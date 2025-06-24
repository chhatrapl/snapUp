import { Post } from "../models/post.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middleware/multer.middleware.js";
import { DeleteCloudinaryPic } from "../utils/deleteCloudinaryPic.js";

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
          pic:{
            url: postPic.url,
            public_id: postPic.public_id
          },
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

export const deletePost = async (req, res) =>{
  try {
    const postId = req.params.id;
    const post = await Post.findById({ _id: postId });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found!" });
    }

   const public_Id = post.pic.public_id;
   console.log("publicId to delete:", public_Id);

    const deletedPic = await DeleteCloudinaryPic(public_Id);
    const deletedPost = await Post.findByIdAndDelete(postId);


    console.log("deleted post:", deletedPost);
    console.log("deleted pic:", deletedPic);

    return res.status(200).json({ success: true, message: "Post and pic deleted." });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong!", error });
  }
};

export const editPost = async (req, res) =>{
  try {
      const {title, discription} = req.body;
       const postId = req.params.id;
       const post = await Post.findById({_id:postId});
  
       if(!post){
        return res.status(404).json({success:false, message:"post not found!"});
       }
    
       const editedPost = await Post.findByIdAndUpdate(postId, {title, discription}, {new:true, runValidators:true });
  
       console.log("editedPost: ",editedPost);
    
       if(!editedPost){
        return res.status(404).json({success:false, message:"post not edited!"})
       }
  
       return res.status(201).json({success:true, message:"post edited Successfully.!"});
  } catch (error) {
      return res.status(500).json({success:false, message:"somthing went wrong!", error});
      }
};