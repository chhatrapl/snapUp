import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";
import mongoose from "mongoose";

export const toggleFollower = async (req, res) =>{
    const userId = req.user.id;
    const targateId = req.params.id;
    
    if(userId === targateId){
        return res.status(400).json({success:false, message:"you cant follow your self!"})
    }

    const existingfollow = await Follow.findOne({
        follower: userId,
        following: targateId
    })

    if(existingfollow){
        await Follow.deleteOne({_id:existingfollow._id})
        return res.status(200).json({success:true, message:"unfollowed"})
    }

    await Follow.create({
        follower: userId,
        following: targateId
    })
    return res.status(200).json({success:true, message:"followed"})

};

export const getAllFollowers = async (req, res) => {
    const userId = req.params.id;
     
    const page = parseInt(req.query.page)|| 1 
    const limit = parseInt(req.query.limit)||10
     const skip = (page - 1) * limit;
     
    const followers = await Follow.aggregate([
        {$match:{following:new mongoose.Types.ObjectId(userId)}},
        {
            $lookup:{
                from:"users",
                localField:"follower",
                foreignField:"_id",
                as:"followerDetails"
            }
        },
        {$unwind:"$followerDetails"},
        {
            $project:{
                _id:0,
                id:"$followerDetails._id",
                userName:"$followerDetails.userName",
                profilePic:"$followerDetails.profilePic"
            }
        },
        {$skip:skip},
        {$limit:limit}
    ]);
   return res.status(200).json({page, limit, followers})
};

export const getAllFollowing = async (req, res) => {
     const userId = req.params.id; 
  
     
    const page = parseInt(req.query.page)|| 1 
    const limit = parseInt(req.query.limit)||10
     const skip = (page - 1) * limit;
     
    const following = await Follow.aggregate([
        {$match:{follower:new mongoose.Types.ObjectId(userId)}},
        {
            $lookup:{
                from:"users",
                localField:"following",
                foreignField:"_id",
                as:"followerDetails"
            }
        },
        {$unwind:"$followerDetails"},
        {
            $project:{
                _id:0,
                id:"$followerDetails._id",
                userName:"$followerDetails.userName",
                profilePic:"$followerDetails.profilePic"
            }
        },
        {$skip:skip},
        {$limit:limit}
    ]);
   return res.status(200).json({page, limit, following})
};
