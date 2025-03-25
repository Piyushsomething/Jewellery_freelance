import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useCartContext } from '@/lib/contexts/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

export default function Cart() {
  const [, navigate] = useLocation();
  const { 
    items, 
    total, 
    isLoading, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCartContext();
  
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
      <Helmet>
        <title>Shopping Cart | Elegance Jewels</title>
        <meta name="description" content="View your shopping cart and proceed to checkout" />
      </Helmet>
      
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
          Shopping Cart
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-card rounded-lg p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any jewelry to your cart yet.
            </p>
            <Button 
              onClick={() => navigate('/catalog')}
              className="gold-btn py-3 px-8 rounded-full font-medium"
            >
              Browse Our Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium text-foreground">
                      Cart Items ({items.length})
                    </h2>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={clearCart}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Cart
                    </Button>
                  </div>
                </div>
                
                <div className="divide-y divide-border">
                  {items.map(item => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start gap-4">
                      <Link href={`/product/${item.product.slug}`} className="flex-shrink-0 h-24 w-24 bg-background rounded overflow-hidden">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="h-full w-full object-cover" 
                        />
                      </Link>
                      <div className="flex-grow min-w-0">
                        <Link href={`/product/${item.product.slug}`} className="font-medium text-foreground hover:text-primary transition-colors">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.product.metal && `${item.product.metal}`}
                          {item.product.metal && item.product.gemstone && ' • '}
                          {item.product.gemstone && `${item.product.gemstone}`}
                        </p>
                        <div className="mt-3 flex flex-wrap justify-between gap-4">
                          <div className="flex items-center space-x-1 border border-border rounded-md">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-none" 
                              onClick={() => handleDecrement(item.id, item.quantity)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm">{item.quantity}</span>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-none" 
                              onClick={() => handleIncrement(item.id, item.quantity)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div>
                            <span className="font-medium text-primary">
                              {formatCurrency((item.product.discountPrice || item.product.price) * item.quantity)}
                            </span>
                            {item.product.discountPrice && (
                              <span className="text-sm line-through text-muted-foreground ml-2">
                                {formatCurrency(item.product.price * item.quantity)}
                              </span>
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
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline"
                  className="flex items-center text-muted-foreground hover:text-primary"
                  onClick={() => navigate('/catalog')}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-medium text-foreground mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatCurrency(total)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">Calculated at checkout</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">Calculated at checkout</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">Estimated Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full gold-btn mt-6 py-3 rounded-full font-medium"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="mt-6 text-sm text-muted-foreground">
                  <p className="mb-2">We accept:</p>
                  <div className="flex items-center space-x-4">
                    <img src="https://via.placeholder.com/40x25?text=Visa" alt="Visa" className="h-6" />
                    <img src="https://via.placeholder.com/40x25?text=MC" alt="Mastercard" className="h-6" />
                    <img src="https://via.placeholder.com/40x25?text=Amex" alt="American Express" className="h-6" />
                    <img src="https://via.placeholder.com/40x25?text=PP" alt="PayPal" className="h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
