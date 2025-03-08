// Required modules
import moment from "moment";
import constants from "../../constants.js";
import { processesResponse as response } from "../../contollers/controller.js";
import { update } from "../../db/crud.js";

/**
 * @swagger
 * /api/auth/revoke:
 *   post:
 *     tags:
 *       - Auth
 *     description: Revoke the API key for the user
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
 *             required:
 *               - userId
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
  if (!req.body || !req.body.userId) {
    processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
  } else {
    revokeAPIkey(req, res);
  }
}

/**
 * Function which revoke the API key for the user
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function revokeAPIkey(req, res) {
  let userId = req.body.userId;

  update(
    constants.COLLECTIONS.USERS,
    { userId },
    { revoke: true, updatedAt: moment().toDate() }  
  ).then(
    function () {
      processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {});
    },
    function (error) {
      logger.error(`Unable to find the user ${userId} `, error);
      processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
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
export { processesRequest as processesRevokeRequest };