import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = 'No items found',
  description = 'Looks like there is nothing to display here right now.',
  actionText = 'Explore Products',
  actionLink = '/products'
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 my-6 bg-white rounded-3xl border border-slate-100 shadow-soft max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20 active:scale-95"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
