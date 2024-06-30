import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async(req,res)=>{
    try{
        const {fullname, username,email, password} = req.body
        console.log({fullname,username,email,password});
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    
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
            fullname,
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
                fullname: newUser.fullname,
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
export const signin = (req,res)=>{
    const {username,password} = req.body
    const user= User.find({username})
    if(!user) console.log("No User with that username!");

    
    res.send()
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

export const getMe = (req,res)=>{
    if(!req.user)
        res.status(403).json({error:"Authentication Error. Sign up or Login First!"})
    res.json({user:req.user})
}