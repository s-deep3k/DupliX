import mongoose from "mongoose";

export default userSchema = new mongoose.Schema({
username:{
    type: String,
    required: true,
    unique: true
},
fullname:{
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
followers:{

}
},{timestamps:true})