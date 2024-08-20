const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const dbConnection = require('./app/config/db');
const bodyParser = require("body-parser");
var cors = require("cors");

dotenv.config();
const app = express();
dbConnection();
app.use(cors());

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "app", "Module", "Product", "views"),
  path.join(__dirname, "views"),
]);
app.use('/uploads',express.static('uploads'))

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 

const ProductApiRouter = require("./app/router/Api/productApiRouter");
const userApiRouter = require('./app/router/Api/userApiRouter');

//api router
app.use("/api", userApiRouter);
app.use("/api", ProductApiRouter);

const PORT = process.env.PORT || 7000 ;

app.listen(PORT, () =>
  console.log(`App is listening on port http://localhost:${PORT}`)
);
