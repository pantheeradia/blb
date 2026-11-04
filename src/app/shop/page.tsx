import { Suspense } from "react";
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
      <main data-gentle-motion className="min-h-screen bg-[#f3ece3] pt-16">
        <Suspense fallback={<ShopSkeleton />}>
          <ShopClient products={products} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
