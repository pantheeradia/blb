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
import type { Product } from "@/types";

function firstProductImage(products: Product[]): string | undefined {
  return products.flatMap((product) => product.images).find(Boolean);
}

export default async function HomePage() {
  const [featured, groundCoffee, premixes, wholeBean] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getProductsByCategory("ground-coffee").catch(() => []),
    getProductsByCategory("instant-premix").catch(() => []),
    getProductsByCategory("whole-bean").catch(() => []),
  ]);

  return (
    <>
      <Nav />
      <CartDrawer />
      <main data-gentle-motion>
        <Hero />
        <ValueStrip />
        <ShopByCategory
          categoryImages={{
            "ground-coffee": firstProductImage(groundCoffee),
            "instant-premix": firstProductImage(premixes),
            "whole-bean": firstProductImage(wholeBean),
          }}
        />
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
