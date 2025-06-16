import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
         
         const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "") 

         if(!token){
            return res.status(401).json({success:false, message:"token does not exist!"})
         }

         const decodedToken = jwt.verify(token,process.env.GENRATETOKEN_SECRATE);

         const user = await User.findById(decodedToken._id).select("-password -refreshToken");

         if(!user){
            return res.status(400).json({success:false, message:"invalid eccessToken!"})
         }
         
         req.user = user;
         next()

    } catch (error) {
        return res.status(500).json({success:false, message:"somthing went wrong is Authorization!"})
    }
}