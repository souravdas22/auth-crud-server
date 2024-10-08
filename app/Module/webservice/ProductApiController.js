const ProductModel = require("../Product/model/Product");
const fs = require("fs");
const productRepository = require("../Product/Repository/productRepository");
const path = require("path");

class ProductController {
  async getallProducts(req, res) {
    try {
      const products = await ProductModel.find({ deleted: false }, { __v: 0 });
      res.status(200).json({
        message: "Products fetched successfully",
        status: 200,
        data: products,
        total: products.length,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  async crateProduct(req, res) {
    try {
      const data = {
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        color: req.body.color,
        brand: req.body.brand,
        description: req.body.description,
      };
      if (req.file) {
        data.image = req.file.path;
      }

      const newProduct = await productRepository.save(data);
      res.status(201).json({
        status: 200,
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error) {
     res.status(500).json({
       status: 500,
       error: error.message,
     });
    }
  }
  async productDetails(req, res) {
    try {
      const productId = req.params.id;

      const singleProduct = await productRepository.findProduct(productId);

      res.status(200).json({
        status: 200,
        message: "Product details successfully",
        data: singleProduct,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
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
      const { name, price, size, color, brand, description } = req.body;
      const productData = { name, price, size, color, brand, description };
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
      res.status(500).json({
        status: 500,
        error: error.message,
      });
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
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
  //filter by size
  async filterbySize(req, res) {
    try {
      const sizeParam = req.query.size;

      const sizes = sizeParam
        .split(",")
        .map((size) => size.trim())
        .filter((size) => size);

      const query = {
        size: { $in: sizes },
      };

      const filteredProducts = await ProductModel.find({
        deleted: false,
        ...query,
      });

      return res.status(200).json({
        message: "Data fetched successfully",
        totalCount: filteredProducts.length,
        data: filteredProducts,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
  async filterByColor(req, res) {
    try {
      const colorParam = req.query.color;

      const colors = colorParam
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color);

      const query = {
        color: { $in: colors },
      };

      const filteredProducts = await ProductModel.find({
        deleted: false,
        ...query,
      });
      return res.status(200).json({
        message: "Data fetched successfully",
        totalCount: filteredProducts.length,
        data: filteredProducts,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
  async filterByBrand(req, res) {
    try {
      const brandParam = req.query.brand;

      const brandArray = brandParam ? brandParam.split(",") : [];

      const filteredProducts = await ProductModel.find({
        deleted: false,
        brand: { $in: brandArray },
      });

      return res.status(200).json({
        message: "Data fetched successfully",
        totalCount: filteredProducts.length,
        data: filteredProducts,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
  async searchProduct(req, res) {
    try {
      const query = {};
       if (req.query.name) {
         query.name = { $regex: req.query.name, $options: "i" };
       }
       if (req.query.price) {
         query.price = parseFloat(req.query.price); 
       }
       if (req.query.size) {
         query.size = { $in: req.query.size.split(",") }; 
       }
       if (req.query.color) {
         query.color = { $in: req.query.color.split(",") };
       }
       if (req.query.brand) {
         query.brand = { $regex: req.query.brand, $options: "i" };
       }
        const result = await ProductModel.find({ ...query, deleted: false });
         if (!result || result.length === 0) {
           console.log("No products found");
           return res.status(404).send({ message: "No products found" });
         }
         res.status(200).json(result);
       
    } catch (error) {
       console.log("Not a Valid Search", error);
       res.status(500).send({ error: "Not a Valid Search" });
    }
  }
}

module.exports = new ProductController();
