import { validationResult } from "express-validator";
import * as userQueries from "../db/userQueries.mjs";
import asyncHandler from "express-async-handler";
import {
  signupValidationRules,
  handleSignupValidation,
} from "../middleware/validation/signupValidation.mjs";
import { hashPassword } from "../middleware/authentication/hashPassword.mjs";

// GET: Render the signup page
export const renderSignupPage = (req, res) => {
  res.render("signup", {
    title: "Sign Up",
    errors: [], // No errors initially
    formData: {}, // Empty form data
  });
};

// POST: Handle user signup
export const addUser = [
  // 1. Run validation rules
  ...signupValidationRules,

  // 2. Check validation result and return errors if any
  handleSignupValidation("signup"),

  // 3. Hash the password before saving
  hashPassword,

  // 4. Handle user creation
  asyncHandler(async (req, res, next) => {
    const { first_name, last_name, username, password } = req.body;

    // Check if the username already exists
    const existingUser = await userQueries.getUserByUsername(username);
    if (existingUser) {
      return res.render("signup", {
        title: "Sign Up",
        errors: [{ msg: "Username already exists" }],
        formData: req.body,
      });
    }

    // Create user in the DB (with hashed password)
    await userQueries.createUser(first_name, last_name, username, password);

    // Redirect to login on success
    res.redirect("/login");
  }),
];
