import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"

export const getNotification = async(req,res)=>{
    try {
        const userId = req.user._id

        const notifications = await Notification.find({
            to: {userId}
        }).populate({
            path:"from",
            select:"username profileImg"
        })

        await Notification.updateMany({to:{userId}},{read:true})
        res.status(200).json(notifications)
    } catch (err) {
        console.log("Error from get Notifctions ctrler");
        res.status(400).json({error: err.message})
        
    }
}

export const deleteNotifications = async(req,res)=>{
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user)
            res.status(404).json({error:"No User found !"})
        
        const notifications = await Notification.deleteMany({
            to: {userId}
        })

        res.status(200).json(notifications)
    } catch (err) {
        console.log("Error from get Notifctions ctrler");
        res.status(400).json({error: err.message})
        
    }
}