// Required modules
import constants from "../constants.js";
import logger from "../logger.js";
import { getFunction, getStatusMessage } from "./utils.js";

/**
 * Function responsible for handling the incoming request
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function processesRequest(req, res) {
  // Get the endpoint
  let endPoint = (req.url || "").split("/").pop();

  // Remove query parameters
  if (endPoint.indexOf("?") > -1) {
    endPoint = endPoint.split("?")[0];
  }

  // Get the function to processes the incoming request
  let fn = getFunction(endPoint);

  // Processes the incoming request
  if (fn) {
    fn(req, res);
  } else {
    sendSystemError(req, res);
  }
}

/**
 * Function responsible for handling the response
 * @param {Object} req Request Object
 * @param {Object} res Response object
 * @param {Object} code Response status code
 * @param {Object} data Response data
 */
function processesResponse(req, res, code, data) {
  // Get the serviceName
  let serviceName = (req.url || "").split("/").pop();

  // Remove query parameters
  if (serviceName.indexOf("?") > -1) {
    serviceName = serviceName.split("?")[0];
  }

  // Handle data undefined case
  if (typeof data !== "object") {
    data = {};
  }

  getStatusMessage(serviceName, code).then(
    function (message) {
      data.code = code;
      data.message = message;
      res.status(200).json(data);
    },
    function (error) {
      logger.error(`Error processing the response `, error);
      sendSystemError(req, res);
    }
  );
}

/**
 * Function which sends the system error as response
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function sendSystemError(req, res) {
  res.status(200).json({
    code: constants.STATUS_CODES.SYSTEM_ERROR,
    message: constants.SYSTEM_MESSAGE.SYSTEM_ERROR,
  });
}

// Export
export { processesRequest, processesResponse };
