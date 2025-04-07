import express from "express";
const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

export default homeRouter;
