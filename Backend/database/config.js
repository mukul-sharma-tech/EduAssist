const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const name=process.env.MONGO_URI+"/hackathonCC2"
  try {
    const conn = await mongoose.connect(name.toString());
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
