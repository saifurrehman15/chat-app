import mongoose from "mongoose";

const { Schema } = mongoose;

const ContactSchema = new Schema(
  {
    userId: String,
    contacts: [
      {
        personId:String,
        contactName: String,
        phone: Number,
        isBlock: { type: String, default: "unblock" },
      },
    ],
  },
  { timestamps: true }
);

export const ContactModal =
  mongoose.models.contacts || mongoose.model("contacts", ContactSchema);
