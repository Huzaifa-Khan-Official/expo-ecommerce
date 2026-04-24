import dns from "dns";
import mongoose from "mongoose";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    console.log("process.env.DB_URL ==>", process.env.DB_URL)
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MONGODB connection error");
    console.log(error);
    process.exit(1);
  }
};

export { connectDB };