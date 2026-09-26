import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { register } = useAuth();
  const { warning } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      warning('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      warning('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      warning('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      password,
      confirmPassword
    });
    setLoading(false);

    if (res.success) {
      navigate(redirect);
    }
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
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Join ShopSphere to enjoy member deals, order tracking, and instant checkout.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+1 (555) 014-9821"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-brand-600 font-bold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
