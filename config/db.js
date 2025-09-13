const mongoose = require("mongoose");

async function connectDB() {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/Library", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
}

module.exports = connectDB;
