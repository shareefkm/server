import Orders from "../../models/order.js";
import Product from "../../models/product.js";
export const manageOrders = {
  viewOrders: async (req, res) => {
    try {
      const id = req.query.id;
      const orders = await Orders.find({
        "item.product": {
          $in: await Product.find({ restaurant_id: id }).select("_id"),
        },
      }).populate({
        path: "item.product",
        model: "Product",
        match: { restaurant_id: id },
      });

      console.log("Orders:", orders);

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
};
