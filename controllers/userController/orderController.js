import Cart from "../../models/cart.js";
import Orders from "../../models/order.js";
import Restarant from "../../models/restaurant.js";
import Users from "../../models/user.js";

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
        };
      });
      const restaurent = await Cart.find({_id: cartData._id}).populate('items.productId')
      const restaurantIds = restaurent.map(data => {
        const updatedItems = data.items.map(item => {
          const restaurantId = item.productId.restaurant_id;
          return restaurantId;
        });
        return updatedItems;
      });

      const paymentStatus = payment === "COD" ? "Pending" : "Paid";
      const orderStatus = payment === "COD" ? "Processing" : "Pending";
      await Orders.create({
        userId: user._id,
        restaurantId:restaurantIds.flat(),
        item: items,
        totalPrice: cart.total,
        discount: cart.discount,
        grandTotal: cart.grandTotal,
        address,
        paymentType: payment,
        paymentStatus,
        orderStatus,
      });
      await Cart.deleteOne({ _id: cartData._id });
      res.status(200).send({
        success: true,
        message: "order success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "server error",
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      const id = req.query.id;
      const orders = await Orders.find({ userId: id }).sort({ _id: -1 }).populate("item.product")
      if(orders){
        res.status(200).send({
          success:true,
          orders,
        })
      }else{
        res.status(404).send({
          success:false,
          message:"You don't have any order"
        })
      }
    } catch (error) {
      res.status(500).send({
        success:false,
        message:"server error"
      })
    }
  },
};
