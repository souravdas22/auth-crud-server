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
userRouter.post("/forget-password", userController.forgetPassword);
userRouter.post("/new-password/:id", userController.newPasswordReset);
userRouter.post("/update-password/:token", userController.updatePassword);
userRouter.get("/confirmation/:email/:token", userController.confirmation);
userRouter.get(
  "/password-reset/:email/:token",
  userController.passwordresetconfirmation
);


module.exports = userRouter;
