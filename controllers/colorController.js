import Color from "../models/colorModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoID } from "../utils/validateMongoId.js";

// @desc    Create new Color 
// @route   POST /api/colors
// @access  Public
export const createColor = asyncHandler(async (req, res) => {
  try {
    const createdColor = await Color.create(req.body);
    res.json(createdColor);
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    Update Color
// @route   PUT /api/colors/:id
// @access  Public   
export const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoID(id);

  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedColor);
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    Get all Colors
// @route   GET /api/colors
// @access  Public  
export const getColors = asyncHandler(async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    Get single Color
// @route   GET /api/colors/:id
// @access  Public
export const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const foundColor = await Color.findById(id);
    res.json(foundColor);
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    Delete Color
// @route   DELETE /api/colors/:id
// @access  Public
export const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    res.json(deletedColor);
  } catch (error) {
    throw new Error(error);
  }
});
