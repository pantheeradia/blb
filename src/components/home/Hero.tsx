"use client";

import Link from "next/link";
import { LoadingImage as Image } from "@/components/LoadingImage";
import { ArrowUpRight, LoaderCircle, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HERO_IMAGES = [
  { src: "/images/HB_03.webp", alt: "House Brew coffee and a traditional filter" },
  { src: "/images/DB_Beans_02.webp", alt: "Déjà Brew whole beans and freshly brewed coffee" },
  { src: "/images/DSC5479.webp", alt: "Bean Leaf Brew instant tea, coffee and matcha premixes" },
  { src: "/images/hero-image.jpeg", alt: "A barista at the Bean Leaf Brew roastery" },
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slideCount = HERO_IMAGES.length + 1;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => setActiveSlide((current) => (current + 1) % slideCount), 3000);
    return () => window.clearTimeout(timer);
  }, [activeSlide, isPlaying, slideCount]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (activeSlide === 0 && isPlaying) {
      void video.play().catch(() => setVideoLoading(false));
    } else {
      video.pause();
    }
  }, [activeSlide, isPlaying]);

  return (
    <section
      aria-label="Bean Leaf Brew highlights"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-[#0F0705] pt-20"
    >
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
          <div role="group" aria-roledescription="slide" aria-label={`1 of ${slideCount}`} aria-hidden={activeSlide !== 0} className="relative h-full w-full shrink-0">
            <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="/images/HB_03.webp"
              aria-label="Bean Leaf Brew coffee video" className="absolute inset-0 h-full w-full object-cover"
              onCanPlay={() => setVideoLoading(false)} onPlaying={() => setVideoLoading(false)} onWaiting={() => setVideoLoading(true)} onError={() => setVideoLoading(false)}>
              <source src="/videos/file.mp4" type="video/mp4" />
            </video>
            {videoLoading && activeSlide === 0 && <span role="status" className="absolute right-6 top-6 text-white"><LoaderCircle size={20} className="animate-spin" /><span className="sr-only">Loading video...</span></span>}
          </div>
          {HERO_IMAGES.map((image, index) => (
            <div key={image.src} role="group" aria-roledescription="slide" aria-label={`${index + 2} of ${slideCount}`} aria-hidden={index + 1 !== activeSlide}
              className="relative h-full w-full shrink-0">
              <Image src={image.src} alt={image.alt} fill preload={index === 0} sizes="100vw" className="object-cover object-[center_55%]" />
            </div>
          ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#20110c]/95 via-[#20110c]/55 to-[#20110c]/10" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#20110c]/60 to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex min-h-[480px] items-center sm:min-h-[500px] md:h-[66dvh] md:min-h-[480px] md:max-h-[680px]">
          <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:px-8 md:py-16">
            <div className="max-w-lg">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#d7a35f]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d7a35f]">
                  Roasted in Whitefield, Bengaluru
                </p>
              </div>

              <h1 className="max-w-[13ch] font-serif text-[clamp(2.6rem,4.5vw,4.5rem)] leading-[1.02] tracking-[-0.035em] text-[#fffaf2] text-balance">
                Better coffee, made personal.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[#fffaf2]/85 sm:text-[15px]">
                Freshly profile-roasted coffee from Karnataka&apos;s finest estates, prepared for the way you brew at home.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="group inline-flex min-h-12 items-center gap-3 bg-[#d7a35f] px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20110c] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e2b979] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7a35f] active:translate-y-0"
                >
                  Shop coffee
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/about"
                  className="px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fffaf2] underline decoration-[#d7a35f] underline-offset-8 transition-colors hover:text-[#d7a35f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7a35f]"
                >
                  Meet the roastery
                </Link>
              </div>

            </div>
          </div>
        </div>

        <div aria-label="Choose hero slide" className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center rounded-full bg-[#20110c]/25 px-1 backdrop-blur-sm">
          <button type="button" aria-label="Show video" aria-pressed={activeSlide === 0} onClick={() => setActiveSlide(0)}
            className="flex h-7 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#e4b97d]">
            <span className={`h-1.5 w-1.5 rounded-full transition-colors ${activeSlide === 0 ? "bg-[#e4b97d]" : "bg-white/60 hover:bg-white"}`} />
          </button>
          {HERO_IMAGES.map((image, index) => (
            <button key={image.src} type="button" aria-label={`Show image ${index + 1}: ${image.alt}`} aria-pressed={index + 1 === activeSlide}
              onClick={() => setActiveSlide(index + 1)}
              className="flex h-7 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#e4b97d]">
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${index + 1 === activeSlide ? "bg-[#e4b97d]" : "bg-white/60 hover:bg-white"}`} />
            </button>
          ))}
        </div>
        <button type="button" aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"} onClick={() => setIsPlaying((playing) => !playing)}
          className="absolute bottom-4 right-5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#20110c]/35 text-[#fffaf2] backdrop-blur-sm hover:bg-[#20110c]/60 focus-visible:outline-2 focus-visible:outline-[#e4b97d]">
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>
      </div>
    </section>
  );
}
