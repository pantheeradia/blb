"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, UserRound, Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { STOREFRONT_CATEGORIES, collectionHref } from "@/lib/storefrontCategories";
import { CategoryVisual } from "@/components/shop/CategoryVisual";

const links = [
  { label: "About Us", href: "/about" },
];
const shopLinks = STOREFRONT_CATEGORIES.map((category) => ({ ...category, label: category.name, href: collectionHref(category.slug) }));
const menuGroups = [
  { id: "shop", label: "Shop", items: shopLinks },
  { id: "coffee", label: "Roasted Coffee", items: shopLinks.filter((item) => ["whole-bean", "ground-coffee"].includes(item.slug)) },
  { id: "hoyya", label: "HOYYA Premix", items: shopLinks.filter((item) => item.slug.startsWith("hoyya-")) },
];
const navLinkClass = "relative py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#4a2818] transition-colors hover:text-[#9b6a3c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b6a3c]";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [utilityOpen, setUtilityOpen] = useState<"search" | "account" | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const utilityTriggerRef = useRef<HTMLButtonElement | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const shopButtonRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const { itemCount, openCart } = useCartStore();
  const pathname = usePathname();
  const router = useRouter();
  const count = itemCount();
  const closeMenus = () => { setActiveMenu(null); setMobileOpen(false); setUtilityOpen(null); };

  useEffect(() => {
    if (utilityOpen === "search") searchRef.current?.focus();
  }, [utilityOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setActiveMenu(null);
        setUtilityOpen(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <nav ref={navRef} aria-label="Main navigation" data-gentle-motion
      className="fixed inset-x-0 top-0 z-50 border-b border-[#20110c]/10 bg-white shadow-[0_4px_24px_rgba(26,14,8,0.04)]"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          closeMenus();
          (utilityOpen ? utilityTriggerRef.current : shopButtonRef.current)?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenus();
      }}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-2 px-3 sm:px-6">
        <Link href="/" aria-label="Bean Leaf Brew home" onClick={closeMenus} className="flex shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b6a3c]">
          <Image src="/images/logo.png" alt="" width={64} height={64} className="h-10 w-10 object-contain sm:h-16 sm:w-16" preload />
          <span className="max-w-20 font-serif text-sm leading-tight tracking-[0.04em] text-[#20110c] sm:max-w-none sm:text-base">Bean Leaf Brew</span>
        </Link>
        <div className="hidden h-full items-center gap-5 lg:flex xl:gap-9">
          {menuGroups.map((group) => <div key={group.id} className="relative flex h-full items-center" onMouseEnter={() => { setActiveMenu(group.id); setUtilityOpen(null); }} onMouseLeave={() => setActiveMenu(null)}>
            <button type="button" aria-expanded={activeMenu === group.id} aria-controls={`desktop-${group.id}-menu`}
              className={cn(navLinkClass, "flex items-center gap-2 whitespace-nowrap", group.id === "shop" && pathname.startsWith("/shop") && "underline decoration-[#9b6a3c] underline-offset-8")}
              onFocus={(event) => { shopButtonRef.current = event.currentTarget; }}
              onClick={(event) => { shopButtonRef.current = event.currentTarget; setActiveMenu((value) => value === group.id ? null : group.id); setUtilityOpen(null); }}>
              {group.label} <ChevronDown size={14} aria-hidden="true" className={cn("transition-transform", activeMenu === group.id && "rotate-180")} />
            </button>
            {activeMenu === group.id && (
              <div id={`desktop-${group.id}-menu`} className="absolute left-0 top-full hidden max-h-[calc(100dvh-6rem)] w-[320px] max-w-[calc(100vw-3rem)] overflow-y-auto border border-[#20110c]/10 bg-white shadow-[0_20px_35px_rgba(26,14,8,0.12)] lg:block">
                <div className="flex flex-col gap-1 p-2">
                  {group.items.map((link) => (
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
          </div>)}
          {links.map((link) => <Link key={link.href} href={link.href} onMouseEnter={() => setActiveMenu(null)} onFocus={() => setActiveMenu(null)} onClick={closeMenus} aria-current={pathname === link.href ? "page" : undefined} className={navLinkClass}>{link.label}</Link>)}
        </div>
        <div className="flex items-center gap-0 sm:gap-2">
          {(["search", "account"] as const).map((utility) => <button key={utility} type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-[#4a2818] hover:bg-[#f3ece3] focus-visible:outline-2 focus-visible:outline-[#9b6a3c]" aria-label={utility === "search" ? "Search products" : "Account"} aria-expanded={utilityOpen === utility} aria-controls={`navigation-${utility}`} onClick={(event) => { utilityTriggerRef.current = event.currentTarget; setUtilityOpen((value) => value === utility ? null : utility); setActiveMenu(null); setMobileOpen(false); }}>{utility === "search" ? <Search size={20} /> : <UserRound size={20} />}</button>)}
          <button onClick={() => { closeMenus(); openCart(); }} className="relative p-2 text-[#4a2818] hover:text-[#9b6a3c] focus-visible:outline-2 focus-visible:outline-[#9b6a3c]" aria-label="Open cart">
            <ShoppingBag size={20} />
            {mounted && count > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9953C] text-[9px] font-semibold text-[#1A0E08]">{count}</span>}
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center text-[#4a2818] lg:hidden" onClick={(event) => { shopButtonRef.current = event.currentTarget; setMobileOpen((value) => !value); setActiveMenu(null); setUtilityOpen(null); }} aria-label="Toggle menu" aria-expanded={mobileOpen} aria-controls="mobile-navigation">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {utilityOpen === "search" && <form id="navigation-search" role="search" className="border-t border-[#20110c]/10 px-4 py-5" onSubmit={(event) => { event.preventDefault(); router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}#catalog`); closeMenus(); }}>
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <label htmlFor="navigation-search-input" className="sr-only">Search products</label>
          <input ref={searchRef} id="navigation-search-input" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search coffee, premixes and more…" className="min-w-0 flex-1 border-b border-[#d4c4b0] py-3 text-sm outline-offset-4" />
          <button type="submit" className="bg-[#20110c] px-4 py-3 text-xs text-white hover:bg-[#4a2818]">Search</button>
          <button type="button" aria-label="Close search" className="p-2" onClick={() => { setUtilityOpen(null); utilityTriggerRef.current?.focus(); }}><X size={20} /></button>
        </div>
      </form>}
      {utilityOpen === "account" && <div id="navigation-account" className="absolute right-4 top-full w-60 border border-[#20110c]/10 bg-white p-5 text-sm text-[#4a2818] shadow-xl sm:right-6">
        <p className="font-serif text-lg">Welcome to BLB</p>
        <p className="mt-2 text-xs leading-relaxed text-[#765f4f]">You are shopping as a guest.</p>
        <Link href="/checkout" onClick={closeMenus} className="mt-4 block py-2 underline underline-offset-4">Go to checkout</Link>
        <Link href="/contact" onClick={closeMenus} className="block py-2 underline underline-offset-4">Help with an order</Link>
      </div>}
      {mobileOpen && (
        <div id="mobile-navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-[#20110c]/10 bg-white px-6 py-4 lg:hidden">
          {menuGroups.map((group) => <div key={group.id}>
            <button type="button" onClick={(event) => { shopButtonRef.current = event.currentTarget; setActiveMenu((value) => value === group.id ? null : group.id); }} aria-expanded={activeMenu === group.id} aria-controls={`mobile-${group.id}-menu`} className="flex w-full items-center justify-between py-3 text-xs uppercase tracking-widest text-[#20110c]">{group.label}<ChevronDown size={16} aria-hidden="true" className={cn("transition-transform", activeMenu === group.id && "rotate-180")} /></button>
            {activeMenu === group.id && <div id={`mobile-${group.id}-menu`} className="mb-3 border-l border-[#d4c4b0] pl-4">{group.items.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus} className="flex items-center gap-4 py-2 text-xs uppercase tracking-wide text-[#4a2818]"><span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#eee3d2]"><CategoryVisual category={link} sizes="48px" /></span><span>{link.label}{link.comingSoon && <span className="mt-1 block text-[8px] text-[#765f4f]">Coming soon</span>}</span></Link>)}</div>}
          </div>)}
          {links.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus} className="block py-3 text-xs uppercase tracking-widest text-[#4a2818]">{link.label}</Link>)}
        </div>
      )}
    </nav>
  );
}
