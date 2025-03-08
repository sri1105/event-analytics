// Require modules
import { processesResponse as response } from "../../contollers/controller.js";
import logger from "../../logger.js";
import { count, getData } from "../../db/crud.js";
import constants from "../../constants.js";

/**
 * @swagger
 * /api/analytics/user-stats:
 *   get:
 *     tags:
 *      - Analytics
 *     description: Get the user stats
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Id of the user
 *         required: true
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
  if (!req.query || !req.query.userId) {
    processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
  } else {
    getUserStats(req, res);
  }
}

/**
 * Function which gets the user stats
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function getUserStats(req, res) {
  let userId = req.query.userId;

  count(constants.COLLECTIONS.EVENTS, { userId }).then(
    function (count) {
      processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {
        userId,
        totalEvents: count,
      });
    },
    function (error) {
      logger.error(`Unable to find the user ${userId} `, error);
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
export { processesRequest as processesUserStatRequest };
