// const mongoose = require('mongoose');
import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;

