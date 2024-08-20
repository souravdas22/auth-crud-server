const express = require("express");
const userController = require("../../Module/webservice/userApiController");
const uploadUser = require("../../helper/userImage");
const { authCheck } = require("../../middleware/authHelper");

const userRouter = express.Router();

//register
userRouter.post(
  "/register",
  uploadUser.single("image"),
  userController.register
);
//register email confirmation
userRouter.get("/confirmation/:email/:token", userController.confirmation);
//login
userRouter.post("/login", userController.login);
// update password
userRouter.post("/update-password",authCheck, userController.updatePassword);



// forget password
userRouter.post("/forget-password", userController.forgetPassword);
// password reset confirmation
userRouter.get(
  "/password-reset/confirmation/:email/:token",
  userController.passwordresetconfirmation
);
//new password
userRouter.post("/new-password/:email", userController.newPasswordReset);



module.exports = userRouter;
