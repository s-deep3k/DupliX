import {v2 as cloudinary} from 'cloudinary'
import Post from '../models/post.model.js'
import User from '../models/user.model.js'


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

export const getLikedPosts = async(req,res)=>{
    const userId = req.params.id
    try {
        const user = await User.findById(userId)
        if(!user)
            res.status(404).json({error:"User not Found!"})
    
        const likedPosts = await Post.find({_id: {$in: user.likedPosts} }).populate({
            path:'user',
            select: '-password'
        }).populate({
            path:'comments.user',
            select: '-password'
        })
        res.status(200).json(likedPosts)
    } catch (error) {
        console.log("Error from get liked Posts");
        res.status(400).json({error:error.message})
        
    }
    
}

export const getFollowingPosts = async(req,res)=>{
    const userId = req.user._id
    try {
        const user = await User.findById(userId)
        if(!user)
            res.status(404).json({error:"User not Found!"})
    
        const following = user.following
        const feedPosts = await Post.find({user: {$in: following} })
        .sort({createdAt: -1})
        .populate({
            path:'user',
            select: '-password'
        }).populate({
            path:'comments.user',
            select: '-password'
        })

        res.status(200).json(feedPosts)
    } catch (error) {
        console.log('Error from getFollowingPosts ctrller');
        res.status(400).json({error:error.message})
        
    }
}

export const getUserPosts = async(req,res)=>{
    try{
        const {username} = req.params
        const user = await User.findOne({username})
        if(!user)
            res.status(404).json({error:"User not Found!"})

        const userPosts = await Post.find({user})
        .sort({createdAt: -1})
        .populate({
            path:'user',
            select: '-password'
        }).populate({
            path:'comments.user',
            select: '-password'
        })

        res.status(200).json(userPosts)
    }catch(err){
        console.log("Error from getUserPosts ctrller");
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

    const user = await User.findById(userId)
        if(!user)
        res.status(403).json({error: "You are not authorized to create a post!"})

    const post = await Post.findById(postId)
    if(!post)res.status(404).json({error: "No Such Post found."})
    if(text)
    {
        await Post.findByIdAndUpdate(postId,{$push:{comments:text}})
    }
}

export const likeUnlikePost = async(req,res)=>{
    const postId = req.params.id
    const userId = req.user._id

    const user = await User.findById(userId)
        if(!user)
        res.status(403).json({error: "You are not authorized to like/unlike a post!"})
    const post = await Post.findById(postId)
    if(!post)res.status(404).json({error: "No such post found !"})
    let updatedLikes = post.likes
    if(post.likes.includes(userId))
    {//Unlike
        await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}})
        await User.findByIdAndUpdate(userId,{$pull:{likedPosts:postId}})

        updatedLikes = post.likes.filter(id=> id !== userId)
    }else{
        await Post.findByIdAndUpdate(postId,{$push:{likes:userId}})
        await User.findByIdAndUpdate(userId,{$push:{likedPosts:postId}})

        updatedLikes = post.likes.concat(userId)
    }
    res.status(200).json(updatedLikes)
}

export const deletePost = async(req,res)=>{
    try{
    const postId = req.params.id

    const post = await Post.findById(postId)
    if(!post)res.status(404).json({error: "No Such Post found."})
    
        if(post.user.toString()!==req.user._id.toString())
        res.status(403).json({error:"You are not authorized to delete this post!"})
    if(post.img){
        const imgUrl = post.img.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(imgUrl)
    }
    await Post.findByIdAndDelete(postId)
    res.status(200).json({message: " Post deleted successfully."})
    }
    catch(err){
        console.log("Error from Delete Post");
        res.status(400).json({error:err.message})
    }
}