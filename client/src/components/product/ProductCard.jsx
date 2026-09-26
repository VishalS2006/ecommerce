import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { DiscountBadge, StockBadge } from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  if (!product) return null;

  const isFavorited = isInWishlist(product._id);
  const hasDiscount = product.discount > 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setAddingToCart(true);
    await addToCart(product, 1);
    setAddingToCart(false);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image container */}
      <Link
        to={`/products/${product.slug || product._id}`}
        className="relative block aspect-square overflow-hidden bg-slate-50"
        onMouseEnter={() => product.images?.length > 1 && setImageIndex(1)}
        onMouseLeave={() => setImageIndex(0)}
      >
        <img
          src={product.images?.[imageIndex] || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && <DiscountBadge discount={product.discount} />}
          {product.isDealOfDay && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs uppercase tracking-wider">
              Deal
            </span>
          )}
          {product.isBestSeller && !hasDiscount && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-xs uppercase tracking-wider">
              Top Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-xs ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View hint */}
        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex justify-center z-10 pointer-events-none">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </span>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Brand & Stock */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {product.brand}
            </span>
            <StockBadge stock={product.stock} />
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.slug || product._id}`}
            className="text-sm font-bold text-slate-800 hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mt-2">
            <RatingStars
              rating={product.ratingsAverage}
              count={product.ratingsCount}
              size="xs"
            />
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                ${product.discountPrice || product.price}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.price}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-[11px] text-emerald-600 font-semibold">
                Save ${Math.round(product.price - product.discountPrice)}
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white active:scale-95 shadow-xs'
            }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
