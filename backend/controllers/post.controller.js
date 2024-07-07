import {v2 as cloudinary} from 'cloudinary'
import Post from '../models/post.model.js'
import User from '../models/user.model.js'

const checkUserAuth = (userId)=>{
    const user = User.findById(userId)
    if(!user)
        return false
    else
        return true
}
export const createPost= async(req, res)=>{
    try{
    const {text} = req.body
    let {img} = req.body
    const userId = req.user._id

    if(!checkUserAuth(userId))
        res.status(403).json({error: "You are not authorized to create a post!"})

    if(!text && !img)
        res.status(400).json({error: "You have to provide text or image for your post!"})
    if(img){
        const uploadedImg = await cloudinary.uploader.upload(img)
        img = uploadedImg.secure_url
    }

    const newPost = new Post({
        user: userId,
        text,
        img
    })

    res.status(201).json(newPost)
}
catch(err){
    console.log("Error from Create Post ctrller");
    res.status(500).json({error:err.message})
}
}

export const commentOnPost = async(req,res)=>{
    const postId = req.params.id
    
    const userId = req.user._id

    if(!checkUserAuth(userId))
        res.status(403).json({error: "You are not authorized to create a post!"})
}

export const likeUnlikePost = async(req,res)=>{
    const postId = req.params.id
    const userId = req.user._id

    if(!checkUserAuth(userId))
        res.status(403).json({error: "You are not authorized to create a post!"})
}

export const deletePost = async(req,res)=>{
    const postId = req.params.id
    const userId = req.user._id

    if(!checkUserAuth(userId))
        res.status(403).json({error: "You are not authorized to create a post!"})

}