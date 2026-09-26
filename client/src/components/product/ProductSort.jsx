import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const ProductSort = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
        <ArrowUpDown className="w-4 h-4 text-slate-400" />
        <span className="hidden sm:inline">Sort By:</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden cursor-pointer"
      >
        <option value="">Featured / Relevance</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
        <option value="newest">Newest Arrivals</option>
        <option value="bestseller">Best Selling</option>
        <option value="discount">Biggest Discount</option>
      </select>
    </div>
  );
};

export default ProductSort;
