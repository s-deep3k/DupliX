import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"

import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'

export const getUserProfile = async (req,res)=>{
    try {
        const {username} = req.params
        const userProfile = await User.findOne({username}).select('-password')
        if(!userProfile){res.status(404).json({error:"No User Found!"})
            return
        }
        res.status(200).json(userProfile)
    } catch (error) {
        console.log(error.message);
       // throw new Error(error.message)
        //res.status(400).json({error:"Error from getUserProfile"})
    }
}

export const updateUserProfile = async (req,res)=>{
    try
    {
    const {fullName, username, newPassword, currentPassword, email, bio, link} = req.body
    let {coverImg, profileImg} = req.body

    const userId = req.user._id

    let user = await User.findById(userId).select("-followers -following -likedPosts")
    if(!user) return res.status(404).json({error:"User Not Found!"})
    console.log(user)
    if((!newPassword&&currentPassword) || (!currentPassword&&newPassword))
        return res.status(400).json({error:"Current Password and New Password both must be given!"})
    console.log("Here I am 1");
    
    if(newPassword && currentPassword){
        const isMatch =await bcrypt.compare(currentPassword, user.password)
        if(!isMatch)
        {
            //throw new Error("Current Password Not Matching!")
            return res.status(400).json({error:"Current Password you entered is incorrect!"})
        }
        console.log("Here I am 2");
        if(newPassword.length <6)
            return res.status(400).json({error:"New Password cannot be less than 6 characters"})
        console.log("Here I am 3");
        const salt =await bcrypt.genSalt()
        user.password =await bcrypt.hash(newPassword,salt)
        console.log("Here I am 4");
    }
        if(coverImg){
            console.log("Here I am for Cover Image!");
            if(user.coverImg)
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0])
            console.log("Destroyed Cover");
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            
            console.log("Uploaded Cover");
            
            coverImg = uploadedResponse.secure_url
        }

        if(profileImg){
            console.log("Here I am for Profile Image");
            if(user.profileImg)
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0])
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url
        }   
        console.log({profileImg, coverImg})

        user.fullName = fullName || user.fullName
        user.username = username || user.username
        user.email = email || user.email
        user.coverImg = coverImg || user.coverImg
        user.profileImg = profileImg || user.profileImg
        user.bio = bio || user.bio
        user.link = link || user.link

        await user.save()
        user.password=null
        res.status(200).json(user)
    }
    catch(err){
        console.log("Error from update user cntroller ",err.message);
        res.status(400).json({error:err.message})
    }
    
}

export const suggestedProfiles = async (req,res)=>{
    try {
        const userId = req.user._id

        const usersFollowedByMe = await User.findById(userId).select("following")
        // getting 10 users who are not me.
        const users =await User.aggregate([
            {
                $match:{
                    _id: {$ne: userId}
                }
            },
            {$sample:{size:10}}
        ])
        //filtering out users that I dont follow
        const filteredUsers = users.filter(user=> !usersFollowedByMe.following.includes(user._id))
        //taking just 4 out of the unfollowed users
        const suggestedUsers = filteredUsers.slice(0,4)
        suggestedUsers.forEach(user=>user.password=null)

        res.status(200).json(suggestedUsers)

    } catch (error) {
        console.log("Error from suggested profiles controller");
        //res.status(400).json({error: error.message})
    }
}

export const followUnfollowUser = async (req,res)=>{
    try{
    const {id} = req.params
    
    const userToFollow = await User.findById(id).select('-password')
    if(!userToFollow) return res.status(404).json({error:"No User to Follow Found!"})
        
        const currentUser = await User.findById(req.user._id).select('-password')
        if(!currentUser)return res.status(404).json({error:"No Current User Found!"})
            
            console.log("Her is "+userToFollow?.fullName+" id "+id);
    if(id===req.user._id)
        return res.status(404).json({error:"You cannot follow / unfollow yourself!"})
    console.log(currentUser?.following);
    
    if(currentUser?.following.includes(id)){
        //Unfollow
       await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}})
       await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}})
       res.status(200).json({message:"You  unfollowed "+userToFollow.fullName+"!"})
       return;
    }else{
        //Follow
        await User.findByIdAndUpdate(req.user._id,{$push:{following:id}})
       await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}})

       const newNotification = new Notification({
        type:"FOLLOW",
        from: req.user._id,
        to: userToFollow._id
    })
    await newNotification.save()
// TODO: return the id of user as response
       res.status(200).json({message:"You  followed "+userToFollow.fullName+"!"})
    }
    }
    catch(err){
        res.status(500).json({error:err.message})
        console.log("error from follow/unfollow user");
    }
}