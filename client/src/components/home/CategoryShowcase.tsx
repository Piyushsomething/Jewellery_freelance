import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';

export default function CategoryShowcase() {
  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card animate-pulse rounded-lg h-[250px]"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Only show first 3 categories
  const displayCategories = categories?.slice(0, 3) || [];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayCategories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="category-card group relative overflow-hidden rounded-lg h-[250px] transition-transform duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
              <img 
                src={category.image} 
                alt={`${category.name} collection`} 
                className="absolute inset-0 w-full h-full object-cover category-card-image"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-3xl font-playfair text-foreground group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">Explore our collection</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
