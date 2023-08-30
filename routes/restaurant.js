import express from "express";
import { restaurant } from "../controllers/restaurantController/restaurantController.js";
//router object
const restaurantRouter = express.Router()
const { restaurantRegister, restaurantLogin } = restaurant
//routs
restaurantRouter.post('/register',restaurantRegister)
restaurantRouter.post('/login',restaurantLogin)

export default restaurantRouter;