"use client";

import { useEffect, useRef } from "react";
import { LoadingImage as Image } from "@/components/LoadingImage";
import { cn } from "@/lib/utils";
import styles from "./timeline.module.css";

export interface TimelineItem {
  title: string;
  description: string;
  date: string;
  image: string;
  imageAlt?: string;
}

export default function Timeline({ items, respectReducedMotion = true }: { items: TimelineItem[]; respectReducedMotion?: boolean }) {
  const timelineRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || !window.IntersectionObserver) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const entries = Array.from(timeline.children) as HTMLLIElement[];
    if (media.matches && respectReducedMotion) return;

    const observer = new IntersectionObserver((observations) => {
      observations.forEach(({ target, isIntersecting }) => {
        (target as HTMLElement).dataset.reveal = isIntersecting ? "visible" : "pending";
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

    entries.forEach((entry) => {
      entry.dataset.reveal = "pending";
      observer.observe(entry);
    });

    const revealAll = () => {
      if (!media.matches || !respectReducedMotion) return;
      entries.forEach((entry) => { entry.dataset.reveal = "visible"; });
      observer.disconnect();
    };
    media.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", revealAll);
      entries.forEach((entry) => { delete entry.dataset.reveal; });
    };
  }, [items, respectReducedMotion]);

  return (
    <ol ref={timelineRef} data-motion={respectReducedMotion ? "system" : "enabled"} className={cn(styles.timeline, "relative m-0 list-none p-0")}>
      {items.map((item, index) => {
        const imageOnLeft = index % 2 !== 0;
        return (
          <li key={`${item.date}-${item.title}`} data-image-side={imageOnLeft ? "left" : "right"} className={cn(styles.entry, "relative grid grid-cols-[36px_minmax(0,1fr)] gap-y-6 py-9 md:py-12 lg:grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] lg:items-center lg:py-14")}>
            <div aria-hidden="true" className="relative z-10 col-start-1 row-span-2 row-start-1 flex justify-center self-stretch pt-1 lg:col-start-2 lg:row-span-1 lg:self-stretch lg:pt-0">
              <span className={cn(styles.marker, "flex h-8 w-8 items-center justify-center rounded-full border border-[#b79a7d] bg-[#f7f0e6] font-serif text-xs text-[#8b5e3c] lg:mt-6 lg:h-11 lg:w-11 lg:text-base")}>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className={cn(styles.text, "col-start-2 row-start-1 min-w-0 px-5 sm:px-8 lg:px-0", imageOnLeft ? "lg:col-start-3 lg:pl-4 lg:pr-12" : "lg:col-start-1 lg:pl-12 lg:pr-4")}>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b5e3c]">{item.date}</p>
              <h3 className="font-serif text-2xl leading-tight tracking-[-0.025em] text-[#302016] sm:text-3xl lg:text-[34px]">{item.title}</h3>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#705b4c]">{item.description}</p>
            </div>
            <div className={cn(styles.image, "relative col-start-2 row-start-2 mx-5 aspect-[4/3] min-w-0 overflow-hidden rounded-lg bg-[#ead9c8] sm:mx-8 lg:row-start-1 lg:mx-0", imageOnLeft ? "lg:col-start-1 lg:ml-12 lg:mr-4" : "lg:col-start-3 lg:ml-4 lg:mr-12")}>
              <Image src={item.image} alt={item.imageAlt ?? item.title} fill sizes="(max-width: 767px) 85vw, (max-width: 1023px) 80vw, 450px" className="object-cover" />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
