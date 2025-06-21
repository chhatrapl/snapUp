import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    pic:{
         url: { type: String, required: true },
    public_id: { type: String, required: true }
    },
    title:{
        type:String
    },
    discription:{
        type:String
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

});

export const Post = mongoose.model("Post", postSchema);

