import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useCartContext } from '@/lib/contexts/CartContext';
import { categories, subcategories } from '@/lib/data/categories';
import { Sun, Moon, Heart, ShoppingBag, Search, Mail, MapPin, User, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount, openCart } = useCartContext();
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Fetch categories
  const { data: categoryData } = useQuery({
    queryKey: ['/api/categories'],
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`border-b border-border sticky top-0 z-50 bg-background transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto py-4 px-6">
        {/* Top bar with contact and account info */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm">
            <a href="mailto:info@elegancejewels.com" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4 mr-1" /> info@elegancejewels.com
            </a>
            <span className="hidden md:inline text-muted">|</span>
            <a href="#track-order" className="hidden md:flex items-center text-muted-foreground hover:text-primary transition-colors">
              <MapPin className="w-4 h-4 mr-1" /> Track Order
            </a>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="relative hidden md:block">
              <select className="bg-transparent text-muted-foreground border-none focus:ring-0 cursor-pointer">
                <option>$ USD</option>
                <option>€ EUR</option>
                <option>£ GBP</option>
              </select>
            </div>
            <span className="hidden md:inline text-muted">|</span>
            <div className="relative">
              <a href="#account" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <User className="w-4 h-4 mr-1" /> My Account
              </a>
            </div>
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <Link href="/" className="mb-4 md:mb-0 flex items-center">
            <span className="text-3xl font-playfair font-bold">
              <span className="text-primary">Elegance</span>
              <span className="text-secondary/70">Jewels</span>
            </span>
          </Link>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <Input
              type="text"
              placeholder="Search for jewelry..."
              className="w-full py-2 px-4 bg-card border border-border rounded-full text-sm focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
          
          <div className="flex items-center space-x-6">
            <button onClick={toggleTheme} className="text-foreground hover:text-primary transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/favorites" className="text-foreground hover:text-primary transition-colors relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
            </Link>
            <button onClick={openCart} className="text-foreground hover:text-primary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            </button>
          </div>
        </div>
        
        {/* Category navigation */}
        <nav className="flex justify-center mt-6 overflow-x-auto pb-2">
          <ul className="flex space-x-8 text-sm font-medium">
            <li>
              <Link 
                href="/" 
                className={location === '/' 
                  ? "text-primary border-b-2 border-primary pb-2 font-medium" 
                  : "text-foreground hover:text-primary pb-2 border-b-2 border-transparent hover:border-primary transition-colors duration-300"}
              >
                Home
              </Link>
            </li>
            
            {categories.map((category) => (
              <li key={category.id} className="relative group">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Link 
                      href={`/category/${category.slug}`}
                      className={location === `/category/${category.slug}` 
                        ? "text-primary border-b-2 border-primary pb-2 font-medium flex items-center" 
                        : "text-foreground hover:text-primary pb-2 border-b-2 border-transparent hover:border-primary transition-colors duration-300 flex items-center"}
                    >
                      {category.name} <ChevronDown className="ml-1 w-4 h-4" />
                    </Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {subcategories[category.slug]?.map((subcategory) => (
                      <DropdownMenuItem key={subcategory.id} asChild>
                        <Link 
                          href={`/category/${category.slug}?subcategory=${subcategory.slug}`}
                          className="block px-4 py-2 text-foreground hover:bg-muted hover:text-primary"
                        >
                          {subcategory.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
            
            <li>
              <Link 
                href="/collections" 
                className="text-foreground hover:text-primary pb-2 border-b-2 border-transparent hover:border-primary transition-colors duration-300"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link 
                href="/sale" 
                className="text-destructive hover:text-destructive/80 pb-2 border-b-2 border-transparent hover:border-destructive transition-colors duration-300"
              >
                Sale
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
