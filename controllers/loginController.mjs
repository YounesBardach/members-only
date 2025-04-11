import passport from 'passport';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';

// Render login page
export const getLoginPage = (req, res) => {
  res.render('login', { 
    title: 'Login',
    error: null,
    username: ''
  });
};

// Handle login form submission
export const loginUser = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', {
      title: 'Login',
      error: errors.array()[0].msg,
      username: req.body.username
    });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message || 'Invalid username or password');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'You are now logged in!');
      return res.redirect('/');
    });
  })(req, res, next);
});

// Handle logout
export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
  });
};
