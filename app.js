//imports packages
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"

//imports files
import connectDB from "./config/db.js"
import userRouter from "./routes/user.js"

//Dotenv config
dotenv.config()

//mongodb connection
connectDB()

const app = express()

//middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api/auth',userRouter)
//port
const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`server connected ${PORT}`);
})