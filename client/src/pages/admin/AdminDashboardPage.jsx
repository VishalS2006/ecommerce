import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Eye
} from 'lucide-react';
import { MetricCard } from '../../components/admin/MetricCard';
import { StatusBadge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Skeleton';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStats();
      if (res.success) {
        setStats(res.stats);
        setSalesChart(res.salesChart || []);
        setRecentOrders(res.recentOrders || []);
        setLowStockProducts(res.lowStockProducts || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickRestock = async (productId, currentStock) => {
    const newStock = currentStock + 20;
    try {
      const res = await adminService.updateStock(productId, newStock);
      if (res.success) {
        success(res.message || 'Stock updated');
        fetchDashboardData();
      }
    } catch (err) {
      error(err.customMessage || 'Failed to update stock');
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-3xl p-5 border border-slate-100 animate-pulse" />
          ))}
        </div>
        <div className="h-80 bg-white rounded-3xl p-6 border border-slate-100 animate-pulse" />
      </div>
    );
  }

  // Max value for chart scaling
  const maxRevenue = Math.max(...(salesChart.map((d) => d.revenue) || [1000]), 100);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="emerald"
          change="+18.4%"
          isPositive={true}
        />
        <MetricCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          color="brand"
          change="+12.1%"
          isPositive={true}
        />
        <MetricCard
          title="Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          color="purple"
          change="+8.3%"
          isPositive={true}
        />
        <MetricCard
          title="Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="brand"
        />
        <MetricCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          icon={Clock}
          color="amber"
        />
        <MetricCard
          title="Low Stock"
          value={stats?.lowStockCount || 0}
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Sales Trend Chart & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue Analytics</h3>
              <p className="text-xs text-slate-400">Monthly store sales performance and transaction volumes</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Healthy Growth</span>
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-2 px-2 border-b border-slate-100">
            {salesChart.length > 0 ? (
              salesChart.map((bar, i) => {
                const heightPercent = Math.max(15, Math.round((bar.revenue / maxRevenue) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shadow-2xs">
                      ${bar.revenue}
                    </div>
                    <div
                      className="w-full max-w-[48px] bg-gradient-to-t from-brand-600 to-indigo-400 rounded-t-xl transition-all duration-500 group-hover:from-brand-500 group-hover:to-indigo-300 shadow-sm"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[60px]">
                      {bar.name}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                Awaiting more sales data to plot chart
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">Low Stock Warnings</h3>
            </div>
            <Link to="/admin/products" className="text-xs text-brand-600 font-bold hover:underline">
              View All
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              All inventory levels are healthy!
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-xl bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                      <p className="text-[11px] text-rose-600 font-semibold">Only {p.stock} units left</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickRestock(p._id, p.stock)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold shrink-0 transition-colors"
                  >
                    +20 Stock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-6 sm:p-8 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Latest transactions requiring fulfillment</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-brand-600">
                    <Link to={`/admin/orders?search=${ord.orderNumber}`} className="hover:underline">
                      {ord.orderNumber}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 block">{ord.shippingAddress?.fullName || ord.user?.name}</span>
                    <span className="text-[11px] text-slate-400">{ord.user?.email}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    {new Date(ord.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <span className="uppercase font-semibold text-xs text-slate-600">
                      {ord.paymentMethod}
                    </span>
                    <span className="block text-[11px] text-emerald-600 font-bold capitalize">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={ord.orderStatus} />
                  </td>
                  <td className="py-4 px-6 text-right font-black text-slate-900">
                    ${ord.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
