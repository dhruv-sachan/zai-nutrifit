import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Sets up your environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose"; // <-- STANDARD MONGOOSE ADDED HERE

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);

// Updated health check to report actual Mongoose status
app.get("/api/health", (req, res) => {
  const dbState =
    mongoose.connection.readyState === 1
      ? "Connected to Atlas"
      : "Disconnected";
  res.json({ status: "ok", db: dbState });
});

const start = async () => {
  try {
    // <-- DIRECT MONGOOSE CONNECTION INSTEAD OF dbManager -->
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from your .env file!");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Atlas Connected Successfully");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Shuts down the process if the database connection fails
  }
};

start();
