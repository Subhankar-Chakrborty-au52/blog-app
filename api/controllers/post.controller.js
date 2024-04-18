import Post from "../models/postModel.js"; // Importing the Post model
import { errorHandler } from "../utils/error.js"; // Importing the errorHandler utility

// Controller function to create a new post
export const create = async (req, res, next) => {
  // Check if the user is an admin
  if (!req.user.isAdmin) {
    // If not admin, return error
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  // Check if required fields are provided in the request body
  if (!req.body.title || !req.body.content) {
    // If not all required fields provided, return error
    return next(errorHandler(400, "Please provide all required fields"));
  }
  // Generate a slug from the title
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  // Create a new Post object
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    // Save the new post to the database
    const savedPost = await newPost.save();
    // Return the saved post
    res.status(201).json(savedPost);
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};

// Controller function to retrieve posts
export const getposts = async (req, res, next) => {
  try {
    // Parse query parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    // Query posts based on query parameters
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection }) // Sort posts based on updatedAt field
      .skip(startIndex) // Skip posts based on startIndex
      .limit(limit); // Limit the number of posts to retrieve
    // Count total number of posts
    const totalPosts = await Post.countDocuments();
    // Calculate number of posts from the last month
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    // Return posts, totalPosts, and lastMonthPosts
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
