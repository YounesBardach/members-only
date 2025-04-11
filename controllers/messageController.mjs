import { createMessage, getAllMessages, deleteMessage } from '../models/messageQueries.mjs';
import asyncHandler from 'express-async-handler';

// Render the new message form
export const getNewMessageForm = (req, res) => {
  res.render('new-message', {
    title: 'New Message',
    user: req.user
  });
};

// Handle new message creation
export const createNewMessage = asyncHandler(async (req, res) => {
  const { title, text } = req.body;
  
  console.log("Received message creation request:", { 
    userId: req.user.id, 
    title, 
    text,
    user: req.user
  });
  
  try {
    await createMessage(req.user.id, title, text);
    req.flash('success', 'Message created successfully!');
    res.redirect('/');
  } catch (error) {
    console.error("Error in createNewMessage:", error);
    req.flash('error', `Failed to create message: ${error.message}`);
    res.redirect('/messages/new');
  }
});

// Get all messages for display
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await getAllMessages();
  res.render('home', {
    title: 'Home',
    messages: messages,
    user: req.user
  });
});

export const deleteMessageHandler = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  
  await deleteMessage(messageId);
  req.flash('success', 'Message deleted successfully!');
  res.redirect('/');
}); 