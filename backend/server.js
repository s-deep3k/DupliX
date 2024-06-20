import express from 'express'

const app = express()

app.get("/",(req,res)=>{
    res.json({data: "Server Running"})
})

app.listen(process.env.PORT,()=>{
    console.log("Server running on Port", process.env.PORT);
})