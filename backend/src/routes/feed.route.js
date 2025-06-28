import express,{Router} from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { getFeed } from "../controllers/feed.controller.js";

const router = express.Router();

router.get("/feed", isAuthenticated, getFeed);


export default router;