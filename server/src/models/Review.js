import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100,
    default: ''
  },
  comment: {
    type: String,
    required: [true, 'Please write a review comment'],
    trim: true,
    maxlength: 1000
  },
  verifiedPurchase: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Prevent duplicate review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (productId) {
  const obj = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  try {
    const Product = mongoose.model('Product');
    if (obj.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        ratingsAverage: Math.round(obj[0].averageRating * 10) / 10,
        ratingsCount: obj[0].ratingCount
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        ratingsAverage: 0,
        ratingsCount: 0
      });
    }
  } catch (err) {
    console.error('Error recalculating average rating:', err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.product);
});

// Call getAverageRating after remove/delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.product);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
