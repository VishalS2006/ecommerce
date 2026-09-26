import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Eye, EyeOff, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login } = useAuth();
  const { warning } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      warning('Please enter both email and password');
      return;
    }

    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  const fillCustomerDemo = () => {
    setEmail('customer@shopsphere.com');
    setPassword('Customer@123456');
  };

  const fillAdminDemo = () => {
    setEmail('admin@shopsphere.com');
    setPassword('Admin@123456');
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome to ShopSphere
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sign in to access your orders, wishlist, and exclusive member discounts.
          </p>
        </div>

        {/* 1-Click Demo Buttons for Fast Evaluation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Instant 1-Click Demo Fill
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillCustomerDemo}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{' '}
            <Link
              to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-brand-600 font-bold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
