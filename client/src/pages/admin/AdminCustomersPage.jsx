import React, { useState, useEffect } from 'react';
import { Search, Users, ShieldAlert, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

export const AdminCustomersPage = () => {
  const { success, error } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCustomers({ search, page, limit: 12 });
      if (res.success) {
        setCustomers(res.customers || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, page]);

  const handleToggleStatus = async (customerId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await adminService.updateCustomerStatus(customerId, nextStatus);
      if (res.success) {
        success(res.message);
        setCustomers((prev) =>
          prev.map((c) => (c._id === customerId ? { ...c, status: nextStatus } : c))
        );
      }
    } catch (err) {
      error(err.customMessage || 'Failed to update customer status');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Customer Accounts Directory
        </h2>
        <p className="text-xs text-slate-400">
          Total of {totalCount} registered shoppers in database
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs relative">
        <input
          type="text"
          placeholder="Search by customer name, email, or mobile..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No customers found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Orders & Spend</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-6 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 font-black text-xs flex items-center justify-center shrink-0">
                          {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[11px] text-slate-400">ID: {c._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.email}</span>
                        </div>
                        {c.mobile && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Phone className="w-3 h-3" />
                            <span>{c.mobile}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block text-xs">
                        {c.totalOrders || 0} {(c.totalOrders || 0) === 1 ? 'Order' : 'Orders'}
                      </span>
                      <span className="text-[11px] font-black text-emerald-600">
                        ${c.totalSpent || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(c._id, c.status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          c.status === 'active'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {c.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomersPage;
