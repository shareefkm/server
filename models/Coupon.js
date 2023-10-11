import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restarant', 
  },
  usageLimit: {
    type: Number,
    default: null 
  },
  usedByUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }],
  usedCount: {
    type: Number,
    default: 0
  }
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
