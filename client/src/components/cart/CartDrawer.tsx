import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartContext } from '@/lib/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

export default function CartDrawer() {
  const { 
    items, 
    total, 
    isCartOpen, 
    closeCart, 
    isLoading,
    updateQuantity,
    removeItem,
    clearCart
  } = useCartContext();
  
  // Reference for the drawer
  const cartRef = useRef<HTMLDivElement>(null);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling of body when cart is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeCart]);

  // Handle increment/decrement quantity
  const handleIncrement = (itemId: number, currentQty: number) => {
    updateQuantity(itemId, currentQty + 1);
  };

  const handleDecrement = (itemId: number, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(itemId, currentQty - 1);
    } else {
      removeItem(itemId);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Cart Drawer */}
      <div 
        ref={cartRef}
        className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-card shadow-lg z-50 transition-transform"
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-xl font-playfair text-foreground">
              Your Cart ({items.length})
            </h3>
            <Button variant="ghost" size="icon" onClick={closeCart} className="text-muted-foreground hover:text-primary">
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex-grow p-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-muted mx-auto mb-4" />
                  <p className="text-muted-foreground mb-6">Your cart is empty</p>
                  <Button onClick={closeCart} className="gold-btn py-2 px-6 rounded-full font-medium">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map(item => (
                    <div key={item.id} className="flex items-start space-x-4">
                      <Link href={`/product/${item.product.slug}`} className="flex-shrink-0 h-20 w-20 bg-background rounded overflow-hidden">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="h-full w-full object-cover" 
                        />
                      </Link>
                      <div className="flex-grow min-w-0">
                        <Link href={`/product/${item.product.slug}`} className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.product.metal && `${item.product.metal}`}
                          {item.product.metal && item.product.gemstone && ' • '}
                          {item.product.gemstone && `${item.product.gemstone}`}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1 border border-border rounded-md">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-7 w-7 rounded-none" 
                              onClick={() => handleDecrement(item.id, item.quantity)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-7 w-7 rounded-none" 
                              onClick={() => handleIncrement(item.id, item.quantity)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-primary">
                              {formatCurrency((item.product.discountPrice || item.product.price) * item.quantity)}
                            </p>
                            {item.product.discountPrice && (
                              <p className="text-xs line-through text-muted-foreground">
                                {formatCurrency(item.product.price * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {items.length > 0 && (
            <div className="p-6 border-t border-border">
              <div className="space-y-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="text-foreground font-medium">{formatCurrency(total)}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">Shipping and taxes calculated at checkout</p>
                
                <Link href="/checkout" className="block w-full">
                  <Button 
                    className="w-full gold-btn py-3 rounded-full font-medium mb-3"
                    disabled={items.length === 0 || isLoading}
                  >
                    Checkout
                  </Button>
                </Link>
                
                <Button 
                  variant="outline"
                  className="w-full border-border text-muted-foreground hover:border-primary hover:text-primary py-3 rounded-full font-medium"
                  onClick={closeCart}
                >
                  Continue Shopping
                </Button>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-destructive"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
