import React from 'react';
import { Link } from 'react-router-dom';
import {
  Headphones,
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Home,
  Sparkles,
  Watch,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Headphones: Headphones,
  Smartphone: Smartphone,
  Laptop: Laptop,
  Shirt: Shirt,
  Footprints: Footprints,
  Home: Home,
  Sparkles: Sparkles,
  Watch: Watch
};

export const CategoryGrid = ({ categories = [] }) => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Shop by Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || ShoppingBag;

            return (
              <Link
                key={category._id}
                to={`/products?category=${category.slug}`}
                className="group relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-soft hover:shadow-card transition-all duration-300 p-5 flex flex-col justify-between aspect-4/3"
              >
                {/* Background image preview with soft gradient overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-20 group-hover:opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                </div>

                {/* Top icon and product count */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  {category.productCount > 0 && (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {category.productCount} Items
                    </span>
                  )}
                </div>

                {/* Bottom text */}
                <div className="relative z-10 pt-4">
                  <h3 className="font-extrabold text-slate-800 text-base sm:text-lg group-hover:text-brand-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {category.description || 'Explore products'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
