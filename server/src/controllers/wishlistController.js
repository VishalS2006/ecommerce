import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'products',
      match: { active: true },
      populate: { path: 'category', select: 'name slug' }
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      wishlist: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist (Add/Remove)
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);
    let added = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      added = false;
    } else {
      wishlist.products.push(productId);
      added = true;
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      added,
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      count: wishlist.products.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/move-to-cart
// @access  Private
export const moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.active || product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is unavailable or out of stock'
      });
    }

    // Remove from wishlist
    await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { products: productId } }
    );

    // Add to cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      if (cart.items[existingIndex].quantity < product.stock) {
        cart.items[existingIndex].quantity += 1;
      }
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product moved to cart successfully'
    });
  } catch (error) {
    next(error);
  }
};
