import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

type FilterType = 'new' | 'bestsellers' | 'featured';

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('featured');

  // Fetch products based on active filter
  const { data, isLoading } = useQuery({
    queryKey: [`/api/products?${activeFilter}=true&limit=4`],
  });

  const products = data?.products || [];

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4 md:mb-0">
            <span className="text-primary">Featured</span> Collection
          </h2>
          <div className="flex items-center space-x-4">
            <Button 
              variant={activeFilter === 'new' ? "outline" : "ghost"}
              onClick={() => handleFilterChange('new')}
              className={activeFilter === 'new' ? 'border-primary text-primary' : 'text-muted-foreground hover:text-primary hover:border-primary'}
            >
              New Arrivals
            </Button>
            <Button 
              variant={activeFilter === 'bestsellers' ? "outline" : "ghost"}
              onClick={() => handleFilterChange('bestsellers')}
              className={activeFilter === 'bestsellers' ? 'border-primary text-primary' : 'text-muted-foreground hover:text-primary hover:border-primary'}
            >
              Best Selling
            </Button>
            <Button 
              variant={activeFilter === 'featured' ? "outline" : "ghost"}
              onClick={() => handleFilterChange('featured')}
              className={activeFilter === 'featured' ? 'border-primary text-primary' : 'text-muted-foreground hover:text-primary hover:border-primary'}
            >
              Featured
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden h-[400px] animate-pulse"></div>
            ))
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/catalog" className="outline-gold-btn inline-block py-3 px-8 rounded-full font-medium">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
