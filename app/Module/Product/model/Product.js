const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
    },
    size: {
      type: [String],
      required: [true, "size is required"],
    },
    color: {
      type: [String],
      required: [true, "color is required"],
    },
    brand: {
      type: String,
      required: [true, "brand is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    image: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductModel = mongoose.model("product", productSchema);
module.exports = ProductModel;
