// import express from "express";
// import loginRoute from "./auth/login.js";
// import signupRoute from "./auth/signup.js";
// import ContactRoute from "./contacts.js";
// import messageRoute from "./message.js";
// import "dotenv/config";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";

// const app = express();
// app.use(cookieParser());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.use("/auth/login", loginRoute);
// app.use("/auth/signup", signupRoute);
// app.use("/contacts", ContactRoute);
// app.use("/message", messageRoute);

// let connectDb = async () => {
//   try {
//     let connection = null;
//     if (connection && connection.readyState === 1) return connection;

//     connection = await mongoose.connect(process.env.MONGO_URI);
//     console.log("db connect");
//   } catch (error) {
//     console.log(error);
//   }
// };

// connectDb();

// app.listen(process.env.PORT, () => console.log("Server runs =>"));

import express from "express";
import loginRoute from "./auth/login.js";
import signupRoute from "./auth/signup.js";
import ContactRoute from "./contacts.js";
import messageRoute from "./message.js";
import lastMsgRoute from "./lastMsg.js";

import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
// import http from "http";
// import { Server } from "socket.io";
import cors from "cors";

const app = express();



app.use(cors("http://localhost:8081"))
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth/login", loginRoute);
app.use("/auth/signup", signupRoute);
app.use("/contacts", ContactRoute);
app.use("/message", messageRoute);
app.use("/lastMsg", lastMsgRoute);

let connectDb = async () => {
  try {
    let connection = null;

    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to the database.");
      return;
    }

    connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

connectDb();

// // Socket.io Connection Logic
// io.on("connection", (socket) => {
//   console.log("A user connected: " + socket.id);

//   // Join a room when a user connects (based on user ID)
//   socket.on("join-room", (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined the room: ${socket.id}`);
//   });

//   // Listen for a message and emit it to the receiver's room
//   socket.on("send-message", (messageData) => {
//     console.log("Message received: ", messageData);
//     // Emit the message to the specific user (receiverId)
//     io.to(messageData.receiverId).emit("receive-message", messageData);
//   });

//   // Handle user disconnection
//   socket.on("disconnect", () => {
//     console.log("User disconnected: " + socket.id);
//   });
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
