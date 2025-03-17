import cloudinaryFunc from "../../services/file-upload-service.js";

const uploadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: true, message: "File not found!" });
    }

    console.log("Uploading File:", file, "ID:", id);

    const result = await cloudinaryFunc(id, file);
    console.log("Cloudinary Response:", result);
    
    if (!result) {
      return res
        .status(403)
        .json({ error: true, message: "Failed to upload Image!" });
    }

    return res.status(201).json({
      error: false,
      message: "File uploaded successfully!",
      url: result.secure_url, 
    });
  } catch (error) {
    console.error("❌ Upload Error:", error.message);
    return res.status(500).json({
      error: true,
      message: "File upload failed!",
    });
  }
};

export default uploadFile;
