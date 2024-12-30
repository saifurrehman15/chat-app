import express from "express";
import { MessageModal } from "./models/messageModal.js";
import { lastMsgModal } from "./models/lastMessage.js";

const router = express();

const findAll = async (senderId, receiverId) => {
  console.log("func=>", senderId);

  let findData = await MessageModal.find({
    $or: [
      { senderId: senderId, receiverId: receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });

  return findData;
};

const updateLastMsg = async (message) => {
  const mergeId = message.senderId + message.receiverId;
  let findedAll = await findAll(message.senderId, message.receiverId);
  console.log(findedAll[findedAll.length - 1].message);

  await lastMsgModal.findOneAndUpdate(
    { mergeId },
    {
      lastMessageId: message.senderId,
      lastMessage: findedAll[findedAll.length - 1].message,
      updatedAt: Date.now(),
    }
  );
};

router.post("/", async (req, res) => {
  const obj = req.body;
  console.log(obj.senderId);

  if (!obj.senderId || !obj.receiverId || !obj.message) {
    return res.status(400).json({
      error: true,
      msg: "senderId, receiverId, and message are required fields",
    });
  }

  try {
    const mergeId = obj.senderId + obj.receiverId;

    console.log("Merge ID:", mergeId);

    let lastMsg = await lastMsgModal.findOne({ mergeId });
    console.log("LastMsg found:", lastMsg);

    if (lastMsg) {
      await lastMsgModal.findOneAndUpdate(
        { mergeId },
        {
          lastMessageId: obj.senderId,
          lastMessage: obj.message,
          updatedAt: Date.now(),
        }
      );
      console.log("Last message updated");
    } else {
      const lastMsgSave = new lastMsgModal({
        mergeId,
        lastMessageId: obj.senderId,
        lastMessage: obj.message,
        updatedAt: Date.now(),
      });

      await lastMsgSave.save();
      console.log("Last message entry created:", lastMsgSave);
    }

    const newMessage = new MessageModal({
      senderId: obj.senderId,
      receiverId: obj.receiverId,
      message: obj.message,
    });

    const savedMessage = await newMessage.save();

    return res.status(200).json({
      error: false,
      msg: "Message sent successfully",
      message: savedMessage,
    });
  } catch (err) {
    console.error("Error saving message:", err);
    return res.status(500).json({
      error: true,
      msg: "Internal server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { sId, rId, page = 1 } = req.query;

    console.log("Sender ID:", sId, "Receiver ID:", rId);

    if (!sId || !rId) {
      return res.status(400).json({
        error: true,
        msg: "Sender and Receiver IDs are required",
      });
    }


// chat-app
    const messages = await MessageModal.find({
      $or: [
        { senderId: sId, receiverId: rId },
        { senderId: rId, receiverId: sId },
      ],
    })
      .sort({ createdAt: 1 })

    console.log(messages);

    res.status(200).json({
      error: false,
      msg: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      error: true,
      msg: "Internal server error",
    });
  }
});

router.put("/", async (req, res) => {
  let obj = req.body;
  console.log(obj.id);

  let message = await MessageModal.findOneAndUpdate(
    { _id: obj.id },
    {
      message: obj.message,
      isRead: obj.isRead,
    }
  );
  console.log(message.senderId);

  await updateLastMsg(message);

  if (!message) {
    return res.status(404).json({
      error: true,
      msg: "Message not found",
    });
  }
  return res.status(201).json({
    error: false,
    msg: "Successfully updated Message",
    message,
  });
});

router.delete("/", async (req, res) => {
  let obj = req.body;
  console.log(obj.deleteType);
  let message =
    obj.deleteType.msg === "delete for me"
      ? await MessageModal.findOneAndUpdate(
          { _id: obj.id },
          { deleteType: { msg: obj.deleteType.msg, deleteId: obj.deleteType.deleteId } }
        )
      : await MessageModal.findOneAndDelete({ _id: obj.id });

  await updateLastMsg(message);

  if (!message) {
    return res.status(404).json({
      error: true,
      msg: "Message not found",
    });
  }
  return res.status(201).json({
    error: false,
    msg: "Successfully deleted Message",
    message,
  });
});

export default router;
