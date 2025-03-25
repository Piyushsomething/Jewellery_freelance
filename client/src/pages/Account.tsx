import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const guestLoginSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type GuestLoginFormValues = z.infer<typeof guestLoginSchema>;

export default function Account() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const guestForm = useForm<GuestLoginFormValues>({
    resolver: zodResolver(guestLoginSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function onLoginSubmit(data: LoginFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Login feature not available",
        description: "This feature is not available in the demo version.",
      });
      setIsSubmitting(false);
    }, 1500);
  }

  function onGuestSubmit(data: GuestLoginFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Guest Checkout",
        description: "You can now proceed with checkout as a guest.",
      });
      navigate('/checkout');
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <>
      <Helmet>
        <title>My Account | Elegance Jewels</title>
        <meta name="description" content="Sign in to your Elegance Jewels account or proceed as a guest." />
      </Helmet>
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-playfair font-bold text-center mb-8">My Account</h1>
          
          <Tabs defaultValue="guest" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="guest">Guest Checkout</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <div className="bg-card p-8 rounded-lg">
                <h2 className="text-xl font-medium mb-6">Sign In to Your Account</h2>
                
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Your password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between items-center pt-2">
                      <a href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                      <Button 
                        type="submit" 
                        className="gold-btn py-2 px-8 rounded-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing In...
                          </>
                        ) : "Sign In"}
                      </Button>
                    </div>
                  </form>
                </Form>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-center text-muted-foreground mb-4">
                    Don't have an account?
                  </p>
                  <Button 
                    variant="outline" 
                    className="outline-gold-btn w-full py-2 rounded-full"
                    onClick={() => toast({
                      title: "Registration feature unavailable",
                      description: "This feature is not available in the demo version."
                    })}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="guest">
              <div className="bg-card p-8 rounded-lg">
                <h2 className="text-xl font-medium mb-6">Continue as Guest</h2>
                <p className="text-muted-foreground mb-6">
                  You can continue shopping without creating an account. Just provide your name and email to proceed with checkout.
                </p>
                
                <Form {...guestForm}>
                  <form onSubmit={guestForm.handleSubmit(onGuestSubmit)} className="space-y-4">
                    <FormField
                      control={guestForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={guestForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="gold-btn w-full py-2 rounded-full mt-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : "Continue as Guest"}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}