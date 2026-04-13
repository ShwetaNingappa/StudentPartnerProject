import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load the server-level .env explicitly from src/config/
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || !mongoUri.includes(".mongodb.net")) {
      throw new Error(
        "Invalid MONGODB_URI. Set your real MongoDB Atlas URI in server/.env."
      );
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};