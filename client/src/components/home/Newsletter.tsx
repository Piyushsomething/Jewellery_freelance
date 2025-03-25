import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Subscription successful!',
        description: 'Thank you for subscribing to our newsletter.',
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto px-6">
        <div className="bg-muted rounded-lg p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              Subscribe to Our <span className="text-primary">Newsletter</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Be the first to know about new collections, special offers, and exclusive events. 
              Sign up for our newsletter and get 10% off your first order.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow bg-background border border-border rounded-full py-3 px-6 focus-visible:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="gold-btn py-3 px-8 rounded-full font-medium whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
