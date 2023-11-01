import Category from "../../models/category.js"
import Restarant from "../../models/restaurant.js"

export const restaurants = {
    getRestaurants: async(req,res)=>{
        try {
            const [restaurants, ratings] = await Promise.all([
                Restarant.find({ Is_blocked: false, Is_verify: true }).populate('product'),
                Restarant.aggregate([
                  {
                    $unwind: '$rating',
                  },
                  {
                    $group: {
                      _id: '$_id',
                      Name: { $first: '$Name' },
                      totalRating: { $sum: '$rating.rating' },
                      averageRating: { $avg: '$rating.rating' },
                    },
                  },
                ]),
              ]);
              
        if(restaurants){
            res.status(200).send({
                success:true,
                restaurants,
                ratings
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
            const restaurants = await Category.find({name:catName}).populate('restaurant')
            const ratings = await Restarant.aggregate([
                {
                  $unwind: '$rating',
                },
                {
                  $group: {
                    _id: '$_id',
                    Name: { $first: '$Name' },
                    totalRating: { $sum: '$rating.rating' },
                    averageRating: { $avg: '$rating.rating' },
                  },
                },
              ])
              res.status(200).send({
                success:true,
                restaurants,
                ratings 
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