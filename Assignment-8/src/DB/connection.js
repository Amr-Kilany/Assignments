import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./src/config/dot.env") });

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

export const db = client.db("assignment_8_db");

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
