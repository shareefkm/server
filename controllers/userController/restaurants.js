import Category from "../../models/category.js"
import Restarant from "../../models/restaurant.js"

export const restaurants = {
    getRestaurants: async(req,res)=>{
        try {
            const restaurants = await Restarant.find({Is_blocked:false,Is_verify:true}).populate('product')
        if(restaurants){
            res.status(200).send({
                success:true,
                restaurants
            })
        }else{
            res.status(404).send({
                success:false,
                message:"Restaurants Not Available"
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
    getCattegories:async(req,res)=>{
        try {
           const categories =  await Category.aggregate([
                {
                    $group: {
                        _id: {
                          name: '$name',
                          image: '$image',
                        },
                        count: { $sum: 1 },
                        categoryIds: { $push: '$_id' },
                      },
                },
              ])
                .exec()
                res.status(200).send({
                    success:true,
                    categories
                })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                message:"Server Error"
            })
        }
    },
    getRestWithCategory:async(req,res)=>{
        try {
            const { catName } = req.query
            // const restaurants = await Restarant.aggregate([
            //     {
            //       $lookup: {
            //         from: "categories", // Name of the Category collection
            //         localField: "categories", // Field in the Restaurant collection
            //         foreignField: "_id", // Field in the Category collection
            //         as: "categoryDetails",
            //       },
            //     },
            //     {
            //       $match: {
            //         "categoryDetails.name": catName,
            //       },
            //     },
            //   ]);
            //   console.log(restaurants);
            const restaurants = await Category.find({name:catName}).populate('restaurant')
              res.status(200).send({
                success:true,
                restaurants 
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                message:"Server Error"
            })
        }
    }
}