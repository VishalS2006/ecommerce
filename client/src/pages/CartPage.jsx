import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  Check,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { couponService } from '../services/couponService';
import { EmptyState } from '../components/common/EmptyState';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, totalItems, subtotal } = useCart();
  const { toggleWishlist } = useWishlist();
  const { success, error, warning } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Calculate order figures
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const amountAfterDiscount = Math.max(0, subtotal - couponDiscount);
  const shippingFee = amountAfterDiscount >= 50 || amountAfterDiscount === 0 ? 0 : 5.99;
  const estimatedTax = Math.round(amountAfterDiscount * 0.05 * 100) / 100;
  const finalTotal = Math.round((amountAfterDiscount + shippingFee + estimatedTax) * 100) / 100;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      warning('Please enter a coupon code');
      return;
    }

    try {
      setValidatingCoupon(true);
      const res = await couponService.validateCoupon(couponCode.trim(), subtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        success(res.message || 'Coupon applied successfully!');
      }
    } catch (err) {
      error(err.customMessage || 'Invalid or expired coupon code');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    success('Coupon removed');
  };

  const handleMoveToWishlist = async (item) => {
    await toggleWishlist(item.product);
    await removeFromCart(item._id);
    success('Moved to wishlist');
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="bg-slate-50 min-h-[70vh] py-16 flex items-center justify-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Explore our top tech and lifestyle collections today!"
          actionText="Continue Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-8">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden divide-y divide-slate-100">
              {cart.items.map((item) => {
                const variantsObj = item.selectedVariants instanceof Map
                  ? Object.fromEntries(item.selectedVariants)
                  : (item.selectedVariants || {});

                return (
                  <div key={item._id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    {/* Product visual & details */}
                    <div className="flex gap-4 items-center flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.slug || item.product._id}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0"
                      >
                        <img
                          src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {item.product.brand}
                        </span>
                        <Link
                          to={`/products/${item.product.slug || item.product._id}`}
                          className="block text-sm sm:text-base font-bold text-slate-800 hover:text-brand-600 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>

                        {/* Selected variant pills */}
                        {Object.keys(variantsObj).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {Object.entries(variantsObj).map(([key, val]) => (
                              <span key={key} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                                {key}: <strong>{val}</strong>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-sm sm:text-base font-black text-slate-900">
                            ${item.product.discountPrice || item.product.price}
                          </span>
                          {item.product.discount > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                              ${item.product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls & actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Qty Counter */}
                      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal & Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleMoveToWishlist(item)}
                          className="text-xs font-semibold text-slate-400 hover:text-brand-600 transition-colors flex items-center gap-1"
                          title="Save for Later"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Wishlist</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Orders over $50 qualify for <strong>FREE Express Shipping</strong></span>
              </div>
              <Link to="/products" className="text-brand-600 font-bold hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary & Coupon Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Coupon Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-600" />
                <span>Have a Promo Coupon?</span>
              </h3>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-${appliedCoupon.discountAmount})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SAVE20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs uppercase font-bold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors disabled:opacity-50"
                  >
                    {validatingCoupon ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}

              <p className="text-[11px] text-slate-400">
                Try codes: <strong className="text-slate-600">SAVE20</strong>, <strong className="text-slate-600">WELCOME10</strong>, or <strong className="text-slate-600">FREESHIP</strong>
              </p>
            </div>

            {/* Price Calculations Summary */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-${couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shippingFee}`}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold text-slate-800">${estimatedTax}</span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-base font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black text-slate-900">${finalTotal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout', { state: { appliedCoupon } })}
                className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 active:scale-95 transition-all mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Safe 256-Bit SSL Checkout Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
