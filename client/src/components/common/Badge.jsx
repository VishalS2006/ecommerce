import React from 'react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || '').toLowerCase();

  const configs = {
    // Order statuses
    placed: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'Order Placed' },
    confirmed: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'Confirmed' },
    processing: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Processing' },
    shipped: { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'Shipped' },
    out_for_delivery: { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', text: 'Out for Delivery' },
    delivered: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Delivered' },
    cancelled: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Cancelled' },
    refunded: { bg: 'bg-slate-100 text-slate-700 border-slate-300', text: 'Refunded' },

    // Payment statuses
    paid: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Paid' },
    pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Payment Pending' },
    failed: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Payment Failed' },

    // User statuses
    active: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Active' },
    inactive: { bg: 'bg-slate-100 text-slate-600 border-slate-200', text: 'Inactive' },
    suspended: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Suspended' }
  };

  const current = configs[normalized] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    text: status
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {current.text}
    </span>
  );
};

export const StockBadge = ({ stock }) => {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
        Out of Stock
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 animate-pulse">
        Only {stock} Left!
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      In Stock
    </span>
  );
};

export const DiscountBadge = ({ discount }) => {
  if (!discount || discount <= 0) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm">
      {discount}% OFF
    </span>
  );
};
