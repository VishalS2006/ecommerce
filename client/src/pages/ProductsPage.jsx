import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowLeft, ArrowRight, Search, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilter } from '../components/product/ProductFilter';
import { ProductSort } from '../components/product/ProductSort';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { productService } from '../services/productService';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract filters from searchParams
  const filters = {
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    inStock: searchParams.get('inStock') || '',
    minDiscount: searchParams.get('minDiscount') || '',
    sort: searchParams.get('sort') || '',
    page: searchParams.get('page') || '1'
  };

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.warn('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when filters/params change
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params[key] = val;
      });

      const res = await productService.getProducts(params);
      if (res.success) {
        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
        setAvailableBrands(res.availableBrands || []);
      }
    } catch (err) {
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  // Update query params
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
  };

  // Remove individual filter pill
  const removeFilter = (key) => {
    handleFilterChange(key, '');
  };

  const activeFilterEntries = Object.entries(filters).filter(
    ([k, v]) => v && k !== 'page' && k !== 'sort'
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {filters.keyword ? (
                <span>Search: &ldquo;{filters.keyword}&rdquo;</span>
              ) : filters.category ? (
                <span className="capitalize">{filters.category.replace('-', ' ')}</span>
              ) : (
                <span>All Products</span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {products.length} of {totalCount} verified items
            </p>
          </div>

          {/* Controls bar: Mobile Filter Button & Sorting */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>Filters {activeFilterEntries.length > 0 && `(${activeFilterEntries.length})`}</span>
            </button>

            <ProductSort
              value={filters.sort}
              onChange={(val) => handleFilterChange('sort', val)}
            />
          </div>
        </div>

        {/* Active Filter Pills Strip */}
        {activeFilterEntries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-slate-400">Active Filters:</span>
            {activeFilterEntries.map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold"
              >
                <span>{k === 'category' ? `Category: ${v}` : k === 'brand' ? `Brand: ${v}` : `${k}: ${v}`}</span>
                <button
                  type="button"
                  onClick={() => removeFilter(k)}
                  className="hover:text-brand-900 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold underline underline-offset-2 ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <ProductFilter
              categories={categories}
              availableBrands={availableBrands}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <ProductFilter
              categories={categories}
              availableBrands={availableBrands}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              isMobileModal={true}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          )}

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No products matched your criteria"
                description="Try relaxing your filters, checking for spelling errors, or browsing our full catalog."
                actionText="Reset All Filters"
                actionLink="/products"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, Number(filters.page) - 1))}
                  disabled={Number(filters.page) <= 1}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const p = idx + 1;
                  const isActive = Number(filters.page) === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, Number(filters.page) + 1))}
                  disabled={Number(filters.page) >= totalPages}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
