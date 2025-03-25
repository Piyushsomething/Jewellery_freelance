import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { type CartItemWithProduct } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItemWithProduct[];
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  isLoading: boolean;
  sessionId: string;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Generate or get existing session ID
    let sid = localStorage.getItem('cart_session_id');
    if (!sid) {
      sid = 'cart_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('cart_session_id', sid);
    }
    setSessionId(sid);

    // Load cart data
    if (sid) {
      fetchCart(sid);
    }
  }, []);

  const fetchCart = async (sid: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart?sessionId=${sid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setItems(data.items);
      setTotal(data.total);
      setItemCount(data.itemCount);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your shopping cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/cart', {
        productId,
        quantity,
        sessionId
      });
      
      const data = await response.json();
      setItems(data.items);
      setTotal(data.total);
      setItemCount(data.itemCount);
      
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
      });
      
      openCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('PUT', `/api/cart/${cartItemId}`, { quantity });
      
      const data = await response.json();
      setItems(data.items);
      setTotal(data.total);
      setItemCount(data.itemCount);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('DELETE', `/api/cart/${cartItemId}`, undefined);
      
      const data = await response.json();
      setItems(data.items);
      setTotal(data.total);
      setItemCount(data.itemCount);
      
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('DELETE', `/api/cart?sessionId=${sessionId}`, undefined);
      
      const data = await response.json();
      setItems(data.items);
      setTotal(data.total);
      setItemCount(data.itemCount);
      
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      total,
      itemCount,
      isCartOpen,
      isLoading,
      sessionId,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
