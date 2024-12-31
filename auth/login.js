import express from "express";
import { userModal } from "../models/userModal.js";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  // let unHashedPass = await bcrypt.compare(obj.pin, userExist.pin);
  // if (!unHashedPass) {
  //   return res.status(404).json({
  //     error: true,
  //     msg: "Pin is incorrect",
  //   });
  // }

  let token = jwt.sign(userExist, process.env.JWT_KEY);

  console.log("token=>", token);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3600000,
  });

  console.log("Token cookie set successfully");

  return res.status(200).json({
    error: false,
    msg: "User Login Successfully",
    data: { user: userExist, token },
  });
});

router.get("/", (req, res) => {
  res.send("Login");
});

export default router;
