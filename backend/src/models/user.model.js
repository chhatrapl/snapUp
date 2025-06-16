import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({

    fullName:{
        type:String,
        required:true,
        lowercase:true
    },

    userName:{
        type:String,
        required:true,
        unique:true,
        index:true
    },

    mobileNumber:{
        type:String,
        parse:true,
         index:true
    },
    
    password:{
        type:String,
        required:true
    },

    profilePic:{
        type:String,
        required:true
    }

});


export const User = mongoose.model("User", userSchema);