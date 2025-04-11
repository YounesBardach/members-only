import express from "express";
import { getMessages } from '../controllers/messageController.mjs';

const homeRouter = express.Router();

// Home page with messages
homeRouter.get("/", getMessages);

export default homeRouter;
