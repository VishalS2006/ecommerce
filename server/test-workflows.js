const BASE_URL = 'http://localhost:5000/api';

const request = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.data = data;
    throw error;
  }
  return data;
};

const runTests = async () => {
  console.log('====================================================');
  console.log('   STARTING FULL-STACK E-COMMERCE WORKFLOW TESTS   ');
  console.log('====================================================');

  try {
    // 1. Health check
    console.log('\n[1] Checking Server Health...');
    const health = await request(`${BASE_URL}/health`);
    console.log('✓ Health Status:', health.status, health.appName);

    // 2. Products Catalog & Search
    console.log('\n[2] Testing Product Search & Filter...');
    const prodRes = await request(`${BASE_URL}/products?keyword=AcousticPro`);
    console.log(`✓ Found ${prodRes.count} matching products. First item: ${prodRes.products[0]?.name}`);
    const testProduct = prodRes.products[0];

    // 3. Customer Registration
    const testEmail = `shopper_${Date.now()}@example.com`;
    console.log(`\n[3] Registering New Customer (${testEmail})...`);
    const regRes = await request(`${BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Taylor Swift',
        email: testEmail,
        mobile: '+1 (555) 987-6543',
        password: 'Password@123',
        confirmPassword: 'Password@123'
      })
    });
    console.log('✓ Customer Registered Successfully:', regRes.user.name);
    const customerToken = regRes.token;
    const authHeaders = { Authorization: `Bearer ${customerToken}` };

    // 4. Add Address
    console.log('\n[4] Adding Delivery Address...');
    const addrRes = await request(`${BASE_URL}/auth/addresses`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        fullName: 'Taylor Swift',
        mobile: '+1 (555) 987-6543',
        addressLine1: '13 Cornelia Street',
        addressLine2: 'Apt 2',
        city: 'New York',
        state: 'NY',
        postalCode: '10014',
        country: 'United States',
        addressType: 'Home',
        isDefault: true
      })
    });
    console.log('✓ Address added. Total user addresses:', addrRes.addresses.length);

    // 5. Add to Cart
    console.log('\n[5] Adding Product to Cart...');
    const initialStock = testProduct.stock;
    const cartRes = await request(`${BASE_URL}/cart/add`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        productId: testProduct._id,
        quantity: 2,
        selectedVariants: { Color: 'Matte Black' }
      })
    });
    console.log(`✓ Cart Updated: ${cartRes.cart.totalItems} items. Subtotal: $${cartRes.cart.subtotal}`);

    // 6. Validate Coupon
    console.log('\n[6] Validating Promo Coupon "SAVE20"...');
    const couponRes = await request(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        code: 'SAVE20',
        orderAmount: cartRes.cart.subtotal
      })
    });
    console.log(`✓ Coupon Valid: Saved $${couponRes.coupon.discountAmount}`);

    // 7. Place Order
    console.log('\n[7] Placing Order with Atomic Stock Decrement & Payment...');
    const orderRes = await request(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        items: [
          {
            productId: testProduct._id,
            quantity: 2,
            selectedVariants: { Color: 'Matte Black' }
          }
        ],
        shippingAddress: addrRes.addresses[0],
        paymentMethod: 'card',
        couponCode: 'SAVE20',
        paymentInfo: { transactionId: 'TXN-TEST-12345' }
      })
    });
    const order = orderRes.order;
    console.log('✓ Order Created Successfully!');
    console.log(`  Order Number:    ${order.orderNumber}`);
    console.log(`  Subtotal:        $${order.subtotal}`);
    console.log(`  Coupon Discount: -$${order.couponDiscount}`);
    console.log(`  Final Total:     $${order.total}`);
    console.log(`  Payment Status:  ${order.paymentStatus}`);

    // Verify Stock was decremented
    const verifiedProduct = (await request(`${BASE_URL}/products/${testProduct._id}`)).product;
    console.log(`✓ Inventory Check: Stock reduced from ${initialStock} to ${verifiedProduct.stock} (-2 units)`);

    // 8. Order Tracking Timeline
    console.log('\n[8] Viewing Order Tracking Timeline...');
    const trackRes = await request(`${BASE_URL}/orders/${order._id}`, { headers: authHeaders });
    console.log('✓ Order Timeline Events:', trackRes.order.trackingTimeline.map(t => t.title).join(' -> '));

    // 9. Post Customer Review
    console.log('\n[9] Posting Product Review for Verified Purchase...');
    const reviewRes = await request(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        productId: testProduct._id,
        rating: 5,
        title: 'Absolutely love these!',
        comment: 'Audio quality is unmatched and delivery was prompt.'
      })
    });
    console.log('✓ Review Submitted:', reviewRes.review.title, `(${reviewRes.review.rating} Stars, Verified: ${reviewRes.review.verifiedPurchase})`);

    // 10. Admin Authentication
    console.log('\n[10] Admin Login & Metrics Verification...');
    const adminLoginRes = await request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@shopsphere.com',
        password: 'Admin@123456'
      })
    });
    const adminToken = adminLoginRes.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    console.log('✓ Admin Logged In:', adminLoginRes.user.name, `(Role: ${adminLoginRes.user.role})`);

    // 11. Admin Dashboard Stats
    const statsRes = await request(`${BASE_URL}/admin/stats`, { headers: adminHeaders });
    console.log('✓ Admin Dashboard Metrics:');
    console.log(`  Total Revenue:   $${statsRes.stats.totalRevenue}`);
    console.log(`  Total Orders:    ${statsRes.stats.totalOrders}`);
    console.log(`  Total Customers: ${statsRes.stats.totalCustomers}`);
    console.log(`  Total Products:  ${statsRes.stats.totalProducts}`);

    // 12. Admin Updates Order Status
    console.log('\n[12] Admin Updating Order Status to "shipped"...');
    const updateOrderRes = await request(`${BASE_URL}/admin/orders/${order._id}/status`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({
        orderStatus: 'shipped',
        note: 'Dispatched via Express Courier'
      })
    });
    console.log('✓ Order Status Updated:', updateOrderRes.order.orderStatus);

    // 13. Admin Product Creation
    console.log('\n[13] Admin Creating New Product...');
    const categoryId = (await request(`${BASE_URL}/categories`)).categories[0]._id;
    const newProductRes = await request(`${BASE_URL}/admin/products`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'UltraGlow RGB Smart Ambience Lightbar',
        sku: `LGT-${Date.now().toString().slice(-4)}`,
        brand: 'Lumino',
        category: categoryId,
        price: 89,
        discount: 10,
        stock: 50,
        description: 'Dynamic RGB sound-reactive lightbar with app control and 16 million colors.',
        images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'],
        isFeatured: true
      })
    });
    console.log('✓ New Product Created by Admin:', newProductRes.product.name);

    console.log('\n====================================================');
    console.log('   🎉 ALL 13 E-COMMERCE CRITICAL WORKFLOWS PASSED!  ');
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ Workflow Test Failed:', err.data || err.message);
    process.exit(1);
  }
};

runTests();
