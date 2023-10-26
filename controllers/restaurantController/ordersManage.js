import mongoose from "mongoose";

import Orders from "../../models/order.js";
import Product from "../../models/product.js";
import Users from "../../models/user.js";

export const manageOrders = {
  viewOrders: async (req, res) => {
    try {
      const id = req.query.id;
      const orders = await Orders.find({
        "item.product": {
          $in: await Product.find({ restaurant_id: id }).select("_id"),
        },
      }).sort({ _id: -1 }).populate({
        path: "item.product",
        model: "Product",
        match: { restaurant_id: id },
      });

      if (orders) {
        res.status(200).send({
          success: true,
          orders,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "You don't have any order",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "server error",
      });
    }
  },
  
  dashBorddata: async(req,res)=>{
    try {
      const restId = new mongoose.Types.ObjectId(req.restaurant.restaurantId)
      const totalSale = await Orders.aggregate([
        {$match : { paymentStatus:'PAID', restaurantId: restId}},
        {$group : { _id: "$restaurantId", total : {$sum :"$grandTotal"}}}]) 
        const totalUsers = await Orders.aggregate([
          {
            $match: { restaurantId: restId } 
          },
          {
            $group: {
              _id: "$userId", 
              total: { $sum: 1 } 
            }
          }
        ]);
    const totalOrders = await Orders.aggregate([
      {
        $match: {
          is_returned: 0,
          // is_delivered: true,
          restaurantId: restId 
        }
      },
      {
        $group: {
          _id: "$restaurantId", 
          total: { $sum: 1 } 
        }
      }
    ]);    
        res.status(200).send({
          success:true,
          totalSale,
          totalUsers,
          totalOrders
        })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"server error"
      })
    }
  }
};
