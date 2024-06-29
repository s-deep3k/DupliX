import jwt from 'jsonwebtoken'
import User from '../models/user.model'
export const protectRoute = (req,res,next)=>{
    try {
        const token = req.cookies.jwt
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded)
            res.status(401).json({error: "Invalid Token Detected!"})

        const user = User.findById(decoded.userId).select("-password")
        if(!user) res.status(401).json({error:"No User Found!"})
        
        req.user = user
        next()
    } catch (error) {
        console.log(error," Error from protection Route"
        );
        res.status(500).json({error:"Internal Server Error"})
    }
}