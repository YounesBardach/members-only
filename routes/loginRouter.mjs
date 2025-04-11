import express from 'express';
import { getLoginPage, loginUser, logoutUser } from '../controllers/loginController.mjs';
import { isNotAuthenticated } from '../middleware/auth.mjs';
import { loginValidationRules } from '../middleware/validation/loginValidation.mjs';

const router = express.Router();

// Render login page (GET request)
router.get('/', isNotAuthenticated, getLoginPage);

// Handle login form submission (POST request)
router.post('/', isNotAuthenticated, loginValidationRules, loginUser);

// Handle logout (GET request)
router.get('/logout', logoutUser);

export default router;
