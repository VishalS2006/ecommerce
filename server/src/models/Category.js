import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Please add a category slug'],
    unique: true,
    lowercase: true,
    trim: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
  },
  icon: {
    type: String,
    default: 'ShoppingBag'
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
