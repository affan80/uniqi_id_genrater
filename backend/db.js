import mongoose from "mongoose";

const MONGO_URL ="mongodb+srv://Lakshya:Lakshya18@cluster0.wck5vzk.mongodb.net/htthunt?retryWrites=true&w=majority";
// paste the real URL from MongoDB Atlas

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error", err);
  }
}
