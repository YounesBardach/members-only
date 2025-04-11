import { body, validationResult } from "express-validator";

// Validation rules for login form
export const loginValidationRules = [
  // Username validation
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  
  // Password validation
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];

// Middleware to check validation results
export const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // If there are validation errors, render the login page with errors
    return res.render("login", {
      title: "Login",
      error: errors.array()[0].msg,
      username: req.body.username // Preserve the username input
    });
  }
  
  // If validation passes, proceed to the next middleware
  next();
};
