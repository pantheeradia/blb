import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "border-transparent bg-[#38251a] text-[#fffaf2]",
  secondary: "border-transparent bg-[#ead9c8] text-[#38251a]",
  destructive: "border-transparent bg-[#a84835] text-white",
  outline: "border-[#d4c4b0] text-[#8b5e3c]",
};

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

// Preserve the shadcn badge API using the project's existing class utilities.
export function badgeVariants({ variant = "default", className }: Pick<BadgeProps, "variant" | "className"> = {}) {
  return cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className);
}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={badgeVariants({ variant, className })} {...props} />;
}
