import {User} from "../models/user.model.js";
import {Post} from "../models/post.model.js";

export const getFeed = async (req, res) =>{
  try {
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;
     const skip = (page -1)*limit;
  
     const posts = await Post.find().sort({createdAt: -1}).skip(skip).limit(limit).populate("owner", "userName profilePic");
  
     if(!posts){
      console.error("posts not found!")
     };
   
     const totalPosts = await Post.countDocuments();

     return res.status(200).json({
      success:true,
      page,
      totalPages:Math.ceil(totalPosts/limit),
      posts
     });
  } catch (error) {
    return res.status(500).json({
        success:false,
        message:"somthing went wrong!",
        error: error.message
    });
  };
 
};