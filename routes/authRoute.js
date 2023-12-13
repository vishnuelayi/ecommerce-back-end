import express from "express";
import {
  createUser,
  deleteOneUser,
  forgotPasswordToken,
  getAllUsers,
  getOneUser,
  handleRefreshToken,
  loginCntrlr,
  logout,
  resetPassword,
  updatePassword,
  updatedUser,
} from "../controllers/userController.js";
import {
  authMiddleware,
  blockUser,
  isAdmin,
  unBlockUser,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginCntrlr);
router.put("/password", authMiddleware, updatePassword);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/all-users", getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getOneUser);
router.delete("/:id", deleteOneUser);
router.put("/user-edit", authMiddleware, updatedUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

export default router;
