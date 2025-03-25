import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Separator } from '@/components/ui/separator';

interface ProductFiltersProps {
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  categoryId?: number;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

export default function ProductFilters({ 
  filters, 
  setFilters, 
  categoryId,
  onMobileClose,
  isMobile = false
}: ProductFiltersProps) {
  // State for expanded filter sections
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    metal: true,
    gemstone: true
  });
  
  // State for price range inputs
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  
  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Fetch subcategories if category is selected
  const { data: subcategories } = useQuery({
    queryKey: ['/api/subcategories', categoryId],
    enabled: !!categoryId,
  });
  
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: filters[key] === value ? undefined : value
    });
  };
  
  // Apply price range filter
  const applyPriceFilter = () => {
    setFilters({
      ...filters,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined
    });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setMinPrice('');
    setMaxPrice('');
  };
  
  // List of metals and gemstones for filters
  const metals = ['Gold', 'White Gold', 'Rose Gold', 'Silver', 'Platinum'];
  const gemstones = ['Diamond', 'Sapphire', 'Emerald', 'Ruby', 'Pearl'];
  
  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} bg-card rounded-lg h-fit`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-playfair text-foreground">Filters</h3>
          <Button variant="ghost" size="icon" onClick={onMobileClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {!isMobile && <h3 className="text-xl font-playfair text-foreground mb-6">Filters</h3>}
      
      {/* Category Filter */}
      {!categoryId && (
        <div className="mb-6">
          <button 
            className="flex items-center justify-between w-full text-foreground font-medium mb-3"
            onClick={() => toggleSection('category')}
          >
            <span>Category</span>
            {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {categories?.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={filters.categoryId === category.id.toString()}
                    onCheckedChange={() => handleCheckboxChange('categoryId', category.id.toString())}
                  />
                  <label 
                    htmlFor={`category-${category.id}`}
                    className="text-muted-foreground hover:text-primary cursor-pointer text-sm"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Subcategory Filter - Only show if category is selected */}
      {categoryId && subcategories?.length > 0 && (
        <div className="mb-6">
          <button 
            className="flex items-center justify-between w-full text-foreground font-medium mb-3"
            onClick={() => toggleSection('subcategory')}
          >
            <span>Subcategory</span>
            {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {subcategories.map(subcategory => (
                <div key={subcategory.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`subcategory-${subcategory.id}`} 
                    checked={filters.subcategoryId === subcategory.id.toString()}
                    onCheckedChange={() => handleCheckboxChange('subcategoryId', subcategory.id.toString())}
                  />
                  <label 
                    htmlFor={`subcategory-${subcategory.id}`}
                    className="text-muted-foreground hover:text-primary cursor-pointer text-sm"
                  >
                    {subcategory.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Price Filter */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full text-foreground font-medium mb-3"
          onClick={() => toggleSection('price')}
        >
          <span>Price Range</span>
          {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Input 
                type="number"
                min="0"
                placeholder="Min" 
                className="w-[45%] bg-background border border-border rounded-md py-2 px-3 text-foreground text-sm focus-visible:ring-primary"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)} 
              />
              <span className="text-muted-foreground">-</span>
              <Input 
                type="number"
                min="0"
                placeholder="Max" 
                className="w-[45%] bg-background border border-border rounded-md py-2 px-3 text-foreground text-sm focus-visible:ring-primary"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <Button 
              onClick={applyPriceFilter}
              className="w-full outline-gold-btn py-2 rounded-md text-sm"
            >
              Apply
            </Button>
          </div>
        )}
      </div>
      
      {/* Metal Filter */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full text-foreground font-medium mb-3"
          onClick={() => toggleSection('metal')}
        >
          <span>Metal</span>
          {expandedSections.metal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.metal && (
          <div className="space-y-2">
            {metals.map(metal => (
              <div key={metal} className="flex items-center space-x-2">
                <Checkbox 
                  id={`metal-${metal}`} 
                  checked={filters.metal === metal}
                  onCheckedChange={() => handleCheckboxChange('metal', metal)}
                />
                <label 
                  htmlFor={`metal-${metal}`}
                  className="text-muted-foreground hover:text-primary cursor-pointer text-sm"
                >
                  {metal}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Gemstone Filter */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full text-foreground font-medium mb-3"
          onClick={() => toggleSection('gemstone')}
        >
          <span>Gemstone</span>
          {expandedSections.gemstone ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.gemstone && (
          <div className="space-y-2">
            {gemstones.map(gemstone => (
              <div key={gemstone} className="flex items-center space-x-2">
                <Checkbox 
                  id={`gemstone-${gemstone}`} 
                  checked={filters.gemstone === gemstone}
                  onCheckedChange={() => handleCheckboxChange('gemstone', gemstone)}
                />
                <label 
                  htmlFor={`gemstone-${gemstone}`}
                  className="text-muted-foreground hover:text-primary cursor-pointer text-sm"
                >
                  {gemstone}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full border-border text-muted-foreground hover:text-foreground hover:border-primary py-2 rounded-md text-sm"
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
        
        {isMobile && (
          <Button
            className="w-full gold-btn py-2 rounded-md text-sm"
            onClick={onMobileClose}
          >
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  );
}
