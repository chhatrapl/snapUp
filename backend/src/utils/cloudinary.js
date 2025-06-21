import dotenv from "dotenv";
dotenv.config();

 import {v2 as cloudinary }from "cloudinary";
  import fs from "fs";


  cloudinary.config({
   cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_APIKEY,
   api_secret:process.env.CLOUDINARY_SECRET,
  })

  const uploadToCloudinary = async (LocalFilePath, folder = "posts")=>{
    try {
     
        if(!LocalFilePath) return null
        
        const uploaded = await cloudinary.uploader.upload(LocalFilePath,{
            folder,
            resource_type:"auto"
        });

        console.log("file uploaded to cloudinary")
        console.log("url : ",uploaded.secure_url);
        console.log("publicId : ", uploaded.public_id);
       // console.log(LocalFilePath);
        await fs.promises.unlink(LocalFilePath);

        return {
             url:uploaded.secure_url,
             public_id:uploaded.public_id
        };

    } catch (error) {
        console.error(`cloudinary upload err`, error);
         await fs.promises.unlink(localFilePath).catch((err) => {
        console.error("Error deleting file after failed upload:", err);
    });
    throw new Error("Cloudinary upload failed: " + error.message)
    }
}

export {uploadToCloudinary}