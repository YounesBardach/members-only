//asyncHandler catches errors thrown in async functions and automatically passes them to Express’s error-handling middleware using next(err).

import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

// Middleware for hashing the password
export const hashPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
  }

  next();
});
