import express, {Router} from "express";
import { User } from "../models/user.model.js";
import {  login, logout, signup } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/signup", upload.fields([
    {name:"profilePic", maxCount:1}
]),signup);
router.post("/login",login)
router.post("/logout",isAuthenticated,logout)


export default router