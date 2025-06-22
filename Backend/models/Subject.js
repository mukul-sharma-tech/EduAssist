import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }]
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;

