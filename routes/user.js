import express from "express";
import { user } from "../controllers/userController/userController.js";

//router object
const userRouter = express.Router()
const {userRegister} = user
//routs
userRouter.post('/register',userRegister)

export default userRouter;