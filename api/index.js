import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "../api/db/conn.js";
import userRoutes from "./routes/user.route.js";
import authroutes from "./routes/auth.route.js";

connectDB();

const app = express();
app.use(express.json());

//routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authroutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Node server running on port ${process.env.PORT}`);
});
