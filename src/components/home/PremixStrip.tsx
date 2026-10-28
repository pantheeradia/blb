"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { type Product } from "@/types";

interface Props {
  products: Product[];
}

function PremixCard({
  product,
  featured = false,
  position,
}: {
  product: Product;
  featured?: boolean;
  position: number;
}) {
  const validImages = product.images.filter(Boolean);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImage = validImages[currentImageIndex];
  const hasMultipleImages = validImages.length > 1;

  const showPreviousImage = () => {
    setCurrentImageIndex((current) =>
      current === 0 ? validImages.length - 1 : current - 1
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((current) =>
      current === validImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <article
      className={`reveal-on-scroll group flex min-w-0 flex-col bg-[#f8f1e7] ${
        featured
          ? "md:col-span-2 lg:col-span-7 lg:row-span-2"
          : "md:col-span-1 lg:col-span-5"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-[#d8c4ad] ${
          featured ? "aspect-[5/4] lg:flex-1" : "aspect-[16/9] lg:aspect-[2.12/1]"
        }`}
      >
        <Link
          href={`/shop/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-[1] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#fffaf2]"
        >
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            sizes={
              featured
                ? "(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 58vw"
                : "(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 42vw"
            }
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex items-start justify-between p-4 sm:p-5">
          <span className="bg-[#f8f1e7] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#20110c]">
            {String(position).padStart(2, "0")} / Instant
          </span>
          {product.regularPrice && (
            <span className="bg-[#c99243] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#20110c]">
              Special price
            </span>
          )}
        </div>

        {hasMultipleImages && (
          <div className="absolute inset-x-4 bottom-4 z-[3] flex items-center justify-between opacity-100 transition-opacity duration-300 sm:inset-x-5 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
            <button
              type="button"
              onClick={showPreviousImage}
              className="grid size-10 place-items-center bg-[#f8f1e7] text-[#20110c] transition-transform duration-200 hover:-translate-x-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffaf2]"
              aria-label={`Show previous image of ${product.name}`}
            >
              <ChevronLeft size={16} strokeWidth={1.6} />
            </button>
            <p
              className="bg-[#20110c]/82 px-3 py-2 text-[9px] font-semibold tracking-[0.18em] text-[#fffaf2] backdrop-blur-sm"
              aria-live="polite"
            >
              {currentImageIndex + 1} / {validImages.length}
            </p>
            <button
              type="button"
              onClick={showNextImage}
              className="grid size-10 place-items-center bg-[#f8f1e7] text-[#20110c] transition-transform duration-200 hover:translate-x-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffaf2]"
              aria-label={`Show next image of ${product.name}`}
            >
              <ChevronRight size={16} strokeWidth={1.6} />
            </button>
          </div>
        )}
      </div>

      <div
        className={`grid gap-5 p-5 sm:p-6 ${
          featured
            ? "sm:grid-cols-[1fr_auto] sm:items-end lg:p-8"
            : "sm:grid-cols-[1fr_auto] sm:items-end"
        }`}
      >
        <div className="min-w-0">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b6a3c]">
            {product.weight || "Ready in 60 seconds"}
          </p>
          <Link
            href={`/shop/${product.slug}`}
            className="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b6a3c]"
          >
            <h3
              className={`font-serif leading-[1.05] tracking-[-0.025em] text-[#20110c] transition-colors duration-200 group-hover:text-[#7c4e2e] ${
                featured ? "text-3xl sm:text-4xl" : "text-2xl"
              }`}
            >
              {product.name}
            </h3>
          </Link>
          {featured && (
            <p className="mt-3 max-w-lg text-xs leading-5 text-[#765f4f] sm:text-sm sm:leading-6">
              {product.shortDescription}
            </p>
          )}
        </div>

        <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-1">
          <span className="text-base font-semibold tabular-nums text-[#20110c]">
            {formatPrice(product.price)}
          </span>
          {product.regularPrice && (
            <span className="text-xs tabular-nums text-[#8b725e] line-through">
              {formatPrice(product.regularPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function PremixStrip({ products }: Props) {
  const withRealImages = products.filter((product) =>
    product.images.some(Boolean)
  );
  const presentable = withRealImages.filter(
    (product) => product.price >= 100 && product.price < 5000
  );
  const visibleProducts = (presentable.length >= 3 ? presentable : withRealImages).slice(0, 3);

  if (visibleProducts.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#e9dccb] py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 size-80 rounded-full bg-[#c99243]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 grid gap-8 border-t border-[#9f856b]/45 pt-6 sm:mb-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8f5e35]">
              The one-minute collection
            </p>
            <h2 className="max-w-3xl font-serif text-4xl leading-[0.96] tracking-[-0.035em] text-[#20110c] sm:text-6xl lg:text-7xl">
              A proper cup, without the wait.
            </h2>
          </div>

          <div className="md:col-span-4 md:justify-self-end md:text-right">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#4a2818]">
              Tear <span className="mx-2 text-[#ad8b68]">·</span> Pour{" "}
              <span className="mx-2 text-[#ad8b68]">·</span> Stir
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#765f4f] md:ml-auto">
              Café-style tea and coffee premixes for fast mornings and slower sips.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden bg-[#bca78f] md:grid-cols-2 lg:grid-cols-12">
          {visibleProducts.map((product, index) => (
            <PremixCard
              key={product.id}
              product={product}
              featured={index === 0}
              position={index + 1}
            />
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-5 border-b border-[#9f856b]/45 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-5 text-[#765f4f]">
            No equipment, no long prep—just a balanced cup whenever you want one.
          </p>
          <Link
            href="/shop?category=instant-premix"
            className="group inline-flex min-h-11 items-center gap-3 self-start bg-[#20110c] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fffaf2] transition-colors duration-200 hover:bg-[#4a2818] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#9b6a3c] sm:self-auto"
          >
            Shop every premix
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
