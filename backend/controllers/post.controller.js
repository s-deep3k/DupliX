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

export const getAllPosts = async(req,res)=>{
    try{
        const posts = await Post.find()
        .sort({createdAt: -1})
        .populate({
            path:'user',
            select: '-password'
        }).populate({
            path:'comments.user',
            select: '-password'
        })

        res.status(200).json(posts)
    }catch(err){
        console.log("Error from Get ALL Posts ");
        res.status(400).json({error:err.message})
    }
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
    const {text} = req.body
    const userId = req.user._id

    if(!checkUserAuth(userId))
        res.status(403).json({error: "You are not authorized to create a post!"})

    const post = await Post.findById(postId)
    if(!post)res.status(404).json({error: "No Such Post found."})
    if(text)
    {}
}

export const likeUnlikePost = async(req,res)=>{
    const postId = req.params.id
    const userId = req.user._id

    if(!checkUserAuth(userId))
        res.status(403).json({error: "You are not authorized to like/unlike a post!"})
    const post = await Post.findById(postId)
    if(!post)res.status(404).json({error: "No such post found !"})

    if(post.likes.includes(userId))
    {//Unlike
        await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}})
        await User.findByIdAndUpdate(userId,{$pull:{likedPosts:postId}})
    }else{
        await Post.findByIdAndUpdate(postId,{$push:{likes:userId}})
        await User.findByIdAndUpdate(userId,)
    }
}

export const deletePost = async(req,res)=>{
    try{
    const postId = req.params.id
   // const userId = req.user._id

    const post = await Post.findByIdAndDelete(postId)
    if(!post)res.status(404).json({error: "No Such Post found."})
    else
    res.status(200).json({message: " Post deleted successfully."})
    }
    catch(err){
        console.log("Error from Delete Post");
        res.status(400).json({error:err.message})
    }
}