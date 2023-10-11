import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restarant'
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
},
variants: [
  {
    name:{type: String},
    price: {
      type: Number,
    },
    offer: {
      type: Number,
      min: 0,
      max: 100
    },  
    offerPrice: {type:Number}
  }
],
  
  stock: {
    type: Boolean,
    default: true
  },
  images: {
   type:String
  },
  isVishlist: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
