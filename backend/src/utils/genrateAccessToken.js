import jwt from "jsonwebtoken"

export const genrateAccessToken = (userId)=>{
  return jwt.sign({_id:userId},process.env.GENRATETOKEN_SECRATE,{expiresIn:"15m"})
};