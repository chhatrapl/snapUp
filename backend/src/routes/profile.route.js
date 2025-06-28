import express, { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { getProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/profile/:id",isAuthenticated,getProfile)

export default router;