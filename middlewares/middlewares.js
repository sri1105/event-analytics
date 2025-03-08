import constants from "../constants.js";
import { getData } from "../db/crud.js";
import logger from "../logger.js";
import { googleAuth } from "./googleAuth.js";
import { checkUserByEmail, checkUserById } from "./utils.js";

/**
 * Middleware to validate the API key in the request header
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to call
 */
function checkAPIKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res
      .status(400)
      .json({ message: constants.SYSTEM_MESSAGE.API_KEY_REQUIRED });
  }

  getData(constants.COLLECTIONS.USERS, {
    $and: [{
      key: apiKey
    }, {
      $or: [{ revoke: false }, { revoked: { $exists: false }}]
    }]
  }).then(
    function (records) {
      if (records && records.length > 0) {
        next();
      } else {
        res
          .status(401)
          .json({ message: constants.SYSTEM_MESSAGE.INVALID_API_KEY });
      }
    },
    function (error) {
      logger.error("Error validating API key", error);
      res.status(500).json({ message: constants.SYSTEM_MESSAGE.SYSTEM_ERROR });
    }
  );
}

/**
 * Function which validate the user in the request
 * @param {Object} req Request body
 * @param {Object} res Response body
 * @param {Function} next Next function to call
 */
function checkUser(req, res, next) {
  let userId;

  if (req.query && req.query.userId) {
    userId = req.query.userId;
  } else if (req.body && req.body.userId) {
    userId = req.body.userId;
  }

  if (userId) {
    checkUserById(userId).then(
      function (records) {
        if (records) {
          next();
        } else {
          res
            .status(400)
            .send({ message: constants.SYSTEM_MESSAGE.USER_NOT_FOUND });
        }
      },
      function (error) {
        logger.error(`Unable to find the user ${userId} `, error);
        res
          .status(500)
          .send({ message: constants.SYSTEM_MESSAGE.SYSTEM_ERROR });
      }
    );
  } else {
    res
      .status(400)
      .send({ message: constants.SYSTEM_MESSAGE.USER_ID_REQUIRED });
  }
}

/**
 * Function which validate the API key in the request header
 * @param {Object} req Request body
 * @param {Object} res Response body
 * @param {Function} next Next function to call
 */
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

/**
 * Function which perform authentication
 */
function performGoogleAuthentication() {
  return googleAuth.authenticate("google", { scope: ["profile", "email"] });
}

/**
 * Function which handle google callback URL
 */
function handleGoogleCallback() {
  return googleAuth.authenticate("google", { failureRedirect: "/" });
}

/**
 * Function which handles the redirect for the register end point
 * @param {Object} req Request body
 * @param {Object} res Response body
 */
function handleRedirect(req, res) {
  // Update user data into the request body
  if (req.user) {
    let body = req.body,
      user = req.user;

    body = typeof body !== "object" ? {} : body;

    body.email = user.emails[0].value;
    body.name = user.displayName;
  }

  checkUserByEmail(req.body.email).then(
    function (records) {
      if (records) {
        // User already exists redirect to the api key end point
        res.redirect(`/api/auth/api-key?userId=${records.userId}`);
      } else {
        // NOTE: The requirement of the register end point was a post call so
        // we need this work around to redirect to the end point
        res.send(`
        <script>
            fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(${JSON.stringify(req.body)})
            });
        </script>`);
      }
    },
    function (error) {
      logger.error(`Unable to find the user ${req.body.email} `, error);
      res.status(500).send({ message: constants.SYSTEM_MESSAGE.SYSTEM_ERROR });
    }
  );
}

/**
 * Function which check the app id
 * @param {Object} req Request Object
 * @param {Object} res Response object
 */
function checkAppId(req, res, next) {
  let appId = req.body.appId;

  getData(constants.COLLECTIONS.APPS, { appId }).then(
    function (records) {
      if (records !== null && records.length > 0) {
        next();
      } else {
        res
          .status(400)
          .send({ message: constants.SYSTEM_MESSAGE.APP_ID_NOT_FOUND });
      }
    },
    function (error) {
      logger.error(`Unable to find the user ${userId} `, error);
      res.status(500).send({ message: constants.SYSTEM_MESSAGE.SYSTEM_ERROR });
    }
  );
}

// Exports
export {
  checkAPIKey,
  checkUser,
  isAuthenticated,
  performGoogleAuthentication,
  handleGoogleCallback,
  handleRedirect,
  checkAppId
};
