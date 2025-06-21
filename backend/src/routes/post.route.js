import { createPost, deletePost, editPost } from "../controllers/post.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/multer.middleware.js";
import { Post } from "../models/post.model.js";
import express,{Router} from "express";


const router = express.Router();

router.post("/createpost", upload.fields([
    {name:"Pic", maxCount:1}
]),isAuthenticated,createPost);

router.delete("/deletepost/:id",isAuthenticated,deletePost);

router.patch("/editpost/:id", isAuthenticated, editPost);


export default router;