import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Hero } from "@/components/home/Hero";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandStory } from "@/components/home/BrandStory";
import { VideoQuote } from "@/components/home/VideoQuote";
import { Testimonials } from "@/components/home/Testimonials";
import { VideoSection } from "@/components/home/VideoSection";
import { PartnerMarquee } from "@/components/home/PartnerMarquee";
import { getAllProducts, getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const [featured, catalog] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getAllProducts().catch(() => []),
  ]);
  const featuredIds = new Set(featured.map((product) => product.id));
  const additions = catalog
    .filter((product) => !featuredIds.has(product.id) && product.inStock && product.images.some(Boolean))
    .sort((a, b) => Number(["ground-coffee", "whole-bean"].includes(b.category)) - Number(["ground-coffee", "whole-bean"].includes(a.category)))
    .slice(0, 3);
  const bestsellers = [...featured, ...additions];

  return (
    <>
      <Nav />
      <CartDrawer />
      <main data-gentle-motion>
        <Hero />
        <ShopByCategory products={catalog} />
        <FeaturedProducts products={bestsellers} />
        <BrandStory />
        <VideoQuote />
        <Testimonials />
        <PartnerMarquee />
        <VideoSection />
      </main>
      <Footer />
    </>
  );
}
