import mongoose from "mongoose";

const URL = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
