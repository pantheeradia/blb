"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const hasMultipleImages = images.length > 1;
  const hasValidImages = images.length > 0 && images[0] !== "";
  const currentImage = hasValidImages ? images[currentImageIndex] : null;
  const hasImageError = imageErrors.has(currentImageIndex);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square bg-[#EAD9C8] overflow-hidden group">
        {currentImage && !hasImageError ? (
          <Image
            src={currentImage}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={currentImageIndex === 0}
            onError={() => handleImageError(currentImageIndex)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]">
            {hasValidImages ? (
              <>
                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586 1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Image not available</p>
              </>
            ) : (
              <p className="text-sm">No image available</p>
            )}
          </div>
        )}

        {/* Navigation Arrows - Only show if multiple images */}
        {hasMultipleImages && hasValidImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1A0E08] p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1A0E08] p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Navigation - Only show if multiple images */}
      {hasMultipleImages && hasValidImages && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 bg-[#EAD9C8] overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? "border-[#1A0E08] ring-2 ring-[#1A0E08] ring-offset-2"
                  : "border-[#D4C4B0] hover:border-[#8B5E3C]"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              {!imageErrors.has(index) ? (
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover p-1"
                  sizes="80px"
                  onError={() => handleImageError(index)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8B5E3C] text-xs">
                  -
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
