"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const { itemCount, openCart } = useCartStore();
  const pathname = usePathname();
  const count = itemCount();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    const frame = window.requestAnimationFrame(handler);
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <>
      <nav
        data-gentle-motion
        className={cn(
          "fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-[#f7f0e6]/10 bg-[#1A0E08]/96 shadow-[0_12px_40px_rgba(26,14,8,0.18)] backdrop-blur-md"
            : "border-[#f7f0e6]/10 bg-[#1A0E08]"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9953C]">
            <Image
              src="/images/BeanLeaf-Logo.png"
              alt="Bean Leaf Brew"
              width={160}
              height={48}
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={cn(
                  "relative py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#F7F0E6]/65 transition-colors hover:text-[#F7F0E6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9953C]",
                  pathname === l.href && "text-[#F7F0E6] after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-[#C9953C]"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              className="relative p-2 text-[#F7F0E6]/75 transition-colors hover:text-[#F7F0E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9953C]"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {mounted && count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C9953C] text-[#1A0E08] text-[9px] font-semibold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <button
              className="p-2 text-[#F7F0E6]/75 transition-colors hover:text-[#F7F0E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9953C] md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="flex flex-col gap-4 border-t border-[#4A2512]/40 bg-[#1A0E08] px-6 py-4 md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] uppercase tracking-widest text-[#F7F0E6]/80 hover:text-[#F7F0E6] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
