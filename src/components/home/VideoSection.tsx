"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, Play } from "lucide-react";
import Link from "next/link";
import { COFFEE_VIDEOS, type CoffeeVideo } from "@/data/coffeeVideos";

function VideoCard({ video: film, preview = false, position }: { video: CoffeeVideo; preview?: boolean; position: number }) {
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
        <article className="min-w-0">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#302016]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 bg-gradient-to-b from-black/45 to-transparent p-4 pb-10 text-[#fffaf2]">
              <span className="text-[10px] font-medium tracking-[0.15em]">{String(position).padStart(2, "0")}</span>
              <span className="rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[8px] uppercase tracking-[0.12em] backdrop-blur-sm">{preview ? "Preview clip" : film.source === "Creator story" ? "Creator story" : "From BLB"}</span>
            </div>
            <video
              ref={videoRef}
              aria-label={`${film.title}${preview ? " (layout preview)" : ""}`}
              poster={film.poster}
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
              <source src={film.src} type="video/mp4" />
              Your browser does not support video playback.
            </video>
            {!started && !error && (
              <button type="button" onClick={play} aria-label={`Play ${film.title}${preview ? " preview" : ""} - video ${position}`} className="group absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d7a35f]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-[#fffaf2]/95 text-[#38251a] transition-transform group-hover:scale-105"><Play size={23} fill="currentColor" className="ml-1" aria-hidden="true" /></span>
              </button>
            )}
            {loading && !error && <span role="status" className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 text-white"><LoaderCircle size={28} className="animate-spin motion-reduce:animate-none" /><span className="sr-only">Loading video...</span></span>}
            {error && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#302016]/90 p-6 text-center text-[#fffaf2]"><p role="alert" className="text-sm">The video could not load.</p><button type="button" onClick={play} className="min-h-11 border border-[#d7a35f] px-5 text-xs hover:bg-[#d7a35f] hover:text-[#302016]">Try again</button></div>}
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-xl text-[#302016]">{film.title}</h3>
            <p className="mt-2 text-[9px] uppercase leading-5 tracking-[0.1em] text-[#8a6c50]">{film.topic} / {film.credit}</p>
          </div>
          <p className="mt-2 text-xs leading-6 text-[#76604c]">{film.description}</p>
        </article>
  );
}

export function VideoSection() {
  if (COFFEE_VIDEOS.length === 0) return null;
  const realVideos = COFFEE_VIDEOS.slice(0, 4).map((video) => ({ ...video, preview: false }));
  // Reuse the available clip as explicitly marked previews until distinct,
  // approved creator and brewing footage is supplied. Real clips take priority.
  const films = [...realVideos, ...Array.from({ length: Math.max(0, 4 - realVideos.length) }, (_, index) => ({
    ...COFFEE_VIDEOS[0],
    id: `coffee-layout-preview-${index}`,
    preview: true,
  }))];

  return (
    <section id="videos" aria-labelledby="videos-heading" className="scroll-mt-20 border-t border-[#e5d9c9] bg-[#f5efe6] py-12 sm:py-16">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8f5e3b]">The coffee journal</p>
            <h2 id="videos-heading" className="font-serif text-3xl leading-tight tracking-[-0.025em] text-[#302016] sm:text-4xl">Good coffee. A closer look.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#76604c]">Coffee stories from Bean Leaf Brew. Discover the people, craft and rituals behind the cup.</p>
        </header>
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
          {films.map((film, index) => <VideoCard key={film.id} video={film} preview={film.preview} position={index + 1} />)}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#dfd0bd] pt-5">
          <p className="max-w-xl text-xs leading-6 text-[#76604c]">Coffee, craft and everyday brewing. More creator stories and coffee guides are on the way.</p>
          <Link href="/shop" className="inline-flex min-h-11 items-center gap-3 text-xs font-medium text-[#4d3826] hover:text-[#8f5e3b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]">Explore the coffee collection <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
