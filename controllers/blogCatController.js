import Category from "../models/blogCatModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoID } from "../utils/validateMongoId.js";

export const newCategory = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    const createdCategory = await Category.create(req.body);
    res.json(createdCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const allCategory = await Category.find();
    res.json(allCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getACategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const aCategory = await Category.findById(id);
    res.json(aCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteACategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});
