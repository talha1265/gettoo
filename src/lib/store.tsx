'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, CustomEmbroiderySpec, UserProfile } from './types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AtelierContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number, customEmbroidery?: CustomEmbroiderySpec) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // User session
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  loginDemoUser: (role?: 'CUSTOMER' | 'ADMIN') => void;
  logoutUser: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const defaultUser: UserProfile = {
  id: 'usr-1',
  name: 'Talha Al-Khatib',
  email: 'talha@gettoo.atelier',
  phone: '+91 98765 01234',
  role: 'CUSTOMER',
  addresses: [
    {
      fullName: 'Talha Al-Khatib',
      phone: '+91 98765 01234',
      email: 'talha@gettoo.atelier',
      street: '42 Rue de l’Atelier, Heritage Enclave',
      landmark: 'Near Silk Mills',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    }
  ],
  savedDesigns: []
};

const AtelierContext = createContext<AtelierContextType | undefined>(undefined);

export function AtelierProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(defaultUser);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('gettoo_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('gettoo_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedUser = localStorage.getItem('gettoo_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error('Error loading local storage state', e);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('gettoo_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('gettoo_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('gettoo_user', JSON.stringify(user));
      }
    } catch (e) {
      console.error('Error saving user', e);
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: Product,
    variant: ProductVariant,
    quantity: number = 1,
    customEmbroidery?: CustomEmbroiderySpec
  ) => {
    const basePrice = product.salePrice || product.basePrice;
    const customFee = customEmbroidery ? customEmbroidery.customCharge : 0;
    const unitPrice = basePrice + customFee;

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: product.id,
      product,
      variant,
      quantity,
      customEmbroidery,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCart((prev) => [...prev, newItem]);
    setIsCartOpen(true);
    showToast(`Added "${product.name}" (${variant.size}) to your atelier bag`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from your bag', 'info');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from your wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to your wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const loginDemoUser = (role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER') => {
    if (role === 'ADMIN') {
      setUser({
        id: 'adm-1',
        name: 'Atelier Lead Admin',
        email: 'admin@gettoo.atelier',
        phone: '+91 99999 88888',
        role: 'ADMIN',
        addresses: [],
        savedDesigns: [],
      });
      showToast('Switched to Atelier Admin profile', 'info');
    } else {
      setUser(defaultUser);
      showToast('Logged in as Talha (Customer)', 'info');
    }
  };

  const logoutUser = () => {
    setUser(null);
    showToast('You have signed out', 'info');
  };

  return (
    <AtelierContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        user,
        setUser,
        loginDemoUser,
        logoutUser,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AtelierContext.Provider>
  );
}

export function useAtelier() {
  const context = useContext(AtelierContext);
  if (!context) {
    throw new Error('useAtelier must be used within an AtelierProvider');
  }
  return context;
}
