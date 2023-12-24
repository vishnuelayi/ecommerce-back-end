import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded?.id);

        req.user = user;

        // Continue to the next middleware or route handler
        next();
      }
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Not Authorized, token expired. Please login again" });
    }
  } else {
    return res.status(401).json({ error: "No token attached to the header" });
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You are not admin");
  } else {
    next();
  }
});

export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blockuser = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json({ Message: "User is blocked" });
  } catch (error) {
    throw error;
  }
});

export const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const unblockuser = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({ Message: "User is Un-blocked" });
  } catch (error) {
    throw error;
  }
});
