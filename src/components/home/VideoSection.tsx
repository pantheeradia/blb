"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, Play } from "lucide-react";
import Link from "next/link";
import { COFFEE_VIDEOS, type CoffeeVideo } from "@/data/coffeeVideos";

function VideoCard({ video: film }: { video: CoffeeVideo }) {
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
        <article>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-[#302016]">
            <video
              ref={videoRef}
              aria-label={film.title}
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
              <button type="button" onClick={play} aria-label={`Play ${film.title}`} className="group absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d7a35f]">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-[#fffaf2]/95 text-[#38251a] transition-transform group-hover:scale-105"><Play size={23} fill="currentColor" className="ml-1" aria-hidden="true" /></span>
              </button>
            )}
            {loading && !error && <span role="status" className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 text-white"><LoaderCircle size={28} className="animate-spin motion-reduce:animate-none" /><span className="sr-only">Loading video...</span></span>}
            {error && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#302016]/90 p-6 text-center text-[#fffaf2]"><p role="alert" className="text-sm">The video could not load.</p><button type="button" onClick={play} className="min-h-11 border border-[#d7a35f] px-5 text-xs hover:bg-[#d7a35f] hover:text-[#302016]">Try again</button></div>}
          </div>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-serif text-2xl text-[#302016]">{film.title}</h3>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#8a6c50]">{film.topic} / {film.credit}</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#76604c]">{film.description}</p>
        </article>
  );
}

export function VideoSection() {
  return (
    <section id="videos" aria-labelledby="videos-heading" className="scroll-mt-20 border-t border-[#e5d9c9] bg-[#f5efe6] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8f5e3b]">The coffee journal</p>
            <h2 id="videos-heading" className="font-serif text-3xl leading-tight tracking-[-0.025em] text-[#302016] sm:text-4xl">Good coffee. A closer look.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#76604c]">Coffee stories from Bean Leaf Brew. Discover the people, craft and rituals behind the cup.</p>
        </header>
        <div className={COFFEE_VIDEOS.length === 1 ? "grid items-center gap-8 md:grid-cols-[1.4fr_0.6fr] md:gap-12" : "grid gap-8 md:grid-cols-2"}>
          {COFFEE_VIDEOS.map((film) => <VideoCard key={film.id} video={film} />)}
          {COFFEE_VIDEOS.length === 1 && <div className="border-l-2 border-[#c4a17a] pl-6">
            <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-[#8f6a47]">Start with your cup</p>
            <h3 className="font-serif text-3xl leading-tight text-[#302016]">Find your next coffee ritual.</h3>
            <p className="mt-4 text-sm leading-7 text-[#76604c]">Whole beans for a fresh grind, roasted and ground coffee for your favourite brewer, or a concentrate for a quicker cup.</p>
            <Link href="/shop" className="mt-5 inline-flex min-h-11 items-center gap-4 border-b border-[#9b8065] text-xs font-medium text-[#4d3826] hover:text-[#8f5e3b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b]">Explore the coffee collection <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>}
        </div>
      </div>
    </section>
  );
}
