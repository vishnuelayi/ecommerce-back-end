import express from "express";
import {
  createUser,
  deleteOneUser,
  getAllUsers,
  getOneUser,
  handleRefreshToken,
  loginCntrlr,
  updatedUser,
} from "../controllers/userController.js";
import { authMiddleware, blockUser, isAdmin, unBlockUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginCntrlr);
router.get("/refresh", handleRefreshToken);
router.get("/all-users", getAllUsers);
router.get("/:id",authMiddleware,isAdmin, getOneUser);
router.delete("/:id", deleteOneUser);
router.put("/user-edit", authMiddleware,updatedUser);
router.put("/block-user/:id", authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware,isAdmin, unBlockUser)

export default router;
