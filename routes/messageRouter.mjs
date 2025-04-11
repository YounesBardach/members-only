import express from 'express';
import { getNewMessageForm, createNewMessage, deleteMessageHandler } from '../controllers/messageController.mjs';
import { isAuthenticated } from '../middleware/auth.mjs';

const router = express.Router();

// Show new message form (only for authenticated users)
router.get('/new', isAuthenticated, getNewMessageForm);

// Create a new message (only for authenticated users)
router.post('/', isAuthenticated, createNewMessage);

// Delete a message (only for authenticated users)
router.post('/:messageId/delete', isAuthenticated, deleteMessageHandler);

export default router; 