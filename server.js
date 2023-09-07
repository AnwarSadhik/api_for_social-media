import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  authRoutes,
  commentRoutes,
  postRoutes,
  reelsRoutes,
  userRoutes,
  messagesRoutes,
} from "./routes/index.js";
import multer from "multer";
dotenv.config();
import initializeSocketIO from "./utils/socket.js";
import http from "http";

const PORT = process.env.PORT || 5005;
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(multer().any());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const connectDatabase = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const StartServer = async () => {
  connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
  });
};

// Routes handler
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/reels", reelsRoutes);
app.use("/api/message", messagesRoutes);
app.use((req, res) => {
  res.status(404).send("Route not found");
});

initializeSocketIO(server);

StartServer();
