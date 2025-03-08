// Required modules
import { processesResponse as response } from "../../contollers/controller.js";
import { getData, insert } from "../../db/crud.js";
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
  let body = req.body;

  // Has required properties
  if (!body.email || !body.name) {
    processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR, {});
  } else {
    checkUser(req, res);
  }
}

/**
 * Function which check user already exists
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */
function checkUser(req, res) {
  let body = req.body;

  getData(constants.COLLECTIONS.USERS, {
    email: body.email,
  }).then(
    function (records) {
      // Has records ?
      if (records !== null && records.length > 0) {
        records = records[0];

        // Delete mongo id
        delete records._id;
        processesResponse(req, res, constants.STATUS_CODES.SUCCESS, records);
      } else {
        registerUser(req, res);
      }
    },
    function (error) {
      logger.error(`Unable to find the user ${body.email} `, error);
      processesResponse(req, res, constants.STATUS_CODES.SYSTEM_ERROR);
    }
  );
}

/**
 * Function which register the new user
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */
function registerUser(req, res) {
  let body = req.body,
    data = {
      userId: generateId(10),
      email: body.email,
      name: body.name,
      key: generateId(16),
      createdAt: moment().toDate(),
    };

  insert(constants.COLLECTIONS.USERS, data).then(
    function () {
      processesResponse(req, res, constants.STATUS_CODES.SUCCESS, {
        userId: data.userId,
        email: body.email,
        name: body.name,
        key: data.key,
      });
    },
    function (error) {
      logger.error(`Unable to find the user ${body.email} `, error);
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
export { processesRequest as processesRegisterRequest };
