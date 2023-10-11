import Razorpay from "razorpay";
import cripto from "crypto";
import dotenv from "dotenv";

import Cart from "../../models/cart.js";
import Orders from "../../models/order.js";
import Restarant from "../../models/restaurant.js";
import Users from "../../models/user.js";

dotenv.config();
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

export const orders = {
  order: async (req, res) => {
    try {
      const { payment, addressIndex, cartData } = req.body;
      const cart = await Cart.findOne({ _id: cartData._id });
      const user = await Users.findOne({ _id: cartData.user });
      const address = user.Address[addressIndex];
      const items = cart.items.map((product) => {
        return {
          product: product.productId,
          quantity: product.quantity,
          price: product.price,
          variant: product.variant
        };
      });
      const restaurent = await Cart.find({ _id: cartData._id }).populate(
        "items.productId"
      );
      const restaurantIds = restaurent.map((data) => {
        const updatedItems = data.items.map((item) => {
          const restaurantId = item.productId.restaurant_id;
          return restaurantId;
        });
        return updatedItems;
      });

      const paymentStatus = payment === "COD" ? "Pending" : "Paid";
      if (payment === "COD") {
        await Orders.create({
          userId: user._id,
          restaurantId: restaurantIds.flat(),
          item: items,
          totalPrice: cart.total,
          discount: cart.discount,
          grandTotal: cart.grandTotal,
          address,
          paymentType: payment,
          paymentStatus,
        });
        await Cart.deleteOne({ _id: cartData._id });
        res.status(200).send({
          success: true,
          message: "order success",
        });
      } else if (payment === "Online") {
        await Orders.create({
          userId: user._id,
          restaurantId: restaurantIds.flat(),
          item: items,
          totalPrice: cart.total,
          discount: cart.discount,
          grandTotal: cart.grandTotal,
          address,
          paymentType: payment,
          paymentStatus,
        });
        const options = {
          amount: cart.grandTotal * 100,
          currency: "INR",
          receipt: cripto.randomBytes(10).toString("hex"),
        };
        instance.orders.create(options, (error, order) => {
          if (error) {
            console.log(error);
            res.status(500).send({
              success: false,
              message: "Something went wrong!!",
            });
          } else {
            res.status(200).send({
              success: true,
              data: order,
            });
          }
        });
      }else if(payment === "Wallet"){
        if(user.Wallet >= cart.grandTotal){
          const grandTotal = parseFloat(cart.grandTotal).toFixed(2)
          await Users.updateOne({_id:cartData.user},{$inc:{
            Wallet:-grandTotal
          }})
          await Orders.create({
            userId: user._id,
            restaurantId: restaurantIds.flat(),
            item: items,
            totalPrice: cart.total,
            discount: cart.discount,
            grandTotal: cart.grandTotal,
            address,
            paymentType: payment,
            paymentStatus,
          });
          await Cart.deleteOne({ _id: cartData._id });
          res.status(200).send({
            success: true,
            message: "order success",
          });
          
        }else{
          res.status(400).send({
            success: false,
            message: "Insufficiant Balnce",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "server error", 
      });
    }
  },
  verifyPayment: async (req, res) => {
    try {
      const { cartData } = req.body
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body.response
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expecterSign = cripto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(sign.toString())
        .digest("hex");
      if (razorpay_signature === expecterSign) {
        await Cart.deleteOne({ _id: cartData._id });
        res.status(200).send({
          success: true,
          message: "Payment Success",
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Invalid payment",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Server Error",
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      const id = req.query.id;
      const orders = await Orders.find({ userId: id })
        .sort({ _id: -1 })
        .populate("item.product");
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
      res.status(500).send({
        success: false,
        message: "server error",
      });
    }
  },

  cancelOrder:async(req,res)=>{
    try {
      const {itemId, orderId, userId} = req.body
      const orderItem = await Orders.findOne({'item._id': itemId})
      const orderStatus = orderItem.item.map((ele)=>{
        return {orderStatus:ele.orderStatus, price:ele.price}
      })
      if(orderStatus[0].orderStatus !== "Delivered"){
        await Orders.updateOne({_id:orderId},{
          $pull:{
             item: { _id: itemId }
          }
        })
        res.status(200).send({
          success:true,
          message:"Item cancelled"
        })
        if(orderItem.paymentType !== "COD"){
          const price = parseFloat(orderStatus[0].price).toFixed(2)
          await Users.updateOne({_id:userId},{$inc:{
            Wallet:price
          }})
        }
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  },

  doRating: async (req, res) => {
    try {
      const { userId, rating, restId } = req.body;
      const existingRating = await Restarant.findOne({
        "rating.userId": userId,
        _id: restId,
      });
      if (existingRating) {
        res.status(400).send({
          success: false,
          message: "You have already rating this restaurant...",
        });
      } else {
        await Restarant.updateOne(
          { _id: restId },
          { $push: { rating: { userId, rating } } }
        );
        res.status(200).send({
          success: true,
          message: "Thank you! Rating submitted successfully.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Server error.",
      });
    }
  },
  doReview: async (req, res) => {
    try {
      const { userId, review, restId } = req.body;
      const existingReview = await Restarant.findOne({
        "reviews.userId": userId,
        _id: restId,
      });
      if (existingReview) {
        res.status(400).send({
          success: false,
          message: "You have already review this restaurant...",
        });
      } else {
        await Restarant.updateOne(
          { _id: restId },
          { $push: { reviews: { userId, review } } }
        );
        res.status(200).send({
          success: true,
          message: "Thank you! Review submitted successfully.",
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Server error.",
      });
    }
  },
};
