import Coupon from '../models/Coupon.js';

// @desc    Validate coupon and calculate discount
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      active: true
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code or coupon does not exist'
      });
    }

    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired'
      });
    }

    // Check usage limit
    if (coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit has been reached'
      });
    }

    // Check minimum order amount
    const parsedAmount = Number(orderAmount) || 0;
    if (parsedAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum order amount of $${coupon.minOrderAmount}`
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (parsedAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = Math.min(coupon.discountValue, parsedAmount);
    }

    discount = Math.round(discount * 100) / 100;

    res.status(200).json({
      success: true,
      message: `Coupon applied! You saved $${discount}`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active public coupons
// @route   GET /api/coupons/public
// @access  Public
export const getPublicCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({
      active: true,
      expiryDate: { $gt: new Date() }
    }).select('code description discountType discountValue minOrderAmount maxDiscountAmount expiryDate');

    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/admin/coupons
// @access  Admin
export const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new coupon (Admin)
// @route   POST /api/admin/coupons
// @access  Admin
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      expiryDate,
      usageLimit
    } = req.body;

    if (!code || !discountValue || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide code, discount value and expiry date'
      });
    }

    const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A coupon with this code already exists'
      });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      description: description || '',
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      expiryDate: new Date(expiryDate),
      usageLimit: Number(usageLimit) || 500,
      active: true
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/admin/coupons/:id
// @access  Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
