import express from "express";

import { requireAuth } from "@clerk/express";
import { createGoal, createSession, createSubject, deleteGoal, deleteSession, deleteSubject, getGoals, getSessions, getSubjects, updateGoal, updateSession, updateSubject } from "../controllers.js/studyController.js";

const studyRouter = express.Router();

// Subjects
studyRouter.post("/", requireAuth(), createSubject);
studyRouter.get("/", requireAuth(), getSubjects);
studyRouter.put("/:id", requireAuth(), updateSubject);
studyRouter.delete("/:id", requireAuth(), deleteSubject);

// Sessions
studyRouter.post("/sessions", requireAuth(), createSession);
studyRouter.get("/sessions/:subjectId", requireAuth(), getSessions);
studyRouter.put("/sessions/:id", requireAuth(), updateSession);
studyRouter.delete("/sessions/:id", requireAuth(), deleteSession);

// Goals
studyRouter.post("/goals", requireAuth(), createGoal);
studyRouter.get("/goals", requireAuth(), getGoals);
studyRouter.put("/goals/:id", requireAuth(), updateGoal);
studyRouter.delete("/goals/:id", requireAuth(), deleteGoal);

export default studyRouter;
