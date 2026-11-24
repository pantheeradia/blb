import { Bean, Coffee, Leaf, Dumbbell, CupSoda, Droplets, Gift, ShoppingBag } from "lucide-react";
import { LoadingImage } from "@/components/LoadingImage";
import type { StorefrontCategory } from "@/lib/storefrontCategories";

const ICONS = { beans: Bean, coffee: Coffee, tea: Leaf, protein: Dumbbell, matcha: CupSoda, concentrate: Droplets, gift: Gift, merchandise: ShoppingBag };

export function CategoryVisual({ category, image, sizes = "128px" }: { category: StorefrontCategory; image?: string; sizes?: string }) {
  const src = category.image ?? image;
  const Icon = ICONS[category.icon];
  return src ? (
    <LoadingImage src={src} alt="" fill sizes={sizes} className={category.image ? "object-contain p-3 mix-blend-multiply" : "object-cover"} />
  ) : (
    <span className="flex h-full w-full items-center justify-center text-[#8a6542]" aria-hidden="true"><Icon className="h-[38%] w-[38%]" strokeWidth={1.25} /></span>
  );
}
