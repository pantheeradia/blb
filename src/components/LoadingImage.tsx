"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

// Keep image dimensions stable while giving slow images a visible placeholder.
export function LoadingImage(props: ImageProps) {
  const key = typeof props.src === "string" ? props.src : JSON.stringify(props.src);
  return <ImageWithLoading key={key} {...props} />;
}

function ImageWithLoading({ onLoad, onError, alt, ...props }: ImageProps) {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-pulse bg-[#d9c9b6]/60 motion-reduce:animate-none" />
      )}
      <Image
        {...props}
        alt={alt}
        onLoad={(event) => { setLoading(false); onLoad?.(event); }}
        onError={(event) => { setLoading(false); onError?.(event); }}
      />
    </>
  );
}
