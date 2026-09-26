import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { StatusBadge } from '../components/common/Badge';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error, warning } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found a better price elsewhere');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderById(id);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Order fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(order._id, cancelReason);
      if (res.success && res.order) {
        setOrder(res.order);
        setCancelModalOpen(false);
        success('Order has been cancelled successfully. Any payment has been marked for refund.');
      }
    } catch (err) {
      error(err.customMessage || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        <Link to="/orders" className="text-brand-600 font-bold text-sm hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  // Standard tracking milestones
  const standardMilestones = [
    { status: 'placed', label: 'Order Placed', desc: 'We received your order' },
    { status: 'confirmed', label: 'Confirmed', desc: 'Order verified & accepted' },
    { status: 'processing', label: 'Processing', desc: 'Packed at fulfillment center' },
    { status: 'shipped', label: 'Dispatched', desc: 'Handed over to carrier' },
    { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier is in your area' },
    { status: 'delivered', label: 'Delivered', desc: 'Package arrived safely' }
  ];

  const statusOrderMap = {
    placed: 1,
    confirmed: 2,
    processing: 3,
    shipped: 4,
    out_for_delivery: 5,
    delivered: 6
  };

  const isCancelled = order.orderStatus === 'cancelled' || order.orderStatus === 'refunded';
  const currentStep = statusOrderMap[order.orderStatus] || 1;
  const canCancel = ['placed', 'confirmed', 'processing'].includes(order.orderStatus);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/orders"
              className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all orders</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Order #{order.orderNumber}
              </h1>
              <StatusBadge status={order.orderStatus} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {canCancel && (
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              className="self-start sm:self-auto px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* Visual Progress Timeline Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-10 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900">Live Delivery Tracker</h2>
            </div>
            {order.estimatedDeliveryDate && !isCancelled && (
              <span className="text-xs font-semibold text-slate-500">
                Estimated Delivery:{' '}
                <strong className="text-slate-800">
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </strong>
              </span>
            )}
          </div>

          {/* Timeline visualization */}
          {isCancelled ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-4">
              <XCircle className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-rose-900">This order has been cancelled</h3>
                <p className="text-xs text-rose-700">
                  Reason: {order.cancelReason || 'Customer requested cancellation'}
                </p>
                {order.paymentStatus === 'refunded' && (
                  <p className="text-xs font-bold text-emerald-700 pt-1">
                    Refund Status: Refund initiated to your original payment method.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Horizontal line for desktop */}
              <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-200 z-0" />
              <div
                className="hidden md:block absolute top-5 left-8 h-1 bg-brand-600 transition-all duration-700 z-0"
                style={{
                  width: `${((currentStep - 1) / (standardMilestones.length - 1)) * 90}%`
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-2 relative z-10">
                {standardMilestones.map((m, idx) => {
                  const stepNum = idx + 1;
                  const isDone = currentStep >= stepNum;
                  const isCurrent = currentStep === stepNum;

                  return (
                    <div key={m.status} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 text-left md:text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          isDone
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                            : 'bg-white border-2 border-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                      </div>

                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-brand-600 font-black'
                              : isDone
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {m.label}
                        </p>
                        <p className="text-[11px] text-slate-400 hidden md:block">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tracking History Logs */}
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Status History Logs
            </h4>
            <div className="space-y-3">
              {order.trackingTimeline?.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 mr-2">{item.title}</span>
                    <span className="text-slate-500">{item.description}</span>
                  </div>
                  <span className="text-slate-400 shrink-0">
                    {new Date(item.timestamp).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details & Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Items breakdown */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Purchased Items ({order.items.length})
            </h3>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl bg-slate-50 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.discountPrice}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-slate-900">
                    ${item.discountPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs sm:text-sm max-w-xs ml-auto">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${order.subtotal}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-${order.couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>${order.tax}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm sm:text-base text-slate-900">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="md:col-span-4 space-y-6">
            {/* Delivery address */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Delivery Address</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                </p>
                <p className="font-semibold pt-1">Phone: {order.shippingAddress?.mobile}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <CreditCard className="w-4 h-4 text-brand-600" />
                <span>Payment Information</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p>Method: <strong className="uppercase text-slate-800">{order.paymentMethod}</strong></p>
                <p>Status: <strong className="capitalize text-slate-800">{order.paymentStatus}</strong></p>
                {order.paymentDetails?.transactionId && (
                  <p className="font-mono text-[11px] text-slate-400">TXN: {order.paymentDetails.transactionId}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-slate-900">Cancel Order #{order.orderNumber}?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel this order? The inventory will be restored immediately.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Reason for cancellation:
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Need to change shipping address">Need to change shipping address</option>
                  <option value="Estimated delivery time is too long">Estimated delivery time is too long</option>
                  <option value="Other reasons">Other reasons</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
