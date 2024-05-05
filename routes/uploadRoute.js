import express from "express";
import {productImgResize, uploadPhoto} from "../middlewares/uploadImage.js";
import { authMiddleware,isAdmin } from "../middlewares/authMiddleware.js";
import { uploadImages } from "../controllers/uploadController.js";

const router = express.Router();

router.put(
  "/:prodId",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages

);

// router.delete("/deleteimage/:id", authMiddleware, isAdmin, deleteImages);

export default router;
