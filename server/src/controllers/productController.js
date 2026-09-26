import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with search, filters, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      minDiscount,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { active: true };

    // Search keyword
    if (keyword && keyword.trim()) {
      query.$or = [
        { name: { $regex: keyword.trim(), $options: 'i' } },
        { brand: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // Brand filter (supports comma-separated list)
    if (brand) {
      const brands = brand.split(',').map(b => b.trim());
      query.brand = { $in: brands.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.discountPrice = {};
      if (minPrice) query.discountPrice.$gte = Number(minPrice);
      if (maxPrice) query.discountPrice.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.ratingsAverage = { $gte: Number(rating) };
    }

    // In-Stock filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Discount filter
    if (minDiscount) {
      query.discount = { $gte: Number(minDiscount) };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    switch (sort) {
      case 'price_asc':
        sortOption = { discountPrice: 1 };
        break;
      case 'price_desc':
        sortOption = { discountPrice: -1 };
        break;
      case 'rating':
        sortOption = { ratingsAverage: -1, ratingsCount: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'bestseller':
        sortOption = { isBestSeller: -1, ratingsCount: -1 };
        break;
      case 'discount':
        sortOption = { discount: -1 };
        break;
      default:
        sortOption = { isFeatured: -1, createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageLimit = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageLimit;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageLimit);

    // Extract available brands for filter sidebar based on current category or all
    const brandQuery = query.category ? { category: query.category, active: true } : { active: true };
    const availableBrands = await Product.distinct('brand', brandQuery);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / pageLimit),
      currentPage: pageNum,
      availableBrands,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:identifier
// @access  Public
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: identifier, active: true }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get related products from the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      active: true
    })
      .populate('category', 'name slug')
      .limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quick search suggestions
// @route   GET /api/products/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(q.trim(), 'i');
    const suggestions = await Product.find(
      {
        active: true,
        $or: [{ name: regex }, { brand: regex }]
      },
      'name brand images discountPrice slug category'
    )
      .populate('category', 'name slug')
      .limit(6);

    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ active: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get deals of the day
// @route   GET /api/products/deals
// @access  Public
export const getDealsOfDay = async (req, res, next) => {
  try {
    const products = await Product.find({
      active: true,
      $or: [{ isDealOfDay: true }, { discount: { $gte: 20 } }]
    })
      .populate('category', 'name slug')
      .sort({ discount: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories with active product count
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ name: 1 });

    // Aggregate counts
    const categoryCounts = await Product.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    categoryCounts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });

    const enriched = categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      icon: cat.icon,
      description: cat.description,
      productCount: countMap[cat._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      count: enriched.length,
      categories: enriched
    });
  } catch (error) {
    next(error);
  }
};
