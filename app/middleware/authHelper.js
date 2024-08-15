const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const hashPassword = async (password) => {
  try {
    const saltPassword = 10;
    const hashedPassword = await bcrypt.hash(password, saltPassword);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
//transporter for email send

const createTransporter = (senderEmail, senderPassword) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });
  return transporter;
};

// Send Mail
const mailSend = (req, res, transport, mailOptions) => {
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      res.status(500).send({
        status: 500,
        message: "Technical Issue",
        error: error,
      });
    } else {
      res.status(200).send({
        status: 200,
        message:
          "A verification Email has bee send to your mail, please click the link to verify or else it will get expire in 24hrs",
        error: error,
      });
    }
  });
};




// jwt token verification at the time of login
const authCheck = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      status: "false",
      message: "a token is required ",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: "invalid token",
    });
  }
  return next();
};

module.exports = {
  hashPassword,
  comparePassword,
  authCheck,
  mailSend,
  createTransporter,
};
