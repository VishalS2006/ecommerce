import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      {/* Top Value Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-brand-400 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Express Delivery</h4>
            <p className="text-xs text-slate-400">Free shipping on orders over $50</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Secure Checkout</h4>
            <p className="text-xs text-slate-400">256-bit encrypted transactions</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">30-Day Free Returns</h4>
            <p className="text-xs text-slate-400">No questions asked policy</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-purple-400 flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">24/7 Dedicated Care</h4>
            <p className="text-xs text-slate-400">Live chat & phone support</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Shop<span className="text-brand-400">Sphere</span>
            </span>
          </Link>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            Shop Smart. Live Better. Your premier destination for handpicked electronics, premium fashion, home essentials, and modern accessories with guaranteed authenticity and lightning-fast delivery.
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <span>742 Commerce Blvd, Suite 500, New York, NY 10001</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-400 shrink-0" />
              <span>+1 (800) 555-SHOP (7467)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-400 shrink-0" />
              <span>support@shopsphere.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Categories</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/products?category=electronics" className="hover:text-white transition-colors">Electronics & Audio</Link></li>
            <li><Link to="/products?category=mobiles" className="hover:text-white transition-colors">Smartphones & 5G</Link></li>
            <li><Link to="/products?category=laptops" className="hover:text-white transition-colors">Laptops & Workstations</Link></li>
            <li><Link to="/products?category=fashion" className="hover:text-white transition-colors">Fashion & Apparel</Link></li>
            <li><Link to="/products?category=footwear" className="hover:text-white transition-colors">Sneakers & Footwear</Link></li>
            <li><Link to="/products?category=home-kitchen" className="hover:text-white transition-colors">Home & Kitchen</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Shipping & Delivery</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Returns & Refunds</span></li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Policy & Trust</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Security Safeguards</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Cookie Preferences</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Affiliate Program</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} ShopSphere Inc. All rights reserved. Built with modern full-stack excellence.
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Safe & Secure Payments</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-300">VISA</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-300">Mastercard</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-300">UPI</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-300">COD</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
