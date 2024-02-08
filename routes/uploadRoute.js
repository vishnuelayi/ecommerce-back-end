import express from "express";
import { productImgResize, uploadPhoto } from "../middlewares/uploadImage.js";
import { uploadImages, deleteImages } from "../controllers/uploadCtrlr.js";
import { authMiddleware,isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/deleteimage/:id", authMiddleware, isAdmin, deleteImages);

export default router;
