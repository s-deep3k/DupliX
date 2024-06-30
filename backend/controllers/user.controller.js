import User from "../models/user.model"


export const getUserProfile = async (req,res)=>{
    try {
        const {username} = req.params
        const userProfile = await User.findOne({username}).select('-password')
        if(!userProfile)res.status(404).json({error:"No User Found!"})
            
        res.status(200).json({
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            fullname: newUser.fullname,
            bio: newUser.bio,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
            followers: newUser.followers,
            following: newUser.following
        })
    } catch (error) {
        console.log(error);
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
        currentUser.following = currentUser.following.filter(follow=>follow._id!==id)
    }else{
        currentUser.following.concat(id)
    }
    }
    catch(err){
        res.status(500).json({error:err.message})
        console.log("error from follow/unfollow user");
    }
}