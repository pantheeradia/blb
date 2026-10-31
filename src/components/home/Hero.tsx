"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loadVideo = () => {
      const source = video.querySelector("source");
      if (!source) return;
      source.src = "/videos/file.mp4";
      video.load();
    };

    if (document.readyState === "complete") {
      const timeoutId = window.setTimeout(loadVideo, 500);
      return () => window.clearTimeout(timeoutId);
    }

    window.addEventListener("load", loadVideo, { once: true });
    return () => window.removeEventListener("load", loadVideo);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#efe5d7] pt-20">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1600px] lg:h-[calc(100dvh-4rem)] lg:min-h-[620px] lg:max-h-[760px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-10 xl:px-24 xl:py-12">
          <div className="hero-copy-enter max-w-[620px]">
            <div className="mb-6 flex items-center gap-3 lg:mb-5">
              <span className="h-px w-8 bg-[#9b6a3c]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#765038]">
                Roasted in Whitefield, Bengaluru
              </p>
            </div>

            <h1 className="max-w-[11ch] font-serif text-[clamp(3.4rem,6vw,6rem)] leading-[0.88] tracking-[-0.045em] text-[#20110c] text-balance">
              Better coffee, made personal.
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-7 text-[#614b3d] sm:text-base">
              Freshly profile-roasted coffee from Karnataka&apos;s finest estates, prepared for the way you brew at home.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex min-h-12 items-center gap-3 bg-[#20110c] px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fffaf2] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4a2818] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#20110c] active:translate-y-0"
              >
                Shop coffee
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/about"
                className="px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4a2818] underline decoration-[#a77851] underline-offset-8 transition-colors hover:text-[#9b6a3c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#20110c]"
              >
                Meet the roastery
              </Link>
            </div>

            <dl className="mt-8 grid max-w-lg grid-cols-3 border-t border-[#20110c]/15 pt-4">
              <div>
                <dt className="font-serif text-2xl text-[#20110c]">3,100+</dt>
                <dd className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#765038]">Feet grown</dd>
              </div>
              <div className="border-l border-[#20110c]/15 pl-5">
                <dt className="font-serif text-2xl text-[#20110c]">48 hr</dt>
                <dd className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#765038]">Packed fresh</dd>
              </div>
              <div className="border-l border-[#20110c]/15 pl-5">
                <dt className="font-serif text-2xl text-[#20110c]">100%</dt>
                <dd className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#765038]">Traceable</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="hero-media-enter relative min-h-[480px] overflow-hidden lg:min-h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/images/HB_03.webp"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#20110c]/65 via-transparent to-[#20110c]/10" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 p-6 text-[#fffaf2] sm:p-8">
            <div className="max-w-xs border-l border-[#d7a35f] pl-4">
              <p className="font-serif text-xl leading-tight">From estate to everyday ritual.</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#fffaf2]/65">Coorg · Chikmagalur · Bengaluru</p>
            </div>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-[#fffaf2]/65 sm:block">Scroll to discover</span>
          </div>
        </div>
      </div>
    </section>
  );
}
