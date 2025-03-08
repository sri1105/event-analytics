// Required modules
import { getData } from "../db/crud.js";
import logger from "../logger.js";
import constants from "../constants.js";

/**
 * Function which validate the user by email
 * @param {String} email Email of the user
 */
function checkUserByEmail(email) {
    return getData(constants.COLLECTIONS.USERS, {
        email: email
    }).then(function(records) {
       // Has records ?
        if (records !== null && records.length > 0) {
            return records[0];
        }
    }, function(error) {
        logger.error(`Unable to find the user ${email} `,error);
        return error;
    });
}

/**
 * Function which validate the user by user id
 * @param {String} userId User id
 */
function checkUserById(userId) {
    return getData(constants.COLLECTIONS.USERS, {
        userId: userId
    }).then(function(records) {
       // Has records ?
        if (records !== null && records.length > 0) {
            return records[0];
        }
    }, function(error) {
        logger.error(`Unable to find the user with id ${userId} `,error);
        return error;
    }); 
}

// Export the function
export { checkUserByEmail, checkUserById };