import mongoose from "mongoose";

const { Schema } = mongoose;

const LastMessage = new Schema(
  {
    mergeId: String,
    lastMessageId: String,
    lastMessage: String,
  },
  { timestamps: true }
);

export const lastMsgModal =
  mongoose.models.lstmsg || mongoose.model("lstmsg", LastMessage);
