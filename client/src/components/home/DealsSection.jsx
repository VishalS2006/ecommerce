import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

export const DealsSection = ({ deals = [] }) => {
  // Countdown timer for midnight end of day
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!deals || deals.length === 0) return null;

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with countdown */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-rose-600" />
              <span>Limited Time Promotions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Deals of the Day
            </h2>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Ends In:</span>
            </span>
            <div className="flex items-center gap-1.5 text-slate-900">
              <div className="px-3 py-2 bg-slate-900 text-white rounded-xl font-mono font-bold text-sm shadow-xs">
                {String(timeLeft.hours).padStart(2, '0')}h
              </div>
              <span className="font-bold text-slate-400">:</span>
              <div className="px-3 py-2 bg-slate-900 text-white rounded-xl font-mono font-bold text-sm shadow-xs">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </div>
              <span className="font-bold text-slate-400">:</span>
              <div className="px-3 py-2 bg-rose-600 text-white rounded-xl font-mono font-bold text-sm shadow-xs">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>
        </div>

        {/* Deals Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/products?sort=discount"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors active:scale-95"
          >
            <span>View All Discounted Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
