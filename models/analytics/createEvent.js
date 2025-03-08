// Require modules
import { processesResponse as response } from "../../contollers/controller.js";
import logger from "../../logger.js";
import { getData, insert } from "../../db/crud.js";
import constants from "../../constants.js";
import moment from "moment";

/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     tags:
 *      - Analytics
 *     description: Create a new event for the user
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: User API Key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User Id
 *               appId:
 *                 type: string
 *                 description: App Id
 *               event:
 *                 type: string
 *                 description: Name of the event
 *               url:
 *                 type: string
 *                 description: URL of the event
 *               referer:
 *                 type: string
 *                 description: Referer URL
 *             required:
 *               - userId
 *               - appId
 *               - event
 *               - url
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

  if (!body.userId || !body.appId || !body.event || !body.url) {
    processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
  } else {
    createEvent(req, res);
  }
}

/**
 * Function which create the event
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function createEvent(req, res) {
  let body = req.body,
    data = {
      userId: body.userId,
      appId: body.appId,
      event: body.event,
      url: body.url,
      referer: body.referer || "",
      createdAt: moment().toDate(),
    };

  insert(constants.COLLECTIONS.EVENTS, data).then(
    function () {
      processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {});
    },
    function (error) {
      logger.error(`Unable to create even data for app ${body.appId} `, error);
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
export { processesRequest as processesCollectRequest };