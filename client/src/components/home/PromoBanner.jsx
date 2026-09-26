import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const PromoBanner = () => {
  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-14 shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Weekend Flash Spotlight</span>
            </span>

            <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Upgrade Your Workspace With Flagship Electronics
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Experience audiophile wireless sound, lightning-fast laptops, and premium titanium smartphones. Take an extra $20 off on orders over $100 with code <strong className="text-white font-bold underline">SAVE20</strong>.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/products?category=electronics"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-md active:scale-95"
              >
                <span>Shop Electronics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?category=laptops"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-colors"
              >
                <span>View Laptops</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
