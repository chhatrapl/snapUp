import express, { Router } from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
const app = express();


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter)


export default app