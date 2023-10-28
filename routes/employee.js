import  express  from "express";

import { employee } from "../controllers/employeeController/employeeController.js"
import { ordersEmpl } from "../controllers/employeeController/orderControllEmpl.js";
import { auth } from "../middlewares/auth.js";
import { chats } from "../controllers/chatController/chatControll.js";

//router object
const employeeRouter = express.Router()
const { employeeRegister, verifyMail, forgetPassword, restPassword, employeeLogin,getEmplProfile, editEmplName,editPassword } = employee
const { getEmplOrders, orderAccept } = ordersEmpl
const { createChat, fetchChats, sendMessage, allMessages } = chats

const { employeetVerify } = auth
//routs
employeeRouter.post('/register', employeeRegister)
employeeRouter.get('/verify/:id', verifyMail);
employeeRouter.post('/login', employeeLogin)
employeeRouter.post("/forgetpassword", forgetPassword);
employeeRouter.patch("/resetpassword", restPassword);
employeeRouter.get('/getprofile/:id',employeetVerify, getEmplProfile)
employeeRouter.get('/getordersempl',employeetVerify, getEmplOrders)
// employeeRouter.patch('/updatedelivery',employeetVerify, updateDeliveryStatus)
employeeRouter.patch('/acceptorder',employeetVerify, orderAccept)
employeeRouter.patch('/editprofile',employeetVerify, editEmplName)
employeeRouter.patch('/editpassword',employeetVerify, editPassword)
employeeRouter.post('/chat',employeetVerify, createChat)
employeeRouter.get('/chat',employeetVerify, fetchChats)
employeeRouter.post('/sendmessage',employeetVerify, sendMessage )
employeeRouter.get('/openchat',employeetVerify, allMessages )

export default employeeRouter