import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dhu7v0zn0",
  api_key: "994592536578543",
  api_secret: "eUIWaSg9l3pIhGdCJosUFG5YEaY",
});

export const cloudinaryUploadImg = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          // Check if result is defined and has secure_url property
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error("Secure URL not found in Cloudinary response."));
          }
        }
      }
    );
  });
};
