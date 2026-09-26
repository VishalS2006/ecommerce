import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { RatingStars } from '../components/common/RatingStars';
import { StockBadge, DiscountBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    const success = await addToCart(product, 1);
    if (success) {
      await toggleWishlist(product);
    }
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="bg-slate-50 min-h-[70vh] py-16 flex items-center justify-center">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save your favorite pieces here to easily track pricing and add them to your cart later."
          actionText="Discover Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item;
            if (!product || !product.name) return null;

            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product._id}
                className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden flex flex-col justify-between p-4 group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      {product.discount > 0 && <DiscountBadge discount={product.discount} />}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-white shadow-xs"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {product.brand}
                    </span>
                    <Link
                      to={`/products/${product.slug || product._id}`}
                      className="block text-sm font-bold text-slate-800 hover:text-brand-600 line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    <RatingStars
                      rating={product.ratingsAverage}
                      count={product.ratingsCount}
                      size="xs"
                    />
                  </div>
                </div>

                {/* Price and Add to cart */}
                <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-slate-900">
                      ${product.discountPrice || product.price}
                    </span>
                    <StockBadge stock={product.stock} />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMoveToCart(product)}
                    disabled={isOutOfStock}
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Move to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
