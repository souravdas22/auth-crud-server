const ProductModel = require("../model/Product");

class ProductRepositories {
  async save(data) {
    try {
      const newProduct = await ProductModel.create(data);
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }
  async edit(productData, productId) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        productData,
        {
          new: true,
        }
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  }
  async delete(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndUpdate(id, {
        deleted: true,
      });
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  }
  async findProduct(id) {
    try {
      const product = await ProductModel.findById( id );
      return product;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ProductRepositories();
