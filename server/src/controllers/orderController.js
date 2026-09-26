import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';

// Helper to generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${timestamp}-${random}`;
};

// @desc    Create new order with server-side price validation & atomic stock decrement
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  const modifiedStock = []; // Track decremented products for rollback on error

  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      paymentInfo
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete shipping address'
      });
    }

    if (!['card', 'upi', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // 1. Validate items and decrement stock atomically
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const productId = item.productId || (item.product && item.product._id) || item._id;
      const quantity = parseInt(item.quantity, 10);

      if (!productId || quantity <= 0) {
        throw new Error('Invalid product or quantity specified in order');
      }

      // Atomic check and decrement stock
      const product = await Product.findOneAndUpdate(
        { _id: productId, active: true, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!product) {
        // Stock insufficient or product not active
        const existingProduct = await Product.findById(productId);
        const name = existingProduct ? existingProduct.name : 'Selected product';
        const available = existingProduct ? existingProduct.stock : 0;
        throw new Error(`Insufficient stock for "${name}". Only ${available} units available.`);
      }

      // Record for rollback if anything subsequent fails
      modifiedStock.push({ productId, quantity });

      const itemPrice = product.price;
      const itemDiscountPrice = product.discountPrice || product.price;
      const itemSubtotal = itemDiscountPrice * quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        price: itemPrice,
        discountPrice: itemDiscountPrice,
        quantity,
        selectedVariants: item.selectedVariants || {}
      });
    }

    // 2. Validate and calculate Coupon
    let couponDiscount = 0;
    let appliedCouponCode = '';

    if (couponCode && couponCode.trim()) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        active: true
      });

      if (coupon && new Date(coupon.expiryDate) > new Date() && coupon.timesUsed < coupon.usageLimit) {
        if (subtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'percentage') {
            couponDiscount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && couponDiscount > coupon.maxDiscountAmount) {
              couponDiscount = coupon.maxDiscountAmount;
            }
          } else {
            couponDiscount = Math.min(coupon.discountValue, subtotal);
          }
          couponDiscount = Math.round(couponDiscount * 100) / 100;
          appliedCouponCode = coupon.code;

          // Increment coupon usage
          coupon.timesUsed += 1;
          await coupon.save();
        }
      }
    }

    // 3. Calculate shipping & tax
    // Free shipping if order subtotal after discount is >= $50, else $5.99
    const amountAfterDiscount = Math.max(0, subtotal - couponDiscount);
    const shippingFee = amountAfterDiscount >= 50 || amountAfterDiscount === 0 ? 0 : 5.99;
    const tax = Math.round(amountAfterDiscount * 0.05 * 100) / 100; // 5% tax
    const total = Math.round((amountAfterDiscount + shippingFee + tax) * 100) / 100;

    // 4. Payment processing simulation
    const isOnlinePayment = paymentMethod === 'card' || paymentMethod === 'upi';
    const paymentStatus = isOnlinePayment ? 'paid' : 'pending';
    const transactionId = isOnlinePayment
      ? (paymentInfo?.transactionId || `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)
      : '';

    // 5. Estimated delivery date (4 business days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      subtotal: Math.round(subtotal * 100) / 100,
      couponDiscount,
      couponCode: appliedCouponCode,
      shippingFee,
      tax,
      total,
      paymentMethod,
      paymentStatus,
      paymentDetails: {
        transactionId,
        provider: paymentMethod === 'card' ? 'ShopSphere SafeCard' : (paymentMethod === 'upi' ? 'ShopSphere UPI FastPay' : 'Cash On Delivery'),
        paidAt: isOnlinePayment ? new Date() : null
      },
      orderStatus: 'placed',
      trackingTimeline: [
        {
          status: 'placed',
          title: 'Order Placed',
          description: `Order #${orderNumber} placed successfully.`
        }
      ],
      estimatedDeliveryDate: estimatedDelivery
    });

    // 6. Clear user cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    // Rollback stock decrement if error occurred
    if (modifiedStock.length > 0) {
      for (const item of modifiedStock) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }
    }
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email mobile');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Ensure user can view only their own order unless admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    const cancelableStatuses = ['placed', 'confirmed', 'processing'];
    if (!cancelableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus.replace('_', ' ')}.`
      });
    }

    // Restore inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelReason = reason || 'Customer requested cancellation';

    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }

    order.trackingTimeline.push({
      status: 'cancelled',
      title: 'Order Cancelled',
      description: `Order cancelled. Reason: ${order.cancelReason}. ${order.paymentStatus === 'refunded' ? 'Refund initiated.' : ''}`
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and inventory restored',
      order
    });
  } catch (error) {
    next(error);
  }
};
