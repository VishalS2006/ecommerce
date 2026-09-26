import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { DealsSection } from '../components/home/DealsSection';
import { PromoBanner } from '../components/home/PromoBanner';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { ProductCard } from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [catsRes, featRes, dealsRes] = await Promise.all([
          productService.getCategories(),
          productService.getFeaturedProducts(),
          productService.getDealsOfDay()
        ]);

        if (catsRes.success) setCategories(catsRes.categories || []);
        if (featRes.success) setFeaturedProducts(featRes.products || []);
        if (dealsRes.success) setDeals(dealsRes.products || []);
      } catch (err) {
        console.warn('Home page data error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Categories Grid */}
      <CategoryGrid categories={categories} />

      {/* 3. Deals Section with Countdown */}
      <DealsSection deals={deals} />

      {/* 4. Featured Products Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handpicked Selection</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 5. Promotional Banner */}
      <PromoBanner />

      {/* 6. Best Sellers Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Customer Favorites</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Best Selling Items
              </h2>
            </div>
            <Link
              to="/products?sort=bestseller"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
