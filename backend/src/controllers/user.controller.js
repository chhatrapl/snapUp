import { User } from "../models/user.model.js";
import { upload } from "../middleware/multer.middleware.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { genrateAccessToken } from "../utils/genrateAccessToken.js";
import { genrateRefreshToken } from "../utils/genrateRefreshToken.js";
import { genrateAccessTokenAndRefreshToken } from "../utils/genrateAccessTokenAndRefreshToken.js";



export const signup = async(req, res)=>{

const {fullName, userName, mobileNumber, password, profilePic } = req.body;

if([fullName, userName, mobileNumber, password].some((field)=> field?.trim() === "")){
      console.log(`all fields are required!`);
    return res.status(401).json({success:false, message:"all fields are required!"})
  
};

const existeduserName = await User.findOne({userName});

if(existeduserName){
    console.log(`already have a account with this username!`)
    return res.status(400).json({success:false, message:"already have a account with this username!"})
    
}

const mobileRegex = /^[6-9]\d{9}$/;
if(!mobileRegex.test(mobileNumber)){
  return res.status(401).json({message:"invalid mobile number"})
}


const profilePicLocalPath = req.files?.profilePic[0]?.path;

if(!profilePicLocalPath){
  return res.status(400).json({success:false, message:"profilepic is required!"});
}

try {
     const profilepic = await uploadToCloudinary(profilePicLocalPath); 
     console.log(profilepic.url);
     if(!profilepic.url || !profilepic){
      console.log("profilepic url nahi mil rha")
     } 

    try {
       const hashedPassword = await bcrypt.hash(password, 10);
       console.log("hashedPassword:",hashedPassword);
  
       const user = await User.create({
          fullName,
          userName,
          mobileNumber,
          password:hashedPassword,
          profilePic:profilepic.url
       });
       
// //////////////////////////////////////////

  const isProduction = process.env.NODE_ENV === "production";

    const accessToken = genrateAccessToken(user._id);
   //console.log(token);
   res.cookie("accessToken", accessToken, {
      httpOnly:true,
      secure: isProduction,
      sameSite:"Strict",
      maxAge:15*60*1000
   });

   const refreshToken = genrateRefreshToken(user._id);
   //console.log(newRefreshToken);
   res.cookie("refreshToken", refreshToken, {
      httpOnly:true,
      secure: isProduction,
      sameSite:"Strict",
      maxAge:7*24*60*60*1000
   });

   console.log(`cookie set successfully`)

       return res.status(201).json({
      success: true,
      message: "User successfully signup & token set",
      user: {
        _id: user._id,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
      },
    });
/////////////////////////////////////////////////////


    } catch (error) {
        return res.status(401).json({success:false, message:"somthing  went wrong ! user does note created!", error})
    }


  
} catch (error) {
    return res.status(500).json({success:false, message:"somthing went wrong!", error})
}
};
/////////////////////////////////////////////////////////////////////////////////////////////////


export const login = async(req, res) => {

 try {
   const {mobileNumber, userName, password} = req.body;
 
   if((!mobileNumber && !userName) || !password){
     return res.status(400).json({success:false, message:"mobileNumer, userName and password is required!"})
   }
 
      const user = await User.findOne(
      { $or:[{mobileNumber},{userName}]}
      );

 
      if(!user){
        return res.status(400).json({success:false, message:"user dooes not exist!"})
      }
      //console.log(user);
 
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if(!isPasswordCorrect){
       return res.status(401).json({success:false,message:"incorrect password!"});
      }
      console.log("password:",isPasswordCorrect);
 
 
      const logedinUser = await User.findOne({_id:user._id}).select("-password -refreshToken");
        console.log("loggedinuser",logedinUser)
      
  try {
      const {accessToken, refreshToken} = await genrateAccessTokenAndRefreshToken(user._id);
  
       const options = {
           httpOnly:true,
           secure:true
         }
  
     return res.status(201).cookie("accessToken", accessToken, options)
                     .cookie("refreshToken", refreshToken,options)
                     .json({
                       success:true,
                       message:"user logedin successfull.",
                       user:logedinUser,accessToken,refreshToken
                     })
  } catch (error) {
    return res.status(400).json({success:false, message:"somthing err in genrating tokens!"})
  }
 
 } catch (error) {
  return res.status(500).json({success:false,
                               message:"somthing went wrong while login!",
                              error
  })
 }
};
////////////////////////////////////////////////////////////////////////////////////////////////////


export const logout = async(req, res)=>{
 try {
   User.findById(req.user._id,{$set:{refreshToken:undefined}},{new:true})
 
   const options = {
     httpOnly:true,
     secure:true
   }
 
   return res.status(200).clearCookie("accessToken", options)
                         .clearCookie("refreshToken", options)
                         .json({success:true, message:"user logedOut successfully."})
 
 } catch (error) {
  
  return res.status(500).json({success:false, message:"somting went wrong while logging Out."})

 }

};
///////////////////////////////////////////////////////////////////////////////////////////////////

