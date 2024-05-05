import expressAsyncHandler from "express-async-handler";
import { validateMongoID } from "../utils/validateMongoId.js";
import cloudinaryUploadImg from "../utils/cloudinary.js";

export const uploadImages = expressAsyncHandler(async (req, res) => {
  try {
    const uploader = async (path) => await cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    // Use Promise.all to wait for all asynchronous operations to complete
    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const { path } = file;
        const { url } = await uploader(path);
        return url;
      })
    );

    // Combine the uploaded URLs into the urls array
    urls.push(...uploadedUrls);

    
    res.status(200).json({ status: "success", data: urls });
  } catch (error) {
    throw new Error(error);
  }
});