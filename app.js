//imports packages
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
// import morgan from "morgan"
import { Server } from 'socket.io';

//imports files
import connectDB from "./config/db.js"
import userRouter from "./routes/user.js"
import adminRouter from "./routes/admin.js"
import restaurantRouter from "./routes/restaurant.js"
import employeeRouter from "./routes/employee.js"
import { chats } from "./controllers/chatController/chatControll.js";
import { ordersEmpl } from "./controllers/employeeController/orderControllEmpl.js";
const { sendMessage } = chats
const { updateDeliveryStatus } = ordersEmpl

//Dotenv config
dotenv.config()

//mongodb connection
connectDB()

const app = express()

//middlewares
app.use(express.json({limit : "10mb"}))
app.use(cors())
// app.use(morgan('dev'))

app.use('/',userRouter)
app.use('/admin',adminRouter)
app.use('/restaurant',restaurantRouter)
app.use('/employee',employeeRouter)

//port
const PORT = process.env.PORT

const server = app.listen(PORT,()=>{
    console.log(`server connected ${PORT}`);
})

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://www.yummi.website",
    methods: ['GET', 'POST'],
  },
});

io.on("connection", (socket) => {
  console.log("Socket.io connected");

  socket.on("joinroom",(chat_id,personId)=>{
    socket.join(chat_id)
    // console.log(personId,"connected");
  })

  socket.on("send message",(newMessage,chatId)=>{
    io.to(chatId).emit("response",newMessage)
    sendMessage(newMessage)
  })

  socket.on("update-order-status", (data) => {
    // updateDeliveryStatus(data)
    // Update the order status in your database, if necessary
    // Then, broadcast the updated status to all connected clients
    io.emit("order-status-update", data);
  });
  
});



  
