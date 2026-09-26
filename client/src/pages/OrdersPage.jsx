import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, ArrowRight, Truck } from 'lucide-react';
import { StatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/Skeleton';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

export const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getUserOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Order History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              View and track all your previous purchases
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Shop More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft">
            <TableSkeleton rows={4} cols={4} />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Orders Found"
            description="You haven't placed any orders yet. Discover our top curated tech and lifestyle items."
            actionText="Start Shopping"
            actionLink="/products"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-7 hover:border-slate-200 transition-all space-y-4"
              >
                {/* Order Top Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm sm:text-base text-slate-900">
                        {order.orderNumber}
                      </span>
                      <StatusBadge status={order.orderStatus} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Placed on{' '}
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 font-bold uppercase block">Total</span>
                      <span className="text-lg font-black text-slate-900">${order.total}</span>
                    </div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-white shrink-0"
                      />
                      <div className="text-xs pr-2">
                        <p className="font-bold text-slate-800 line-clamp-1 max-w-[180px]">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity} • ${item.discountPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
