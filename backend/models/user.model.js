import mongoose, { Schema, Types } from "mongoose";

export const userSchema = new mongoose.Schema({
username:{
    type: String,
    required: true,
    unique: true
},
fullName:{
    type: String,
    required: true,
    unique: true
},
email: {
    type: String,
    required: true,
    unique: true
},
password:{
    type: String,
    required: true,
    minLength: 6
},
followers:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:[]
    }
],
following:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:[]
    }
],
likedPosts:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default:[]
    }
],
bio: {
    type: String,
    default:""
},
profileImg: {
    type: String,
    default:""
},
coverImg:{
type: String,
    default:""
},
link: {
    type: String,
    default:""
}
},{timestamps:true})

const User = mongoose.model("User", userSchema)
//users will be name of collection in db

export default User