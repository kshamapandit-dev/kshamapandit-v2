"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { 
  CART_QUERY, 
  ADD_TO_CART_MUTATION, 
  UPDATE_CART_ITEM_MUTATION, 
  REMOVE_CART_ITEM_MUTATION 
} from '@/lib/graphql/queries';

interface CartItem {
  key: string;
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: { id: number; name: string; price: string; images: { src: string }[] }) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  removeFromCart: (key: string) => Promise<void>;
  cartCount: number;
  isLoading: boolean;
}

interface CartResponse {
  cart: {
    contents: {
      nodes: Array<{
        key: string;
        product: {
          node: {
            id: string;
            databaseId: number;
            name: string;
            price: string;
            image?: {
              sourceUrl: string;
              altText: string;
            };
          };
        };
        quantity: number;
        total: string;
      }>;
    };
    total: string;
    subtotal: string;
    shippingTotal: string;
    discountTotal: string;
  };
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  total: 0,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  cartCount: 0,
  isLoading: false
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const { cart } = await graphqlClient.request<CartResponse>(CART_QUERY);
      const items = cart.contents.nodes.map((node) => ({
        key: node.key,
        id: node.product.node.databaseId,
        name: node.product.node.name,
        price: parseFloat(node.product.node.price),
        quantity: node.quantity,
        image: node.product.node.image?.sourceUrl || "/placeholder.png"
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Initialize cart
  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate total whenever cartItems changes
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const addToCart = async (product: { id: number; name: string; price: string; images: { src: string }[] }) => {
    setIsLoading(true);
    try {
      await graphqlClient.request(ADD_TO_CART_MUTATION, {
        input: {
          productId: product.id,
          quantity: 1
        }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (key: string, quantity: number) => {
    setIsLoading(true);
    try {
      await graphqlClient.request(UPDATE_CART_ITEM_MUTATION, {
        input: {
          key,
          quantity: Math.max(1, quantity)
        }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (key: string) => {
    setIsLoading(true);
    try {
      await graphqlClient.request(REMOVE_CART_ITEM_MUTATION, {
        input: {
          key
        }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      items: cartItems, 
      total, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      cartCount,
      isLoading
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