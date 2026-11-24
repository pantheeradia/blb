"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { STOREFRONT_CATEGORIES, collectionHref } from "@/lib/storefrontCategories";
import { CategoryVisual } from "@/components/shop/CategoryVisual";

const links = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
const shopLinks = STOREFRONT_CATEGORIES.map((category) => ({ ...category, label: category.name, href: collectionHref(category.slug) }));
const navLinkClass = "relative py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#4a2818] transition-colors hover:text-[#9b6a3c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b6a3c]";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const shopButtonRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const { itemCount, openCart } = useCartStore();
  const pathname = usePathname();
  const count = itemCount();
  const closeMenus = () => { setShopOpen(false); setMobileOpen(false); };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setShopOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <nav ref={navRef} aria-label="Main navigation" data-gentle-motion
      className="fixed inset-x-0 top-0 z-50 border-b border-[#20110c]/10 bg-[#fffaf3] shadow-[0_4px_24px_rgba(26,14,8,0.04)]"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          closeMenus();
          shopButtonRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenus();
      }}
      onMouseLeave={() => setShopOpen(false)}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="Bean Leaf Brew home" onClick={closeMenus} className="flex shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b6a3c]">
          <Image src="/images/logo.png" alt="" width={64} height={64} className="h-16 w-16 object-contain" preload />
          <span className="hidden font-serif text-base tracking-[0.04em] text-[#20110c] sm:block">Bean Leaf Brew</span>
        </Link>
        <div className="hidden h-full items-center gap-9 md:flex">
          <div className="relative flex h-full items-center" onMouseEnter={() => setShopOpen(true)}>
            <button ref={shopButtonRef} type="button" aria-expanded={shopOpen} aria-controls="desktop-shop-menu"
              className={cn(navLinkClass, "flex items-center gap-2", pathname.startsWith("/shop") && "underline decoration-[#9b6a3c] underline-offset-8")}
              onClick={() => setShopOpen((value) => !value)}>
              Shop <ChevronDown size={14} className={cn("transition-transform", shopOpen && "rotate-180")} />
            </button>
            {shopOpen && (
              <div id="desktop-shop-menu" className="absolute right-0 top-full hidden max-h-[calc(100dvh-6rem)] w-[340px] max-w-[calc(100vw-3rem)] overflow-y-auto border border-[#20110c]/10 bg-[#fffaf3] shadow-[0_20px_35px_rgba(26,14,8,0.12)] md:block">
                <div className="flex flex-col gap-1 p-2">
                  {shopLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenus}
                      className="group flex items-center gap-3 p-2 text-[11px] uppercase tracking-[0.06em] text-[#20110c] transition-colors hover:bg-[#e2d2bf] focus-visible:bg-[#e2d2bf] focus-visible:outline-2 focus-visible:outline-[#9b6a3c]"
                    >
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#eee3d2]"><CategoryVisual category={link} sizes="48px" /></span>
                      <span className="flex-1">{link.label}{link.comingSoon && <span className="mt-1 block text-[8px] tracking-widest text-[#987e61]">Coming soon</span>}</span>
                      <ArrowUpRight size={16} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {links.map((link) => <Link key={link.href} href={link.href} onMouseEnter={() => setShopOpen(false)} onFocus={() => setShopOpen(false)} onClick={closeMenus} aria-current={pathname === link.href ? "page" : undefined} className={navLinkClass}>{link.label}</Link>)}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { closeMenus(); openCart(); }} className="relative p-2 text-[#4a2818] hover:text-[#9b6a3c] focus-visible:outline-2 focus-visible:outline-[#9b6a3c]" aria-label="Open cart">
            <ShoppingBag size={20} />
            {mounted && count > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9953C] text-[9px] font-semibold text-[#1A0E08]">{count}</span>}
          </button>
          <button type="button" className="p-2 text-[#4a2818] md:hidden" onClick={() => { setMobileOpen((value) => !value); setShopOpen(false); }} aria-label="Toggle menu" aria-expanded={mobileOpen} aria-controls="mobile-navigation">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div id="mobile-navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-[#20110c]/10 bg-[#fffaf3] px-6 py-4 md:hidden">
          <button type="button" onClick={() => setShopOpen((value) => !value)} aria-expanded={shopOpen} aria-controls="mobile-shop-menu" className="flex w-full items-center justify-between py-3 text-xs uppercase tracking-widest text-[#20110c]">Shop<ChevronDown size={16} className={cn("transition-transform", shopOpen && "rotate-180")} /></button>
          {shopOpen && <div id="mobile-shop-menu" className="mb-3 border-l border-[#d4c4b0] pl-4">{shopLinks.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus} className="flex items-center gap-4 py-2 text-xs uppercase tracking-wide text-[#4a2818]"><span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#eee3d2]"><CategoryVisual category={link} sizes="48px" /></span>{link.label}</Link>)}</div>}
          {links.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus} className="block py-3 text-xs uppercase tracking-widest text-[#4a2818]">{link.label}</Link>)}
        </div>
      )}
    </nav>
  );
}
