import  express  from "express";

import { employee } from "../controllers/employeeController/employeeController.js"

//router object
const employeeRouter = express.Router()
const { employeeRegister, employeeLogin } = employee

//routs
employeeRouter.post('/register', employeeRegister)
employeeRouter.post('/login', employeeLogin)

export default employeeRouter