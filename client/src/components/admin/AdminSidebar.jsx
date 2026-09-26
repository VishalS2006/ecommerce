import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  ExternalLink,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/coupons', label: 'Coupons & Promos', icon: Ticket }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-lg text-white tracking-tight leading-none">
              Shop<span className="text-brand-400">Sphere</span>
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400">Admin Control</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-1">
        <div className="text-[11px] font-bold uppercase text-slate-500 px-3 mb-2 tracking-wider">
          Store Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-6">
          <div className="text-[11px] font-bold uppercase text-slate-500 px-3 mb-2 tracking-wider">
            Quick Actions
          </div>
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4" />
              <span>View Live Store</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">Client</span>
          </Link>
        </div>
      </div>

      {/* Admin User Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-800/60 rounded-xl mb-3">
          <div className="w-9 h-9 rounded-full bg-brand-600/30 text-brand-400 font-black text-sm flex items-center justify-center shrink-0">
            A
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
