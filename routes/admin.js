import express from "express";
import { admin } from "../controllers/adminController/adminController.js";
import { auth } from "../middlewares/auth.js";
import { employees } from "../controllers/adminController/employees.js";
import { restaurants } from "../controllers/adminController/restaurants.js";
import { coupons } from "../controllers/adminController/couponController.js"
import { reports } from "../controllers/adminController/Reports.js";

const { adminVerify } = auth;
//router object
const adminRouter = express.Router();
const { adminLogin } = admin;
const { getEmployees, manageEmployeeStatus } = employees;
const { getRestaurants, manageRestaurantsStatus} = restaurants
const { createCoupon, getCoupons, deleteCoupon } = coupons
const { salesReport } = reports
//routs
adminRouter.post("/login", adminLogin);
adminRouter.get("/getemployees", adminVerify, getEmployees);
adminRouter.patch("/employeestatus", adminVerify, manageEmployeeStatus);
adminRouter.get("/geterestaurant", adminVerify, getRestaurants);
adminRouter.patch("/restaurantstatus", adminVerify, manageRestaurantsStatus);
adminRouter.post("/createcoupon", adminVerify, createCoupon);
adminRouter.get("/getcoupon", adminVerify, getCoupons);
adminRouter.delete("/deletecoupon", adminVerify, deleteCoupon);
adminRouter.get("/salesreport", adminVerify, salesReport);

export default adminRouter;
