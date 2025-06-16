import jwt from "jsonwebtoken";

export const genrateRefreshToken = (userId)=>{
    return jwt.sign({_id:userId},process.env.REFRESHTOKEN_SECRATE,{expiresIn:"7d" });
};