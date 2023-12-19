import express from "express";
import {
  addToWishList,
  createProduct,
  deleteProduct,
  getAllProducts,
  getAproduct,
  rating,
  updateProduct,
  uploadImages,
} from "../controllers/productController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { productImgResize, uploadPhoto } from "../controllers/cloudinaryCtrlr.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 10),productImgResize, uploadImages)
router.put("/rating", authMiddleware, rating);
router.put("/addtowishlist/", authMiddleware, addToWishList);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/:id", getAproduct);
router.get("/", getAllProducts);

export default router;
