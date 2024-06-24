import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route.js'
import { connectMongoDB } from './db/connectDB.js'
import { PORT } from '../env.local.js'

const app = express()
dotenv.config()
app.use(express.json())

app.use("/api/v1/auth",authRouter)

app.listen(PORT,()=>{
    console.log(`Server running on Port ${PORT}`);
    connectMongoDB()
})