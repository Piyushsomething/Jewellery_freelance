import { Link } from 'wouter';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { useCartContext } from '@/lib/contexts/CartContext';
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartContext();
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: 'Added to wishlist',
      description: `${product.name} has been added to your wishlist!`,
    });
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: 'Quick view',
      description: 'Quick view feature coming soon!',
    });
  };
  
  // Generate rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} className="fill-primary text-primary w-4 h-4" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg 
          key="half" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-4 h-4 text-primary"
        >
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#half-fill)" 
            stroke="currentColor" 
            d="M12 17.8L5.8 21 7 14.1 2 9.3l7-1L12 2l3 6.3 7 1-5 4.8 1.2 6.9z"
          />
        </svg>
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="text-muted-foreground w-4 h-4" />);
    }
    
    return stars;
  };
  
  return (
    <Link href={`/product/${product.slug}`} className="product-card bg-card rounded-lg overflow-hidden transition-all duration-400 h-full block">
      <div className="relative group h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button 
              onClick={handleQuickView}
              size="icon" 
              variant="secondary" 
              className="bg-background/80 hover:bg-primary text-primary hover:text-primary-foreground rounded-full"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              onClick={handleAddToWishlist}
              size="icon" 
              variant="secondary" 
              className="bg-background/80 hover:bg-primary text-primary hover:text-primary-foreground rounded-full"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button 
              onClick={handleAddToCart}
              size="icon" 
              variant="secondary" 
              className="bg-background/80 hover:bg-primary text-primary hover:text-primary-foreground rounded-full"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {product.isNew && (
          <div className="absolute top-2 left-2">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">New</span>
          </div>
        )}
        {product.isBestseller && (
          <div className="absolute top-2 left-2">
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md font-medium">Bestseller</span>
          </div>
        )}
        {product.isOnSale && (
          <div className="absolute top-2 left-2">
            <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-md font-medium">Sale</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-sm text-muted-foreground mb-1">{product.categoryId === 1 ? 'Rings' : product.categoryId === 2 ? 'Earrings' : product.categoryId === 3 ? 'Necklaces' : product.categoryId === 4 ? 'Bracelets' : 'Gemstones'}</div>
        <h3 className="font-medium text-foreground hover:text-primary transition-colors">{product.name}</h3>
        <div className="flex items-center mt-2">
          <div className="flex text-sm">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-muted-foreground ml-2">({product.reviewCount})</span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="font-medium text-primary">${product.discountPrice || product.price}</div>
          {product.discountPrice && (
            <div className="text-xs line-through text-muted-foreground">${product.price}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
