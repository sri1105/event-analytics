// Required modules
import constants from "../constants.js";
import { getData } from "../db/crud.js";
import logger from "../logger.js";
import { processesCollectRequest } from "../models/analytics/createEvent.js";
import { processesEventSummaryRequest } from "../models/analytics/eventSummary.js";
import { processesUserStatRequest } from "../models/analytics/userStats.js";
import { processesRegisterRequest } from "../models/auth/register.js";
import { processesRevokeRequest } from "../models/auth/revoke.js";
import { processesRetrieveRequest } from "../models/auth/retrieve.js";
import { processesCreateAppRequest } from "../models/analytics/createApp.js";
import { processesEditAppRequest } from "../models/analytics/editApp.js";
import { processesDeleteAppRequest } from "../models/analytics/deleteApp.js";
import { processesActivateRequest } from "../models/auth/activate.js";

/**
 * Function which return a function to processes the incoming
 * request for the end point
 * @param {String} endPoint URL end point
 */
function getFunction(endPoint) {
  switch (endPoint) {
    case "user-stats":
      return processesUserStatRequest;
      break;
    case "event-summary":
      return processesEventSummaryRequest;
      break;
    case "collect":
      return processesCollectRequest;
      break;
    case "register":
      return processesRegisterRequest;
      break;
    case "revoke":
      return processesRevokeRequest;
      break;
    case "api-key":
      return processesRetrieveRequest;
      break;
    case "activate":
      return processesActivateRequest;
      break;
    case "create-app":
      return processesCreateAppRequest;
      break;
    case "edit-app":
      return processesEditAppRequest;
      break;
    case "delete-app":
      return processesDeleteAppRequest;
      break;
    default:
      return;
  }
}

/**
 * Function which ges the status messsage
 * @param {String} name Name of the API
 * @param {String} code Status code
 */
function getStatusMessage(name, code) {
  return getData(constants.COLLECTIONS.STATUS_MESSAGE, {
    $and: [
      {
        code: code,
      },
      {
        serviceName: name,
      },
    ],
  }).then(
    function (records) {
      // Has records ?
      if (records !== null && records.length > 0) {
        return records[0].message;
      } else {
        return Promise.reject("Status code not found");
      }
    },
    function (error) {
      logger.error(`Unable to get status message `, error);
      return error;
    }
  );
}

// Export required functions
export { getFunction, getStatusMessage };
