"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: { id: number; name: string; price: string; images: { src: string }[] }) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  cartCount: number;
}

const CART_STORAGE_KEY = 'kp-cart-items';

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  total: 0,
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  cartCount: 0
});

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = getStoredCart();
    setCartItems(storedCart);
    setIsInitialized(true);
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems, isInitialized]);

  // Calculate total whenever cartItems changes
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (product: { id: number; name: string; price: string; images: { src: string }[] }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images[0]?.src || "/placeholder.png",
        quantity: 1
      }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ 
      items: cartItems, 
      total, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 