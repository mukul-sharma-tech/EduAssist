import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  duration: Number, // in minutes
  timestamp: { type: Date, default: Date.now }
});

// module.exports = mongoose.model('Session', sessionSchema);
const Session = mongoose.model("Session", sessionSchema);
export default Session;

