import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async(req,res)=>{
    try{
        const {fullname, username,email, password} = req.body
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    
        if(!emailRegex.test(email))
            return res.status(400).json({error:"Invalid Email Format"})

        const emailExists = User.findOne({email})
        if(emailExists)
            return res.status(400).json({error:"Email Already Taken!"})

        const userExists = User.findOne({username})
        if(userExists)
            return res.status(400).json({error:"User ALready Exists!"})

        const salt = await bcrypt.genSalt()
        const hashedPass = bcrypt.hash(password,salt)

        const newUser = new User({
            email,
            fullname,
            username,
            password:hashedPass,
        })
        if(newUser){
            generateTokenAndSetCookie(newUser,res)
            await newUser.save()

            res.status(201).json({
                ...newUser,
                id: newUser._id,
                // username: newUser.username,
                // email: newUser.email,
                // fullname: newUser.fullname,
                // bio: newUser.bio,
                // profileImg: newUser.profileImg,
                // coverImg: newUser.coverImg,
                // followers: newUser.
            })
        }else{
            res.status(400).json({error: "Error from signup contrlr"})
        }

    }
    catch(error){}
}
export const signin = (req,res)=>{
    const {username,password} = req.body
    const user= User.find({username})
    if(!user) console.log("No User with that username!");

    
    res.send()
}
export const logout = (req,res)=>{
    try{res.cookie(jwt,"",{
        maxAge:0
    })
    console.log("Logged Out Successfully");}
    catch(err){
        console.log("Error in Logging out");
        res.status(400).json({error:"Error from Logout controller"})
    }
}

export const getMe = (req,res)=>{
    if(!req.user)
        res.status(403).json({error:"Authentication Error. Sign up or Login First!"})
    res.json({user:req.user})
}