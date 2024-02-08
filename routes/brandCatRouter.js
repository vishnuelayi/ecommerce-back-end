import express from "express";
import {
  deleteACategory,
  getACategory,
  getAllCategory,
  newCategory,
  updateCategory,
} from "../controllers/brandCatCtrlr.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, newCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteACategory);
router.get("/",getAllCategory);
router.get("/:id", getACategory);

export default router;
