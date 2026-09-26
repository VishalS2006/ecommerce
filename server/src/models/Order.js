import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedVariants: {
    type: Map,
    of: String,
    default: {}
  }
}, { _id: true });

const timelineEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  subtotal: { type: Number, required: true },
  couponDiscount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  shippingFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: { type: String, default: '' },
    provider: { type: String, default: 'ShopSphere SafePay' },
    paidAt: { type: Date }
  },
  orderStatus: {
    type: String,
    enum: [
      'placed',
      'confirmed',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'placed',
    index: true
  },
  trackingTimeline: [timelineEventSchema],
  estimatedDeliveryDate: { type: Date },
  cancelReason: { type: String, default: '' }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
