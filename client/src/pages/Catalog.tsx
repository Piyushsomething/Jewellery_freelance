import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Catalog() {
  const [location] = useLocation();
  const params = useParams<{ categorySlug?: string }>();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Initialize search params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, [location]);
  
  // Get search query from URL
  const searchQuery = searchParams?.get('search') || '';
  
  // Get subcategory from URL
  const subcategorySlug = searchParams?.get('subcategory') || '';
  
  // Fetch category data if categorySlug is provided
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['/api/categories'],
    enabled: !!params.categorySlug,
  });
  
  // Find the category
  const category = categoryData?.find(cat => cat.slug === params.categorySlug);
  
  // Fetch subcategories if we have a category
  const { data: subcategoriesData, isLoading: isSubcategoriesLoading } = useQuery({
    queryKey: ['/api/subcategories', category?.id],
    enabled: !!category?.id,
  });
  
  // Find the subcategory
  const subcategory = subcategoriesData?.find(subcat => subcat.slug === subcategorySlug);
  
  // Set title based on available data
  let pageTitle = 'All Jewelry';
  let pageDescription = 'Browse our complete collection of luxury jewelry pieces.';
  
  if (searchQuery) {
    pageTitle = `Search Results: ${searchQuery}`;
    pageDescription = `Jewelry items matching your search for "${searchQuery}"`;
  } else if (subcategory) {
    pageTitle = subcategory.name;
    pageDescription = `Explore our ${subcategory.name.toLowerCase()} collection`;
  } else if (category) {
    pageTitle = category.name;
    pageDescription = `Discover our luxury ${category.name.toLowerCase()} collection`;
  }
  
  // Prepare filters for query
  const queryFilters: Record<string, any> = { ...filters };
  
  // Add categoryId if available
  if (category?.id) {
    queryFilters.categoryId = category.id;
  }
  
  // Add subcategoryId if available
  if (subcategory?.id) {
    queryFilters.subcategoryId = subcategory.id;
  }
  
  return (
    <>
      <Helmet>
        <title>{`${pageTitle} | Elegance Jewels`}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        
        {/* Mobile filters toggle */}
        <div className="lg:hidden mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[400px] p-0 bg-card">
              <ProductFilters 
                filters={filters} 
                setFilters={setFilters} 
                categoryId={category?.id} 
                isMobile={true}
              />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <ProductFilters 
              filters={filters} 
              setFilters={setFilters} 
              categoryId={category?.id}
            />
          </div>
          
          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid 
              searchQuery={searchQuery} 
              filters={queryFilters} 
            />
          </div>
        </div>
      </div>
    </>
  );
}
