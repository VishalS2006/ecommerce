import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut,
  Flame,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productService } from '../../services/productService';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCategoryDropdownOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  // Load categories and recent searches
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.warn('Failed to load categories for nav:', err);
      }
    };
    fetchCats();

    try {
      const saved = localStorage.getItem('shopsphere_recent_searches');
      if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
    } catch {}
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await productService.getSearchSuggestions(searchQuery);
        if (res.success) {
          setSuggestions(res.suggestions || []);
        }
      } catch (err) {
        console.warn('Suggestions error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const trimmed = searchQuery.trim();
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('shopsphere_recent_searches', JSON.stringify(updated));

    setShowSuggestions(false);
    navigate(`/products?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectRecent = (term) => {
    setSearchQuery(term);
    setShowSuggestions(false);
    navigate(`/products?keyword=${encodeURIComponent(term)}`);
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('shopsphere_recent_searches');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Offer: Free delivery on orders over $50</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Use code <strong className="text-white font-semibold">SAVE20</strong> for 20% off</span>
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <Link to="/products?deals=true" className="hover:text-white transition-colors">Daily Deals</Link>
            <Link to="/account" className="hover:text-white transition-colors">Order Tracking</Link>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                Shop<span className="text-brand-600">Sphere</span>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1 hidden sm:block">
                Shop Smart. Live Better.
              </div>
            </div>
          </Link>

          {/* Categories & Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180 text-brand-600' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[11px] font-bold uppercase text-slate-400 px-3 py-1.5">
                    Browse Categories
                  </div>
                  <div className="divide-y divide-slate-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/products?category=${cat.slug}`}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors"
                      >
                        <span>{cat.name}</span>
                        {cat.productCount > 0 && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
                            {cat.productCount}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/products"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/products' && !location.search.includes('deals') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Products
            </Link>

            <Link
              to="/products?sort=discount"
              className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              <Flame className="w-4 h-4 fill-rose-600" />
              <span>Deals</span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-11 pr-10 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm rounded-full border border-transparent focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-hidden transition-all duration-200 placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Suggestions & Recent Searches Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50">
                {/* Suggestions List */}
                {suggestions.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase text-slate-400 px-3 py-1 mb-1">
                      Matching Products
                    </div>
                    <div className="space-y-1">
                      {suggestions.map((item) => (
                        <Link
                          key={item._id}
                          to={`/products/${item.slug || item._id}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.brand} • <span className="font-semibold text-slate-700">${item.discountPrice}</span>
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {suggestions.length === 0 && recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-3 py-1 mb-1">
                      <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Recent Searches</span>
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-2">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectRecent(term)}
                          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-xs font-medium text-slate-600 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick categories hint */}
                {suggestions.length === 0 && recentSearches.length === 0 && (
                  <div className="p-4 text-center text-sm text-slate-400">
                    Type a keyword or brand to search products
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-brand-600 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-brand-600 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-semibold max-w-[100px] truncate hidden md:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/account"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>Orders & Tracking</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-sm shadow-brand-500/20 active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 xl:hidden transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 text-sm rounded-xl border-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-100 py-4 space-y-2 animate-in fade-in duration-200">
            <Link
              to="/"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              All Products
            </Link>
            <Link
              to="/products?sort=discount"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Hot Deals & Discounts
            </Link>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase px-3 mb-1">Categories</p>
              <div className="grid grid-cols-2 gap-1 px-1">
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    to={`/products?category=${c.slug}`}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-brand-600 bg-brand-50"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
