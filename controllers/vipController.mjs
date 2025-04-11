import { updateUserMembership, updateUserAdmin } from '../models/userQueries.mjs';
import asyncHandler from 'express-async-handler';

export const joinVIP = asyncHandler(async (req, res) => {
  const { passcode, adminPasscode } = req.body;
  
  if (passcode === 'vip') {
    // Update user's membership status to true
    await updateUserMembership(req.user.id, true);
    
    // Check for admin passcode
    if (adminPasscode === 'boss') {
      await updateUserAdmin(req.user.id, true);
      req.user.admin = true;
    }
    
    // Refresh user data in session
    req.user.membership = true;
    
    res.render('vip', {
      title: 'VIP Club',
      user: req.user,
      success: 'Welcome to the VIP Club!',
      error: null
    });
  } else {
    res.render('vip', {
      title: 'VIP Club',
      user: req.user,
      error: 'Invalid passcode. Please try again.'
    });
  }
});
