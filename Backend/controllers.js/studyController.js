import Subject from "../models/Subject.js";
import Session from "../models/Session.js";
import Goal from "../models/Goal.js";

// SUBJECT CRUD
export const createSubject = async (req, res) => {
  const { name } = req.body;
  const userId = req.auth.userId;
  const sub = await Subject.create({ name, students: [userId] });
  res.status(201).json(sub);
};

export const getSubjects = async (req, res) => {
  const subs = await Subject.find({ students: req.auth.userId });
  res.json(subs);
};

export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const sub = await Subject.findByIdAndUpdate(id, req.body, { new: true });
  res.json(sub);
};

export const deleteSubject = async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// SESSION CRUD
export const createSession = async (req, res) => {
  const { title, duration, subjectId } = req.body;
  const sess = await Session.create({
    title, duration, subject: subjectId, user: req.auth.userId
  });
  // Link in Subject
  await Subject.findByIdAndUpdate(subjectId, { $push: { sessions: sess._id } });
  res.status(201).json(sess);
};

export const getSessions = async (req, res) => {
  const { subjectId } = req.params;
  const sess = await Session.find({ subject: subjectId });
  res.json(sess);
};

export const updateSession = async (req, res) => {
  const sess = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(sess);
};

export const deleteSession = async (req, res) => {
  await Session.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// GOAL CRUD
export const createGoal = async (req, res) => {
  const { task, sessionId } = req.body;
  const goal = await Goal.create({ title: task, user: req.auth.userId });
  res.status(201).json(goal);
};

export const getGoals = async (req, res) => {
  const goals = await Goal.find({ user: req.auth.userId });
  res.json(goals);
};

export const updateGoal = async (req, res) => {
  const g = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(g);
};

export const deleteGoal = async (req, res) => {
  await Goal.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
