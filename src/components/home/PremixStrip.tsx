"use client";

import Link from "next/link";
import Image from "next/image";
import { type Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  products: Product[];
}

function PremixCard({ product }: { product: Product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const hasValidImages = product.images.length > 0 && product.images[0] !== "";
  const hasMultipleImages = hasValidImages && product.images.length > 1;
  const currentImage = hasValidImages ? product.images[currentImageIndex] : null;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="reveal-on-scroll min-w-0 snap-start">
      <Link href={`/shop/${product.slug}`} className="group block">
        <div
          className="relative mb-4 aspect-square overflow-hidden bg-[#EAD9C8]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setCurrentImageIndex(0);
          }}
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]">
              No image
            </div>
          )}

          {/* Image Navigation Controls - Show on hover if multiple images */}
          {hasMultipleImages && isHovering && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1A0E08] p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1A0E08] p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <ChevronRight size={14} />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1 h-1 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-4"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {product.regularPrice && (
            <span className="absolute left-2 top-2 bg-[#C9953C] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#1A0E08]">
              Sale
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-[#1A0E08] leading-snug mb-1">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#4A2512]">{formatPrice(product.price)}</span>
          {product.regularPrice && (
            <span className="text-xs text-[#8B5E3C] line-through">{formatPrice(product.regularPrice)}</span>
          )}
        </div>
      </Link>
    </div>
  );
}

export function PremixStrip({ products }: Props) {
  const withRealImages = products.filter(
    (product) => product.images.length > 0 && Boolean(product.images[0])
  );
  const presentable = withRealImages.filter(
    (product) => product.price >= 100 && product.price < 5000
  );
  const visibleProducts = (presentable.length >= 3 ? presentable : withRealImages).slice(0, 8);

  if (visibleProducts.length === 0) return null;

  return (
    <section className="bg-[#fffaf2] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b6a3c]">
              Easy does it
            </p>
            <h2 className="font-serif text-4xl leading-none tracking-[-0.025em] text-[#20110c] sm:text-5xl">A real cup. Ready in 60 seconds.</h2>
          </div>
          <Link
            href="/shop?category=instant-premix"
            className="hidden md:block text-xs uppercase tracking-widest text-[#8B5E3C] border-b border-[#8B5E3C] pb-0.5 hover:text-[#1A0E08] hover:border-[#1A0E08] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {visibleProducts.map((product) => (
            <PremixCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
