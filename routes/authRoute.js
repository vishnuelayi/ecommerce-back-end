import express from "express";
import {
  createUser,
  deleteOneUser,
  getAllUsers,
  getOneUser,
  loginCntrlr,
  updatedUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginCntrlr);
router.get("/all-users", getAllUsers);
router.get("/:id",authMiddleware, getOneUser);
router.delete("/:id", deleteOneUser);
router.put("/:id", updatedUser);

export default router;
