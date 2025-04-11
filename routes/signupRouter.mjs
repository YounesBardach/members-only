import express from "express";
import { renderSignupPage, addUser } from "../controllers/signupController.mjs";

const signupRouter = express.Router();

// Render signup page (GET request)
signupRouter.get("/", renderSignupPage);

// Handle user signup (POST request)
signupRouter.post("/", addUser);

export default signupRouter;
