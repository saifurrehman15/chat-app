import express from "express";
import Joi from "joi";
import { ContactModal } from "./models/contactModal.js";
import { userModal } from "./models/userModal.js";
import { MessageModal } from "./models/messageModal.js";

const router = express();

const contactSchema = Joi.object({
  userId: Joi.string().required(),
  contacts: Joi.object({
    phone: Joi.string()
      .pattern(/^\d{11}$/)
      .required(),
    contactName: Joi.string().min(3).max(30).required(),
  }).required(),
});

router.post("/", async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: true,
      msg: error.details[0].message,
    });
  }

  const obj = req.body;
  console.log(obj);

  let contactExist = await ContactModal.findOne({
    userId: obj.userId,
    "contacts.phone": obj.contacts.phone,
  });

  let userAvailable = await userModal.findOne({
    phone: obj.contacts.phone,
  });

  console.log(userAvailable);

  if (contactExist) {
    return res.status(404).json({
      error: true,
      msg: "This contact is already exists",
    });
  }

  if (!userAvailable) {
    return res.status(404).json({
      error: true,
      msg: "The user you are trying to connect with is not registered in the app.",
    });
  }

  let alreadyContact = await ContactModal.findOne({ userId: obj.userId });
  console.log(alreadyContact);

  let newAddContact = {
    personId: userAvailable._id,
    phone: obj.contacts.phone,
    contactName: obj.contacts.contactName,
  };

  let newContact = new ContactModal({
    userId: obj.userId,
    contacts: [newAddContact],
  });
  if (!alreadyContact) {
    newContact = await newContact.save();
    
  } else {
    alreadyContact.contacts.push({
      personId: userAvailable._id,
      phone: obj.contacts.phone,
      contactName: obj.contacts.contactName,
    });

    await alreadyContact.save();
  }

  let alreadyContactReverse = await ContactModal.findOne({
    userId: userAvailable._id,
  });
  let user2 = await userModal.findOne({
    _id: obj.userId,
  });

  console.log(alreadyContactReverse);

  if (!alreadyContactReverse) {
    let newAddContact = {
      personId: obj.userId,
      phone: user2.phone,
    };

    let newContact = new ContactModal({
      userId: userAvailable._id,
      contacts: [newAddContact],
    });

    newContact = await newContact.save();
    console.log("saved yes");
  } else {
    alreadyContactReverse.contacts.push({
      personId: obj.userId,
      phone: user2.phone,
    });

    await alreadyContactReverse.save();
  }

  return res.status(200).json({
    error: false,
    msg: "Contact added successfully",
  });
});

router.get("/", async (req, res) => {
  try {
    const { id } = req.query;

    let contacts = await ContactModal.findOne({ userId: id });

    if (!contacts) {
      return res.status(404).json({
        error: true,
        msg: "Contacts not found",
      });
    }

    let messages = await MessageModal.find({
      $or: [{ senderId: id }, { receiverId: id }],
      isRead: false,
    });

    console.log(messages);

    let unreadCountMap = {};
    messages.forEach((msg) => {
      let contactId =
        msg.senderId === id
          ? msg.receiverId.toString()
          : msg.senderId.toString();
      unreadCountMap[contactId] = (unreadCountMap[contactId] || 0) + 1;
    });

    let sortedContacts = contacts.contacts
      .map((contact) => ({
        ...contact.toObject(),
        unreadMessages: unreadCountMap[contact.personId] || 0,
      }))
      .sort((a, b) => b.unreadMessages - a.unreadMessages);

    return res.status(200).json({
      error: false,
      msg: "Contacts sorted by unread messages",
      userId: id,
      contacts: sortedContacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ error: true, msg: "Internal Server Error" });
  }
});

router.put("/", async (req, res) => {
  const obj = req.body;
  console.log(obj.id);

  let findUser = await ContactModal.findOneAndUpdate(
    {
      "contacts._id": obj.id,
    },
    {
      "contacts.$.contactName": obj.contactName,
      "contacts.$.phone": obj.phone,
      "contacts.$.isBlock": obj.isBlock,
    }
  );

  if (!findUser) {
    return res.status(404).json({
      error: true,
      msg: "Contact not found",
    });
  }

  console.log(findUser);
  res.status(200).json({
    error: false,
    msg: "Contact updated successfully",
    contact: findUser,
  });
});

router.delete("/", async (req, res) => {
  const obj = req.body;
  console.log(obj.id);

  let findUser = await ContactModal.findOne({ "contacts._id": obj.id });

  if (!findUser) {
    return res.status(404).json({
      error: true,
      msg: "Contact not found",
    });
  }

  const contactIndex = findUser.contacts.findIndex(
    (contact) => contact._id.toString() === obj.id
  );

  if (contactIndex === -1) {
    return res.status(404).json({
      error: true,
      msg: "Contact not found in the contacts array",
    });
  }

  findUser.contacts.splice(contactIndex, 1);

  await findUser.save();

  console.log(findUser);

  res.status(200).json({
    error: false,
    msg: "Contact deleted successfully",
    contact: findUser,
  });
});
export default router;
