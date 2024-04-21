import bcryptjs from "bcryptjs"; // Import bcryptjs for password hashing
import { errorHandler } from "../utils/error.js"; // Import error handling utility function
import User from "../models/userModel.js"; // Import User model

// Controller function to test API functionality
export const test = (req, res) => {
  res.json({ message: "API is working!" }); // Respond with a JSON message indicating that the API is working
};

// Controller function to update user information
export const updateUser = async (req, res, next) => {
  // Check if the authenticated user is authorized to update the specified user
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user")); // Return an error if not authorized
  }

  // Validate and hash the password if provided in the request body
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters")); // Return an error if password is too short
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10); // Hash the password with bcryptjs
  }

  // Validate username if provided in the request body
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      ); // Return an error if username length is invalid
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces")); // Return an error if username contains spaces
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase")); // Return an error if username is not lowercase
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      ); // Return an error if username contains invalid characters
    }
  }

  try {
    // Update user information in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId, // User ID to update
      {
        $set: {
          username: req.body.username, // Update username if provided
          email: req.body.email, // Update email if provided
          profilePicture: req.body.profilePicture, // Update profile picture if provided
          password: req.body.password, // Update password if provided (hashed)
        },
      },
      { new: true } // Return the updated document
    );

    const { password, ...rest } = updatedUser._doc; // Exclude password from the response
    res.status(200).json(rest); // Respond with updated user information (excluding password)
  } catch (error) {
    next(error); // Forward any errors to the error handling middleware
  }
};

// Controller function to delete user account
export const deleteUser = async (req, res, next) => {
  // Check if the authenticated user is authorized to delete the specified user
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user")); // Return an error if not authorized
  }

  try {
    // Delete user from the database
    await User.findByIdAndDelete(req.params.userId); // Find user by ID and delete

    res.status(200).json("User has been deleted"); // Respond with success message
  } catch (error) {
    next(error); // Forward any errors to the error handling middleware
  }
};

//signout
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
