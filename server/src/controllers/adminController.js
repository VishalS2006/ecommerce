import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['placed', 'confirmed', 'processing'] }
    });
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } });

    // Revenue calculation from non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? Math.round(revenueAgg[0].totalRevenue * 100) / 100 : 0;

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
      .select('name sku stock price images brand')
      .limit(6);

    // Monthly sales data for chart
    const salesAgg = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['cancelled', 'refunded'] } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesChart = salesAgg.map(item => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: Math.round(item.revenue),
      orders: item.orders
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        lowStockCount
      },
      salesChart,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for Admin table
// @route   GET /api/admin/products
// @access  Admin
export const getAdminProducts = async (req, res, next) => {
  try {
    const { keyword, category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { sku: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const pageNum = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageLimit;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / pageLimit),
      currentPage: pageNum,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/admin/products
// @access  Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      category,
      brand,
      price,
      discount = 0,
      stock = 0,
      description,
      shortDescription,
      images,
      specifications,
      variants,
      isFeatured = false,
      isDealOfDay = false,
      isBestSeller = false,
      active = true
    } = req.body;

    if (!name || !category || !brand || !price || !description || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product fields'
      });
    }

    // Generate slug and SKU if missing
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    const finalSku = sku ? sku.toUpperCase().trim() : `SKU-${Date.now().toString().slice(-6)}`;

    const product = await Product.create({
      name,
      slug,
      sku: finalSku,
      category,
      brand,
      price: Number(price),
      discount: Number(discount),
      stock: Number(stock),
      description,
      shortDescription: shortDescription || '',
      images: Array.isArray(images) ? images : [images],
      specifications: specifications || [],
      variants: variants || [],
      isFeatured: !!isFeatured,
      isDealOfDay: !!isDealOfDay,
      isBestSeller: !!isBestSeller,
      active: active !== undefined ? active : true
    });

    const populated = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // If price or discount changed, update discountPrice
    const price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    const discount = req.body.discount !== undefined ? Number(req.body.discount) : product.discount;
    req.body.discountPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick update product stock (Admin)
// @route   PATCH /api/admin/products/:id/stock
// @access  Admin
export const updateProductStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ success: false, message: 'Invalid stock value' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: Number(stock) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: `Stock updated to ${product.stock}`,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Admin
export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.mobile': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageLimit;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email mobile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / pageLimit),
      currentPage: pageNum,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status & tracking (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, note } = req.body;

    const validStatuses = [
      'placed',
      'confirmed',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'refunded'
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status specified'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If changing to cancelled, restore stock if not already cancelled
    if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    // If changing from cancelled back to active, re-check and decrement
    if (order.orderStatus === 'cancelled' && orderStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    // Auto mark paid if delivered on COD
    if (orderStatus === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    order.orderStatus = orderStatus;

    // Friendly title
    const statusTitles = {
      placed: 'Order Placed',
      confirmed: 'Order Confirmed',
      processing: 'Processing for Dispatch',
      shipped: 'Shipped from Warehouse',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Order Delivered',
      cancelled: 'Order Cancelled',
      refunded: 'Payment Refunded'
    };

    order.trackingTimeline.push({
      status: orderStatus,
      title: statusTitles[orderStatus] || orderStatus,
      description: note || `Status updated to ${statusTitles[orderStatus]} by administrator.`
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${statusTitles[orderStatus]}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order payment status (Admin)
// @route   PUT /api/admin/orders/:id/payment-status
// @access  Admin
export const updateOrderPaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const valid = ['pending', 'paid', 'failed', 'refunded'];

    if (!valid.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered customers (Admin)
// @route   GET /api/admin/customers
// @access  Admin
export const getAdminCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageLimit;

    const total = await User.countDocuments(query);
    const customers = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    // Enrich with order count and total spent
    const enriched = await Promise.all(
      customers.map(async customer => {
        const orderStats = await Order.aggregate([
          { $match: { user: customer._id, orderStatus: { $ne: 'cancelled' } } },
          {
            $group: {
              _id: null,
              orderCount: { $sum: 1 },
              totalSpent: { $sum: '$total' }
            }
          }
        ]);

        return {
          ...customer.toObject(),
          totalOrders: orderStats.length > 0 ? orderStats[0].orderCount : 0,
          totalSpent: orderStats.length > 0 ? Math.round(orderStats[0].totalSpent * 100) / 100 : 0
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / pageLimit),
      currentPage: pageNum,
      customers: enriched
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle customer account status (Admin)
// @route   PUT /api/admin/customers/:id/status
// @access  Admin
export const updateCustomerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const customer = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-passwordHash');

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({
      success: true,
      message: `Customer account status updated to ${status}`,
      customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Category (Admin)
// @route   POST /api/admin/categories
// @access  Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, image, icon, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      icon: icon || 'ShoppingBag',
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};
