import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { STOREFRONT_CATEGORIES, collectionHref } from "@/lib/storefrontCategories";
import { CategoryVisual } from "@/components/shop/CategoryVisual";
import type { Product } from "@/types";

export function ShopByCategory({ products = [] }: { products?: Product[] }) {
  return (
    <section id="collections" aria-labelledby="collections-heading" className="scroll-mt-20 border-b border-[#e7dccd] bg-[#fbf7f0] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-9">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8f6a47]">The Bean Leaf Brew collection</p>
            <h2 id="collections-heading" className="font-serif text-3xl leading-tight tracking-[-0.025em] text-[#302016] sm:text-4xl">Find your everyday ritual.</h2>
          </div>
          <Link href="/shop" className="inline-flex min-h-11 items-center gap-3 text-xs font-medium text-[#785535] hover:text-[#302016] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]">Explore the shop <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </header>
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 min-[360px]:grid-cols-4 sm:gap-x-5 lg:grid-cols-8 lg:gap-x-6">
          {STOREFRONT_CATEGORIES.map((category) => {
            const image = category.comingSoon || category.slug === "filter-coffee-decoction" ? undefined : products.find((product) => product.category === category.slug && product.images.some(Boolean))?.images.find(Boolean);
            return (
              <Link key={category.slug} href={collectionHref(category.slug)} className="group flex min-w-0 flex-col items-center text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]">
                <span className="relative mb-3 block aspect-square w-full max-w-32 overflow-hidden rounded-full border border-[#e6d8c5] bg-[#eee3d2] transition-[transform,border-color,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:border-[#b28b61] group-hover:shadow-[0_8px_20px_-12px_rgba(94,60,30,0.35)] motion-reduce:transform-none">
                  <CategoryVisual category={category} image={image} sizes="(max-width: 419px) 128px, (max-width: 1023px) 112px, 128px" />
                </span>
                <span className="max-w-36 text-xs font-medium leading-5 text-[#4d3826]">{category.name}</span>
                {category.comingSoon && <span className="mt-1 text-[9px] uppercase tracking-[0.08em] text-[#987e61]">Coming soon</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
