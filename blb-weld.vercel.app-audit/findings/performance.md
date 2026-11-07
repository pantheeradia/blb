# Performance Findings

**Audit target:** https://blb-weld.vercel.app/  
**Checked:** 3 November 2026  
**Category score:** **56/100 provisional**

Google PageSpeed Insights returned a quota error, so no current Lighthouse score or field LCP/INP/CLS was available. This score is based on live transfer behavior and implementation review and must be replaced with measured mobile/desktop results after deployment.

## What works

- The homepage is prerendered and served from Vercel cache.
- Fonts are self-hosted through `next/font`.
- Most content images use Next Image, responsive `srcset`, lazy loading, and meaningful alt text.
- The hero video uses `preload="none"` and its source is assigned after page load, protecting the initial request waterfall.

## Findings

### High — Hero poster is an oversized LCP candidate

`public/images/HB_03.webp` is 975,882 bytes and is used directly as the video poster. It is manually preloaded in the root layout, and live HTML emitted duplicate preloads. A video poster does not receive responsive Next Image sizing.

**Recommendation:** Produce responsive mobile/desktop poster variants, target roughly 100-300 KB, and preload one exact LCP candidate.

**Validation / failure test:** Mobile network traces show one poster request at the intended size and p75 LCP is at or below 2.5 seconds. If the 976 KB original is still requested before LCP, the fix failed.

### High — Hero video transfers about 14.2 MB automatically

`public/videos/file.mp4` is 14,236,751 bytes. Although deferred until after load, it begins downloading for every capable visitor.

**Recommendation:** Re-encode a shorter/lower-bitrate loop, provide mobile and desktop encodes, respect reduced-data/reduced-motion preferences, and load only when visible or after clear intent.

**Validation / failure test:** Compare total transferred media bytes and engagement with the video enabled versus poster-only. Remove automatic loading if it does not justify its cost.

### Medium — JavaScript and hydration footprint is material

Homepage HTML measured 140,665 bytes. Ten JavaScript chunks plus one stylesheet totaled about 717.6 KB decoded. Static sections such as the partner marquee are client components, and the shop catalog fully bails to client rendering.

**Recommendation:** Keep interactive islands client-side, server-render static markup and the default catalog, and lazy-load nonessential interaction.

**Validation / failure test:** Built route JavaScript and Lighthouse Total Blocking Time should fall without losing catalog content in raw HTML.

### Medium — Live media caching does not reflect the intended config

Sampled poster, video, source images, and optimized image responses used `max-age=0, must-revalidate`. The current `minimumCacheTTL` setting is not reflected by the deployed build.

**Recommendation:** Deploy the intended config, use versioned assets, and verify long-lived caching for immutable media.

### Medium — Source asset library is oversized

Nineteen repository images exceed 500 KB, 11 exceed 1 MB, and several product masters exceed 2.4 MB. Next Image mitigates most delivery, but direct posters/backgrounds, optimizer cold starts, and deployment size still suffer.

**Recommendation:** Store web-ready masters at practical dimensions and audit all direct/CSS references.

## Required measurement after release

- Mobile and desktop Lighthouse on home, shop, and representative product pages
- CrUX/Search Console field data at the 75th percentile
- Targets: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1
- Initial media transfer, total JavaScript, and cache-hit behavior
