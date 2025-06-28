import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Follow } from "../models/follow.model.js";
import mongoose from "mongoose";


export const getProfile = async (req, res) =>{
 try {
       const userId = req.params.id;
       const loggedInUserId = req.user.id;

       const page = parseInt(req.query.page) || 1;
       const limit = parseInt(req.query.limit) || 10;
       const skip = (page - 1)*limit;
       
        console.log("Input userId:", userId, "Type:", typeof userId);
        console.log("LoggedInUserId:", loggedInUserId, "Type:", typeof loggedInUserId);

         if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }
   
       const profile = await User.findById({_id:userId}).select("-password");
       //console.log("user: ", profile);
   
       if(!profile){
           return res.status(404).json({message:"user not found!"})
       }
   
       const posts = await Post.find({owner: new mongoose.Types.ObjectId(userId)})
       .sort({createdAt: -1 })
       .skip(skip)
       .limit(limit);
       console.log("post: ", posts);

        const postCount = await Post.countDocuments({owner:userId});
        const totalPages = Math.ceil(postCount/limit);
        console.log("posts count : ", postCount)
   
            const [followersCount, followingCount] = await Promise.all([
            Follow.countDocuments({ following: userId }),
            Follow.countDocuments({ follower: userId })
        ]);
        console.log("followers, following", followersCount, followingCount)

        const  isOwnProfile = userId === loggedInUserId
        
       if(!isOwnProfile){
        console.log("owner and user is not a same.")
       }else{
        console.log("owner and user is same person")
       }
        
    
   
       return res.status(200).json({
           User:{
               _id:profile._id,
               userName: profile.userName,
               fullName: profile.fullName,
               profilePic: profile.profilePic,
               isOwnProfile,
               followersCount,
               followingCount,
               postCount
           },
           posts,
            pagination: {
        currentPage: page,
        totalPages,
        limit,
    }
       })
 } catch (error) {
    return res.status(500).json({
  success: false,
  message: "Something went wrong!",
  error: error.message // ya error.toString()
});
 }
};