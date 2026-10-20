import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(paise);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Safely get the first valid image from a product's images array.
 * Returns null if images array is empty, contains empty strings, or is invalid.
 */
export function getFirstValidImage(images: unknown): string | null {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }
  const firstImage = images[0];
  if (typeof firstImage === "string" && firstImage.trim() !== "") {
    return firstImage.trim();
  }
  return null;
}
