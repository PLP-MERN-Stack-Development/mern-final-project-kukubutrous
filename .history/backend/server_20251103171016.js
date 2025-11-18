import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { Message } from "./models/message.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// HTTP + Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Database connection
connectDB();
sequelize.sync();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.get("/", (req, res) => res.send("API is running..."));

// ✅ Socket.io event handling
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join personal room for direct messages
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  // Handle sending a message
  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    const newMessage = await Message.create({ senderId, receiverId, content });

    // Send to receiver's room
    io.to(receiverId).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
