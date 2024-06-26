import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (userId, response)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{ //payload must be plain object
        expiresIn:"15d"
    })
    response.cookie(process.env.JWT_TOKEN_NAME,token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true,// prevents XSS cross site scripting attacks
        sameSite:true,// prevents CSRF cross site request forgery attacks
        secure: process.env.NODE_ENV!=="development"
    })
}