import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Get all reviews for a product with breakdown
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating] += 1;
      }
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      distribution,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a product
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID, rating (1-5), and review text'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check duplicate review
    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product. You can edit your existing review.'
      });
    }

    // Check verified purchase
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      'items.product': productId,
      orderStatus: { $in: ['delivered', 'confirmed', 'processing', 'shipped', 'out_for_delivery'] }
    });

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating: Number(rating),
      title: title || '',
      comment,
      verifiedPurchase: !!hasPurchased
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully! Thank you for your feedback.',
      review: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
