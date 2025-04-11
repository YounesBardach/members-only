import express from 'express';
import { isAuthenticated } from '../middleware/auth.mjs';
import { joinVIP } from '../controllers/vipController.mjs';

const router = express.Router();

// VIP page route - only accessible to authenticated users
router.get('/', isAuthenticated, (req, res) => {
  res.render('vip', { 
    title: 'VIP Club',
    user: req.user
  });
});

// Handle VIP passcode submission
router.post('/', isAuthenticated, joinVIP);

export default router;
