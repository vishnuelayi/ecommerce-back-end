import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "dhu7v0zn0",
  api_key: "994592536578543",
  api_secret: "eUIWaSg9l3pIhGdCJosUFG5YEaY",
});

const cloudinaryUploadImg = async (fileToUpload, folder) => {
  try {
    const uploadedResponse = await cloudinary.v2.uploader.upload(fileToUpload, {
      folder,
    });

    const { secure_url, public_id } = uploadedResponse;

    return {
      url: secure_url,
      public_id: public_id,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export default cloudinaryUploadImg;
