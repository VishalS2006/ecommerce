import React from 'react';
import { Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminHeader = ({ title = 'Dashboard Overview', subtitle = 'Welcome to ShopSphere management portal' }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Super Admin Active</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
