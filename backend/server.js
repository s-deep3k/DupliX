import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route.js'
import { connectMongoDB } from './db/connectDB.js'
import {v2 as cloudinary} from 'cloudinary'

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

app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port ${process.env.PORT}`);
    connectMongoDB()
})