import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users' },
    items: [{
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product'
       },
      quantity: { 
        type: Number, 
        default: 1
      },
      price:{
        type:Number
      },
      date: {
        type: Date,
        defualt: Date.now(),
    },
        
    }],
    total: { 
        type: Number, 
        default: 0
      },
    discount:{
      type:Number,
      default:0
    },
    grandTotal:{
      type:Number,
      default:0
  }
  });

  const Cart = mongoose.model('Cart',cartSchema)

  export default Cart;