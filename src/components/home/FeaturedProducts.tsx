"use client";

import Link from "next/link";
import Image from "next/image";
import { type Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { formatPriceDisplay, requiresOptionSelection } from "@/lib/productOptions";

interface Props {
  products: Product[];
}

function ProductAction({
  product,
  light = false,
}: {
  product: Product;
  light?: boolean;
}) {
  const { addItem } = useCartStore();
  const actionClass = light
    ? "border border-[#fffaf2]/45 text-[#fffaf2] hover:border-[#d7a35f] hover:bg-[#d7a35f] hover:text-[#20110c]"
    : "bg-[#20110c] text-[#fffaf2] hover:bg-[#4a2818]";

  if (
    requiresOptionSelection(
      product.category,
      product.weightOptions ?? [],
      product.brewingEquipmentOptions ?? []
    )
  ) {
    return (
      <Link
        href={`/shop/${product.slug}`}
        className={`inline-flex min-h-11 items-center gap-2 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b6a3c] ${actionClass}`}
      >
        Select roast <ArrowUpRight size={13} />
      </Link>
    );
  }

  return (
    <button
      onClick={() => addItem(product)}
      className={`inline-flex min-h-11 items-center gap-2 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b6a3c] ${actionClass}`}
    >
      <ShoppingBag size={13} /> Add to bag
    </button>
  );
}

function PrimaryProduct({ product }: { product: Product }) {
  const image = product.images.find(Boolean);

  return (
    <article className="reveal-on-scroll group relative min-h-[560px] overflow-hidden bg-[#24130d] lg:min-h-[650px]">
      {image && (
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          sizes="(max-width: 1024px) 100vw, 62vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1b0d08]/95 via-[#1b0d08]/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-7 text-[#fffaf2] sm:p-10">
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d7a35f]">House favourite</p>
        <Link href={`/shop/${product.slug}`} className="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7a35f]">
          <h3 className="font-serif text-4xl tracking-[-0.03em] sm:text-5xl">{product.name}</h3>
        </Link>
        <p className="mt-3 max-w-md text-sm leading-6 text-[#fffaf2]/70">{product.shortDescription}</p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <span className="min-w-16 text-base font-semibold tabular-nums">
            {formatPriceDisplay(product.price, product.weightOptions ?? [])}
          </span>
          <ProductAction product={product} light />
        </div>
      </div>
    </article>
  );
}

function CompactProduct({ product }: { product: Product }) {
  const image = product.images.find(Boolean);

  return (
    <article className="reveal-on-scroll reveal-on-scroll-late group grid min-h-[270px] grid-cols-[0.9fr_1.1fr] overflow-hidden bg-[#fffaf2]">
      <Link href={`/shop/${product.slug}`} className="relative overflow-hidden bg-[#dfcbb5] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9b6a3c]">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 1024px) 45vw, 18vw"
          />
        )}
      </Link>
      <div className="flex min-w-0 flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b6a3c]">{product.categoryLabel}</p>
          <Link href={`/shop/${product.slug}`} className="focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#9b6a3c]">
            <h3 className="font-serif text-2xl leading-tight tracking-[-0.02em] text-[#20110c]">{product.name}</h3>
          </Link>
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#765f4f]">{product.shortDescription}</p>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold tabular-nums text-[#20110c]">
            {formatPriceDisplay(product.price, product.weightOptions ?? [])}
          </span>
          <ProductAction product={product} />
        </div>
      </div>
    </article>
  );
}

export function FeaturedProducts({ products }: Props) {
  if (products.length === 0) return null;

  const [primary, ...alternatives] = products.slice(0, 3);

  return (
    <section className="bg-[#ead9c8] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f5e35]">Most loved</p>
            <h2 className="max-w-xl font-serif text-4xl leading-none tracking-[-0.025em] text-[#20110c] sm:text-5xl">Start with the house favourites.</h2>
          </div>
          <Link href="/shop" className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4a2818] underline decoration-[#9b6a3c] underline-offset-8">
            Shop all coffee <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <PrimaryProduct product={primary} />
          {alternatives.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {alternatives.map((product) => (
                <CompactProduct key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
