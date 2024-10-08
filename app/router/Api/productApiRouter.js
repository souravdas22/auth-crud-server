const express = require("express");
const ProductApiController = require("../../Module/webservice/ProductApiController");
const { authCheck } = require("../../middleware/authHelper");
const uploadProduct = require("../../helper/productImage");
const ProductApiRouter = express.Router();

ProductApiRouter.get(
  "/products",
  authCheck,
  ProductApiController.getallProducts
);
ProductApiRouter.post(
  "/create",
  authCheck,
  uploadProduct.single("image"),
  ProductApiController.crateProduct
);
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
ProductApiRouter.get(
  "/delete/:id",
  authCheck,
  ProductApiController.deleteProduct
);
ProductApiRouter.get(
  "/product/filter/size",
  authCheck,
  ProductApiController.filterbySize
);
ProductApiRouter.get(
  "/product/filter/color",
  authCheck,
  ProductApiController.filterByColor
);
ProductApiRouter.get(
  "/product/filter/brand",
  authCheck,
  ProductApiController.filterByBrand
);

ProductApiRouter.get("/products/search", authCheck, ProductApiController.searchProduct);

module.exports = ProductApiRouter;
