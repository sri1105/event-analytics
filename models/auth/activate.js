// Required modules
import { processesResponse as response } from "../../contollers/controller.js";
import { update } from "../../db/crud.js";
import constants from "../../constants.js";
import logger from "../../logger.js";
import { generateId } from "../globalUtils.js";
import moment from "moment";

/**
 * Function responsible for handling the incoming request
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function processesRequest(req, res) {

  // Has required properties
  if (!req.body && !req.body.userId) {
    processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
  } else {
    activateAPIKey(req, res);
  }
}

/**
 * Function which activate API key
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */
function activateAPIKey(req, res) {
  let userId = req.body.userId,
    data = {
      key: generateId(16),
      updatedAt: moment().toDate(),
      revoke: false
    };

  update(constants.COLLECTIONS.USERS, {userId}, data).then(
    function () {
      processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {
        userId: data.userId,
        key: data.key,
      });
    },
    function (error) {
      logger.error(`Unable to generate new API key for the user ${userId} `, error);
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
function processesResponse(req, res, status, data) {
  response(req, res, status, data);
}

// Export
export { processesRequest as processesActivateRequest };