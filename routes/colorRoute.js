import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createColor,
  updateColor,
  getColors,
  getColor,
  deleteColor,
} from "../controllers/colorController.js";

const router = express.Router();

// @desc    Create color
// @route   POST /api/colors
// @access  Public
router.post("/", authMiddleware, isAdmin, createColor);

// @desc    Update color
// @route   PUT /api/colors/:id
// @access  Public
router.put("/:id", authMiddleware, isAdmin, updateColor);

// @desc    Get all colors
// @route   GET /api/colors
// @access  Public
router.get("/", authMiddleware, getColors);

// @desc    Get single color
// @route   GET /api/colors/:id
// @access  Public
router.get("/:id", authMiddleware, getColor);

// @desc    Delete color
// @route   DELETE /api/colors/:id
// @access  Public
router.delete("/:id", authMiddleware, isAdmin, deleteColor);

export default router;
