import Link from "next/link";
import { LoadingImage as Image } from "@/components/LoadingImage";
import { ArrowUpRight } from "lucide-react";

export function VideoQuote() {
  return (
    <section className="relative flex min-h-[380px] items-center overflow-hidden bg-[#0F0705]">
      <Image
        src="/images/Welcome-to-our-coffee-BG.png"
        alt="Fresh coffee surrounded by roasted beans"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#160b07]/80 via-[#160b07]/45 to-[#160b07]/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="reveal-on-scroll max-w-xl">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d7a35f]">Roasted every week</p>
          <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.035em] text-[#fffaf2] sm:text-5xl">
            Coffee that still smells like the roastery.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#fffaf2]/80">
            We roast in small batches, pack quickly and send each order from our Whitefield roastery.
          </p>
          <Link href="/about" className="group mt-8 inline-flex min-h-12 items-center gap-3 bg-[#d7a35f] px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20110c] transition-all hover:-translate-y-0.5 hover:bg-[#e2b979]">
            How we roast
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
