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
import userRoute from "./auth/users.js"
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
let server = http.createServer(app);
let io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,  
  pingInterval: 25000, 
});
const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.options("", cors(corsConfig));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth/login", loginRoute);
app.use("/auth/signup", signupRoute);
app.use("/auth/users", userRoute);

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

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('user-message', (data) => {
    console.log('Broadcasting message:', data);
    io.emit('user-message', data);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
  
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
