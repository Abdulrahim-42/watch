// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import productsRouter from "./routes/product.js";
import userRouter from "./routes/auth.js";
import errorsMiddleware from "./middleware/errors.js";
// import cartRouter from "./routes/cart.js"; // əgər ayrıca cart router varsa
import blogRoutes from "./routes/blog.js";
import categoryRoutes from "./routes/category.js";
import ChatMessage from "./model/Socket.js";

// .env faylını oxuyuruq
dotenv.config({ path: "config/config.env" });

const app = express();

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // lokal üçün default
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Database bağlantısı
connectDatabase();

// Middleware-lər
app.use(express.json());
app.use(cookieParser());

// Routers
app.use("/api/v1", productsRouter);
app.use("/crud/v1", userRouter);
// app.use("/api/v1", cartRouter);
app.use("/api/v1", blogRoutes);
app.use("/api/v1", categoryRoutes);

// Xətalar üçün middleware
app.use(errorsMiddleware);

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("Yeni client bağlandı:", socket.id);

  // Chat tarixçəsini göndəririk
  try {
    const chatHistory = await ChatMessage.find({}).sort({ createdAt: 1 });
    socket.emit("chatHistory", chatHistory);
  } catch (error) {
    console.error("Chat tarixi alınarkən xəta:", error);
  }

  // Client-dan gələn mesajları saxlayıb yayırıq
  socket.on("chatMessage", async (data) => {
    try {
      const newMessage = new ChatMessage({
        sender: data.sender,
        userName: data.userName,
        text: data.text,
      });

      await newMessage.save();
      io.emit("chatMessage", newMessage);
    } catch (error) {
      console.error("Mesaj saxlanarkən xəta:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client ayrıldı:", socket.id);
  });
});

// Port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
