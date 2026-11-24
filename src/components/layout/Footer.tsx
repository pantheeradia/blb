import Link from "next/link";
import Image from "next/image";
import { STOREFRONT_CATEGORIES, collectionHref } from "@/lib/storefrontCategories";

const shopLinks = STOREFRONT_CATEGORIES.map((category) => ({ label: category.name, href: collectionHref(category.slug) }));

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Coffee journal", href: "/#videos" },
];

export function Footer() {
  return (
    <footer className="bg-[#1A0E08] text-[#F7F0E6]">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-12">
          <div className="sm:col-span-2 md:col-span-2">
            <Image
              src="/images/logo.png"
              alt="Bean Leaf Brew"
              width={112}
              height={112}
              quality={85}
              className="mb-5 h-28 w-28 object-contain"
            />
            <p className="text-sm text-[#F7F0E6]/70 leading-relaxed max-w-sm">
              Artisan coffee roasted in small batches in Whitefield, Bengaluru.
              We source directly from estates in Coorg and Chikmagalur.
            </p>
            <p className="text-xs text-[#F7F0E6]/70 mt-4">
              Anytime. Anywhere.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-[#C9953C] mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-8 items-center text-sm text-[#F7F0E6]/70 hover:text-[#F7F0E6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9953C]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-[#C9953C] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-8 items-center text-sm text-[#F7F0E6]/70 hover:text-[#F7F0E6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9953C]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#4A2512]/40 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#F7F0E6]/55">
            © {new Date().getFullYear()} Bean Leaf Brew LLP. All rights reserved.
          </p>
          <p className="text-xs text-[#F7F0E6]/55">
            Whitefield, Bengaluru 560066 · +91 8123273344
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-[#F7F0E6]/55">
            Made with <span className="text-[#C9953C]">❤</span> by Stratix Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
