import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    phone: { type: Number, required: true },
    pin: { type: String, required: true },
    bio: { type: String },
    profileUrl: { type: String },
    isOnline: { type: String, default: "offline" },
  },
  { timestamps: true }
);

export const userModal =
  mongoose.models.users || mongoose.model("users", UserSchema);
