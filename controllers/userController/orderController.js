import Razorpay from "razorpay";
import cripto from "crypto";
import dotenv from "dotenv";

import Cart from "../../models/cart.js";
import Orders from "../../models/order.js";
import Restarant from "../../models/restaurant.js";
import Users from "../../models/user.js";
import Coupon from "../../models/Coupon.js";
import Product from "../../models/product.js";

dotenv.config();
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
let newOrder;

export const orderControl = {
  applyCoupon: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { couponCode, cartData } = req.body;

      const coupon = await Coupon.findOne({ couponCode }).populate(
        "usedByUsers"
      );
      if (!coupon) {
        res.status(404).send({
          success: false,
          message: "Coupon not found",
        });
      } else {
        const currentDate = new Date();
        if (currentDate > coupon.expirationDate) {
          res.status(404).send({
            success: false,
            message: "Coupon has expired",
          });
        } else if (
          coupon.usedByUsers &&
          coupon.usedByUsers.some((usedUserId) => usedUserId.equals(userId))
        ) {
          res.status(404).send({
            success: false,
            message: "Coupon has already been used by this user",
          });
        } else if (
          coupon.usageLimit !== null &&
          coupon.usedCount >= coupon.usageLimit
        ) {
          res.status(404).send({
            success: false,
            message: "Coupon usage limit reached",
          });
        } else {
          const discountAmount =
            (cartData.total * coupon.discountPercentage) / 100;
          const grandTotal = cartData.total - discountAmount;
          await Cart.updateOne(
            { _id: cartData._id },
            {
              $set: {
                discount: discountAmount,
                grandTotal,
              },
              $push: {
                usedByUsers: userId,
              },
            }
          );
          res.status(200).send({
            success: true,
            message: "Coupon Applied",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  order: async (req, res) => {
    try {
      const { payment, addressIndex, cartData } = req.body;
      const user = await Users.findOne({ _id: cartData.user });
      const address = user.Address[addressIndex];
      const cart = await Cart.findOne({ _id: cartData._id })
        .populate("items.productId");
      const items = cart.items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
      }));

      // const items = cart.items.map((product) => {
      //   return {
      //     product: product.productId,
      //     quantity: product.quantity,
      //     price: product.price,
      //     variant: product.variant,
      //   };
      // });
      // const restaurent = await Cart.find({ _id: cartData._id }).populate(
      //   "items.productId"
      // );
      // const restaurantIds = restaurent.map((data) => {
      //   const updatedItems = data.items.map((item) => {
      //     const restaurantId = item.productId.restaurant_id;
      //     return restaurantId;
      //   });
      //   return updatedItems;
      // });

      // const cart = await Cart.aggregate([
      //   { $match: { _id: cartData._id } },
      //   { $unwind: '$items' },
      //   {
      //     $project: {
      //       product: '$items.productId',
      //       quantity: '$items.quantity',
      //       price: '$items.price',
      //       variant: '$items.variant'
      //     }
      //   }
      // ]);
      
      // const items = cart.map(item => ({
      //   product: item.product,
      //   quantity: item.quantity,
      //   price: item.price,
      //   variant: item.variant
      // }));
      
      // const restaurantIds = cart.map(item => item.product.restaurant_id);
      
      const paymentStatus = payment === "COD" ? "Pending" : "Paid";
      if (payment === "COD") {
        await Orders.create({
          userId: user._id,
          restaurantId: cart.restaurantId,
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
         newOrder = await new Orders({
          userId: user._id,
          restaurantId: cart.restaurantId,
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
      } else if (payment === "Wallet") {
        if (user.Wallet >= cart.grandTotal) {
          const grandTotal = parseFloat(cart.grandTotal).toFixed(2);
          await Users.updateOne(
            { _id: cartData.user },
            {
              $inc: {
                Wallet: -grandTotal,
              },
            }
          );
          await Orders.create({
            userId: user._id,
            restaurantId: cart.restaurantId,
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
        } else {
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
      const { cartData } = req.body;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body.response;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expecterSign = cripto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(sign.toString())
        .digest("hex");
      if (razorpay_signature === expecterSign) {
        newOrder.save()
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

  // cancelOrder: async (req, res) => {
  //   try {
  //     const { itemId, orderId, userId } = req.body;
  //     const orderItem = await Orders.findOne({ "item._id": itemId });
  //     const orderStatus = orderItem.item.map((ele) => {
  //       return { orderStatus: ele.orderStatus, price: ele.price };
  //     });
  //     console.log("order ====> ", orderStatus);
  //     if (orderStatus[0].orderStatus !== "Delivered") {
  //       await Orders.updateOne(
  //         { _id: orderId },
  //         {
  //           $pull: {
  //             item: { _id: itemId },
  //           },
  //         }
  //       );
  //       res.status(200).send({
  //         success: true,
  //         message: "Item cancelled",
  //       });
  //       if (orderItem.paymentType !== "COD") {
  //         const price = parseFloat(orderStatus[0].price).toFixed(2);
  //         await Users.updateOne(
  //           { _id: userId },
  //           {
  //             $inc: {
  //               Wallet: price,
  //             },
  //           }
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     res.status(500).send({
  //       success: false,
  //       message: "Internal server error",
  //     });
  //   }
  // },

  cancelOrder: async (req, res) => {
    try {
      const { itemId, orderId, userId } = req.body;
      const orderItem = await Orders.findOne({ "item._id": itemId });
  
      if (orderItem) {
        const canceledItemIndex = orderItem.item.findIndex(item => item._id.toString() === itemId);
  
        if (canceledItemIndex !== -1 && orderItem.item[canceledItemIndex].orderStatus !== "Delivered") {
          const canceledItem = orderItem.item[canceledItemIndex];
          const canceledProductPrice = canceledItem.price * canceledItem.quantity;
          const canceledProductDiscount = canceledProductPrice * (canceledItem.discount || 0);
          const updatedTotalPrice = orderItem.totalPrice - canceledProductPrice;
          const updatedDiscount = orderItem.discount - canceledProductDiscount;
          const updatedGrandTotal = updatedTotalPrice - updatedDiscount;
          
          // Update order details to cancel the item and remove restaurantId
          if(req.baseUrl.startsWith('/restaurant')){
            await Orders.updateOne(
              { _id: orderId },
              {
                $set: {
                  "item.$[element].is_canceled": true,
                  totalPrice: updatedTotalPrice,
                  discount: updatedDiscount,
                  grandTotal: updatedGrandTotal,
                },
              },
              {
                arrayFilters: [{ "element._id": itemId }], 
              }
            );
          }else{
            await Orders.updateOne(
              { _id: orderId },
              {
                $pull: { item: { _id: itemId }, },
                $set: {
                  totalPrice: updatedTotalPrice,
                  discount: updatedDiscount,
                  grandTotal: updatedGrandTotal
                },
              }
            );
          }
          res.status(200).send({
            success: true,
            message: "Item cancelled",
          });
  
          if (orderItem.paymentType !== "COD") {
            const formattedPrice = parseFloat(canceledProductPrice).toFixed(2);
            await Users.updateOne(
              { _id: userId },
              {
                $inc: { Wallet: parseFloat(formattedPrice) }
              }
            );
          }
        } else {
          res.status(400).send({
            success: false,
            message: "Item not found or cannot be cancelled.",
          });
        }
      } else {
        res.status(400).send({
          success: false,
          message: "Order not found.",
        });
      }
    } catch (error) {
      console.error("Error cancelling item:", error);
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
  getOrderItems: async (req, res) => {
    try {
      const { id } = req.query;
      const orderItems = await Orders.findOne({ _id: id })
        .sort({ _id: -1 })
        .populate("item.product").populate("employeeId")
      res.status(200).send({
        success: true,
        orderItems,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Server error.",
      });
    }
  },
};
