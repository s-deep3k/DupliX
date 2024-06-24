import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from '../../../env.local.js'

export const generateTokenAndSetCookie = (userId, response)=>{
    const token = jwt.sign(userId,JWT_SECRET,{
        expiresIn:"15d"
    })
    response.cookie("jwt",token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true,// prevents XSS cross site scripting attacks
        sameSite:true,// prevents CSRF cross site request forgery attacks
        secure: NODE_ENV!=="development"
    })
}