const express = require("express");
const ProductApiController = require("../../Module/webservice/ProductApiController");
const { authCheck } = require("../../middleware/authHelper");
const uploadProduct = require("../../helper/productImage");
const ProductApiRouter = express.Router();



ProductApiRouter.get("/products", ProductApiController.getallProducts);
ProductApiRouter.post("/create", authCheck,uploadProduct.single('image'), ProductApiController.crateProduct);
ProductApiRouter.get(
  "/product/:id",
  authCheck,
  
  ProductApiController.productDetails
);
ProductApiRouter.post(
  "/update/:id",
  authCheck,
  uploadProduct.single("image"),
  ProductApiController.updateProduct
);
ProductApiRouter.get("/delete/:id",authCheck, ProductApiController.deleteProduct);

module.exports = ProductApiRouter;
