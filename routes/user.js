import express from "express";
import { user } from "../controllers/userController/userController.js";
import { auth } from "../middlewares/auth.js"; 

//router object
const userRouter = express.Router()
const {userRegister,userLogin} = user
const { verifyToken } = auth
//routs
userRouter.post('/register',userRegister)
userRouter.post('/login', userLogin)

export default userRouter;