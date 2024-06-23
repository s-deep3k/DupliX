export const signup = (req,res)=>{
    try{
        const {fullname, username,email, password} = req.body
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    
        if(!emailRegex.test(email))
            return res.status(400).json({error:"Invalid Email Format"})
    }
    catch(error){}
}
export const signin = (req,res)=>{
    res.send()
}
export const logout = (req,res)=>{
    res.send()
}