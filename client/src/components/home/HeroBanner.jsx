import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Sparkles, TrendingUp } from 'lucide-react';

export const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white py-16 sm:py-24">
      {/* Decorative gradient glow background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-brand-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ShopSphere Fall Collection 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-white">Up to 30% Off</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Shop Smart. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-indigo-200 to-amber-200">
                Live Better.
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover curated luxury electronics, runway-inspired apparel, and smart home essentials designed for elevated everyday living.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all shadow-lg shadow-brand-500/30 active:scale-95 group"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?sort=discount"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm transition-all backdrop-blur-md"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Today's Flash Deals</span>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-black text-white">50k+</p>
                <p className="text-xs text-slate-400 font-medium">Orders Fulfilled</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-400">4.9★</p>
                <p className="text-xs text-slate-400 font-medium">Customer Rating</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">100%</p>
                <p className="text-xs text-slate-400 font-medium">Authentic Products</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Main featured image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 aspect-4/5 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="AcousticPro Studio Headphones"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Floating bottom label */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/15">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-brand-300 font-bold uppercase tracking-wider">Editor's Pick</span>
                      <h4 className="text-white font-bold text-sm sm:text-base">AcousticPro Studio Wireless</h4>
                    </div>
                    <span className="text-amber-400 font-black text-base">$296</span>
                  </div>
                </div>
              </div>

              {/* Floating secondary badge */}
              <div className="absolute -top-4 -left-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 shadow-xl border border-white hidden sm:flex items-center gap-3 animate-bounce">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Trending Now</p>
                  <p className="text-sm font-black text-slate-900">Electronics & Audio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
