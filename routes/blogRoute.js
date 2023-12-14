import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createBlog,
  deleteBlog,
  disliketheBlog,
  getAllBlogs,
  getBlog,
  liketheBlog,
  updateBlog,
} from "../controllers/blogController.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware, liketheBlog);
router.put("/dislikes", authMiddleware, disliketheBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);

export default router;
