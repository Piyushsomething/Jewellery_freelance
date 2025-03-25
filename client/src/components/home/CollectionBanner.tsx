import { Link } from 'wouter';

export default function CollectionBanner() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury jewelry collection" 
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
          <div className="absolute top-0 left-0 h-full w-full flex items-center z-20 p-8 md:p-16">
            <div className="max-w-md">
              <h2 className="text-4xl font-playfair font-bold text-foreground mb-4">
                Summer <span className="text-primary">Collection</span>
              </h2>
              <p className="text-foreground text-lg mb-8">
                Discover our new summer collection featuring elegant designs with colorful gemstones.
              </p>
              <Link href="/collections/summer" className="gold-btn inline-block py-3 px-8 rounded-full font-medium">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
