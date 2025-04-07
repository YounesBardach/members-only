import { Router } from "express";
import * as loginController from "../controllers/loginController.mjs";

const loginRouter = Router();

loginRouter.get("/", loginController.);
loginRouter.post("/", loginController.);

export default loginRouter;
