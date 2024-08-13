const ProductModel = require("../Product/model/Product");
const fs = require('fs');
const productRepository = require("../Product/Repository/productRepository");
const path = require('path')

class ProductController {
  async getallProducts(req, res) {
    try {
      const products = await ProductModel.find({ deleted: false }, { __v: 0 });
      res.status(200).json({
        message: "Products fetched successfully",
        status: 200,
        data: products,
        total : products.length
      });
    } catch (error) {
      console.log(error);
    }
  }

  async crateProduct(req, res) {
    try {
      const data = {
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        color: req.body.color,
      };
         if (req.file) {
           data.image = req.file.path;
         }

      const newProduct = await productRepository.save(data);
      res.status(201).json({
        status:200,
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async productDetails(req, res) {
    try {
      const productId = req.params.id;

      const singleProduct = await productRepository.findProduct( productId);

      res.status(200).json({
        status: 200,
        message: "Product details successfully",
        data: singleProduct,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const new_image = req.file ? req?.file?.path : null;
      const duplicateImage = await ProductModel.findById(productId);
      if (new_image && duplicateImage.image) {
        fs.unlinkSync(duplicateImage.image);
      }
      const { name, price, size, color } = req.body;
      const productData = { name, price, size, color };
       if (new_image) {
         productData.image = new_image;
       }

      const newProduct = await productRepository.edit(productData, productId);

      if (!newProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        status: 200,
        message: "Product updated successfully",
        data: newProduct,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await productRepository.delete(id);
      if (product) {
        fs.unlinkSync(product.image);
      }
      res.status(200).json({
        status: 200,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ProductController();
