import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useCartContext } from '@/lib/contexts/CartContext';
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  RefreshCcw, 
  Shield, 
  ChevronRight, 
  Minus, 
  Plus,
  Star,
  StarHalf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { formatCurrency } from '@/lib/utils';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { addToCart } = useCartContext();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${slug}`],
  });
  
  // Fetch related products
  const { data: relatedData } = useQuery({
    queryKey: [`/api/products?limit=4${product ? `&categoryId=${product.categoryId}` : ''}`],
    enabled: !!product,
  });
  
  const relatedProducts = relatedData?.products || [];
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/catalog')} className="gold-btn py-2 px-6 rounded-full">
            Browse Our Collection
          </Button>
        </div>
      </div>
    );
  }
  
  // Handle quantity changes
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };
  
  // Combine main image with additional images
  const allImages = [product.image, ...(product.additionalImages || [])];
  
  // Get category and subcategory info
  const categoryName = product.categoryId === 1 ? 'Rings' :
                        product.categoryId === 2 ? 'Earrings' :
                        product.categoryId === 3 ? 'Necklaces' :
                        product.categoryId === 4 ? 'Bracelets' : 'Gemstones';
  
  const categorySlug = product.categoryId === 1 ? 'rings' :
                         product.categoryId === 2 ? 'earrings' :
                         product.categoryId === 3 ? 'necklaces' :
                         product.categoryId === 4 ? 'bracelets' : 'gemstones';
  
  // Generate rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-primary text-primary w-4 h-4" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-primary text-primary w-4 h-4" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-muted w-4 h-4" />);
    }
    
    return stars;
  };
  
  return (
    <>
      <Helmet>
        <title>{`${product.name} | Elegance Jewels`}</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/catalog">Catalog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${categorySlug}`}>{categoryName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-card rounded-lg overflow-hidden mb-4 aspect-square">
              <img 
                src={allImages[activeImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    className={`bg-card rounded-md overflow-hidden aspect-square ${
                      activeImageIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-2">
              <span className="text-muted-foreground">{categoryName}</span>
            </div>
            <h1 className="text-3xl font-playfair font-bold text-foreground mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center mt-2 mb-4">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-muted-foreground ml-2">({product.reviewCount} reviews)</span>
            </div>
            
            <div className="mb-6">
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-medium text-primary mr-2">
                    {formatCurrency(product.discountPrice)}
                  </span>
                  <span className="text-lg line-through text-muted-foreground">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-medium text-primary">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            
            <Separator className="mb-6" />
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-foreground font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {product.metal && (
                  <div>
                    <h3 className="text-foreground font-medium mb-1">Metal</h3>
                    <p className="text-muted-foreground">{product.metal}</p>
                  </div>
                )}
                
                {product.gemstone && (
                  <div>
                    <h3 className="text-foreground font-medium mb-1">Gemstone</h3>
                    <p className="text-muted-foreground">{product.gemstone}</p>
                  </div>
                )}
              </div>
            </div>
            
            <Separator className="mb-6" />
            
            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div>
                <h3 className="text-foreground font-medium mb-4">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-border rounded-md">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-10 w-10 rounded-none" 
                      onClick={decrementQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-10 w-10 rounded-none" 
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  className="gold-btn py-3 px-8 rounded-full font-medium flex-1"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  className="outline-gold-btn py-3 px-8 rounded-full font-medium flex-1"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
              </div>
            </div>
            
            {/* Product Features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Truck className="text-primary h-5 w-5" />
                <span className="text-sm text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <RefreshCcw className="text-primary h-5 w-5" />
                <span className="text-sm text-muted-foreground">30-Day Returns</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Shield className="text-primary h-5 w-5" />
                <span className="text-sm text-muted-foreground">Warranty</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-playfair font-bold text-foreground">
                You May Also Like
              </h2>
              <Button 
                variant="link" 
                className="text-primary flex items-center"
                onClick={() => navigate(`/category/${categorySlug}`)}
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map(relatedProduct => (
                <div key={relatedProduct.id} className="product-card bg-card rounded-lg overflow-hidden transition-all duration-400 h-full">
                  <a href={`/product/${relatedProduct.slug}`} className="block h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        {categoryName}
                      </div>
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="mt-2">
                        <span className="font-medium text-primary">
                          {formatCurrency(relatedProduct.discountPrice || relatedProduct.price)}
                        </span>
                        {relatedProduct.discountPrice && (
                          <span className="text-sm line-through text-muted-foreground ml-2">
                            {formatCurrency(relatedProduct.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
