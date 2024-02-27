import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "../api/db/conn.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

connectDB();

const app = express();
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
