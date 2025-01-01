import express from "express";
import { authenticateUser } from "../middleware/auth.js";

let router = express();
export default router.get("/", authenticateUser, (req, res) => {
  res.status(200).json({
    error: false,
    msg: "Success",
    user: null,
  });
});
