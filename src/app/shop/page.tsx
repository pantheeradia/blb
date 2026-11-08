import { Suspense } from "react";
import Image from "next/image";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ShopClient } from "@/components/shop/ShopClient";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Shop coffee - Bean Leaf Brew",
  description:
    "Shop freshly roasted ground coffee, whole beans, filter coffee and instant premixes from Bean Leaf Brew.",
};

function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16" aria-label="Loading products">
      <div className="mb-10 h-16 animate-pulse bg-[#ead9c8]" />
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[5/5.35] bg-[#e6d9ca]" />
            <div className="mt-5 h-3 w-1/3 bg-[#d8c5b0]" />
            <div className="mt-3 h-7 w-3/4 bg-[#ead9c8]" />
            <div className="mt-6 h-10 w-full bg-[#ead9c8]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      <Nav />
      <CartDrawer />
      <main data-gentle-motion className="min-h-screen bg-[#f3ece3]">
        <section className="border-b border-[#d2c0ac] bg-[#e8dccd] pt-20">
          <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="hero-copy-enter flex min-h-[390px] items-center px-6 py-14 sm:px-10 lg:px-16 xl:px-24">
              <div className="max-w-xl">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#9b6a3c]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#765038]">
                    Fresh from our Bengaluru roastery
                  </p>
                </div>
                <h1 className="max-w-[10ch] font-serif text-[clamp(3.5rem,6vw,6rem)] leading-[0.88] tracking-[-0.05em] text-[#20110c]">
                  Coffee for the way you brew.
                </h1>
                <p className="mt-6 max-w-md text-sm leading-7 text-[#614b3d] sm:text-base">
                  Choose your roast, grind and ritual. Every batch is roasted in small lots and packed while it is still fresh.
                </p>
                <a href="#catalog" className="mt-7 inline-flex items-center border-b border-[#8f5e35] pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4a2818] transition-colors hover:text-[#9b6a3c]">
                  Browse the collection ↓
                </a>
              </div>
            </div>

            <div className="hero-media-enter relative min-h-[320px] overflow-hidden lg:min-h-[390px]">
              <Image src="/images/GC_Beans_01.webp" alt="Golden Crema coffee surrounded by freshly roasted beans" fill preload className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#170b07]/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 p-6 text-[#fffaf2] sm:p-8">
                <p className="max-w-xs border-l border-[#d7a35f] pl-4 font-serif text-lg leading-tight">Grown in Karnataka. Roasted for your everyday cup.</p>
                <span className="hidden text-[9px] uppercase tracking-[0.2em] text-[#fffaf2]/65 sm:block">Small-batch · Traceable</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#27150e]/12 bg-[#f3ece3]">
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-[#20110c]/12 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                ["Roasted weekly", "Never pulled from stale stock"],
                ["Packed in 48 hours", "Aroma kept where it belongs"],
                ["Delivered across India", "Tracked from us to your door"],
              ].map(([title, copy]) => (
                <div key={title} className="py-5 sm:px-6 first:sm:pl-0 last:sm:pr-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4a2818]">{title}</p>
                  <p className="mt-1 text-xs text-[#806854]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Suspense fallback={<ShopSkeleton />}>
          <ShopClient products={products} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
