import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { registerUser } from "../controllers.js/userController.js";
// const { requireAuth, ClerkExpressWithAuth } = require("@clerk/express");
// const { Router } = require("express");

const userRouter=Router()

userRouter.post('/register', requireAuth(), registerUser);

export default userRouter;