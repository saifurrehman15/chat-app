import { cloudinary, cloudinaryConfiguration, Readable } from "../utils/cloudinary.js";

const cloudinaryFunc = async (id, file) => {
  // cloudinary configs
  cloudinaryConfiguration();

  console.log(file.originalname.split(".")[1]);
  const fileType = file.originalname.split(".")[1];
  let resource_type;

  if (fileType === "mp3" || fileType === "mp4") {
    resource_type = "video";
  } else if (fileType === pdf || fileType === "docx") {
    resource_type = "raw";
  } else {
    resource_type = "image";
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: id,
        resource_type,
      },
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(result);
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
};

export default cloudinaryFunc;
