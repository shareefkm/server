import Category from "../../models/category.js";
import Product from "../../models/product.js";
import Restarant from "../../models/restaurant.js";

export const categories = {
  addCategory: async (req, res) => {
    try {
      const { restId, categoryName, image } = req.body;
      const existCategory = await Category.findOne({
        name: categoryName,
        restaurant: restId,
      });
      if(existCategory){
        res.status(400).send({
            success:false,
            message:"Category already exists"
        })
      }else{
        const newCategory = await Category.create({
            name: categoryName,
            image: image || '',
            restaurant: restId,
        })
        const restaurant = await Restarant.findById(restId);
        restaurant.categories.push(newCategory._id);
        await restaurant.save();
        res.status(200).send({
            success:true,
            newCategory,
            message:"Category added success"
        })
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Server Error",
      });
    }
  },
  getCategories: async(req,res)=>{
    try {
        const{ id }= req.query
        // const categoryDatas = await Restarant.findOne({_id:id}).populate('categories')
        const categoryDatas = await Category.find({
          is_deleted:false,
          restaurant:id
        })
        if(categoryDatas.length > 0){
            res.status(200).send({
                success:true,
                categoryDatas,
            })
        }else{
            res.status(400).send({
                success:false,
                message:"Category Not fount"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Server Error"
        })
    }
  },
  editCategory: async(req,res)=>{
    try {
      const { categoryName, image, categoryId, restId } = req.body
      const existCategory = await Category.findOne({
        name: categoryName,
        restaurant: restId,
      });
      if(existCategory){
        const existId = existCategory._id.toString()
        if(existId === categoryId){
          await Category.updateOne({_id:categoryId},{$set:{
            image,
          }})
          res.status(200).send({
            success:true,
            message:"Category edited success"
          })
          
        }else{
          res.status(400).send({
            success:false,
            message:"Category already exists"
        })
        }
      }else{await Category.updateOne({_id:categoryId},{
        $set:{
          name:categoryName,
          image:image || ''
        }
      })
      res.status(200).send({
        success:true,
        message:"Category edited success"
      })}
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Server Error"
      })
    }
  },
  deleteCategory: async(req,res)=>{
    try {
      const { catId } = req.body
      const isProduct = await Product.find({'category._id':catId})
      if (isProduct.length > 0) {
        return res.status(409).send({
          message: 'Category has associated products. Do you want to delete the products and the category?',
          confirmationRequired: true
        });
      }
      await Category.updateOne({_id:catId},{$set:{
        is_deleted:true
      }})
      res.status(200).send({
        success:true,
        message:"Category Deleted"
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Server error"
      })
    }
  },
  // searchCategory: async(req,res)=>{
  //   try {
  //     const restId = req.restaurant.restaurantId
  //     console.log(restId);
  //     const keyword = req.query.keyword
  //     const category = await Category.find({_id:restId,  name: { $regex: new RegExp(keyword, 'i') }})
  //     res.status(200).send({
  //       success:true,
  //       category
  //     })
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({
  //       success:false,
  //       message:"Server error"
  //     })
  //   }
  // }
};
