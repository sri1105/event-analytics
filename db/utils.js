// Import required modules
import constants from '../constants.js';

/**
 * Function which validate the parameter before performing
 * DB operations
 * @param {String} collection Collection name
 * @param {Object} condition Condition to query
 * @param {Object} data Data to add/update
 * @param {String} operation DB operation
 */
function validateParameter(collection, condition, data, operation) {
  // Validate for all operations 
  if (!collection) {
    return Promise.reject('Collection name cannot be undefined');
  } else if (typeof collection !== 'string') {
    return Promise.reject('Collection name must be a string');
  }

  // Ignore validation for delete and find operations
  if ([constants.DB_OPERATIONS.INSERT, constants.DB_OPERATIONS.UPDATE].includes(operation)) {
    if (!data) {
      return Promise.reject('Data cannot be undefined');
    } else if (typeof condition !== 'object') {
      return Promise.reject('Data must be an object');
    }
  }

  // Ignore validation for insert operation
  if (operation !== constants.DB_OPERATIONS.INSERT) {
    if (!condition) {
      return Promise.reject('Condition name cannot be undefined');
    } else if (typeof condition !== 'object') {
      return Promise.reject('Condition must be an object');
    }
  }

  return Promise.resolve();
}

// Export
export { validateParameter };