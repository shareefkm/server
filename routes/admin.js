import express from "express";
import { admin } from "../controllers/adminController/adminController.js";
import { auth } from "../middlewares/auth.js";
import { employees } from "../controllers/adminController/employees.js";
import { restaurants } from "../controllers/adminController/restaurants.js";

const { adminVerify } = auth;
//router object
const adminRouter = express.Router();
const { adminLogin } = admin;
const { getEmployees, manageEmployeeStatus } = employees;
const { getRestaurants, manageRestaurantsStatus} = restaurants
//routs
adminRouter.post("/login", adminLogin);
adminRouter.get("/getemployees", adminVerify, getEmployees);
adminRouter.patch("/employeestatus", adminVerify, manageEmployeeStatus);
adminRouter.get("/geterestaurant", adminVerify, getRestaurants);
adminRouter.patch("/restaurantstatus", adminVerify, manageRestaurantsStatus);

export default adminRouter;
