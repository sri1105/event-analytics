// Require modules
import { processesResponse as response } from "../../contollers/controller.js";
import logger from "../../logger.js";
import { getData } from "../../db/crud.js";
import constants from "../../constants.js";
import moment from "moment";

/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     tags:
 *      - Analytics
 *     description: Get the event summary
 *     parameters:
 *       - in: query
 *         name: event
 *         schema:
 *           type: string
 *         description: Name of the event
 *         required: true
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Start date format YYYY-MM-DD
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: End date format YYYY-MM-DD
 *       - in: query
 *         name: appId
 *         schema:
 *           type: string
 *         description: App Id
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         description: User API Key
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * Function responsible for handling the incoming request
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function processesRequest(req, res) {
  if (!req.query && !req.query.event) {
    processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
  } else {
    getUserId(req, res);
  }
}

/**
 * Function which get the user id
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function getUserId(req, res) {
  let key = req.headers["x-api-key"];

  getData(constants.COLLECTIONS.USERS, { key }).then(
    function (records) {
      if (records && records.length > 0) {
        getEventSummary(req, res, records[0].userId);
      } else {
        processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
      }
    },
    function (error) {
      logger.error(`Unable to find the user ${key} `, error);
      processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR);
    }
  );
}

/**
 * Function which gets the user stats
 * @param {Object} req Request Object
 * @param {Object} res Response object
 * @param {String} userId User Id
 */
function getEventSummary(req, res, userId) {
  let query = req.query,
    condition = [
      {
        event: query.event,
      },
      {
        userId: userId,
      },
    ];

  // Has start date ?
  if (query.startDate) {
    condition.push({
      createdAt: {
        $gte: moment(query.startDate, "YYYY-MM-DD").startOf("d").toDate(),
      },
    });
  }

  // Has end date ?
  if (query.endDate) {
    condition.push({
      createdAt: {
        $lte: moment(query.endDate, "YYYY-MM-DD").endOf("d").toDate(),
      },
    });
  }

  // Has app id ?
  if (query.appId) {
    condition.push({
      appId: query.appId,
    });
  }

  getData(constants.COLLECTIONS.EVENTS, { $and: condition }).then(
    function (records) {
      // Has records ?
      if (records !== null && records.length > 0) {
        records.forEach((record) => {
          delete record._id;
          delete record.userId;
          delete record.createdAt;
        });
        processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {
          events: records,
        });
      } else {
        processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {
          events: [],
        });
      }
    },
    function (error) {
      logger.error(
        `Unable to get even summary data for event ${body.event} `,
        error
      );
      processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR);
    }
  );
}

/**
 * Function which processes the response
 * @param {Object} req Request Object
 * @param {Object} res Response object
 * @param {String} code Status code
 * @param {Object} data Data to be sent
 */
function processesResponse(req, res, code, data) {
  response(req, res, code, data);
}

// Export
export { processesRequest as processesEventSummaryRequest };