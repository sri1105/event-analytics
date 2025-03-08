// Required modules
import mongoose from 'mongoose';
import logger from '../logger.js';
import { validateParameter } from './utils.js';
import constants from '../constants.js';

/**
 * Function which insert the data in the given collection
 * @param {String} collectionName Collection name
 * @param {Object} data Data to insert
 */
function insert(collectionName, data) {
  return validateParameter(
    collectionName,
    null,
    data,
    constants.DB_OPERATIONS.INSERT
  ).then(
    function () {
      const collection = mongoose.connection.db.collection(collectionName);

      return collection.insertOne(data).then(
        function (records) {
          return records;
        },
        function (error) {
          logger.error(
            `Unable to the insert the data in ${collectionName} `,
            error
          );
        }
      );
    },
    function (error) {
      logger.error(`Unable to perform insert for ${collectionName} `, error);
    }
  );
}

/**
 * Function which find the data inside the collection
 * @param {String} collectionName Collection Name
 * @param {Object} Condition Condition to query
 */
function getData(collectionName, condition) {
  return validateParameter(
    collectionName,
    condition,
    null,
    constants.DB_OPERATIONS.FIND
  ).then(
    function () {
      const collection = mongoose.connection.db.collection(collectionName);

      return collection
        .find(condition)
        .toArray()
        .then(
          function (records) {
            return records;
          },
          function (error) {
            logger.error(
              `Unable to the find the data in ${collectionName} `,
              error
            );
            return error;
          }
        );
    },
    function (error) {
      logger.error(`Unable to perform find for ${collectionName} `, error);
    }
  );
}

/**
 * Function which update the data for the given collection
 * @param {String} collectionName Collection name
 * @param {Object} condition Condition to update
 * @param {Object} data Data to update
 */
function update(collectionName, condition, data) {
  return validateParameter(
    collectionName,
    condition,
    data,
    constants.DB_OPERATIONS.UPDATE
  ).then(
    function () {
      const collection = mongoose.connection.db.collection(collectionName);

      return collection.updateMany(condition, { $set: data }).then(
        function (records) {
          return records;
        },
        function (error) {
          logger.error(
            `Unable to update the data for ${collectionName} `,
            error
          );
        }
      );
    },
    function (error) {
      logger.error(`Unable to perform update for ${collectionName} `, error);
    }
  );
}

/**
 * Function which delete the records from the given
 * collection
 * @param {String} collectionName Collection name
 * @param {Object} condition Condiiton to delete
 */
function deleteAll(collectionName, condition) {
  return validateParameter(
    collectionName,
    condition,
    null,
    constants.DB_OPERATIONS.DELETE
  ).then(
    function () {
      const collection = mongoose.connection.db.collection(collectionName);

      return collection.deleteMany(condition).catch(function (error) {
        logger.error(`Unable to delete records from ${collectionName} `, error);
      });
    },
    function (error) {
      logger.error(`Unable to perform delete for ${collectionName} `, error);
    }
  );
}

/**
 * Function which count the records from the given condition
 * @param {String} collectionName Collection name
 * @param {Object} condition Condiiton to delete
 */
function count(collectionName, condition) {
  return validateParameter(
    collectionName,
    condition,
    null,
    constants.DB_OPERATIONS.COUNT
  ).then(
    function () {
      const collection = mongoose.connection.db.collection(collectionName);

      return collection.countDocuments(condition).then(
        function (count) {
          return count;
        },
        function (error) {
          logger.error(
            `Unable to count the data in ${collectionName} `,
            error
          );
          return error;
        }
      );
    },
    function (error) {
      logger.error(`Unable to perform data count for ${collectionName} `, error);
    }
  );
}

// Export data
export { count, insert, getData, update, deleteAll };