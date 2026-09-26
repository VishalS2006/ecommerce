import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-soft p-4 flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-square bg-slate-200 rounded-xl" />
      <div className="w-1/3 h-3 bg-slate-200 rounded mt-2" />
      <div className="w-4/5 h-4 bg-slate-200 rounded" />
      <div className="w-1/2 h-3 bg-slate-200 rounded" />
      <div className="flex items-center justify-between pt-2 mt-auto">
        <div className="w-1/3 h-5 bg-slate-200 rounded" />
        <div className="w-9 h-9 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full animate-pulse divide-y divide-slate-100">
      <div className="flex gap-4 py-3 bg-slate-50 px-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-4 px-4 items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-slate-100 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
      <div className="space-y-4">
        <div className="w-full aspect-square bg-slate-200 rounded-2xl" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-20 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="w-24 h-4 bg-slate-200 rounded" />
        <div className="w-3/4 h-8 bg-slate-200 rounded" />
        <div className="w-1/3 h-4 bg-slate-200 rounded" />
        <div className="w-1/4 h-8 bg-slate-200 rounded" />
        <div className="w-full h-24 bg-slate-100 rounded-xl" />
        <div className="w-1/2 h-10 bg-slate-200 rounded-xl" />
        <div className="flex gap-4 pt-4">
          <div className="flex-1 h-12 bg-slate-200 rounded-xl" />
          <div className="flex-1 h-12 bg-slate-300 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
