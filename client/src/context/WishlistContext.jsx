import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { success, error, info } = useToast();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await wishlistService.getWishlist();
        if (res.success && res.wishlist) {
          setWishlist(res.wishlist);
        }
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const local = localStorage.getItem('shopsphere_guest_wishlist');
        setWishlist(local ? JSON.parse(local) : []);
      } catch {
        setWishlist([]);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id === productId || item === productId));
  };

  const toggleWishlist = async (product) => {
    const productId = typeof product === 'string' ? product : product._id;

    if (isAuthenticated) {
      try {
        const res = await wishlistService.toggleWishlist(productId);
        if (res.success) {
          if (res.added) {
            setWishlist((prev) => [...prev, typeof product === 'object' ? product : { _id: productId }]);
            success('Added to wishlist');
          } else {
            setWishlist((prev) => prev.filter((p) => (p._id || p) !== productId));
            info('Removed from wishlist');
          }
          return res.added;
        }
      } catch (err) {
        error(err.customMessage || 'Failed to update wishlist');
      }
    } else {
      const exists = isInWishlist(productId);
      let updated;
      if (exists) {
        updated = wishlist.filter((p) => (p._id || p) !== productId);
        info('Removed from wishlist');
      } else {
        updated = [...wishlist, typeof product === 'object' ? product : { _id: productId }];
        success('Added to wishlist');
      }
      setWishlist(updated);
      localStorage.setItem('shopsphere_guest_wishlist', JSON.stringify(updated));
      return !exists;
    }
  };

  const moveToCartAction = async (product) => {
    const successAdd = await addToCart(product, 1);
    if (successAdd) {
      await toggleWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        moveToCart: moveToCartAction,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
