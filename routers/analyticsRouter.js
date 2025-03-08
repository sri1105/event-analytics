// Required modules
import express from 'express';
import { processesRequest } from '../contollers/controller.js';
import { checkAPIKey, checkAppId, checkUser } from '../middlewares/middlewares.js';

// Constants
const router = express.Router();

// Available routes
router.post('/create-app', checkAPIKey, processesRequest);
router.post('/edit-app', checkAPIKey, checkAppId, processesRequest);
router.post('/delete-app', checkAPIKey, checkAppId, processesRequest);
router.post('/collect', checkAPIKey, checkAppId, checkUser, processesRequest);
router.get('/event-summary', checkAPIKey, processesRequest);
router.get('/user-stats', checkAPIKey, checkUser ,processesRequest);

// Export
export default router;