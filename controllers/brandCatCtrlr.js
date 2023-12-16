import brandCategory from "../models/brandCatModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoID } from "../utils/validateMongoId.js";


export const newCategory = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    const createdCategory = await brandCategory.create(req.body);
    res.json(createdCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);
  try {
    const updatedCategory = await brandCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const allCategory = await brandCategory.find();
    res.json(allCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getACategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const aCategory = await brandCategory.findById(id);
      res.json(aCategory);
    } catch (error) {
      throw new Error(error);
    }
  });

  export const deleteACategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const deleteCategory = await brandCategory.findByIdAndDelete(id);
      res.json(deleteCategory);
    } catch (error) {
      throw new Error(error);
    }
  });

