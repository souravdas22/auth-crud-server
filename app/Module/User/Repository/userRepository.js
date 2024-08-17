const TokenModel = require("../model/tokenModel");
const UserModel = require("../model/user");

class ProductRepositories {
  async save(data) {
    try {
      const newUser = await UserModel.create(data);
      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

  async findUser(query) {
    try {
      const user = await UserModel.findOne(query);
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  async edit(productId,password) {
    try {
      const updatedProduct = await UserModel.findByIdAndUpdate(
        productId,
        password,
        {
          new: true,
        }
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  }
  async findToken(query) {
    try {
      const token = await TokenModel.findOne(query);
      return token;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ProductRepositories();
