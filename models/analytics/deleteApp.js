// Required modules
import { processesResponse as response } from "../../contollers/controller.js";
import constants from "../../constants.js";
import { deleteAll, getData } from "../../db/crud.js";
import logger from "../../logger.js";

/**
 * Function responsible for handling the incoming request
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function processesRequest(req, res) {
  // Has required properties
  if (!req.body.appId) {
    processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
  } else {
    deleteAppById(req, res);
  }
}

/**
 * Function which delete the app for the user
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function deleteAppById(req, res) {
  let appId = req.body.appId;

  Promise.all([
    deleteAll(constants.COLLECTIONS.APPS, { appId: appId }),
    deleteAll(constants.COLLECTIONS.EVENTS, { appId: appId }),
  ]).then(
    function () {
      processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {});
    },
    function (error) {
      logger.error(`Unable to delete the user ${key} `, error);
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
export { processesRequest as processesDeleteAppRequest };