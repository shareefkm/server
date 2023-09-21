import express from "express";
import { user } from "../controllers/userController/userController.js";
import { cart } from "../controllers/userController/cartController.js";
import { auth } from "../middlewares/auth.js";
import { orders } from "../controllers/userController/orderController.js";

//router object
const userRouter = express.Router();
const restaurantRouter = express.Router()
const {
  userRegister,
  userLogin,
  getUserDetail,
  editAddress,
  addAddress,
  profileImage,
  deletAddress,
  editProfile,
  editPassword,
} = user;
const { addToCart, getcart, changeQuantity, cancelCartItem, cartTotal } = cart;
const { order, getOrders } = orders

const { verifyToken } = auth;

//routs
userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/profile", verifyToken, getUserDetail);
userRouter.patch("/addaddress", verifyToken, addAddress);
userRouter.patch("/editaddress", verifyToken, editAddress);
userRouter.patch("/addimage", verifyToken, profileImage);
userRouter.patch("/editprofile", verifyToken, editProfile);
userRouter.patch("/editpassword", verifyToken, editPassword);
userRouter.patch("/deletaddress", verifyToken, deletAddress);

userRouter.post("/add-to-cart", verifyToken, addToCart);
userRouter.get("/getcart", verifyToken, getcart);
userRouter.patch("/changequantity", verifyToken, changeQuantity);
userRouter.patch("/updatetotal", verifyToken, cartTotal);
userRouter.patch("/cancelcartitem", verifyToken, cancelCartItem);

userRouter.post("/order", verifyToken, order);
userRouter.get("/getorders", verifyToken, getOrders);

export default userRouter;
