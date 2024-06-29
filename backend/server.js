import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route.js'
import { connectMongoDB } from './db/connectDB.js'

const app = express()
dotenv.config()
app.use(express.json())
app.use(urlencoded({extended:true}))

app.use("/api/v1/auth",authRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port ${process.env.PORT}`);
    connectMongoDB()
})