import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Please provide a discount amount or percentage'],
    min: [1, 'Discount value must be at least 1']
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order cannot be negative']
  },
  maxDiscountAmount: {
    type: Number,
    default: null
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide an expiry date']
  },
  usageLimit: {
    type: Number,
    default: 500
  },
  timesUsed: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
