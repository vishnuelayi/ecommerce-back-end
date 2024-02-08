import express from "express";
import {
  adminLogin,
  applyCoupon,
  createCart,
  createOrder,
  createUser,
  deleteOneUser,
  emptyCart,
  forgotPasswordToken,
  getAllUsers,
  getCart,
  getOneUser,
  getOrders,
  getAllOrders,
  handleRefreshToken,
  loginCntrlr,
  logout,
  resetPassword,
  saveAddress,
  updateOrderStatus,
  updatePassword,
  updatedUser,
  viewWishlist,
} from "../controllers/userController.js";
import {
  authMiddleware,
  blockUser,
  isAdmin,
  unBlockUser,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

//User Registration and Authentication
router.post("/register", createUser);
router.post("/login", loginCntrlr);
router.post("/admin-login", adminLogin);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

//User Management and Authentication Routes
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.put("/password", authMiddleware, updatePassword);
router.get("/wishlist", authMiddleware, viewWishlist);
router.get("/cart", authMiddleware, getCart);
router.post("/cart", authMiddleware, createCart);
router.delete("/cart", authMiddleware, emptyCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/create-cart", authMiddleware, createOrder);
router.get("/get-orders", authMiddleware, getOrders);

//Admin Only Routes
router.get("/get-all-orders", authMiddleware, isAdmin, getAllOrders);
router.get("/all-users", authMiddleware, isAdmin, getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getOneUser);
router.put("/oders/status/:id", authMiddleware, isAdmin, updateOrderStatus);

//User Management Routes
router.put("/user-edit", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);
router.delete("/:id", deleteOneUser);

export default router;
