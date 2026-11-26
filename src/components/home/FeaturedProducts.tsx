"use client";

import Link from "next/link";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";
import { type Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { ArrowUpRight, Plus } from "lucide-react";
import { formatPriceDisplay, requiresOptionSelection } from "@/lib/productOptions";

interface Props {
  products: Product[];
}

function ProductAction({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const needsOptions = requiresOptionSelection(product.category, product.weightOptions ?? [], product.brewingEquipmentOptions ?? []) || (product.options?.variants.length ?? 0) > 0;
  const actionClass = "flex min-h-11 w-full items-center justify-between rounded-full border border-[#38251a] bg-transparent px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#38251a] transition-colors hover:bg-[#38251a] hover:text-[#fffaf2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]";
  const content = <><span>{!product.inStock ? "Sold out" : needsOptions ? "Choose options" : "Add to bag"}</span><span aria-hidden="true" className="ml-3 flex h-6 w-7 items-center justify-end border-l border-current/25"><Plus size={16} /></span></>;

  if (!product.inStock) return <button type="button" disabled className={`${actionClass} cursor-not-allowed opacity-50`}>{content}</button>;
  if (needsOptions) {
    return <Link href={`/shop/${product.slug}`} aria-label={`Buy ${product.name} - choose options`} className={actionClass}>{content}</Link>;
  }
  return <button type="button" aria-label={`Add ${product.name} to bag`} onClick={() => addItem(product)} className={actionClass}>{content}</button>;
}

export function FeaturedProducts({ products }: Props) {
  if (products.length === 0) return null;

  const slides = products.map((product) => ({
    name: product.name,
    designation: product.categoryLabel ?? product.category.replaceAll("-", " "),
    quote: product.notes?.filter(Boolean).join(" · ") || product.shortDescription,
    src: product.images.find(Boolean) ?? "",
    detail: <p className="text-xl font-semibold tabular-nums text-[#302016]">{formatPriceDisplay(product.price, product.weightOptions ?? [])}</p>,
    action: <div className="space-y-4"><ProductAction product={product} /><Link href={`/shop/${product.slug}`} className="inline-flex min-h-11 items-center gap-2 text-xs text-[#76604c] underline underline-offset-4 hover:text-[#302016]">View product details <ArrowUpRight size={14} aria-hidden="true" /></Link></div>,
  }));

  return (
    <section id="bestsellers" aria-labelledby="bestsellers-heading" className="scroll-mt-20 overflow-hidden border-y border-[#e5dacb] bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <header className="mb-2 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f6a47]">The most-loved blends</p>
            <h2 id="bestsellers-heading" className="font-serif text-4xl leading-tight tracking-[-0.025em] text-[#302016] sm:text-[54px]">Bestsellers.</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#76604c] sm:text-base">Find your everyday favourite, from a bold morning brew to a slow afternoon cup.</p>
          </div>
          <Link href="/shop" className="inline-flex min-h-11 items-center gap-3 border-b border-[#9b8065] text-xs font-medium text-[#4d3826] transition-colors hover:text-[#8f5e3b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]">Explore the collection <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </header>
        <CircularTestimonials key={products.map((product) => product.id).join(",")} testimonials={slides} autoplay={false} label="Bestseller" />
      </div>
    </section>
  );
}
