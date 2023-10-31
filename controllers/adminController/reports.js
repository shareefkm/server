import Orders from "../../models/order.js";
import Restarant from "../../models/restaurant.js";
export const reports = {
  salesReport: async (req, res) => {
    try {
      const totalSale = await Orders.aggregate([
        { $match: { paymentStatus: "PAID"} },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]);
  //     const totalSaleRestaurant = await Orders.aggregate([
  //        { $match: { paymentStatus: "PAID" } },
  // {
  //   $group: {
  //     _id: "$restaurantId", 
  //     total: { $sum: "$grandTotal" }, 
  //   },
  // },
  //     ]);

  const pipeline = [
    {
      $lookup: {
        from: 'orders',
        localField: '_id', 
        foreignField: 'restaurantId', 
        as: 'orders',
      },
    },
    {
      $unwind: '$orders',
    },
    {
      $group: {
        _id: '$_id', 
        restaurantName: { $first: '$Name' }, 
        totalGrandTotal: { $sum: '$orders.grandTotal' }, 
      },
    },
    {
      $project: {
        _id: 1, 
        restaurantName: 1, 
        totalGrandTotal: 1, 
      },
    },
  ];
  
  // Execute the aggregation
  const totalSaleRestaurant = await Restarant.aggregate(pipeline);
      
      res.status(200).send({
        success:true,
        totalSale,
        totalSaleRestaurant,
    })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error finding",
        error,
      });
    }
  },
};
