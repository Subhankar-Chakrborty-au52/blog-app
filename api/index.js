import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "../api/db/conn.js";

connectDB();

const app = express();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Node server running on port ${process.env.PORT}`);
});
