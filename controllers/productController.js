import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

export const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const item = await Product.create(req.body);
    res.json(item);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAproduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findItem = await Product.findById(id);
    res.json(findItem);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const findAllItems = await Product.find();
    res.json(findAllItems);
  } catch (error) {
    throw new Error(error);
  }
});
