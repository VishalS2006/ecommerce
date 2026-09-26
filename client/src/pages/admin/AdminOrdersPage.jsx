import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Truck,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

export const AdminOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const { success, error } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({
        search,
        status: statusFilter === 'all' ? '' : statusFilter,
        page,
        limit: 12
      });
      if (res.success) {
        setOrders(res.orders || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter, page]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await adminService.updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus} by admin`);
      if (res.success) {
        success(res.message);
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.order);
        }
        fetchOrders();
      }
    } catch (err) {
      error(err.customMessage || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const res = await adminService.updateOrderPaymentStatus(orderId, paymentStatus);
      if (res.success) {
        success(res.message);
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus });
        }
        fetchOrders();
      }
    } catch (err) {
      error(err.customMessage || 'Failed to update payment status');
    }
  };

  const statusOptions = [
    'all',
    'placed',
    'confirmed',
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Customer Orders Management
        </h2>
        <p className="text-xs text-slate-400">
          Monitor deliveries, update tracking milestones, and manage payment states
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        {/* Status Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {st === 'out_for_delivery' ? 'Out for Delivery' : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs relative">
          <input
            type="text"
            placeholder="Search by order ID, customer name, mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={8} cols={6} />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status & Action</th>
                  <th className="py-3.5 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-brand-600">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">
                        {ord.shippingAddress?.fullName || ord.user?.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{ord.shippingAddress?.mobile}</span>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-semibold text-slate-800">
                        {ord.items?.length} {ord.items?.length === 1 ? 'item' : 'items'}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate max-w-[140px]">
                        {ord.items?.[0]?.name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ${ord.total}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => handleUpdatePaymentStatus(ord._id, e.target.value)}
                        className={`text-[11px] font-bold rounded-lg px-2 py-1 border cursor-pointer ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ord.paymentStatus === 'refunded'
                            ? 'bg-slate-100 text-slate-600 border-slate-300'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        className="text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-200 bg-white cursor-pointer focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="placed">Order Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        title="View Full Order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Order Details #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  Customer: {selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.mobile})
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address & Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="font-bold uppercase text-slate-400 block mb-1">Shipping Destination</span>
                <p className="font-bold text-slate-800">{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}</p>
              </div>
              <div>
                <span className="font-bold uppercase text-slate-400 block mb-1">Payment Method & Status</span>
                <p className="uppercase font-bold text-slate-800">{selectedOrder.paymentMethod}</p>
                <p className="capitalize font-bold text-emerald-600">{selectedOrder.paymentStatus}</p>
                {selectedOrder.paymentDetails?.transactionId && (
                  <p className="font-mono text-[11px] text-slate-400">TXN: {selectedOrder.paymentDetails.transactionId}</p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-100">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-xl bg-slate-100"
                    />
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity} × ${item.discountPrice}</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">${item.discountPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="p-4 rounded-2xl bg-slate-50 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${selectedOrder.subtotal}</span>
              </div>
              {selectedOrder.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({selectedOrder.couponCode})</span>
                  <span>-${selectedOrder.couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span>${selectedOrder.shippingFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>${selectedOrder.tax}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount</span>
                <span>${selectedOrder.total}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
