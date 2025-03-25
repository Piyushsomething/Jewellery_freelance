import { useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useCartContext } from '@/lib/contexts/CartContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, ChevronLeft, CreditCard, ShoppingBag } from 'lucide-react';

// Form validation schema
const checkoutSchema = z.object({
  // Contact information
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  
  // Shipping information
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  zipCode: z.string().min(5, { message: 'ZIP code is required' }),
  country: z.string().min(2, { message: 'Country is required' }),
  
  // Payment information
  cardName: z.string().min(2, { message: 'Name on card is required' }),
  cardNumber: z.string().min(15, { message: 'Card number is required' }).max(19),
  expiryMonth: z.string().min(1, { message: 'Expiry month is required' }),
  expiryYear: z.string().min(4, { message: 'Expiry year is required' }),
  cvv: z.string().min(3, { message: 'CVV is required' }).max(4),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, total, clearCart } = useCartContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  
  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      cardName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    },
  });
  
  // Calculate order summary
  const subtotal = total;
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax rate
  const orderTotal = subtotal + shipping + tax;
  
  // Check if cart is empty
  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto bg-card rounded-lg p-8 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted mb-4" />
          <h2 className="text-xl font-medium text-foreground mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button 
            onClick={() => navigate('/catalog')}
            className="gold-btn py-3 px-8 rounded-full font-medium"
          >
            Browse Our Collection
          </Button>
        </div>
      </div>
    );
  }
  
  // Form submission handler
  const onSubmit = (data: CheckoutFormValues) => {
    if (currentStep === 'shipping') {
      setCurrentStep('payment');
      window.scrollTo(0, 0);
    } else if (currentStep === 'payment') {
      setIsSubmitting(true);
      
      // Simulate order processing
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentStep('confirmation');
        clearCart();
        window.scrollTo(0, 0);
      }, 1500);
    }
  };
  
  // Navigate back to shipping from payment
  const goBackToShipping = () => {
    setCurrentStep('shipping');
    window.scrollTo(0, 0);
  };
  
  return (
    <>
      <Helmet>
        <title>Checkout | Elegance Jewels</title>
        <meta name="description" content="Complete your purchase of luxury jewelry" />
      </Helmet>
      
      <div className="container mx-auto px-6 py-8">
        {currentStep === 'confirmation' ? (
          <div className="max-w-2xl mx-auto bg-card rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-playfair font-bold text-foreground mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>
            <div className="bg-muted p-4 rounded-md text-left mb-8">
              <p className="text-foreground font-medium">Order Summary</p>
              <p className="text-muted-foreground text-sm mt-2">
                Order #EJ-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
              </p>
              <p className="text-muted-foreground text-sm">
                Order Total: {formatCurrency(orderTotal)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')}
                className="outline-gold-btn py-3 px-8 rounded-full font-medium"
              >
                Return to Home
              </Button>
              <Button 
                onClick={() => navigate('/catalog')}
                className="gold-btn py-3 px-8 rounded-full font-medium"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
                Checkout
              </h1>
              
              {/* Checkout Steps */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === 'shipping' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'}`}>
                    1
                  </div>
                  <div className={`h-0.5 w-8 ${currentStep === 'shipping' ? 'bg-muted-foreground' : 'bg-primary'}`}></div>
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    2
                  </div>
                  <div className={`h-0.5 w-8 ${currentStep === 'confirmation' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === 'confirmation' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    3
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${currentStep === 'shipping' ? 'text-primary font-medium' : 'text-foreground'}`}>
                    Shipping
                  </span>
                  <span className={`text-sm ${currentStep === 'payment' ? 'text-primary font-medium' : 'text-foreground'}`}>
                    Payment
                  </span>
                  <span className={`text-sm ${currentStep === 'confirmation' ? 'text-primary font-medium' : 'text-foreground'}`}>
                    Confirmation
                  </span>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {currentStep === 'shipping' && (
                    <>
                      <div className="bg-card rounded-lg p-6">
                        <h2 className="text-xl font-medium text-foreground mb-6">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="your.email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="(123) 456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg p-6">
                        <h2 className="text-xl font-medium text-foreground mb-6">Shipping Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main St, Apt 4B" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="New York" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province</FormLabel>
                                <FormControl>
                                  <Input placeholder="NY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP/Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="Australia">Australia</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button"
                          variant="outline"
                          className="flex items-center text-muted-foreground hover:text-primary"
                          onClick={() => navigate('/cart')}
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Back to Cart
                        </Button>
                        <Button 
                          type="submit"
                          className="gold-btn py-3 px-8 rounded-full font-medium"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {currentStep === 'payment' && (
                    <>
                      <div className="bg-card rounded-lg p-6">
                        <h2 className="text-xl font-medium text-foreground mb-6">Payment Method</h2>
                        <div className="mb-6">
                          <div className="flex items-center p-4 bg-muted rounded-lg">
                            <CreditCard className="h-5 w-5 text-primary mr-3" />
                            <span className="text-foreground font-medium">Credit Card</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="1234 5678 9012 3456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="expiryMonth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Month</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                      <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                        {(i + 1).toString().padStart(2, '0')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="expiryYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Year</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="YYYY" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => {
                                      const year = new Date().getFullYear() + i;
                                      return (
                                        <SelectItem key={year} value={year.toString()}>
                                          {year}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" maxLength={4} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button"
                          variant="outline"
                          className="flex items-center text-muted-foreground hover:text-primary"
                          onClick={goBackToShipping}
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Back to Shipping
                        </Button>
                        <Button 
                          type="submit"
                          className="gold-btn py-3 px-8 rounded-full font-medium"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Complete Order"}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-medium text-foreground mb-6">Order Summary</h2>
                
                <Accordion type="single" collapsible defaultValue="items">
                  <AccordionItem value="items" className="border-border">
                    <AccordionTrigger className="py-2">
                      <span className="font-medium">Items ({items.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 mt-2">
                        {items.map(item => (
                          <div key={item.id} className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-16 w-16 bg-background rounded overflow-hidden">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="h-full w-full object-cover" 
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-foreground font-medium truncate">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-sm text-primary">
                                {formatCurrency((item.product.discountPrice || item.product.price) * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping > 0 ? formatCurrency(shipping) : 'Free'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="text-foreground">{formatCurrency(tax)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatCurrency(orderTotal)}</span>
                  </div>
                </div>
                
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
