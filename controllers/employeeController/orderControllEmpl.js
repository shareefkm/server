import Orders from "../../models/order.js";

export const ordersEmpl = {
  getEmplOrders: async (req, res) => {
    try {
      const id = req.query.id;
      const ordersDetails = await Orders.find({
        $or: [
          { "item.employeeId._id": id },
          { "item.employeeId._id": { $exists: false } },
          { "item.employeeId._id": null },
        ],
      })
        .sort({ _id: -1 })
        .populate({
          path: "item.product",
          model: "Product",
          populate: {
            path: "restaurant_id",
            model: "Restarant",
          },
        })
        .populate("userId");
      if (ordersDetails) {
        res.status(200).send({
          success: true,
          ordersDetails,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "No orders found",
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
  updateDeliveryStatus: async (req,res) => {
    // console.log(data);
    try {
      const { prodId, emplId, orderStatus } = req.body;
      let item_orderStatus;
      if (orderStatus === "Pending") {
        item_orderStatus = "Preparing...";
      } else if (orderStatus === "Preparing...") {
        item_orderStatus = "Packed";
      } else if (orderStatus === "Packed") {
        item_orderStatus = "Out of delivery";
      } else {
        item_orderStatus = "Delivered";
      }
      await Orders.updateOne(
        { "item._id": prodId },
        {
          $set: {
            "item.$.orderStatus": item_orderStatus,
            "item.$.employeeId": emplId,
          },
        }
      );
      const order = await Orders.findOne({ "item._id": prodId });
      const allItemsDelivered = order.item.every(
        (item) => item.orderStatus === "Delivered"
      );
      if (allItemsDelivered) {
        await Orders.updateOne(
          { "item._id": prodId },
          { $set: { is_delivered: true,paymentStatus:'PAID'} }
        );
      }
      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
 
};
