import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import authRouter from './routes/auth.route.js'
import { connectMongoDB } from './db/connectDB.js'
import {v2 as cloudinary} from 'cloudinary'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import notificationRouter from './routes/notification.route.js'

const app = express()
dotenv.config()

const port = process.env.PORT || 5000

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})
app.use(cookieParser())
app.use(express.json({limit:'5mb'}))
app.use(urlencoded({extended:true}))
const __dirname = path.resolve()

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/post",postRouter)
app.use("/api/v1/notification", notificationRouter)
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")))

    app.get("*",(req,res)=>res.sendFile(path.resolve(__dirname,"frontend","dist","index.html")))
}

app.listen(port,()=>{
    console.log(`Server running on Port ${port}`);
    connectMongoDB()
})