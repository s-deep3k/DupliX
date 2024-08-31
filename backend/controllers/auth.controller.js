import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async(req,res)=>{
    try{
        const {fullName, username,email, password} = req.body
        console.log({fullName,username,email,password});
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    
        if(!emailRegex.test(email))
            return res.status(400).json({error:"Invalid Email Format"})

        const emailExists = await User.findOne({email})
        console.log(emailExists);
        if(emailExists)
            return res.status(400).json({error:"Email Already Taken!"})

        const userExists = await User.findOne({username})
        if(userExists)
            return res.status(400).json({error:"User ALready Exists!"})

        const salt = await bcrypt.genSalt()
        const hashedPass = await bcrypt.hash(password,salt)

        const newUser = new User({
            email,
            fullName,
            username,
            password:hashedPass,
        })
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save()

            res.status(201).json({
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                fullName: newUser.fullName,
                bio: newUser.bio,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                followers: newUser.followers,
                following: newUser.following
            })
        }else{
            
            res.status(400).json({error: "User didnot Save"})
        }

    }
    catch(error){
        console.log(error);
        res.status(400).json({error: "Error from signup contrlr"})
    }
}
export const signin = async(req,res)=>{
    try {
        const {username,password} = req.body
        const user=await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if(!user || !isPasswordCorrect)
            res.status(400).json({error:"Invalid username or password"}) 
    
        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            bio: user.bio,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            followers: user.followers,
            following: user.following
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}
export const logout = (req,res)=>{
    try{
    res.cookie(process.env.JWT_TOKEN_NAME,"",{
        maxAge:0
    })
    res.status(200).json({message: "Logged out succesffuly"})
    console.log("Logged Out Successfully");}
    catch(err){
        console.log("Error in Logging out ",err);
        res.status(400).json({error:"Error from Logout controller"})
    }
}

export const getMe = async(req,res)=>{
    try{
    const user = await User.findById(req.user._id).select("-password");
    console.log(user, "From Get Me");
    
    if(!user)
        res.status(403).json({error:"Authentication Error.Couldnt Fetch Your Profile! Sign up or Login First!"})
    res.status(200).json(user)
    }catch(err){
        console.log("Error in getMe ctrler",err.message);
        //res.status(500).json({error: "Internal Server Error"})
        
    }
}