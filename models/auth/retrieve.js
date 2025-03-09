// Required modules
import constants from "../../constants.js";
import { getData } from "../../db/crud.js";
import logger from "../../logger.js";
import { processesResponse as response } from "../../contollers/controller.js";

/**
 * @swagger
 * /api/auth/api-key:
 *   get:
 *     tags:
 *       - Auth
 *     description: Retrieve the API key for the user
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User Id
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
  if (!req.query && !req.query.userId) {
    processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
  } else {
    getAPIkey(req, res);
  }
}

/**
 * Fuction which get the API key for the user
 * @param {Object} req Request object
 * @param {Object} res Response object
 */
function getAPIkey(req, res) {
  let userId = req.query.userId;

  getData(constants.COLLECTIONS.USERS, {userId}).then(
    function (records) {
      if (records && records.length > 0) {
        records = records[0];
        processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {
            userId: records.userId,
            key: records.key,
        });
      } else {
        processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
      }
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
 * @param {Object} res Response Object
 * @param {Number} status Response status code
 * @param {Object} data Response data
 */
function processesResponse(req, res, code, data) {
  response(req, res, code, data);
}

// Export
export { processesRequest as processesRetrieveRequest };
