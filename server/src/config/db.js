import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from a .env file if it exists (for local dev)
// On Render, this will safely do nothing and use the dashboard variables instead
dotenv.config();

export const connectDB = async () => {
  try {
    // We check for both common names just to be extra safe
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    // Check if the URI exists and looks like a valid MongoDB Atlas string
    if (!mongoUri || !mongoUri.includes("mongodb")) {
      throw new Error(
        "Invalid or missing MONGODB_URI. Please check your Render Environment settings."
      );
    }

    // Connect to the database
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // We exit the process because the app cannot function without a database
    process.exit(1);
  }
};