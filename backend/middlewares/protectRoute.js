import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
export const protectRoute =async (req,res,next)=>{
    try {
        const token = req.cookies[process.env.JWT_TOKEN_NAME]
        
        if(!token)
            res.status(401).json({error: "Unauthorized! No Token Detected!"})
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded)
            res.status(401).json({error: "Unauthorized! Decoding token Failed!"})

        const user = await User.findById(decoded.userId).select("-password")
        if(!user) res.status(401).json({error:"No User Found!"})
        
        req.user = user
        console.log("Protected Route success ,",user.fullName);
        
        next()
    } catch (error) {
        console.log(error.message ," Error from protection Route"
        );
        //res.status(500).json({error:"Internal Server Error"})
    }
}