import express from "express"; // Importing Express framework
import bcryptjs from "bcryptjs"; // Importing bcryptjs for password hashing
import User from "../models/userModel.js"; // Importing User model
import { errorHandler } from "../utils/error.js"; // Importing errorHandler utility function
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for token generation

const router = express.Router(); // Creating an instance of Express router

// User signup route
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body; // Extracting username, email, and password from request body
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    // Checking if any of the fields are empty
    return res.status(400).json({ message: "All fields are required" }); // Returning error response if any field is empty
    //next(errorHandler(400, "All fields are required"));
  }

  try {
    // Hashing password
    const hashedPassword = bcryptjs.hashSync(password, 12); // Generating hashed password using bcryptjs
    const newUser = new User({
      // Creating a new user instance with hashed password
      username,
      email,
      password: hashedPassword,
    });

    // Check if user already exists
    const userExist = await User.findOne({ email }); // Checking if a user with the provided email already exists
    if (userExist) {
      return res.status(402).json({ error: "Email already exist" }); // Returning error response if user already exists
    }

    await newUser.save(); // Saving new user to the database
    res.status(200).json({ message: "Signup successful" }); // Returning success response
  } catch (error) {
    next(error); // Forwarding any error to the error handler middleware
  }
};

// User login route
export const signin = async (req, res, next) => {
  const { email, password } = req.body; // Extracting email and password from request body
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required")); // Returning error response if email or password is empty
  }

  try {
    const validUser = await User.findOne({ email }); // Finding user with provided email
    if (!validUser) {
      next(errorHandler(400, "User not found")); // Returning error response if user not found
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password); // Comparing provided password with hashed password
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password")); // Returning error response if password is invalid
    }

    // Generating JWT token
    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
      },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc; // Removing password from user object

    // Setting token as a cookie and sending user data in response
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error); // Forwarding any error to the error handler middleware
  }
};

// Google authentication route
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body; // Extracting email, name, and googlePhotoUrl from request body
  try {
    const user = await User.findOne({ email }); // Finding user with provided email
    if (user) {
      // If user exists, generate token and send user data
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc; // Removing password from user object
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      // If user does not exist, create a new user and send user data
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); // Generating random password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // Hashing generated password
      const newUser = new User({
        // Creating a new user instance
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4), // Generating username
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save(); // Saving new user to the database
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      ); // Generating token for new user
      const { password, ...rest } = newUser._doc; // Removing password from user object
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest); // Setting token as a cookie and sending user data in response
    }
  } catch (error) {
    next(error); // Forwarding any error to the error handler middleware
  }
};

export default router; // Exporting Express router
