"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Bean } from "lucide-react";
import styles from "./circular-testimonials.module.css";
import { LoadingImage as Image } from "@/components/LoadingImage";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  action?: ReactNode;
  detail?: ReactNode;
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  label?: string;
  colors?: {
    name?: string;
    designation?: string;
    testimony?: string;
    arrowBackground?: string;
    arrowForeground?: string;
    arrowHoverBackground?: string;
  };
  fontSizes?: { name?: string; designation?: string; quote?: string };
}

function subscribeToMotionPreference(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function cardPosition(index: number, selected: number, count: number, gap: number) {
  const active = index === selected;
  const left = index === (selected - 1 + count) % count;
  const right = index === (selected + 1) % count;
  return {
    zIndex: active ? 3 : left || right ? 2 : 1,
    opacity: active || left || right ? 1 : 0,
    transform: `translateX(${active ? 0 : left ? -gap : gap}px) translateY(${active ? 0 : -gap * 0.45}px) scale(${active ? 1 : 0.92}) rotate(${active ? 0 : left ? -5 : 5}deg)`,
  };
}

export function CircularTestimonials({ testimonials, autoplay = true, label = "Testimonials", colors = {}, fontSizes = {} }: CircularTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [containerWidth, setContainerWidth] = useState(320);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationsRef = useRef<Animation[]>([]);
  const animatingRef = useRef(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useSyncExternalStore(subscribeToMotionPreference, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const count = testimonials.length;
  const selected = count ? activeIndex % count : 0;
  const active = testimonials[selected];
  const gap = Math.min(68, containerWidth * 0.14);

  const navigate = useCallback((direction: number, manual = true) => {
    if (count < 2 || animatingRef.current) return;
    if (manual) setInteracted(true);
    setDirection(direction);
    const next = (selected + direction + count) % count;
    animatingRef.current = true;
    animationsRef.current = [];

    cardRefs.current.slice(0, count).forEach((card, index) => {
      if (!card) return;
      const from = cardPosition(index, selected, count, gap);
      const to = cardPosition(index, next, count, gap);
      let frames: Keyframe[] = [from, to];
      if (index === selected) {
        // Tuck the front card into the stack without sweeping sideways.
        // Shrinking first exposes the incoming card before the depth handoff.
        const tucked = `translateX(0px) translateY(${reduceMotion ? -12 : -36}px) scale(${reduceMotion ? 0.94 : 0.84}) rotate(${-direction * (reduceMotion ? 1 : 6)}deg)`;
        frames = [
          { ...from, zIndex: 4, offset: 0 },
          { transform: tucked, opacity: 1, zIndex: 4, offset: 0.38 },
          { transform: tucked, opacity: 1, zIndex: 2, offset: 0.40 },
          { ...to, offset: 1 },
        ];
      } else if (index === next) {
        frames = [
          { ...from, zIndex: 2, offset: 0 },
          { transform: `translateX(${direction * gap * 0.2}px) translateY(${reduceMotion ? 0 : 10}px) scale(${reduceMotion ? 1 : 1.025}) rotate(0deg)`, opacity: 1, zIndex: 3, offset: 0.60 },
          { ...to, zIndex: 3, offset: 1 },
        ];
      }
      animationsRef.current.push(card.animate(frames, {
        duration: reduceMotion ? 450 : 850,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      }));
    });
    // The outgoing card stays in front until it shrinks into the stack.
    setActiveIndex(next);
    void Promise.allSettled(animationsRef.current.map((animation) => animation.finished)).then(() => {
      animatingRef.current = false;
    });
  }, [count, selected, gap, reduceMotion]);

  useEffect(() => () => {
    animationsRef.current.forEach((animation) => animation.cancel());
  }, []);

  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(container);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    if (!autoplay || count < 2 || paused || interacted || reduceMotion) return;
    const interval = window.setInterval(() => navigate(1, false), 5000);
    return () => window.clearInterval(interval);
  }, [autoplay, count, paused, interacted, reduceMotion, navigate]);

  if (!active) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          navigate(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      className="mx-auto w-full max-w-6xl rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#8f5e3b]"
    >
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-24">
        <div ref={imageContainerRef} className="relative mx-auto mt-4 aspect-square w-full max-w-[500px] [perspective:1000px] md:mt-5">
          {testimonials.map((testimonial, index) => {
            const isActive = index === selected;
            // Keep the stack inside its column, including on narrow phones.
            return (
              <div
                key={`${testimonial.src}-${index}`}
                aria-hidden={!isActive}
                ref={(node) => { cardRefs.current[index] = node; }}
                style={cardPosition(index, selected, count, gap)}
                className="pointer-events-none absolute left-[8%] top-[8%] aspect-square w-[84%] overflow-hidden rounded-2xl bg-[#e9dfd1] shadow-[0_12px_32px_-12px_rgba(56,37,26,0.3)]"
              >
                {testimonial.src ? <Image src={testimonial.src} alt={isActive ? testimonial.name : ""} fill sizes="(max-width: 767px) 75vw, 420px" unoptimized={testimonial.src.startsWith("https://images.unsplash.com/")} className="object-cover" /> : <span className="flex h-full items-center justify-center"><Bean size={48} className="text-[#9b8065]" /></span>}
              </div>
            );
          })}
        </div>
        <div className="flex min-w-0 flex-col items-start">
          <div className="w-full" aria-live={paused || interacted || !autoplay ? "polite" : "off"} aria-atomic="true">
              <div key={selected} className={styles.content} style={{ "--slide-offset": `${direction * 24}px` } as CSSProperties}>
                <h3 className="font-serif text-3xl leading-tight tracking-[-0.025em] sm:text-4xl lg:text-5xl" style={{ color: colors.name ?? "#302016", fontSize: fontSizes.name }}>{active.name}</h3>
                <p className="mt-3 text-sm" style={{ color: colors.designation ?? "#8f6a47", fontSize: fontSizes.designation }}>{active.designation}</p>
                <p className="mt-6 text-base leading-8" style={{ color: colors.testimony ?? "#76604c", fontSize: fontSizes.quote }}>{active.quote}</p>
                {active.detail && <div className="mt-5">{active.detail}</div>}
                {active.action && <div className="mt-7 max-w-sm">{active.action}</div>}
              </div>
          </div>
          <div className="mt-8 flex items-center gap-3 md:mt-10">
            {[-1, 1].map((direction) => (
              <button key={direction} type="button" disabled={count < 2} onClick={() => navigate(direction)} aria-label={`${direction < 0 ? "Previous" : "Next"} ${label.toLowerCase()}`} style={{ backgroundColor: colors.arrowBackground ?? "#38251a", color: colors.arrowForeground ?? "#fffaf2", "--arrow-hover": colors.arrowHoverBackground ?? "#805536" } as CSSProperties} className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:!bg-[var(--arrow-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f5e3b] disabled:cursor-default disabled:opacity-30">
                {direction < 0 ? <ArrowLeft size={20} aria-hidden="true" /> : <ArrowRight size={20} aria-hidden="true" />}
              </button>
            ))}
            <span className="ml-3 text-xs tabular-nums tracking-[0.15em] text-[#8f6a47]">{String(selected + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CircularTestimonials;
