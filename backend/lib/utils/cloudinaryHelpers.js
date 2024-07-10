import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (imagePath) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(imagePath);
    return uploadedResponse.secure_url;
  } catch (error) {
    throw new Error("Error uploading image");
  }
};

export const destroyImage = async (imageUrl) => {
  try {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error("Error destroying image");
  }
};
