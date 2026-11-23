"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, Play } from "lucide-react";
import Link from "next/link";

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function play() {
    const video = videoRef.current;
    if (!video || loading) return;
    setStarted(true);
    setLoading(true);
    setError(false);
    try {
      if (video.error) video.load();
      await video.play();
    } catch {
      setLoading(false);
      setError(true);
    }
  }

  return (
    <section id="videos" aria-labelledby="videos-heading" className="scroll-mt-20 bg-[#f5f1e9] py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-7 px-6 sm:px-8 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8f5e3b]">BLB videos</p>
          <h2 id="videos-heading" className="font-serif text-4xl leading-[1.08] tracking-[-0.035em] text-[#302016] sm:text-5xl">Coffee, <span className="italic text-[#8f5e3b]">in motion.</span></h2>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#76604c]">A closer look at the coffee behind your daily cup.</p>
          <Link href="/shop" className="mt-5 inline-flex min-h-11 items-center gap-4 border-b border-[#9b8065] text-xs font-medium text-[#4d3826] transition-colors hover:text-[#8f5e3b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]">Find your coffee <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>

        <div>
          <div className="relative aspect-video overflow-hidden bg-[#302016]">
            <video
              ref={videoRef}
              aria-label="Bean Leaf Brew coffee video"
              poster="/images/HB_03.webp"
              preload="none"
              playsInline
              muted
              controls={started}
              className="h-full w-full object-cover"
              onPlaying={() => { setLoading(false); setError(false); }}
              onCanPlay={() => setLoading(false)}
              onWaiting={() => setLoading(true)}
              onPause={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
            >
              <source src="/videos/file.mp4" type="video/mp4" />
              Your browser does not support video playback.
            </video>
            {!started && !error && (
              <button type="button" onClick={play} aria-label="Play Bean Leaf Brew video" className="group absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d7a35f]">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-[#fffaf2]/95 text-[#38251a] transition-transform group-hover:scale-105"><Play size={23} fill="currentColor" className="ml-1" aria-hidden="true" /></span>
              </button>
            )}
            {loading && !error && <span role="status" className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 text-white"><LoaderCircle size={28} className="animate-spin motion-reduce:animate-none" /><span className="sr-only">Loading video...</span></span>}
            {error && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#302016]/90 p-6 text-center text-[#fffaf2]"><p role="alert" className="text-sm">The video could not load.</p><button type="button" onClick={play} className="min-h-11 border border-[#d7a35f] px-5 text-xs hover:bg-[#d7a35f] hover:text-[#302016]">Try again</button></div>}
          </div>
          <p className="mt-3 text-xs text-[#76604c]">The BLB brew</p>
        </div>
      </div>
    </section>
  );
}
