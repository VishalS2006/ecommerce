import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  MapPin,
  CreditCard,
  CheckCircle,
  Truck,
  ShieldCheck,
  Plus,
  ArrowRight,
  ArrowLeft,
  Lock,
  Smartphone,
  Wallet,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { cart, clearCart } = useCart();
  const { success, error, warning } = useToast();

  const [step, setStep] = useState(1);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Applied coupon passed from CartPage or local
  const appliedCoupon = location.state?.appliedCoupon || null;

  // Address state
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    addressType: 'Home',
    isDefault: false
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'cod'
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: user?.name || '',
    cardNumber: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888'
  });
  const [upiId, setUpiId] = useState('customer@okaxis');

  // Guard: if not authenticated, redirect to login with return path
  useEffect(() => {
    if (!isAuthenticated) {
      warning('Please sign in or create an account to proceed with checkout.');
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  // Guard: if cart is empty and order hasn't just been placed
  useEffect(() => {
    if ((!cart || cart.items?.length === 0) && step !== 4) {
      navigate('/cart');
    }
  }, [cart, step, navigate]);

  // Recalculate numbers
  const subtotal = cart?.subtotal || 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const amountAfterDiscount = Math.max(0, subtotal - couponDiscount);
  const shippingFee = amountAfterDiscount >= 50 || amountAfterDiscount === 0 ? 0 : 5.99;
  const estimatedTax = Math.round(amountAfterDiscount * 0.05 * 100) / 100;
  const finalTotal = Math.round((amountAfterDiscount + shippingFee + estimatedTax) * 100) / 100;

  const currentAddress = user?.addresses?.[selectedAddressIndex] || null;

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.mobile || !newAddress.addressLine1 || !newAddress.city || !newAddress.postalCode) {
      warning('Please fill in all required address fields');
      return;
    }

    try {
      const res = await authService.addAddress(newAddress);
      if (res.success) {
        await refreshUser();
        setShowNewAddressForm(false);
        setSelectedAddressIndex(user?.addresses ? user.addresses.length : 0);
        success('New delivery address saved');
      }
    } catch (err) {
      error(err.customMessage || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    const shippingAddressToUse = currentAddress || newAddress;

    if (!shippingAddressToUse || !shippingAddressToUse.fullName || !shippingAddressToUse.addressLine1) {
      warning('Please select or provide a delivery address');
      setStep(1);
      return;
    }

    try {
      setSubmittingOrder(true);

      const orderPayload = {
        items: cart.items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          selectedVariants: item.selectedVariants
        })),
        shippingAddress: shippingAddressToUse,
        paymentMethod,
        couponCode: appliedCoupon?.code || '',
        paymentInfo: {
          transactionId: paymentMethod === 'card'
            ? `TXN-CARD-${Date.now().toString().slice(-6)}`
            : paymentMethod === 'upi'
            ? `TXN-UPI-${Date.now().toString().slice(-6)}`
            : ''
        }
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.success && res.order) {
        setCreatedOrder(res.order);
        clearCart();
        setStep(4);

        // Confetti celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}

        success('Order placed successfully!');
      }
    } catch (err) {
      error(err.customMessage || 'Failed to place order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <CheckoutSteps currentStep={step} />

        {/* STEP 1: Address Selection / Addition */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-10 space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">1. Delivery Address</h2>
                <p className="text-xs text-slate-400 mt-0.5">Where should we deliver your order?</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{showNewAddressForm ? 'Cancel New Address' : 'Add New Address'}</span>
              </button>
            </div>

            {/* Saved Addresses List */}
            {user?.addresses && user.addresses.length > 0 && !showNewAddressForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => {
                  const isSelected = selectedAddressIndex === idx;
                  return (
                    <div
                      key={addr._id || idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/30 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                          {addr.addressType || 'Home'}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{addr.fullName}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`} <br />
                        {addr.city}, {addr.state} - {addr.postalCode} <br />
                        {addr.country}
                      </p>
                      <p className="text-xs text-slate-500 font-semibold mt-2">
                        Mobile: {addr.mobile}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add New Address Form */}
            {(showNewAddressForm || !user?.addresses?.length) && (
              <form onSubmit={handleSaveNewAddress} className="space-y-4 max-w-xl">
                <h4 className="font-bold text-sm text-slate-900">Enter Shipping Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={newAddress.mobile}
                      onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Street Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.addressLine1}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apartment, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    value={newAddress.addressLine2}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Save Address
                </button>
              </form>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link to="/cart" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Cart</span>
              </Link>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!currentAddress && !newAddress.addressLine1}
                className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                Continue to Summary
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Order Summary Review */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-10 space-y-8">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">2. Review Order Summary</h2>
                <p className="text-xs text-slate-400 mt-0.5">Please check your items and delivery destination</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Change Address
              </button>
            </div>

            {/* Delivery address preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase text-slate-400">Delivering To:</span>
                <p className="font-bold text-sm text-slate-800">{currentAddress?.fullName || newAddress.fullName}</p>
                <p className="text-xs text-slate-600">
                  {currentAddress?.addressLine1 || newAddress.addressLine1}, {currentAddress?.city || newAddress.city} {currentAddress?.state || newAddress.state} - {currentAddress?.postalCode || newAddress.postalCode}
                </p>
              </div>
            </div>

            {/* Items review */}
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {cart.items.map((item) => (
                <div key={item._id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl bg-slate-50"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.product.discountPrice || item.product.price}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-slate-900">
                    ${(item.product.discountPrice || item.product.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-sm max-w-sm ml-auto">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">${subtotal}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-${couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (5%)</span>
                <span>${estimatedTax}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-black text-slate-900">Total</span>
                <span className="text-xl font-black text-slate-900">${finalTotal}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Address</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Method Selection & Safe Demo Simulation */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-10 space-y-8">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">3. Select Payment Method</h2>
              <p className="text-xs text-slate-400 mt-0.5">Secure, 256-bit encrypted checkout guarantee</p>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-brand-600 bg-brand-50/40 text-brand-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className="w-6 h-6 text-brand-600" />
                <span className="font-bold text-sm">Credit / Debit Card</span>
                <span className="text-[11px] text-slate-400">Visa, Mastercard, Amex</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-brand-600 bg-brand-50/40 text-brand-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Smartphone className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-sm">UPI / QR Payment</span>
                <span className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-600 bg-brand-50/40 text-brand-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Wallet className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-sm">Cash on Delivery</span>
                <span className="text-[11px] text-slate-400">Pay cash upon delivery</span>
              </button>
            </div>

            {/* Payment Fields Based on Selected Method */}
            {paymentMethod === 'card' && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 max-w-lg space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-bold uppercase tracking-wider">Test Card Simulation</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Safe Test Mode Active</span>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name on Card</label>
                  <input
                    type="text"
                    value={cardDetails.nameOnCard}
                    onChange={(e) => setCardDetails({ ...cardDetails, nameOnCard: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-brand-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-brand-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 max-w-lg space-y-4">
                <span className="font-bold text-xs uppercase tracking-wider text-purple-700">UPI Instant Pay</span>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  A payment request simulation will be approved immediately for this test flow.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 max-w-lg">
                <h4 className="font-bold text-sm text-emerald-900 mb-1">Pay Cash Upon Delivery</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You can pay cash to our logistics courier at your doorstep when receiving the parcel. Please keep exact change ready.
                </p>
              </div>
            )}

            {/* Total and Place Order action */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-semibold">Total Payable Amount</span>
                <p className="text-2xl font-black text-slate-900">${finalTotal}</p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Back to Summary
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submittingOrder}
                  className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{submittingOrder ? 'Securing Order...' : `Pay & Confirm $${finalTotal}`}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Order Confirmation & Receipt */}
        {step === 4 && createdOrder && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-12 text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <CheckCircle className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Order Placed Successfully!
              </h2>
              <p className="text-sm text-slate-500">
                Thank you for shopping with ShopSphere. Your order has been registered and is being prepared for fulfillment.
              </p>
            </div>

            {/* Key Order Receipt Details */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Order Number</span>
                <span className="font-bold text-brand-600 font-mono">{createdOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Payment Status</span>
                <span className="font-bold text-emerald-600 capitalize">{createdOrder.paymentStatus} ({createdOrder.paymentMethod.toUpperCase()})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Estimated Delivery</span>
                <span className="font-bold text-slate-800">
                  {new Date(createdOrder.estimatedDeliveryDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-700">Total Paid</span>
                <span className="font-black text-base text-slate-900">${createdOrder.total}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                to={`/orders/${createdOrder._id}`}
                className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Order</span>
              </Link>
              <Link
                to="/products"
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
