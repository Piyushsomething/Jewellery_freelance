import Hero from '@/components/home/Hero';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CollectionBanner from '@/components/home/CollectionBanner';
import Newsletter from '@/components/home/Newsletter';
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Elegance Jewels | Luxury Jewelry Collection</title>
        <meta name="description" content="Discover our exceptional collection of handcrafted luxury jewelry, designed with the finest materials and attention to detail." />
      </Helmet>
      
      <div className="min-h-screen">
        <Hero />
        <CategoryShowcase />
        <FeaturedProducts />
        <CollectionBanner />
        <Newsletter />
      </div>
    </>
  );
}
