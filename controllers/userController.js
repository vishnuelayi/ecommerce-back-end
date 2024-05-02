import generateToken from "../config/jsonWebToken.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoID } from "../utils/validateMongoId.js";
import generateRefreshToken from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import sendMail from "./emailController.js";
import crypto from "crypto";
import Cart from "../models/cartModel.js";
import uniqid from "uniqid";
import { log } from "console";

//register a new user
export const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists !");
  }
});

//User login authentication
export const loginCntrlr = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials !");
  }
});

//admin login authentication
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findAdmin = await User.findOne({ email });

  if (findAdmin.role !== "admin") {
    throw new Error("You are not Authorized !");
  }

  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin._id);
    const updateAdmin = await User.findByIdAndUpdate(
      findAdmin._id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials !");
  }
});

//get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//get a perticular user
export const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);

  try {
    const user = await User.findById(id);

    if (!user) {
      // If no user is found with the given id, return an error response
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    // Instead of throwing a new Error, you can pass the error to the asyncHandler
    throw error;
  }
});

//delete a user
export const deleteOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw error;
  }
});

//handle refresh token

export const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No User Found Using This Refresh Token");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
    if (err || user.id !== decode.id) {
      throw new Error("Something Went Wrong In Refresh Token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//logout

export const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No Token Found");
  }

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204);
  }

  await User.findByIdAndUpdate(user._id, { refreshToken: "" });

  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.sendStatus(204);
});

//update a user
export const updatedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    throw error;
  }
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoID(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

export const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // console.log(user);
  if (!user) throw new Error("User not found using this email");

  try {
    const token = await user.createResetPasswordToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset your password, This link is valid till 10 minutes from now. <a href='http://localhost:3000/api/user/reset-password/${token}'>Click Here</a>`;
    const data = {
      text: "Hey, User",
      to: email,
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendMail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired, Try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

export const viewWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("whishlist");
    res.json(findUser.whishlist);
  } catch (error) {
    throw new Error(error);
  }
});

export const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      { address: req?.body?.address },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

export const createCart = async (req, res) => {
  const { productId, color, quantity, price } = req.body;
  const { _id } = req.user;

  try {
    // Fetch user to ensure it exists
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = new Cart({
      userId: _id,
      productId: productId,
      color: color,
      quantity: quantity,
      price: price,
    });

    // Save the cart to the database
    await cart.save();

    // Respond with the created cart
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const cart = await Cart.find({ userId: _id })
      .populate("productId")
      .populate("color");

    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//for deleting a product from the cart, each product in the cart have seperate _id , dont use the product id
export const deleteProductCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.params;

  try {
    const cart = await Cart.findOne({userId:_id, _id:prodId})
    res.json(cart)
  } catch (error) {
    throw new Error(error);
  }
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { cartItemId, newQuantity } = req.params;

  try {
    const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });
    // console.log(cartItem);
    cartItem.quantity = newQuantity;
    cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});

export const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const cart = await Cart.deleteMany({ userId: _id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//for apply an existing coupon code upon aleready created order
export const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;

  try {
    const validCoupon = await Coupon.findOne({ name: coupon });

    if (validCoupon === null) {
      throw new Error("Invalid Coupon");
    }

    //checking the applied coupon is expired or not
    const isExpired = validCoupon.expiry < new Date();

    if (isExpired) {
      throw new Error("Coupon has expired");
    }

    let { totalPrice } = await Order.findOne({ userId: _id });
    let totalPriceAfterDiscount = (
      totalPrice -
      (totalPrice + validCoupon.discount) / 100
    ).toFixed(2);
    await Order.findOneAndUpdate(
      { userId: _id },
      { totalPriceAfterDiscount },
      { new: true }
    );
    res.json(totalPriceAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

export const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {
    shippingInfo,
    paymentInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
  } = req.body;
  try {
    const newOrder = await Order.create({
      shippingInfo,
      paymentInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      userId: _id,
    });
    res.json({ newOrder, success: true });
  } catch (error) {
    throw new Error(error);
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const myOrders = await Order.find({ userId: _id })
      .populate("orderItems.product")
      .populate("orderItems.color");
    res.json(myOrders).status(200);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const getOrder = await Order.find().populate("userId");
    res.json(getOrder);
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getOrder = await Order.findById(id);
    res.json(getOrder);
  } catch (err) {
    throw new Error(err);
  }
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { updatedStatus } = req.body;
  const {itemId} = req.params;

  validateMongoID(itemId);
  try {
    const updatedOrderStatus = await Order.findByIdAndUpdate(
      itemId,
      {
        orderStatus: updatedStatus,
      },
      { new: true }
    );
    res.json(updatedOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

export const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = month[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
        },
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
});

export const getYearlyWiseOrderCount = asyncHandler(async (req, res) => {
  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = month[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        amount: { $sum: "$totalPriceAfterDiscount" },
      },
    },
  ]);
  res.json(data);
});
