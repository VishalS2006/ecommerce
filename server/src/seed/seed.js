import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import { categoriesData, productsData, couponsData } from './data.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('--- Clearing Existing Data ---');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();

    console.log('--- Seeding Categories ---');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('--- Seeding Products ---');
    const preparedProducts = productsData.map(prod => {
      const { categorySlug, ...rest } = prod;
      const slug = prod.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const discountPrice = prod.discount > 0
        ? Math.round(prod.price * (1 - prod.discount / 100))
        : prod.price;

      return {
        ...rest,
        slug,
        category: categoryMap[categorySlug],
        discountPrice
      };
    });

    const createdProducts = await Product.insertMany(preparedProducts);
    console.log(`Seeded ${createdProducts.length} products`);

    console.log('--- Seeding Users ---');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123456', salt);
    const customerPasswordHash = await bcrypt.hash('Customer@123456', salt);

    const admin = await User.create({
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      mobile: '+1 (555) 019-2834',
      passwordHash: adminPasswordHash,
      role: 'admin',
      status: 'active'
    });

    const customer = await User.create({
      name: 'Alex Johnson',
      email: 'customer@shopsphere.com',
      mobile: '+1 (555) 014-9821',
      passwordHash: customerPasswordHash,
      role: 'customer',
      status: 'active',
      addresses: [
        {
          fullName: 'Alex Johnson',
          mobile: '+1 (555) 014-9821',
          addressLine1: '742 Evergreen Terrace',
          addressLine2: 'Apt 4B',
          city: 'Springfield',
          state: 'Oregon',
          postalCode: '97477',
          country: 'United States',
          addressType: 'Home',
          isDefault: true
        },
        {
          fullName: 'Alex Johnson (Office)',
          mobile: '+1 (555) 014-9821',
          addressLine1: '100 Silicon Parkway',
          addressLine2: 'Suite 300',
          city: 'Springfield',
          state: 'Oregon',
          postalCode: '97478',
          country: 'United States',
          addressType: 'Work',
          isDefault: false
        }
      ]
    });

    await Cart.create({ user: customer._id, items: [] });
    await Wishlist.create({
      user: customer._id,
      products: [createdProducts[0]._id, createdProducts[3]._id]
    });

    console.log('--- Seeding Coupons ---');
    await Coupon.insertMany(couponsData);

    console.log('--- Seeding Sample Reviews ---');
    const sampleReviews = [
      {
        user: customer._id,
        product: createdProducts[0]._id,
        rating: 5,
        title: 'Incredible sound clarity and ANC!',
        comment: 'I use these headphones daily for both office focus and long flights. Battery easily lasted through an entire week of work. Highly recommended!',
        verifiedPurchase: true
      },
      {
        user: customer._id,
        product: createdProducts[3]._id,
        rating: 5,
        title: 'Best smartphone I have owned',
        comment: 'The titanium build feels super lightweight, and the 5x optical zoom camera takes crystal clear photos even in low light.',
        verifiedPurchase: true
      },
      {
        user: customer._id,
        product: createdProducts[7]._id,
        rating: 5,
        title: 'Authentic leather quality',
        comment: 'Leather smells amazing and fits like a glove. The hardware is sturdy and heavyweight.',
        verifiedPurchase: true
      }
    ];

    for (const rev of sampleReviews) {
      await Review.create(rev);
    }

    console.log('--- Seeding Sample Orders for Analytics ---');
    const sampleOrders = [
      {
        orderNumber: 'ORD-9021-4821',
        user: customer._id,
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            image: createdProducts[0].images[0],
            price: createdProducts[0].price,
            discountPrice: createdProducts[0].discountPrice,
            quantity: 1,
            selectedVariants: { Color: 'Matte Black' }
          }
        ],
        shippingAddress: customer.addresses[0],
        subtotal: createdProducts[0].discountPrice,
        couponDiscount: 20,
        couponCode: 'SAVE20',
        shippingFee: 0,
        tax: 13.8,
        total: Math.round((createdProducts[0].discountPrice - 20 + 13.8) * 100) / 100,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        paymentDetails: {
          transactionId: 'TXN-984128-VISA',
          provider: 'ShopSphere SafeCard',
          paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        orderStatus: 'delivered',
        trackingTimeline: [
          { status: 'placed', title: 'Order Placed', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
          { status: 'confirmed', title: 'Order Confirmed', timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000) },
          { status: 'processing', title: 'Packed at Hub', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { status: 'shipped', title: 'Dispatched via Courier', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { status: 'out_for_delivery', title: 'Out for Delivery', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
          { status: 'delivered', title: 'Delivered to Customer', timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000) }
        ],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        orderNumber: 'ORD-8419-1029',
        user: customer._id,
        items: [
          {
            product: createdProducts[3]._id,
            name: createdProducts[3].name,
            image: createdProducts[3].images[0],
            price: createdProducts[3].price,
            discountPrice: createdProducts[3].discountPrice,
            quantity: 1,
            selectedVariants: { Storage: '256GB', Color: 'Natural Titanium' }
          }
        ],
        shippingAddress: customer.addresses[0],
        subtotal: createdProducts[3].discountPrice,
        couponDiscount: 50,
        couponCode: 'FESTIVE50',
        shippingFee: 0,
        tax: 48.0,
        total: Math.round((createdProducts[3].discountPrice - 50 + 48.0) * 100) / 100,
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        paymentDetails: {
          transactionId: 'TXN-UPI-481928-HDFC',
          provider: 'ShopSphere UPI FastPay',
          paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        orderStatus: 'shipped',
        trackingTimeline: [
          { status: 'placed', title: 'Order Placed', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
          { status: 'confirmed', title: 'Order Confirmed', timestamp: new Date(Date.now() - 0.8 * 24 * 60 * 60 * 1000) },
          { status: 'processing', title: 'Packed at Warehouse', timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000) },
          { status: 'shipped', title: 'In Transit', timestamp: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000) }
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    await Order.insertMany(sampleOrders);

    console.log('==================================================');
    console.log('  Database Seeded Successfully!');
    console.log('  Admin Login:    admin@shopsphere.com    / Admin@123456');
    console.log('  Customer Login: customer@shopsphere.com / Customer@123456');
    console.log('==================================================');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1].endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
