import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔵 Trying MongoDB connection...");
    console.log("URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("🟢 MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.log("🔴 MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;