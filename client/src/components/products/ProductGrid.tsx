import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductGridProps {
  categoryId?: number;
  subcategoryId?: number;
  searchQuery?: string;
  filters?: Record<string, string | number | boolean>;
}

export default function ProductGrid({ categoryId, subcategoryId, searchQuery, filters = {} }: ProductGridProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortBy, setSortBy] = useState('featured');
  
  // Construct API query parameters
  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.append('categoryId', categoryId.toString());
  if (subcategoryId) queryParams.append('subcategoryId', subcategoryId.toString());
  if (searchQuery) queryParams.append('search', searchQuery);
  
  // Add sorting
  if (sortBy === 'price-asc') queryParams.append('sort', 'price-asc');
  if (sortBy === 'price-desc') queryParams.append('sort', 'price-desc');
  if (sortBy === 'newest') queryParams.append('sort', 'newest');
  if (sortBy === 'rating') queryParams.append('sort', 'rating');
  
  // Add pagination
  queryParams.append('page', page.toString());
  queryParams.append('limit', pageSize.toString());
  
  // Add other filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '')
      queryParams.append(key, value.toString());
  });
  
  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: [`/api/products?${queryParams.toString()}`],
  });
  
  const products = data?.products || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 };
  
  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };
  
  const handleNextPage = () => {
    if (page < pagination.totalPages) setPage(page + 1);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  return (
    <div>
      {/* Desktop Sorting and Count */}
      <div className="hidden lg:flex justify-between items-center mb-6">
        <p className="text-foreground">
          Showing <span className="text-primary">{(page - 1) * pageSize + 1}-{Math.min(page * pageSize, pagination.total)}</span> of <span className="text-primary">{pagination.total}</span> products
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Sort By:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="bg-card border border-border rounded-md py-1 px-2 text-foreground text-sm focus:outline-none focus:border-primary w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Best Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Sort By:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="bg-card border border-border rounded-md py-1 px-2 text-foreground text-sm focus:outline-none focus:border-primary w-[140px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Best Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden h-[400px] animate-pulse"></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-foreground mb-4">No products found</p>
          <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="flex items-center rounded-md shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="rounded-l-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {[...Array(pagination.totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
                className={`border border-border ${
                  page === i + 1 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-foreground hover:bg-muted'
                }`}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page === pagination.totalPages}
              className="rounded-r-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
