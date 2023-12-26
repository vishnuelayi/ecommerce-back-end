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
  deleteImages
} from "../controllers/productController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { productImgResize, uploadPhoto } from "../middlewares/uploadImage.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
router.put("/rating", authMiddleware, rating);
router.put("/addtowishlist/", authMiddleware, addToWishList);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.delete("/deleteimages/:id", authMiddleware, isAdmin, deleteImages);
router.get("/:id", getAproduct);
router.get("/", getAllProducts);

export default router;
