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
}

module.exports = new ProductRepositories();
