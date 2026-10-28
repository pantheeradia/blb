import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandStory } from "@/components/home/BrandStory";
import { PremixStrip } from "@/components/home/PremixStrip";
import { VideoQuote } from "@/components/home/VideoQuote";
import { Testimonials } from "@/components/home/Testimonials";
import { PartnerMarquee } from "@/components/home/PartnerMarquee";
import { ValueStrip } from "@/components/home/ValueStrip";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { getFeaturedProducts, getProductsByCategory } from "@/lib/products";

export default async function HomePage() {
  const [featured, premixes] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getProductsByCategory("instant-premix").catch(() => []),
  ]);

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
        <PremixStrip products={premixes} />
        <VideoQuote />
        <Testimonials />
        <PartnerMarquee />
      </main>
      <Footer />
    </>
  );
}
