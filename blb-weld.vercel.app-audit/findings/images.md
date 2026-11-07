# Image and Media SEO Findings

**Audit target:** https://blb-weld.vercel.app/  
**Checked:** 3 November 2026  
**Category score:** **66/100**

## What works

- All 31 homepage `<img>` elements in raw production HTML had non-empty alt text. The sampled shop, About, Contact, and product pages also had alt attributes on every image.
- Homepage images were emitted through Next Image with `srcset` and `sizes`; below-fold images were lazy-loaded. Product gallery thumbnails are lazy-loaded and the first main product image is eager (`src/components/shop/ProductImageGallery.tsx:38-45`, `103-109`).
- Browser-format delivery is effective for normal Next Image requests: a 1,080 px derivative of `GC_Beans_01.webp` was served as AVIF at about **155.5 KB**, and a 640 px derivative at about **66.2 KB** when the request advertised AVIF/WebP support.
- Product, category, partner, and story imagery generally uses relevant alt text rather than filenames (`src/components/home/ShopByCategory.tsx:52-58`, `src/components/home/FeaturedProducts.tsx:59-65`).

## Findings

### High — The likely LCP poster bypasses responsive optimization

The hero video poster `/images/HB_03.webp` is preloaded directly from the root layout (`src/app/layout.tsx:32`) and used directly as the `<video poster>` (`src/components/home/Hero.tsx:84-95`). Production reported a **975,882-byte** poster. Unlike Next Image assets, a video poster has no responsive `srcset`, so mobile users receive the full file.

**Impact:** A roughly 953 KB above-the-fold poster is well above the audit target for a hero image and can delay LCP on constrained mobile connections.

**Recommendation:** Create a purpose-sized, visually equivalent AVIF/WebP poster around 1,200-1,600 px with a target below 200-300 KB, or use a responsive image as the initial hero and swap to video after interaction/idle. Preload only the exact optimized LCP asset.

**Dependency:** Confirm the actual LCP element with Lighthouse/CrUX before changing preload behavior.

**Validation / failure test:** On a throttled mobile Lighthouse run, the chosen poster should be the LCP resource, transfer under 300 KB, and avoid a later image/video swap that worsens CLS. Track p75 LCP after release.

### High — The hero video is deferred but still transfers about 14.2 MB

Production `/videos/file.mp4` reported **14,236,751 bytes**. The implementation correctly sets `preload="none"` and injects the source after window load plus 500 ms (`src/components/home/Hero.tsx:10-27`, `84-95`), so it does not block initial HTML rendering. It nevertheless begins downloading automatically for every capable visitor soon after load.

**Impact:** This can consume mobile data and compete with late page resources, especially on slow connections. It is a media-performance issue rather than an alt-text defect.

**Recommendation:** Encode a much shorter/lower-bitrate loop, supply mobile and desktop sources, respect reduced-data/reduced-motion preferences, and consider load-on-interaction or viewport-idle loading.

**Validation / failure test:** Compare transferred bytes and LCP on mobile with video enabled versus poster-only. If conversion/engagement does not improve, the automatic download has failed its cost-benefit test.

### Medium — Source assets are substantially oversized even though Next Image mitigates delivery

The repository contains 180 image files; 19 exceed 500 KB and 11 exceed 1 MB. Examples include `GC_Beans_01.webp` at about 2.62 MB, `DB_Beans_01.webp` at about 2.52 MB, and two enhanced/source logo PNGs over 1 MB. Next Image prevents most of those originals from being sent directly, so this is not a claim that every visitor downloads them. Direct poster/CSS/static use, optimizer CPU, cold-cache latency, and deployment size still benefit from normalized sources.

**Recommendation:** Keep master photography outside `public`; store web-ready masters at practical dimensions and compression. Audit all CSS backgrounds and direct file URLs because they bypass Next Image transformations.

**Validation / failure test:** Build a referenced-asset inventory. No directly served content image should exceed 500 KB, and normal responsive derivatives should remain under the category thresholds.

### Medium — Product gallery alt text is mechanical rather than descriptive

The main gallery uses `"{product} - Image N"` and thumbnails use `"{product} thumbnail N"` (`src/components/shop/ProductImageGallery.tsx:38-45`, `103-109`). This identifies the product but does not describe front pack, back label, ingredients, texture, or serving presentation. The thumbnail buttons already carry `aria-label`, so repeated thumbnail alt text can also be redundant for assistive technology.

**Recommendation:** Store an alt/caption per product asset. Use descriptive main-image alt text; use empty alt on a thumbnail when the surrounding button label already conveys its control purpose, or provide a distinct label such as “View back-of-pack nutrition panel.”

**Validation / failure test:** Each gallery image should be distinguishable without seeing it; repeated thumbnails should not produce duplicate announcements.

### Low — Duplicate partner marquee images repeat alt text

The partner array is duplicated to create a seamless animation (`src/components/home/PartnerMarquee.tsx:6-7`), causing nine partner-logo alts to appear twice in production. The second visual sequence is animation scaffolding, not new content.

**Recommendation:** Hide the duplicate sequence from assistive technology or render duplicate logo images with empty alt while retaining one accessible partner list and link name.

### Info — Missing width/height attributes are not automatically a CLS failure here

Raw homepage HTML showed 29 of 31 images without numeric `width` and `height`, primarily because Next Image `fill` is used. Most are constrained by explicit aspect-ratio or fixed-size containers. Treat this as a Lighthouse/CLS verification item, not a blanket defect.

## Leading indicators

- Hero poster transfer size and p75 LCP
- Total homepage media bytes before and after user interaction
- Image optimizer cache hit rate and cold-transform latency
- Count of unique, useful product-image descriptions
- CLS remains below 0.1 at the 75th percentile

