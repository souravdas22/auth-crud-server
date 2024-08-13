const {
  comparePassword,
  hashPassword,
} = require("../../middleware/authHelper");
const User = require("../User/model/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const userRepository = require("../User/Repository/userRepository");

class UserController {
  async register(req, res) {
    try {
      const { name, email, password, mobile } = req.body;

      const existingUser = await userRepository.findUser({ email });
      if (existingUser) {
        return res.status(500).send({
          success: false,
          message: "already registered with this mail",
        });
      }
      //password hash
      const hashedPassword = await hashPassword(password);

      //save
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

      return res.status(200).send({
        status: true,
        message: "user register successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "error in register",
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      //validation

      //check user
      const user = await userRepository.findUser({ email });

      if (!user) {
        return res.status(500).send({
          status: false,
          message: "email is not registered",
        });
      }
      const match = await comparePassword(password, user.password);

      if (!match) {
        return res.status(500).send({
          status: false,
          message: "password invalid",
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
      return res.status(200).send({
        status: true,
        message: "login successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        token,
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "error in login",
        error: error.message,
      });
    }
  }
 
}
const userController = new UserController();
module.exports = userController;
