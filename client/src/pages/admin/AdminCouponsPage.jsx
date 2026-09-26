import React, { useState, useEffect } from 'react';
import { Plus, Ticket, Trash2, Calendar, Tag, Check, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { TableSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

export const AdminCouponsPage = () => {
  const { success, error, warning } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 50,
    maxDiscountAmount: 30,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 500
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCoupons();
      if (res.success) {
        setCoupons(res.coupons || []);
      }
    } catch (err) {
      console.error('Coupons fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue || !formData.expiryDate) {
      warning('Please provide code, discount value and expiration date');
      return;
    }

    try {
      setSaving(true);
      const res = await adminService.createCoupon(formData);
      if (res.success) {
        success('New coupon activated successfully');
        setModalOpen(false);
        setFormData(initialForm);
        fetchCoupons();
      }
    } catch (err) {
      error(err.customMessage || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await adminService.deleteCoupon(id);
      success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      error(err.customMessage || 'Failed to delete coupon');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Promotion & Coupon Management
          </h2>
          <p className="text-xs text-slate-400">
            Create promotional voucher codes and define minimum order thresholds
          </p>
        </div>

        <button
          onClick={() => {
            setFormData(initialForm);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No active coupons found. Create your first promotion code above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-6">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Minimum Order</th>
                  <th className="py-3.5 px-4">Max Cap</th>
                  <th className="py-3.5 px-4">Redeemed / Limit</th>
                  <th className="py-3.5 px-4">Expires</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {coupons.map((c) => {
                  const isExpired = new Date(c.expiryDate) < new Date();

                  return (
                    <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2.5">
                          <Ticket className="w-4 h-4 text-brand-600 shrink-0" />
                          <div>
                            <span className="font-mono font-bold text-slate-900 block">{c.code}</span>
                            <span className="text-[11px] text-slate-400">{c.description || 'Promotional offer'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-black text-brand-600">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} FLAT`}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        ${c.minOrderAmount || 0}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {c.maxDiscountAmount ? `$${c.maxDiscountAmount}` : 'No Limit'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">
                          {c.timesUsed || 0}
                        </span>
                        <span className="text-slate-400"> / {c.usageLimit}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-semibold ${
                            isExpired ? 'text-rose-500' : 'text-slate-700'
                          }`}
                        >
                          {new Date(c.expiryDate).toLocaleDateString()}
                          {isExpired && <span className="block text-[10px] font-bold">Expired</span>}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => handleDeleteCoupon(c._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Create Promotion Coupon</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 25% off on summer apparel"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Min Order ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Cap ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Activating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;
