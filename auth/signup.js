import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModal } from "../models/userModal.js";

const router = express();

const userValidation = Joi.object({
  phone: Joi.string()
    .pattern(/^\d{11}$/)
    .required(),
  pin: Joi.string()
    .pattern(/^\d{6}$/)
    .required(),
});

router.post("/", async (req, res) => {
  let obj = req.body;

  const { error, value } = userValidation.validate(obj);
  if (error) {
    const errorMsg = error.details.some((e) => e.path.includes("phone"))
      ? "Phone number should be exactly 11 digits"
      : "PIN should be exactly 6 digits";
    return res.status(403).json({ error: true, msg: errorMsg });
  }

  let newObj = {
    phone: Number(value.phone),
    pin: value.pin,
  };

  try {
    let isUser = await userModal.findOne({ phone: newObj.phone });
    if (isUser) {
      return res.status(400).json({
        error: true,
        msg: "This phone number is already taken",
      });
    }

    const hashed = await bcrypt.hash(newObj.pin, 12);
    newObj.pin = hashed;

    let newUser = new userModal({ ...newObj });
    newUser = await newUser.save();

    const token = jwt.sign(newUser , process.env.JWT_KEY);

    // res.cookie("token", token, { secure: true, httpOnly: true });

    return res.status(200).json({
      error: false,
      msg: "The user was created successfully",
      user: { newUser, token },
    });
  } catch (err) {
    console.error("server error", err);
    return res.status(500).json({
      error: true,
      msg: "An unexpected error occurred. Please try again later.",
    });
  }
});

// router.get('/',(req,res)=>{

//     res.send("hy")
// })

export default router;
