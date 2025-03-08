// Required modules
import mongoose from 'mongoose';
import logger from '../logger.js';
import dotenv from 'dotenv';

dotenv.config();

/*
  NOTE: The requirement was to build a backend API for 
  Website analytics. Schemaless direct mongoDB useage was 
  the better approach since we are dealing with dynamic data
/*

/**
 * Function which connect to the mongoDB
 * using the connection string
 */
async function connectDB() {
   return await mongoose.connect(process.env.MONGO_DB_URI).then(
    function () {
      logger.info('Successfully connected to DB');
    },
    function (error) {
      logger.error(`Unable to connect to DB `, error);
    }
  );
}

// Export
export default connectDB;