const express = require("express");
const userController = require("../../Module/webservice/userApiController");
const uploadUser = require("../../helper/userImage");

const userRouter = express.Router();

userRouter.post(
  "/register",
  uploadUser.single("image"),
  userController.register
);
userRouter.post("/login", userController.login);

module.exports = userRouter;
