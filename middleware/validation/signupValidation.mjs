//checks req.body for the parsed data

import { body, validationResult } from "express-validator";

export const signupValidationRules = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must contain only letters"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name must contain only letters"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Must include an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Must include a lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Must include a number"),

  //custom validator to check if the confirm password matches the password

  body("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

// Custom middleware to check validation result and return errors
export function handleSignupValidation(view = "signup") {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render(view, {
        title: "Sign Up",
        errors: errors.array(),
        formData: req.body,
      });
    }
    next();
  };
}
