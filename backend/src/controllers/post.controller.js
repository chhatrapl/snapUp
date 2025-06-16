import { Post } from "../models/post.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middleware/multer.middleware.js";

export const createPost = async (req, res) =>{
        const {pic, title, discription} = req.body;
        const userId = req.user.id;

      postPicLocalPath = req.files?.pic[0]?.path; 

      if(!postPicLocalPath){
        console.log("picture is required!");
        return res.status(401).json({success:false, message:"pic is required!"});
      };

      try {
        
      const postPic = await uploadToCloudinary(postPicLocalPath);
      console.log(postPic.url);

      if(!postPic || !postPic.url){
        return res.status(401).json({success:false, message:"postpic nahi mil rha"})
      };

      const post = await Post.create({
        pic,
        title,
        discription,
        owner:userId
      });

      if(!post){
        console.log("post not created!");
        return res.status(401).json({success:false, message:"post not created!"})
      }

      return res.status(201).json({success:true, message:"post created successfully.", post:post})



      } catch (error) {
        return res.status(500).json({success:false, message:"somthing went wrong post not created!",error})
      }

};