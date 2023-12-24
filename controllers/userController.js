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
  const { _id } = req.user;
  validateMongoID(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
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
    res.json(findUser);
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
  const sampleProducts = req.body.cart;
  const sampleUserId = req.user._id; // Replace with a valid User ID

  try {
    // Fetch user to ensure it exists
    const user = await User.findById(sampleUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch products to ensure they exist
    const products = await Promise.all(
      sampleProducts.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          return res
            .status(404)
            .json({ error: `Product not found for ID: ${item.product}` });
        }
        return {
          product: item.product,
          count: item.count,
          color: item.color,
          price: item.price,
        };
      })
    );

    // Calculate cartTotal and totalAfterDiscount based on the products
    const cartTotal = products.reduce(
      (total, product) => total + product.price * product.count,
      0
    );

    // Create the cart
    const newCart = new Cart({
      products,
      cartTotal,
      orderby: sampleUserId,
    });

    // Save the cart to the database
    await newCart.save();

    // Respond with the created cart
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoID(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

export const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    // const user = await User.findById(_id);
    const cart = await Cart.findOneAndDelete({ orderby: _id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
      throw new Error("Invalid Coupon");
    }

    let { cartTotal } = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal + validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderby: _id },
      { totalAfterDiscount },
      { new: true }
    );
    res.json(totalAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

export const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoID(_id);

  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoID(_id);
  try {
    const getOrder = await Order.findOne({ orderby: _id });
    res.json(getOrder);
  } catch (error) {
    throw new Error(error);
  }
});


export const updateOrderStatus = asyncHandler(async(req, res) => {
  const {status} = req.body;
  const {id} = req.params;
  validateMongoID(id)
  try{
const updatedStatus = await Order.findByIdAndUpdate(id, {orderstatus:status, paymentIntent:{
  status:status
}}, {new:true})
res.json(updatedStatus);
  }
  catch(error)
  {
    throw new Error(error);
  }
})