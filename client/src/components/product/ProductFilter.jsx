import React from 'react';
import { Star, RotateCcw, X, Check } from 'lucide-react';

export const ProductFilter = ({
  categories = [],
  availableBrands = [],
  filters,
  onFilterChange,
  onResetFilters,
  isMobileModal = false,
  onCloseMobile
}) => {
  const handleCategoryClick = (slug) => {
    onFilterChange('category', filters.category === slug ? '' : slug);
  };

  const handleBrandToggle = (brand) => {
    let current = filters.brand ? filters.brand.split(',') : [];
    if (current.includes(brand)) {
      current = current.filter((b) => b !== brand);
    } else {
      current.push(brand);
    }
    onFilterChange('brand', current.join(','));
  };

  const activeBrandList = filters.brand ? filters.brand.split(',') : [];

  const content = (
    <div className="space-y-6 text-sm">
      {/* Header with Clear button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-base">Filters</h3>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2.5">Categories</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => handleCategoryClick('')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !filters.category
                ? 'bg-brand-50 text-brand-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => handleCategoryClick(c.slug)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filters.category === c.slug
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{c.name}</span>
              {c.productCount > 0 && (
                <span className="text-[11px] text-slate-400">({c.productCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2.5">Price Range ($)</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-400 font-medium">Min</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
              min="0"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 font-medium">Max</label>
            <input
              type="number"
              placeholder="2000"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-800 mb-2.5">Brands</h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {availableBrands.map((brand) => {
              const checked = activeBrandList.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  <div
                    onClick={() => handleBrandToggle(brand)}
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      checked
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'border-slate-300 hover:border-brand-500'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{brand}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Rating */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2.5">Minimum Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => {
            const isSelected = Number(filters.rating) === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => onFilterChange('rating', isSelected ? '' : stars)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2.5">Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
          <input
            type="checkbox"
            checked={filters.inStock === 'true' || filters.inStock === true}
            onChange={(e) => onFilterChange('inStock', e.target.checked ? 'true' : '')}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Discount */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2.5">Discount</h4>
        <div className="flex flex-wrap gap-1.5">
          {[10, 20, 30, 50].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onFilterChange('minDiscount', Number(filters.minDiscount) === d ? '' : d)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                Number(filters.minDiscount) === d
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {d}%+
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobileModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <span className="font-bold text-lg text-slate-800">Filter Products</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6">
            <button
              onClick={onCloseMobile}
              className="w-full py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 sticky top-28">
      {content}
    </div>
  );
};

export default ProductFilter;
