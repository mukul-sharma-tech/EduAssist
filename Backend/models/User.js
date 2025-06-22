// const mongoose = require('mongoose');
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  role: { type: String, enum: ['student', 'teacher'], required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }]
});

const User = mongoose.model("User", userSchema);
export default User;

