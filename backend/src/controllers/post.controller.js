import { Post } from "../models/post.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middleware/multer.middleware.js";

export const createPost = async (req, res) =>{
        const { title, discription} = req.body;
        const { pic } = req.files;
        const userId = req.user.id;

     const  postPicLocalPath = req.files?.Pic[0]?.path; 

     

      try {
        
      const postPic = await uploadToCloudinary(postPicLocalPath);
      console.log(postPic.url);

      if(!postPic || !postPic.url){
        return res.status(401).json({success:false, message:"postpic nahi mil rha"})
      };


try {
  
        const post = await Post.create({
          pic:postPic.url,
          title,
          discription,
          owner:userId
        });

        console.log(post);
        return res.status(201).json({success:true, message:"post created successfully.", post:post})

} catch (error) {
  return res.status(500).json({success:false, message:"post not created!", error})
}

      } catch (error) {
        return res.status(500).json({success:false, message:"somthing went wrong!",error})
      }

};