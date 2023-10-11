import  express  from "express";

import { employee } from "../controllers/employeeController/employeeController.js"
import { ordersEmpl } from "../controllers/employeeController/orderControllEmpl.js";
import { auth } from "../middlewares/auth.js";

//router object
const employeeRouter = express.Router()
const { employeeRegister, employeeLogin,getEmplProfile, editEmplName,editPassword } = employee
const { getEmplOrders,updateDeliveryStatus} = ordersEmpl

const { employeetVerify } = auth
//routs
employeeRouter.post('/register', employeeRegister)
employeeRouter.post('/login', employeeLogin)
employeeRouter.get('/getprofile/:id',employeetVerify, getEmplProfile)
employeeRouter.get('/getordersempl',employeetVerify, getEmplOrders)
employeeRouter.patch('/updatedelivery',employeetVerify, updateDeliveryStatus)
employeeRouter.patch('/editprofile',employeetVerify, editEmplName)
employeeRouter.patch('/editpassword',employeetVerify, editPassword)

export default employeeRouter