import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {});
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error in db connection:", error.message);
    process.exit(1);
  }
};

export default connectDB;
