import express from "express";
import { restaurant } from "../controllers/restaurantController/restaurantController.js";
import { products } from "../controllers/restaurantController/productController.js";
import { auth } from "../middlewares/auth.js";
import { manageOrders } from "../controllers/restaurantController/ordersManage.js";
//router object
const restaurantRouter = express.Router()
const { restaurantRegister, restaurantLogin, getResProfile, editProfile } = restaurant
const { addProduct, getProduct, deleteProduct, getEditProduct, editProduct, getRestaurantProduct } = products
const { viewOrders } = manageOrders

const { restaurantVerify } = auth
//routs
restaurantRouter.post('/register',restaurantRegister)
restaurantRouter.post('/login',restaurantLogin)
restaurantRouter.post('/addproduct',restaurantVerify,addProduct)
restaurantRouter.get('/getproduct',getProduct)
restaurantRouter.get('/getrestarantproduct',restaurantVerify,getRestaurantProduct)
restaurantRouter.get('/getresprofile',restaurantVerify,getResProfile)
restaurantRouter.post('/editprofile',restaurantVerify,editProfile)
restaurantRouter.patch('/deletproduct',restaurantVerify,deleteProduct)
restaurantRouter.get('/editproduct',restaurantVerify,getEditProduct)
restaurantRouter.patch('/editproduct',restaurantVerify,editProduct)

restaurantRouter.get('/vieworders',restaurantVerify,viewOrders)

export default restaurantRouter;