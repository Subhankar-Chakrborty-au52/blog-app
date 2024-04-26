import express from "express"; // Import the Express framework
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
} from "../controllers/user.controller.js"; // Import controller functions for user routes
import { verifyToken } from "../utils/verifyUser.js"; // Import middleware function for verifying user tokens

const router = express.Router(); // Create an instance of Express Router

// Define routes for user-related operations

// Route to test endpoint functionality
router.get("/test", test);

// Route to update user information
// Requires token verification middleware before executing the updateUser controller function
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);

//signout
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUser);

export default router; // Export the router for use in other parts of the application
