import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Award,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import { ImageGallery } from '../components/product/ImageGallery';
import { RatingStars } from '../components/common/RatingStars';
import { StockBadge, DiscountBadge } from '../components/common/Badge';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { ProductCard } from '../components/product/ProductCard';
import { ProductDetailsSkeleton } from '../components/common/Skeleton';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { warning } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'specs', 'reviews'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductByIdOrSlug(identifier);
        if (res.success && res.product) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);

          // Initialize default variants
          const defaults = {};
          if (res.product.variants && res.product.variants.length > 0) {
            res.product.variants.forEach((v) => {
              if (v.options && v.options.length > 0) {
                defaults[v.name] = v.options[0];
              }
            });
          }
          setSelectedVariants(defaults);
          setQuantity(1);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [identifier]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          The product you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/products"
          className="inline-flex px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const hasDiscount = product.discount > 0;
  const isOutOfStock = product.stock <= 0;

  const handleVariantSelect = (variantName, option) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleQuantityChange = (delta) => {
    const nextQty = quantity + delta;
    if (nextQty >= 1 && nextQty <= product.stock) {
      setQuantity(nextQty);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      warning('This item is currently out of stock');
      return;
    }
    await addToCart(product, quantity, selectedVariants);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) {
      warning('This item is currently out of stock');
      return;
    }
    const success = await addToCart(product, quantity, selectedVariants);
    if (success) {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to="/products" className="hover:text-slate-700 transition-colors">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link
                to={`/products?category=${product.category.slug}`}
                className="hover:text-slate-700 transition-colors capitalize"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-700 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6">
            <ImageGallery images={product.images} />
          </div>

          {/* Right Column: Product Information & Purchase */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand and Stock status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                  {product.brand}
                </span>
                <StockBadge stock={product.stock} />
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* SKU & Ratings */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="text-slate-400">SKU: <strong className="text-slate-600">{product.sku}</strong></span>
                <span className="text-slate-300">|</span>
                <RatingStars
                  rating={product.ratingsAverage}
                  count={product.ratingsCount}
                  size="sm"
                />
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ${product.discountPrice || product.price}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      ${product.price}
                    </span>
                    <DiscountBadge discount={product.discount} />
                    <span className="text-xs font-bold text-emerald-600 ml-auto">
                      Save ${Math.round(product.price - product.discountPrice)}
                    </span>
                  </>
                )}
              </div>

              {/* Short description */}
              {product.shortDescription && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Variant Selectors (Size, Color, etc.) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  {product.variants.map((v) => (
                    <div key={v.name} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                        <span>Select {v.name}:</span>
                        <span className="text-brand-600 font-semibold">{selectedVariants[v.name]}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {v.options.map((opt) => {
                          const isSelected = selectedVariants[v.name] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleVariantSelect(v.name, opt)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                                isSelected
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="pt-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Quantity
                  </span>
                  <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                  <span>{isOutOfStock ? 'Currently Out of Stock' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Buy Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-rose-50/50'
                  }`}
                  title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Value Propositions */}
              <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                  <Truck className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                  <RefreshCw className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>30-day hassle-free returns</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                  <Award className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>100% Genuine Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                  <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>1-Year Official Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Section: Description, Specifications, Reviews */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
          {/* Tabs Navigation Header */}
          <div className="flex border-b border-slate-100 px-6 sm:px-8 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-4 font-bold text-sm border-b-2 transition-all ${
                activeTab === 'description'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Detailed Overview
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-4 font-bold text-sm border-b-2 transition-all ${
                activeTab === 'specs'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications ({product.specifications?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-4 font-bold text-sm border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({product.ratingsCount || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-10">
            {activeTab === 'description' && (
              <div className="max-w-3xl space-y-4">
                <h3 className="text-xl font-bold text-slate-900">About This Product</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Technical Specifications</h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex px-4 py-3 text-sm even:bg-slate-50">
                        <span className="w-1/3 font-semibold text-slate-500">{spec.key}</span>
                        <span className="w-2/3 font-medium text-slate-800">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No specifications provided for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewsSection
                productId={product._id}
                ratingsAverage={product.ratingsAverage}
                ratingsCount={product.ratingsCount}
              />
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Customers Also Viewed
              </h3>
              <Link
                to={`/products?category=${product.category?.slug}`}
                className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View More in {product.category?.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
