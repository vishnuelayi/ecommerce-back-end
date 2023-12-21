import express from "express";
import {
  adminLogin,
  createUser,
  deleteOneUser,
  forgotPasswordToken,
  getAllUsers,
  getOneUser,
  handleRefreshToken,
  loginCntrlr,
  logout,
  resetPassword,
  saveAddress,
  updatePassword,
  updatedUser,
  userCart,
  viewWishlist,
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
router.post("/admin-login", adminLogin);

router.put("/password", authMiddleware, updatePassword);
router.get("/refresh", handleRefreshToken);
router.get("/wishlist", authMiddleware, viewWishlist);
router.get("/logout", logout);
router.get("/all-users", getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getOneUser);
router.post("/cart", authMiddleware, userCart);

router.delete("/:id", deleteOneUser);
router.put("/user-edit", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

export default router;
