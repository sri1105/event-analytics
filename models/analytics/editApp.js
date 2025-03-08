// Required modules
import { processesResponse as response } from "../../contollers/controller.js";
import moment from "moment";
import constants from "../../constants.js";
import { update } from "../../db/crud.js";
import logger from "../../logger.js";

/**
 * Function responsible for handling the incoming request
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function processesRequest(req, res) {
  let body = req.body;

  // Has required properties
  if (!body.appId || (!body.appName && !body.appType)) {
    processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
  } else {
    updateApp(req, res);
  }
}

/**
 * Function which update the app details
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function updateApp(req, res) {
  let body = req.body,
    data = {
      updatedAt: moment().toDate(),
    };

  if (body.appName) {
    data.appName = body.appName;
  }

  if (body.appType) {
    data.appType = body.appType;
  }

  update(
    constants.COLLECTIONS.APPS,
    {
      appId: body.appId,
    },
    data
  ).then(
    function () {
      processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {});
    },
    function (error) {
      logger.error(
        `Unable to update the app details for ${body.appId} `,
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
export { processesRequest as processesEditAppRequest };
