import express from "express";
import uploadFile from "../controllers/files-uploads/file-upload.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/upload-file/:id", upload.single("image"), uploadFile);

export default router;
