import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route'
import { PORT } from '../env'
const app = express()
dotenv.config()

app.use("/api/v1/auth",authRouter)

app.listen(PORT,()=>{
    console.log(`Server running on Port ${PORT}`);
})