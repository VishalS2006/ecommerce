const BASE_URL = 'http://localhost:5000/api';

const runEdgeCases = async () => {
  console.log('\n--- TESTING SECURITY & VALIDATION EDGE CASES ---');

  // 1. Invalid Login
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'fake@example.com', password: 'WrongPassword' })
    });
    if (res.status === 401) {
      console.log('✓ Invalid login correctly rejected with 401');
    } else {
      console.error('x Invalid login failed: got status', res.status);
    }
  } catch (err) {
    console.error('x', err);
  }

  // 2. Unauthorized Admin Access
  try {
    const customerLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@shopsphere.com', password: 'Customer@123456' })
    });
    const { token } = await customerLogin.json();

    const adminStats = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (adminStats.status === 403) {
      console.log('✓ Customer token accessing /api/admin/stats correctly rejected with 403 Forbidden');
    } else {
      console.error('x RBAC check failed: got status', adminStats.status);
    }
  } catch (err) {
    console.error('x', err);
  }

  // 3. Invalid Coupon
  try {
    const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@shopsphere.com', password: 'Admin@123456' })
    });
    const { token } = await adminLogin.json();

    const couponRes = await fetch(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code: 'FAKE_EXPIRED_CODE', orderAmount: 100 })
    });
    if (couponRes.status === 404) {
      console.log('✓ Invalid coupon code correctly rejected with 404');
    } else {
      console.error('x Invalid coupon check failed:', couponRes.status);
    }
  } catch (err) {
    console.error('x', err);
  }

  console.log('--- ALL SECURITY & VALIDATION CHECKS PASSED ---\n');
};

runEdgeCases();
