// very small db helper (mongoose connection)
import mongoose from "mongoose";

export async function connectDB(uri: string) {
  if (!uri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
