import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const url = async (public_Id) => {
  return cloudinary.url(public_Id, {
    transformation: [
      {
        fetch_format: "auto", // asking cloudinary to deliver the most efficient format for that browser or device. (Ex : jpeg to webp)
        quality: "auto",
      },
      {
        width: 1200,
        height: 1200,
        crop: "fill",
        gravity: "auto",
      },
    ],
  });
};

export const userImage = async (imagePath) => {
  const results = await cloudinary.uploader.upload(imagePath);
  const finalURL = await url(results.public_id);
  console.log(finalURL);
};

userImage();
