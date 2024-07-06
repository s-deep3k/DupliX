import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route.js'
import { connectMongoDB } from './db/connectDB.js'
import {v2 as cloudinary} from 'cloudinary'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'

const app = express()
dotenv.config()
cloudinary.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME
})

app.use(express.json())
app.use(urlencoded({extended:true}))

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/post",postRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port ${process.env.PORT}`);
    connectMongoDB()
})