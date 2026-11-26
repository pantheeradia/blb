import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LoadingImage as Image } from "@/components/LoadingImage";

export function VideoQuote() {
  return (
    <section aria-labelledby="weekly-roast-heading" className="border-b border-[#e9e2da] bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-7 px-6 py-10 sm:px-8 md:grid-cols-[1.1fr_1fr] md:gap-12 md:py-16 lg:gap-20">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#402b20] md:aspect-[5/4]">
          <Image
            src="/images/weekly-roast.webp"
            alt="Freshly roasted coffee beans in a roaster’s steel cooling tray"
            fill
            sizes="(min-width: 1280px) 595px, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="max-w-lg">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#805532]">
            <span aria-hidden="true" className="h-px w-9 bg-[#b58c64]" />
            Roasted every week
          </p>
          <h2 id="weekly-roast-heading" className="font-serif text-[clamp(2.5rem,4.4vw,4rem)] leading-[1.04] tracking-[-0.045em] text-[#302017]">
            Coffee that still smells like <em className="text-[#805532]">the roastery.</em>
          </h2>
          <p className="mt-5 max-w-[39ch] text-base leading-7 text-[#604f43]">
            We roast in small batches, pack quickly and send each order from our Whitefield roastery.
          </p>
          <Link
            href="/about"
            className="group mt-6 inline-flex min-h-11 items-center gap-4 text-sm font-semibold text-[#38261b] underline decoration-[#ae937c] underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#805532]"
          >
            Our roastery story
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[#38261b] text-white transition-colors group-hover:bg-[#805532]">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
