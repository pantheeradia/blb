"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LoadingImage as Image } from "@/components/LoadingImage";
import { type Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { ArrowLeft, ArrowRight, Bean, Plus } from "lucide-react";
import { formatPriceDisplay, requiresOptionSelection } from "@/lib/productOptions";

interface Props {
  products: Product[];
}

function ProductAction({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const actionClass = "flex min-h-11 w-full items-center justify-between rounded-sm bg-[#38251a] px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#fffaf2] transition-colors hover:bg-[#805536] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]";
  const content = <><span>{product.inStock ? "Buy now" : "Sold out"}</span><span aria-hidden="true" className="ml-3 flex h-6 w-7 items-center justify-end border-l border-white/25"><Plus size={16} /></span></>;

  if (!product.inStock) return <button type="button" disabled className={`${actionClass} cursor-not-allowed opacity-50`}>{content}</button>;
  if (requiresOptionSelection(product.category, product.weightOptions ?? [], product.brewingEquipmentOptions ?? []) || (product.options?.variants.length ?? 0) > 0) {
    return <Link href={`/shop/${product.slug}`} aria-label={`Buy ${product.name} - choose options`} className={actionClass}>{content}</Link>;
  }
  return <button type="button" aria-label={`Add ${product.name} to bag`} onClick={() => addItem(product)} className={actionClass}>{content}</button>;
}

function BestsellerProduct({ product }: { product: Product }) {
  const image = product.images.find(Boolean);
  const notes = product.notes?.filter(Boolean).join(", ");
  return (
    <article className="group flex min-w-0 snap-start flex-col overflow-hidden rounded-lg border border-[#e1d5c5] bg-[#fffcf7] text-[#302016] transition-colors hover:border-[#bda184]">
      <Link href={`/shop/${product.slug}`} aria-label={`Explore ${product.name}`} className="relative block h-[280px] overflow-hidden bg-[#eee5d9] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#8f5e3b] sm:h-[320px]">
        {image ? <Image src={image} alt={product.name} fill sizes="(max-width: 639px) 76vw, (max-width: 1023px) 43vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none" /> : <span className="absolute inset-0 flex items-center justify-center"><Bean size={40} className="text-[#9b8065]" aria-hidden="true" /></span>}
        {!product.inStock && <span className="absolute right-0 top-0 bg-[#a84835] px-3 py-1.5 text-xs font-semibold text-white">Sold out</span>}
        <span className="absolute bottom-3 left-3 rounded-sm border border-[#fffaf2]/60 bg-[#fffaf2]/95 px-3 py-2 text-base font-semibold tabular-nums text-[#302016] backdrop-blur-sm">{formatPriceDisplay(product.price, product.weightOptions ?? [])}</span>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={`/shop/${product.slug}`} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]">
          <h3 className="truncate text-[15px] font-semibold uppercase leading-6 tracking-[0.04em]">{product.name}</h3>
        </Link>
        <p className="mb-4 mt-1 truncate text-xs leading-6 text-[#76604c]">{notes || product.shortDescription}</p>
        <div className="mt-auto"><ProductAction product={product} /></div>
      </div>
    </article>
  );
}

export function FeaturedProducts({ products }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setCanPrevious(track.scrollLeft > 2);
      setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => { track.removeEventListener("scroll", update); observer.disconnect(); };
  }, [products.length]);

  function scroll(direction: number) {
    const track = trackRef.current;
    const card = track?.querySelector("article");
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  }

  if (products.length === 0) return null;
  const cardWidth = products.length > 3 ? "calc((100% - 72px) / 3.7)" : products.length === 3 ? "calc((100% - 48px) / 2.7)" : "calc((100% - 24px) / 2)";

  return (
    <section id="bestsellers" aria-labelledby="bestsellers-heading" className="scroll-mt-20 border-y border-[#e5dacb] bg-[#f5efe6] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-7 sm:px-12">
        <header className="mb-6 flex items-end justify-between gap-5 sm:mb-7">
          <div>
            <h2 id="bestsellers-heading" className="font-serif text-4xl leading-tight tracking-[-0.025em] text-[#302016] sm:text-5xl">Bestsellers<span className="text-[#a0754e]">.</span></h2>
            <p className="mt-2 text-xs leading-5 text-[#76604c] sm:text-sm">Find your favourite in our most-loved blends.</p>
          </div>
          <Link href="/shop" className="flex shrink-0 items-center gap-2 border-b border-[#9b8065] py-2 text-xs font-medium text-[#4d3826] transition-colors hover:text-[#8f5e3b]">Shop all <ArrowRight size={14} aria-hidden="true" /></Link>
        </header>
        <div className="relative">
          <div id="bestseller-products" ref={trackRef} role="region" aria-label="Bestselling products" tabIndex={0} style={{ "--card-width": cardWidth } as CSSProperties} className="scrollbar-hide grid snap-x snap-mandatory auto-cols-[88%] grid-flow-col gap-6 overflow-x-auto pb-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b] sm:auto-cols-[46%] lg:auto-cols-[var(--card-width)]">
            {products.map((product) => <BestsellerProduct key={product.id} product={product} />)}
          </div>
          <button type="button" aria-label="Previous bestsellers" aria-controls="bestseller-products" disabled={!canPrevious} onClick={() => scroll(-1)} className="absolute -left-5 top-[140px] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8c8b6] bg-[#fffdf8] text-[#302016] shadow-md transition-colors hover:bg-[#ead9c8] disabled:cursor-default disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#8f5e3b] sm:top-[160px]"><ArrowLeft size={19} /></button>
          <button type="button" aria-label="Next bestsellers" aria-controls="bestseller-products" disabled={!canNext} onClick={() => scroll(1)} className="absolute -right-5 top-[140px] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8c8b6] bg-[#fffdf8] text-[#302016] shadow-md transition-colors hover:bg-[#ead9c8] disabled:cursor-default disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#8f5e3b] sm:top-[160px]"><ArrowRight size={19} /></button>
        </div>
      </div>
    </section>
  );
}
