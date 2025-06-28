import express, { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { getAllFollowers, getAllFollowing, toggleFollower } from "../controllers/follow.controller.js";

const router = express.Router();

router.patch("/toggle/:id",isAuthenticated,toggleFollower);
router.get("/followers/:id",isAuthenticated,getAllFollowers);
router.get("/following/:id",isAuthenticated,getAllFollowing);


export default router;
