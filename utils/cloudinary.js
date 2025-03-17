import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";


const cloudinaryConfiguration = () => {
  return cloudinary.config({
    cloud_name: "dhvtjvx8y",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

export { cloudinary, cloudinaryConfiguration,Readable };
