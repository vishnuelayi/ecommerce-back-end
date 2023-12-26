import express from "express";
import { 
  createColor,
  updateColor,
  getColors,
  getColor,
  deleteColor  
} from "../controllers/colorController.js";

const router = express.Router();

// @desc    Create color
// @route   POST /api/colors
// @access  Public
router.post("/", createColor);

// @desc    Update color
// @route   PUT /api/colors/:id
// @access  Public
router.put("/:id", updateColor);

// @desc    Get all colors
// @route   GET /api/colors
// @access  Public
router.get("/", getColors); 

// @desc    Get single color
// @route   GET /api/colors/:id
// @access  Public
router.get("/:id", getColor);

// @desc    Delete color
// @route   DELETE /api/colors/:id
// @access  Public
router.delete("/:id", deleteColor);

export default router;
