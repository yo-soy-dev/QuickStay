import mongoose from "mongoose";

mongoose.connection.on("connected", () =>
  console.log("✅ MongoDB connected successfully")
);

mongoose.connection.on("error", (err) =>
  console.error("❌ MongoDB connection error:", err)
);

mongoose.connection.on("disconnected", () =>
  console.warn("⚠️ MongoDB disconnected")
);

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
