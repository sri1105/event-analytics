// Required modules
import { processesResponse as response } from "../../contollers/controller.js";
import moment from "moment";
import constants from "../../constants.js";
import { getData, insert } from "../../db/crud.js";
import logger from "../../logger.js";
import { generateId } from "../globalUtils.js";

/**
 * @swagger
 * /api/analytics/create-app:
 *   post:
 *     tags:
 *      - Analytics
 *     description: Create a new app for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appName:
 *                 type: string
 *                 description: Name of the app
 *               appType:
 *                 type: string
 *                 description: Type of the app
 *             required:
 *               - appName
 *               - appType
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: User API Key
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
  let body = req.body;

  // Has required properties
  if (!body.appName || !body.appType) {
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
        createApp(req, res, records[0].userId);
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
 * Function which create the app for the user
 * @param {Object} req Request Object
 * @param {Object} res Response object
 * @param {String} userId User Id
 */
function createApp(req, res, userId) {
  let body = req.body,
    appId = generateId(6);

  insert(constants.COLLECTIONS.APPS, {
    appId: appId,
    appName: body.appName,
    appType: body.appType,
    createdAt: moment().toDate(),
    userId: userId,
  }).then(
    function () {
      processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {
        appId: appId,
      });
    },
    function (error) {
      logger.error(`Unable to create the app ${data.appName} `, error);
      processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
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
export { processesRequest as processesCreateAppRequest };
