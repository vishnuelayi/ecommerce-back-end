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
  uploadImages,
} from "../controllers/blogController.js";
import { blogImgResize, uploadPhoto } from "../middlewares/uploadImage.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put(
  "/upload/:blogId",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
);
router.put("/like/:blogId", authMiddleware, liketheBlog);
router.put("/dislike/:blogId", authMiddleware, disliketheBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);

export default router;
