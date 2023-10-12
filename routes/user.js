import express from "express";
import { user } from "../controllers/userController/userController.js";
import { restaurants } from "../controllers/userController/restaurants.js";
import { products } from "../controllers/restaurantController/productController.js";
import { cart } from "../controllers/userController/cartController.js";
import { auth } from "../middlewares/auth.js";
import { orders } from "../controllers/userController/orderController.js";

//router object
const userRouter = express.Router();
const restaurantRouter = express.Router()
const {
  userRegister,
  verifyMail,
  userLogin,
  getUserDetail,
  editAddress,
  addAddress,
  profileImage,
  deletAddress,
  editProfile,
  editPassword,
} = user;
const { getRestaurants} =restaurants
const { getProductData, searchProduct } = products
const { addToCart, getcart, changeQuantity, cancelCartItem, cartTotal } = cart;
const { applyCoupon, order, verifyPayment, getOrders, cancelOrder, doRating, doReview } = orders

const { verifyToken } = auth;

//routs
userRouter.get('/getrestaurants', getRestaurants)
userRouter.post("/register", userRegister);
userRouter.get('/verify/:id', verifyMail);
userRouter.post("/login", userLogin);
userRouter.get("/profile", verifyToken, getUserDetail);
userRouter.patch("/addaddress", verifyToken, addAddress);
userRouter.patch("/editaddress", verifyToken, editAddress);
userRouter.patch("/addimage", verifyToken, profileImage);
userRouter.patch("/editprofile", verifyToken, editProfile);
userRouter.patch("/editpassword", verifyToken, editPassword);
userRouter.patch("/deletaddress", verifyToken, deletAddress);

userRouter.get('/getproductdetail',getProductData)
userRouter.get('/searchproduct',searchProduct)

userRouter.post("/add-to-cart", verifyToken, addToCart);
userRouter.get("/getcart", verifyToken, getcart);
userRouter.patch("/changequantity", verifyToken, changeQuantity);
userRouter.patch("/updatetotal", verifyToken, cartTotal);
userRouter.patch("/cancelcartitem", verifyToken, cancelCartItem);

userRouter.post("/applaycoupon", verifyToken, applyCoupon);
userRouter.post("/order", verifyToken, order);
userRouter.post("/verifypayment", verifyToken, verifyPayment);
userRouter.get("/getorders", verifyToken, getOrders);
userRouter.patch("/cancelorder", verifyToken, cancelOrder);
userRouter.patch("/rating", verifyToken, doRating);
userRouter.patch("/review", verifyToken, doReview);

export default userRouter;
