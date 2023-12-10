import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAproduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getAproduct);
router.get("/", getAllProducts);

export default router;
