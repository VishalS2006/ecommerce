import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { success, error, warning } = useToast();

  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0
  });
  const [loading, setLoading] = useState(false);

  // Load cart when auth status changes
  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartService.getCart();
        if (res.success && res.cart) {
          setCart(res.cart);
        }
      } catch (err) {
        console.error('Failed to load user cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Load guest cart from localStorage
      try {
        const local = localStorage.getItem('shopsphere_guest_cart');
        if (local) {
          const parsed = JSON.parse(local);
          setCart(parsed);
        } else {
          setCart({ items: [], totalItems: 0, subtotal: 0 });
        }
      } catch {
        setCart({ items: [], totalItems: 0, subtotal: 0 });
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Save guest cart to localStorage
  const saveGuestCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('shopsphere_guest_cart', JSON.stringify(newCart));
  };

  const addToCart = async (product, quantity = 1, selectedVariants = {}) => {
    if (!product || product.stock <= 0) {
      warning('This product is out of stock.');
      return false;
    }

    if (isAuthenticated) {
      try {
        const res = await cartService.addToCart(product._id, quantity, selectedVariants);
        if (res.success) {
          setCart(res.cart);
          success(`Added "${product.name.slice(0, 24)}..." to cart!`);
          return true;
        }
      } catch (err) {
        error(err.customMessage || 'Failed to add item to cart');
        return false;
      }
    } else {
      // Guest cart logic
      const currentItems = [...cart.items];
      const existingIdx = currentItems.findIndex((item) => {
        if (item.product._id !== product._id) return false;
        return JSON.stringify(item.selectedVariants || {}) === JSON.stringify(selectedVariants || {});
      });

      const parsedQty = Math.max(1, parseInt(quantity, 10));

      if (existingIdx > -1) {
        const newQty = currentItems[existingIdx].quantity + parsedQty;
        if (newQty > product.stock) {
          warning(`Cannot add more. Maximum available stock is ${product.stock}.`);
          return false;
        }
        currentItems[existingIdx].quantity = newQty;
        currentItems[existingIdx].itemSubtotal = (product.discountPrice || product.price) * newQty;
      } else {
        if (parsedQty > product.stock) {
          warning(`Only ${product.stock} items available.`);
          return false;
        }
        currentItems.push({
          _id: 'guest_' + Date.now() + Math.random().toString(36).substring(2, 5),
          product: {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            images: product.images,
            brand: product.brand,
            price: product.price,
            discount: product.discount,
            discountPrice: product.discountPrice || product.price,
            stock: product.stock
          },
          quantity: parsedQty,
          selectedVariants,
          itemSubtotal: (product.discountPrice || product.price) * parsedQty
        });
      }

      let subtotal = 0;
      let totalItems = 0;
      currentItems.forEach((i) => {
        subtotal += i.itemSubtotal;
        totalItems += i.quantity;
      });

      const newCart = {
        items: currentItems,
        totalItems,
        subtotal: Math.round(subtotal * 100) / 100
      };

      saveGuestCart(newCart);
      success(`Added "${product.name.slice(0, 24)}..." to cart!`);
      return true;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.updateCartItem(itemId, quantity);
        if (res.success) {
          setCart(res.cart);
        }
      } catch (err) {
        error(err.customMessage || 'Failed to update quantity');
      }
    } else {
      let currentItems = [...cart.items];
      if (quantity <= 0) {
        currentItems = currentItems.filter((i) => i._id !== itemId);
      } else {
        const item = currentItems.find((i) => i._id === itemId);
        if (item) {
          if (quantity > item.product.stock) {
            warning(`Only ${item.product.stock} units available.`);
            return;
          }
          item.quantity = quantity;
          item.itemSubtotal = (item.product.discountPrice || item.product.price) * quantity;
        }
      }

      let subtotal = 0;
      let totalItems = 0;
      currentItems.forEach((i) => {
        subtotal += i.itemSubtotal;
        totalItems += i.quantity;
      });

      const newCart = {
        items: currentItems,
        totalItems,
        subtotal: Math.round(subtotal * 100) / 100
      };

      saveGuestCart(newCart);
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.removeFromCart(itemId);
        if (res.success) {
          setCart(res.cart);
          success('Item removed from cart');
        }
      } catch (err) {
        error(err.customMessage || 'Failed to remove item');
      }
    } else {
      const currentItems = cart.items.filter((i) => i._id !== itemId);
      let subtotal = 0;
      let totalItems = 0;
      currentItems.forEach((i) => {
        subtotal += i.itemSubtotal;
        totalItems += i.quantity;
      });

      const newCart = {
        items: currentItems,
        totalItems,
        subtotal: Math.round(subtotal * 100) / 100
      };

      saveGuestCart(newCart);
      success('Item removed from cart');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setCart({ items: [], totalItems: 0, subtotal: 0 });
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      const empty = { items: [], totalItems: 0, subtotal: 0 };
      saveGuestCart(empty);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItems: cart?.totalItems || 0,
        subtotal: cart?.subtotal || 0,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
