import express from "express";
import { restaurant } from "../controllers/restaurantController/restaurantController.js";
import { products } from "../controllers/restaurantController/productController.js";
import { manageOrders } from "../controllers/restaurantController/ordersManage.js";
import { categories } from "../controllers/restaurantController/categoryManagement.js";
import { auth } from "../middlewares/auth.js";
//router object
const restaurantRouter = express.Router()
const { restaurantRegister, verifyMail, restaurantLogin,forgetPassword,restPassword, getResProfile, editProfile } = restaurant
const { addProduct, getProduct, deleteProduct, getProductData, editProduct, getRestaurantProduct } = products
const { addCategory, getCategories, editCategory, deleteCategory } = categories
const { viewOrders } = manageOrders

const { restaurantVerify } = auth
//routs
restaurantRouter.post('/register',restaurantRegister)
restaurantRouter.get('/verify/:id', verifyMail);
restaurantRouter.post('/login',restaurantLogin)
restaurantRouter.post("/forgetpassword", forgetPassword);
restaurantRouter.patch("/resetpassword", restPassword);
restaurantRouter.post('/addproduct',restaurantVerify,addProduct)
restaurantRouter.get('/getproduct',getProduct)
restaurantRouter.get('/getrestarantproduct',getRestaurantProduct)
restaurantRouter.get('/getresprofile',getResProfile)
restaurantRouter.post('/editprofile',restaurantVerify,editProfile)
restaurantRouter.patch('/deletproduct',restaurantVerify,deleteProduct)
restaurantRouter.get('/editproduct',restaurantVerify,getProductData)
restaurantRouter.patch('/editproduct',restaurantVerify,editProduct)
restaurantRouter.post('/addcategory',restaurantVerify,addCategory)
restaurantRouter.get('/getcategory',getCategories)
restaurantRouter.patch('/editcategory',restaurantVerify,editCategory)
restaurantRouter.patch('/deletcategory',restaurantVerify,deleteCategory)

restaurantRouter.get('/vieworders',restaurantVerify,viewOrders)

export default restaurantRouter;