import Notification from "../models/notification.model"
import User from "../models/user.model"


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

export const updateUserProfile = async (req,res)=>{}

export const suggestedProfiles = async (req,res)=>{}

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