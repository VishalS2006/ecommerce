import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to calculate cart summary
const formatCartResponse = (cart) => {
  let subtotal = 0;
  let totalItems = 0;

  const validItems = cart.items
    .filter(item => item.product && item.product.active)
    .map(item => {
      const price = item.product.discountPrice || item.product.price;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;
      totalItems += item.quantity;

      return {
        _id: item._id,
        product: {
          _id: item.product._id,
          name: item.product.name,
          slug: item.product.slug,
          images: item.product.images,
          brand: item.product.brand,
          price: item.product.price,
          discount: item.product.discount,
          discountPrice: item.product.discountPrice,
          stock: item.product.stock
        },
        quantity: item.quantity,
        selectedVariants: item.selectedVariants,
        itemSubtotal,
        isOutOfStock: item.product.stock === 0,
        isExceedingStock: item.quantity > item.product.stock
      };
    });

  return {
    _id: cart._id,
    items: validItems,
    totalItems,
    subtotal: Math.round(subtotal * 100) / 100
  };
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, selectedVariants = {} } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.active) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or currently unavailable'
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this product is currently out of stock'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if same product with same variants is already in cart
    const existingIndex = cart.items.findIndex(item => {
      if (item.product.toString() !== productId) return false;
      // compare selectedVariants
      const itemVariants = item.selectedVariants instanceof Map ? Object.fromEntries(item.selectedVariants) : (item.selectedVariants || {});
      const targetVariants = selectedVariants || {};
      return JSON.stringify(itemVariants) === JSON.stringify(targetVariants);
    });

    const parsedQty = Math.max(1, parseInt(quantity, 10));

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + parsedQty;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Maximum available stock is ${product.stock}.`
        });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      if (parsedQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock.`
        });
      }
      cart.items.push({
        product: productId,
        quantity: parsedQty,
        selectedVariants
      });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    const newQty = parseInt(quantity, 10);

    if (newQty <= 0) {
      cart.items.pull({ _id: itemId });
    } else {
      const product = await Product.findById(item.product);
      if (product && newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${product.stock})`
        });
      }
      item.quantity = newQty;
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: formatCartResponse(updatedCart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull({ _id: itemId });
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: formatCartResponse(updatedCart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all items in cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: { items: [], totalItems: 0, subtotal: 0 }
    });
  } catch (error) {
    next(error);
  }
};
