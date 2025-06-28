import express, { Router } from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import followrouter from "./routes/follow.route.js";
import profilerouter from "./routes/profile.route.js";
import feedRouter from "./routes/feed.route.js";
const app = express();


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/follow",followrouter);
app.use("/api/v1/profile",profilerouter);
app.use("/api/v1/getfeed",feedRouter);



export default app