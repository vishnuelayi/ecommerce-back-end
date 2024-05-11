import expressAsyncHandler from "express-async-handler";
import { validateMongoID } from "../utils/validateMongoId.js";
import cloudinaryUploadImg from "../utils/cloudinary.js";
import Product from "../models/productModel.js";

export const uploadImages = expressAsyncHandler(async (req, res) => {
  const {prodId} = req.params;
  try {
    const uploader = async (path) => await cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    // Use Promise.all to wait for all asynchronous operations to complete
    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const { path } = file;
        const { url, public_id } = await uploader(path);
        return {url, public_id};
      })
    );

    // Combine the uploaded URLs into the urls array
    urls.push(...uploadedUrls);

    // Update the product with the uploaded image URLs
    const product = await Product.findByIdAndUpdate(
      prodId,
      {
        $push: { images: { $each: urls } },
      },
      { new: true }
    );

    console.log(urls);
    res.status(200).json({ status: "success", data: urls });
  } catch (error) {
    throw new Error(error);
  }
});