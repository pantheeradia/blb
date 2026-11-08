import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandStory } from "@/components/home/BrandStory";
import { VideoQuote } from "@/components/home/VideoQuote";
import { Testimonials } from "@/components/home/Testimonials";
import { PartnerMarquee } from "@/components/home/PartnerMarquee";
import { ValueStrip } from "@/components/home/ValueStrip";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const featured = await getFeaturedProducts().catch(() => []);

  return (
    <>
      <Nav />
      <CartDrawer />
      <main data-gentle-motion>
        <Hero />
        <ValueStrip />
        <ShopByCategory />
        <FeaturedProducts products={featured} />
        <BrandStory />
        <VideoQuote />
        <Testimonials />
        <PartnerMarquee />
      </main>
      <Footer />
    </>
  );
}
