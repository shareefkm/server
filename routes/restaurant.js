import express from "express";
import { restaurant } from "../controllers/restaurantController/restaurantController.js";
import { products } from "../controllers/restaurantController/productController.js";
import { manageOrders } from "../controllers/restaurantController/ordersManage.js";
import { categories } from "../controllers/restaurantController/categoryManagement.js";
import { auth } from "../middlewares/auth.js";
//router object
const restaurantRouter = express.Router()
const { restaurantRegister, restaurantLogin, getResProfile, editProfile } = restaurant
const { addProduct, getProduct, deleteProduct, getProductData, editProduct, getRestaurantProduct } = products
const { addCategory, getCategories, searchCategory, editCategory, deleteCategory } = categories
const { viewOrders } = manageOrders

const { restaurantVerify } = auth
//routs
restaurantRouter.post('/register',restaurantRegister)
restaurantRouter.post('/login',restaurantLogin)
restaurantRouter.post('/addproduct',restaurantVerify,addProduct)
restaurantRouter.get('/getproduct',getProduct)
restaurantRouter.get('/getrestarantproduct',getRestaurantProduct)
restaurantRouter.get('/getresprofile',getResProfile)
restaurantRouter.post('/editprofile',restaurantVerify,editProfile)
restaurantRouter.patch('/deletproduct',restaurantVerify,deleteProduct)
restaurantRouter.get('/editproduct',restaurantVerify,getProductData)
restaurantRouter.patch('/editproduct',restaurantVerify,editProduct)
restaurantRouter.post('/addcategory',restaurantVerify,addCategory)
restaurantRouter.get('/getcategory',restaurantVerify,getCategories)
// restaurantRouter.get('/serchcategory',restaurantVerify,searchCategory)
restaurantRouter.patch('/editcategory',restaurantVerify,editCategory)
restaurantRouter.patch('/deletcategory',restaurantVerify,deleteCategory)

restaurantRouter.get('/vieworders',restaurantVerify,viewOrders)

export default restaurantRouter;