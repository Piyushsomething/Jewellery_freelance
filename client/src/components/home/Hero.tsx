import { Link } from 'wouter';

export default function Hero() {
  return (
    <section className="relative overflow-hidden h-[500px] md:h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
        alt="Luxury jewelry collection" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-4">
          New Collection <span className="text-primary">Of 2024</span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground max-w-lg mb-8">
          Thousands of designs for selection, wholesale prices, low minimum quantity, premium quality.
        </p>
        <p className="text-lg text-foreground mb-8">
          1000+ retailers and they are 100% satisfied
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/catalog?wholesale=true" className="outline-gold-btn py-3 px-8 rounded-full font-medium text-center">
            &lt; Wholesale Jewelry
          </Link>
          <Link href="/catalog?customize=true" className="gold-btn py-3 px-8 rounded-full font-medium text-center">
            Customize Jewelry &gt;
          </Link>
        </div>
      </div>
    </section>
  );
}
