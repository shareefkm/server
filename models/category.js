import mongoose from 'mongoose';
import Product from './product.js';


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restarant',
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

categorySchema.pre('remove', async function (next) {
  try {
    await Product.updateMany({ category: this._id },{$set:{
      isDeleted:true
    }});
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
