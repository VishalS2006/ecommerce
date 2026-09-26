import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success, warning } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      warning('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    success('Thank you for subscribing! Your 10% coupon code: WELCOME10');
  };

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center max-w-4xl mx-auto shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Join the ShopSphere Insider Circle
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Get first access to limited product drops, secret flash sales, and receive a 10% coupon code for your next order.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 p-3.5 bg-emerald-950/80 border border-emerald-700/60 rounded-2xl text-emerald-200 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>You are subscribed! Use coupon code <strong className="text-white">WELCOME10</strong> at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-500 mt-4">
            We value your privacy. Unsubscribe at any time with one click.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
