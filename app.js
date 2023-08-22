//imports

import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

//Dotenv config
dotenv.config()

//mongodb connection
connectDB()


const app = express()

app.get('/',(req,res)=>{
    res.send("<h1>welcome to yummi<h1>")
    
})
//port
const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`server connected ${PORT}`);
})