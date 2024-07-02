import Notification from "../models/notification.model"
import User from "../models/user.model"
import bcrypt from 'bcryptjs'

export const getUserProfile = async (req,res)=>{
    try {
        const {username} = req.params
        const userProfile = await User.findOne({username}).select('-password')
        if(!userProfile)res.status(404).json({error:"No User Found!"})
            
        res.status(200).json(userProfile)
    } catch (error) {
        console.log(error.message);
        res.status(400).json({error:"Error from getUserProfile"})
    }
}

export const updateUserProfile = async (req,res)=>{
    const {fullname, username, newPassword, currentPassword, email} = req.body
    let {coverImg, profileImg} = req.body

    const userId = req.user._id

    const user = await User.findById(userId)
    if(!user) res.status(404).json({error:"User Not Found!"})
    
    if(!newPassword || !currentPassword)
        res.status(400).json({error:"Current Password and New Password!"})
    else{
        const isMatch = bcrypt.compare(currentPassword, user.password)
        if(!isMatch)res.status(400).json({error:"Current Password you entered is incorrect!"})
        if(newPassword.length()<6)res.status(400).json({error:"New Password cannot be less than 6 characters"})
        
        const salt =await bcrypt.genSalt()
        const hashedPassword =await bcrypt.hash(newPassword,salt)

        if(coverImg){}

        if(profileImg){}   
    }
}

export const suggestedProfiles = async (req,res)=>{
    try {
        const userId = req.user._id

        const usersFollowedByMe = await User.findById(userId).select("following")
        // getting 10 users who are not me.
        const users = User.aggregate([
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
        const suggestedUsers = filteredUsers.splice(0,4).forEach(user=>user.password=null)

        res.status(200).json(suggestedUsers)

    } catch (error) {
        console.log("Error from suggested profiles controller");
        res.status(400).json({error: error.message})
    }
}

export const followUnfollowUser = async (req,res)=>{
    try{
    const {id} = req.params
    const userToFollow = await User.findById(id).select('-password')
    if(!userToFollow)res.status(404).json({error:"No User to Follow Found!"})

    const currentUser = await User.findById(req.user._id).select('-password')
    if(!currentUser)res.status(404).json({error:"No Current User Found!"})
    
    if(id===req.user._id)
        res.status(404).json({error:"You cannot follow / unfollow yourself!"})
    if(currentUser.following.includes(id)){
        //Unfollow
       await User.findByIdAndUpdate(req.user._id,{$pull:{followers:id}})
       await User.findByIdAndUpdate(id,{$pull:{following:req.user._id}})
       res.status(200).json({message:"User has been unfollowed!"})
    }else{
        //Follow
        await User.findByIdAndUpdate(req.user._id,{$push:{followers:id}})
       await User.findByIdAndUpdate(id,{$push:{following:req.user._id}})

       const newNotification = new Notification({
        type:"FOLLOW",
        from: req.user._id,
        to: userToFollow.id
    })
    await newNotification.save()
// TODO: return the id of user as response
       res.status(200).json({message:"User has been followed!"})
    }
    }
    catch(err){
        res.status(500).json({error:err.message})
        console.log("error from follow/unfollow user");
    }
}