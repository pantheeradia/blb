"use client";

import Link from "next/link";
import Image from "next/image";
import { type Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

interface Props {
  products: Product[];
}

export function PremixStrip({ products }: Props) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <section className="bg-[#F7F0E6] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9953C] mb-2">
              Instant Premix
            </p>
            <h2 className="font-serif text-2xl md:text-4xl text-[#1A0E08]">Ready in 60 seconds.</h2>
          </div>
          <Link
            href="/shop?category=instant-premix"
            className="hidden md:block text-xs uppercase tracking-widest text-[#8B5E3C] border-b border-[#8B5E3C] pb-0.5 hover:text-[#1A0E08] hover:border-[#1A0E08] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {products.map((product) => {
            // Safely validate the image array and first image URL
            const imageSrc =
              Array.isArray(product.images) &&
              product.images.length > 0 &&
              typeof product.images[0] === "string" &&
              product.images[0].trim() !== "" &&
              !imageErrors[product.id]
                ? product.images[0].trim()
                : null;

            return (
              <div key={product.id} className="flex-none w-44 snap-start">
                <Link href={`/shop/${product.slug}`} className="group block">
                  <div className="relative h-44 bg-[#EAD9C8] overflow-hidden mb-3">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        sizes="176px"
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EAD9C8]">
                        <svg className="w-8 h-8 text-[#8B5E3C] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-[#8B5E3C] text-center px-2">{product.name || "Product"}</span>
                      </div>
                    )}
                    {product.regularPrice && (
                      <span className="absolute top-2 left-2 bg-[#C9953C] text-[#1A0E08] text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5">
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
          })}
        </div>
      </div>
    </section>
  );
}
