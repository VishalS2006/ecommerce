import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MetricCard = ({ title, value, icon: Icon, change, isPositive = true, color = 'brand' }) => {
  const colorStyles = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100'
  };

  const currentStyle = colorStyles[color] || colorStyles.brand;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${currentStyle}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </div>
        {change && (
          <div
            className={`flex items-center text-xs font-bold ${
              isPositive ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
