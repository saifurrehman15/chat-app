import express from "express";
import { userModal } from "../models/userModal.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express();

router.post("/", async (req, res) => {
  const obj = req.body;
  console.log(obj);

  let phoneNumber = obj.phone;
  let userExist = await userModal.findOne({ phone: phoneNumber });
  if (!userExist) {
    return res.status(404).json({
      error: true,
      msg: "The user with this phone number does not exist",
    });
  }

  try {
    let isValidPin = await argon2.verify(userExist.pin, obj.pin);
    console.log(isValidPin);
    
    if (!isValidPin) {
      return res.status(404).json({
        error: true,
        msg: "Pin is incorrect",
      });
    }

    let tokenObj = {
      _id: userExist._id,
      phone: userExist.phone,
      isOnline: userExist.isOnline,
    };
    console.log(tokenObj._id);

    let token = jwt.sign({ ...tokenObj }, process.env.JWT_KEY);

    console.log("token=>", token);
    console.log("Token cookie set successfully");

    return res.status(200).json({
      error: false,
      msg: "User Login Successfully",
      user: userExist,
      token,
    });
  } catch (err) {
    console.error("Error during Argon2 verification:", err.message);
    return res.status(500).json({
      error: true,
      msg: "Internal Server Error",
    });
  }
});

router.get("/", (req, res) => {
  res.send("Login");
});

export default router;
