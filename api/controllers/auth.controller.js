import express from "express";
import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
// import { errorHandler } from "../utils/error.js";

const router = express.Router();

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
    // next(errorHandler(400, "All fields are required"));
  }

  try {
    // Hashing password
    const hashedPassword = bcryptjs.hashSync(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(402).json({ error: "Email already exists" });
    }

    await newUser.save();
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};
