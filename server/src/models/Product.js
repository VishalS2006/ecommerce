import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [180, 'Product name cannot exceed 180 characters']
  },
  slug: {
    type: String,
    required: [true, 'Please add a product slug'],
    unique: true,
    lowercase: true,
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'Please add a SKU'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a detailed description']
  },
  shortDescription: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please specify a category']
  },
  brand: {
    type: String,
    required: [true, 'Please specify a brand'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please set a price'],
    min: [0, 'Price must be positive']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount percentage cannot be negative'],
    max: [99, 'Discount cannot exceed 99%']
  },
  discountPrice: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: {
    type: [String],
    required: [true, 'At least one product image is required'],
    validate: [v => Array.isArray(v) && v.length > 0, 'At least one image is required']
  },
  specifications: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  variants: [{
    name: { type: String, required: true },
    options: [{ type: String, required: true }]
  }],
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating cannot exceed 5'],
    set: v => Math.round(v * 10) / 10
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDealOfDay: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-calculate discountPrice before saving
productSchema.pre('save', function (next) {
  if (this.discount > 0) {
    this.discountPrice = Math.round(this.price * (1 - this.discount / 100));
  } else {
    this.discountPrice = this.price;
  }
  next();
});

// Text index for search
productSchema.index({
  name: 'text',
  brand: 'text',
  description: 'text',
  shortDescription: 'text'
});

const Product = mongoose.model('Product', productSchema);
export default Product;
