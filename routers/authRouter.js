// Required modules
import express from 'express';
import { checkAPIKey, isAuthenticated, handleGoogleCallback, handleRedirect, checkUser } from '../middlewares/middlewares.js';
import { processesRequest } from '../contollers/controller.js';

const router = express.Router();

// Available routes
router.post('/revoke', checkAPIKey, checkUser, processesRequest);
router.post('/activate', checkUser, processesRequest);
router.get('/api-key', isAuthenticated, checkUser, processesRequest);
router.get('/google/callback', handleGoogleCallback(), handleRedirect);
router.post('/register', isAuthenticated, processesRequest);

// Export
export default router;