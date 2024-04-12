import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import brandCategory from "../models/brandCatModel.js";
import Color from "../models/colorModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import User from "../models/userModel.js";

export const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const item = await Product.create(req.body);

    res.json(item);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAproduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findItem = await Product.findById(id)
      .populate("color")
      .populate("ratings.postedBy")
      .populate("category")
      .populate("brand");
    res.json(findItem);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    //filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Product.find(JSON.parse(queryString));

    //sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page is not Exist");
    }
    const product = await query
      .populate("color")
      .populate("category")
      .populate("brand");
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

export const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const isAlreadyinWList = user.whishlist.find(
      (id) => id.toString() === prodId
    );
    if (isAlreadyinWList) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { whishlist: prodId },
        },
        { new: true }
      );
      res.json({ message: "Removed from wishlist" });
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        { $push: { whishlist: prodId } },
        { new: true }
      );
      res.json({ message: "Added to wishlist" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId, star, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    const isAlreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );

    if (isAlreadyRated) {
      await Product.updateOne(
        {
          ratings: { $elemMatch: isAlreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              postedBy: _id,
              comment: comment,
            },
          },
        },
        { new: true }
      );
    }

    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    ).populate("ratings.postedBy");
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const getItemOnQuery = asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const category = req.query.category
      ? {
          category: {
            $in: await Category.find(
              { title: { $regex: req.query.category, $options: "i" } },
              { _id: 1 }
            ),
          },
        }
      : {};

    const color = req.query.color
      ? {
          color: {
            $in: await Color.find(
              { title: { $regex: req.query.color, $options: "i" } },
              { _id: 1 }
            ),
          },
        }
      : {};

    const brand = req.query.brand
      ? {
          brand: {
            $in: await brandCategory.find(
              { title: { $regex: req.query.brand, $options: "i" } },
              { _id: 1 }
            ),
          },
        }
      : {};

    const tag = req.query.tag
      ? { tag: { $all: req.query.tag.split(",") } }
      : {};

    const searchTerm = req.query.searchTerm
      ? {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: "i" } },
            { description: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }
      : {};

    const item = await Product.find({
      ...category,
      ...tag,
      ...searchTerm,
      ...color,
      ...brand,
    }).limit(limit);

    return res.json({
      item,
    });
  } catch (error) {
    throw new Error(error);
  }
});
