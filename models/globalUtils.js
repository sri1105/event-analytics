// Required modules
import { customAlphabet } from "nanoid";

/**
 * Function which generate id with the given lenght
 * @param {Number} length Lenght of the id
 */
function generateId(length) {
  return customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    length
  )();
}

// Export
export { generateId };
