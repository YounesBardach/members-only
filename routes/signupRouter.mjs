import express from "express";
import { renderSignupPage, addUser } from "../controllers/userController.mjs";

const signupRouter = express.Router();

// Render signup page (GET request)

signupRouter.get("/signup", renderSignupPage);

// Handle user signup (POST request)

signupRouter.post("/signup", addUser);

export default signupRouter;
