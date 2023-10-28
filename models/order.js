import mongoose from "mongoose";
const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  restaurantId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restarant",
  },
  item: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      variant:{
        type: String
      },
      orderStatus: {
        type:String,
        default:"Pending"
      },
      is_canceled:{
        type: Boolean,
        default: false
      }
    },
  ],
  employeeId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  start_date: {
    type: Date,
    default:Date.now()
  },
  delivered_date: {
    type: Date,
  },
  totalPrice: {
    type: String,
  },
  discount: {
    type:Number,
},
  grandTotal: {
  type:Number
},
  is_delivered: {
    type: Boolean,
    default: false,
  },
  user_cancelled: {
    type: Boolean,
    default: false,
  },
  admin_cancelled: {
    type: Boolean,
    default: false,
  },
  return_reason: {
    type: String,
  },
  is_returned: {
    type: Number,
    default: 0,
  },
  address: {
    type: Array,
  },
  paymentType: {
    type: String,
  },
  paymentStatus: {
    type:String
},
},{
  timestamps: true
});

const Orders = mongoose.model("Orders", orderSchema);
export default  Orders;
