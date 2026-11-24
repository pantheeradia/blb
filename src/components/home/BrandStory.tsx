import Link from "next/link";
import { MapPin } from "lucide-react";
import { LoadingImage as Image } from "@/components/LoadingImage";

export function BrandStory() {
  return (
    <section className="overflow-hidden bg-[#1A0E08] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="reveal-on-scroll relative">
            <div className="relative h-80 overflow-hidden rounded-xl md:h-[400px]">
              <Image
                src="/images/hero-image.jpeg"
                alt="Bean Leaf Brew barista"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="reveal-on-scroll reveal-on-scroll-late">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9953C] mb-4">
              Our Story
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#F7F0E6] leading-tight mb-6">
              Born in Whitefield,
              <br />
              Brewed with Purpose.
            </h2>
            <p className="text-[#F7F0E6]/75 text-sm leading-relaxed mb-4">
              We source directly from award-winning estates in Coorg and Chikmagalur,
              Karnataka — grown at elevations of 3,100 to 4,000 ft. Every batch is
              freshly profile-roasted in-house using state-of-the-art technology.
            </p>
            <p className="text-[#F7F0E6]/75 text-sm leading-relaxed mb-8">
              No middlemen. No stale stock. Just coffee that&apos;s honest and alive —
              packed immediately after roasting to lock in the aroma and freshness
              you deserve.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/about"
                className="text-xs uppercase tracking-widest text-[#C9953C] border-b border-[#C9953C] pb-0.5 hover:opacity-80 transition-opacity"
              >
                Read our story →
              </Link>
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 border-b border-[#C9953C] pb-0.5 text-xs uppercase tracking-widest text-[#C9953C]"
              >
                <MapPin size={14} aria-hidden="true" />
                Find BLB Near You
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
