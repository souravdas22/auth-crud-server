const {
  comparePassword,
  mailSend,
  createTransporter,
  hashPassword,
} = require("../../middleware/authHelper");
const crypto = require("crypto");
const User = require("../User/model/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const userRepository = require("../User/Repository/userRepository");
const nodemailer = require("nodemailer");
const TokenModel = require("../User/model/tokenModel");
const userModel = require("../User/model/user");
const bcrypt = require("bcryptjs");

class UserController {
  async register(req, res) {
    try {
      const { name, email, password, mobile } = req.body;
      const existingUser = await userRepository.findUser({ email });
      if (existingUser) {
        return res.status(409).send({
          success: 409,
          message: "already registered with this email",
        });
      }
      //password hash
      const hashedPassword = await hashPassword(password);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        mobile,
      });
      if (req.file) {
        user.image = req.file.path;
      }
      await userRepository.save(user);
      const token_model = new TokenModel({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token_model.save();
      const senderEmail = process.env.MAIL_ID;
      const senderPassword = process.env.PASSWORD;
      const transport = createTransporter(senderEmail, senderPassword);

      const mailOptions = {
        from: senderEmail,
        to: user.email,
        subject: "Confirmation ✔",
        text:
          "Hello " +
          user.name +
          ",\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/api/confirmation/" +
          user.email +
          "/" +
          token_model.token +
          "\n\nThank You!\n",
      };
      mailSend(req, res, transport, mailOptions);

      return res.status(200).send({
        status: 200,
        message: "Verification link sent successfully",
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in registration",
        error: error.message,
      });
    }
  }

  // email verification

  async confirmation(req, res) {
    try {
      const token = await TokenModel.findOne({ token: req.params.token });
      if (!token) {
        return res.status(400).send({
          status: 400,
          message: "Verification link may be expired",
        });
      } else {
        const user = await userModel.findOne({
          _id: token._userId,
          email: req.params.email,
        });
        if (!user) {
          return res.status(404).send({
            status: 404,
            message: "User not found",
          });
        }
        if (user.isVerified) {
          return res.status(400).send({
            status: 400,
            message: "User already verified",
          });
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).send({
          status: 200,
          message: "User verified successfully. Now you can login to your account.",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in email verification",
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      //check user
      const user = await userRepository.findUser({ email });

      if (!user) {
        return res.status(404).send({
          status: 404,
          message: "Email is not registered",
        });
      }
      if (user.isVerified === false) {
        return res.status(401).send({
          status: 401,
          message: "User not verified",
        });
      }
      const match = await comparePassword(password, user.password);

      if (!match) {
        return res.status(401).send({
          status: 401,
          message: "Invalid password",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );
      return res.status(200).json({
        status: 200,
        message: "Login successfull",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Login Unsucessfull",
        error: error.message,
      });
    }
  }
  async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      //check user
      const user = await userRepository.findUser({ email });
    

      if (!user) {
        return res.status(404).send({
          status: 404,
          message: "Email is not registered",
        });
      }
        if (user.isVerified === false) {
          return res.status(500).send({
            status: 500,
            message: "email is not verified",
          });
        }
      const senderEmail = process.env.MAIL_ID;
      const senderPassword = process.env.PASSWORD;
      const transport = createTransporter(senderEmail, senderPassword);
      const mailOptions = {
        from: senderEmail,
        to: user.email,
        subject: "Forgot Password",
        html: `
        <p>create a new password by clicking the link below:</p>
        <a href="http://localhost:3000/password-reset/${user._id}">
        Reset Password
        </a>
        <p>Thank you!</p>
         `,
      };
      if (user.isVerified) {
        mailSend(req, res, transport, mailOptions);
      }

      return res.status(200).send({
        status: 200,
        message: "password reset link sent successfully on your email",
        _id: user._id,
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in password reset",
        error: error.message,
      });
    }
  }
  async passwordresetconfirmation(req, res) {
    try {
      const token = await TokenModel.findOne({ token: req.params.token });
      if (!token) {
        return res.status(400).send({
          status: 400,
          message: "reset link may be expired",
        });
      } else {
        const user = await userModel.findOne({
          _id: token._userId,
          email: req.params.email,
        });
        if (!user) {
          return res.status(404).send({
            status: 404,
            message: "User not found",
          });
        }
        if (user.isVerified) {
          return res.status(400).send({
            status: 400,
            message: "User verified now you can reset password",
          });
        }
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in email verification",
        error: error.message,
      });
    }
  }

  async newPasswordReset(req, res) {
    try {
      const id = req.params.id;
      const { newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await userModel.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true }
      );

      res.status(200).send({
        status: 200,
        message: " password reset successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in password reset",
      });
    }
  }
}

const userController = new UserController();
module.exports = userController;
