"use client";

import { useState } from "react";
import Image from "next/image";

interface Partner {
  name: string;
  website: string;
  logo: string | null;
  hasLogo: boolean;
}

const partners: Partner[] = [
  {
    name: "Barn House",
    website: "https://essensai.com/whitefield-067/barnhouse",
    logo: "/images/partners/barn-house.png",
    hasLogo: true,
  },
  {
    name: "Nonnina Pizza",
    website: "https://www.zomato.com/bangalore/nonnina-seegehalli-bangalore",
    logo: "/images/partners/nonnina.png",
    hasLogo: true,
  },
  {
    name: "Cake Bee",
    website: "https://cakebee.in/",
    logo: "/images/partners/cakebee-logo.png",
    hasLogo: true,
  },
  {
    name: "Cake Bee",
    website: "https://cakebee.in/",
    logo: "/images/partners/cakebee-logo.png",
    hasLogo: true,
  },
  {
    name: "Cake Bee",
    website: "https://cakebee.in/",
    logo: "/images/partners/cakebee-logo.png",
    hasLogo: true,
  },
  {
    name: "Cake Bee - Franchise",
    website: "https://cakebee.in/",
    logo: "/images/partners/cakebee-logo.png",
    hasLogo: true,
  },
  {
    name: "Probe",
    website: "https://probe42.in/",
    logo: "/images/partners/probe42.png",
    hasLogo: true,
  },
  {
    name: "Keto Chennai",
    website: "https://wa.me/918903280064?utm_source=chatgpt.com",
    logo: "/images/partners/keto-chennai.png",
    hasLogo: true,
  },
  {
    name: "Sheraton Grand",
    website: "https://www.marriott.com/hotels/travel/bglsg-sheraton-grand-bangalore-hotel-at-brigade-gateway/",
    logo: "/images/partners/Sheraton-Grand.png",
    hasLogo: true,
  },
  {
    name: "Amma's Pastries",
    website: "https://ammaspastries.in/",
    logo: "/images/partners/amma-pastries.png",
    hasLogo: true,
  },
  {
    name: "Barbacoa Restaurant & Grill",
    website: "https://barbacoarestaurants.com/",
    logo: "/images/partners/barb.png",
    hasLogo: true,
  },
  {
    name: "Harpos",
    website: "#",
    logo: null,
    hasLogo: false,
  },
];

export function PartnerMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  return (
    <section className="bg-[#EAD9C8] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9953C] mb-2">
            Trusted by our partners
          </p>
          <h2 className="font-serif text-2xl md:text-4xl text-[#1A0E08]">
            Good company, great coffee.
          </h2>
          <p className="text-sm text-[#4A2512] mt-3">
            A few of the partners we're proud to work with
          </p>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#EAD9C8] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#EAD9C8] to-transparent z-10" />

        <div
          className={`flex items-center gap-8 md:gap-16 px-8 ${
            isPaused ? "" : "animate-marquee"
          }`}
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <a
              key={`${partner.name}-${index}`}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 transition-transform hover:scale-105 flex items-center justify-center"
              style={{ width: "160px", height: "80px" }}
              aria-label={`Visit ${partner.name} website`}
            >
              {partner.hasLogo && partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={160}
                  height={80}
                  className="object-contain"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                  onError={(e) => {
                    console.error(`Failed to load logo for ${partner.name}:`, e);
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="font-serif text-lg md:text-xl text-[#1A0E08] hover:text-[#C9953C] transition-colors text-center px-2">
                  {partner.name}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
