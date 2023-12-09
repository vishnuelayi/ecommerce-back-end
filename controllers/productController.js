import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

export const createProduct = asyncHandler(async (req, res) => {
  try {
    const item = await Product.create(req.body);
    res.json(item);
  } catch (error) {
    throw new Error(error);
  }
});
