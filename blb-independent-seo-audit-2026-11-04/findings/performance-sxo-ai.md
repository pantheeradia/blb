# BLB Performance, Search Experience, Accessibility, and AI-Readiness Findings

Audit date: 4 November 2026  
Scope: current BLB deployment and repository only. No competitor or prior-audit data was used.

## Scores

| Area | Score | Basis |
|---|---:|---|
| Performance implementation | 40/100 | Verified HTML/asset/build evidence; no field CWV available |
| Search experience (SXO) | 55/100 | Public route/content/template review |
| Accessibility foundations | 68/100 | Semantic/source review; not a substitute for a full assistive-technology test |
| AI search readiness | 45/100 | Citability, structure, entity and crawler-readiness review |

## Measurement limitation

Google PageSpeed Insights returned HTTP 429 for both mobile and desktop during this audit. No Search Console/CrUX field data was available. Therefore no Lighthouse performance score, LCP, INP, CLS, FCP, or TBT value is claimed.

## Performance findings

### Medium — hero media is heavy for mobile delivery

Fresh repository evidence shows:

- `public/images/HB_03.webp`: approximately 976 KB;
- `public/videos/file.mp4`: approximately 14.2 MB;
- multiple source product images: approximately 2–2.7 MB each;
- live homepage raw HTML response: approximately 139 KB.

The hero poster is preloaded in the root layout and used as the video poster. The video source is assigned after window load and the element uses `preload="none"`, which is a useful safeguard, but it can still consume substantial bandwidth soon after load.

**Recommendation:** create correctly sized AVIF/WebP poster variants, preload only the exact responsive LCP candidate, compress/shorten the video, use mobile-specific delivery, and honor reduced-motion/data-saver preferences. Validate with real-user mobile LCP/INP/CLS after release.

### Medium — source-image control is inconsistent

`next/image`, responsive `sizes`, optimized formats, and long cache settings are good foundations. However, several remote/local sources are oversized and duplicate files exist. This increases origin storage/processing cost and can create accidental unoptimized delivery paths.

**Recommendation:** cap upload dimensions and bytes, preprocess sources, retain archival originals outside the public delivery path, and remove unused duplicates.

### Medium — default production build is unreliable in the current environment

`npm run build` failed with a Turbopack internal CSS-processing error. `next build --webpack` compiled, type-checked, generated all 52 routes, and completed successfully, including 24 product pages.

**Recommendation:** make the production build mode explicit in CI until the Turbopack issue is resolved, pin/test the Next.js version, and keep a clean deploy smoke test for robots, sitemap, canonicals, product pages, and noindex routes. This is a release-reliability finding, not a direct ranking failure.

## Search-experience findings

### High — catalog navigation is not search-crawler friendly

The shop experience offers useful search, filter, sort, and pagination controls for users, but the initial raw shop HTML contains no product-detail anchors and pagination is button-only client state. This separates the user-visible catalog from the crawlable document graph.

**Recommendation:** server-render the initial product grid, use real anchors for products, and expose URL-based pagination. Treat client filtering/sorting as progressive enhancement.

### High — transaction/auth pages can appear in search

Checkout, order-success, admin-login, and admin-reset routes return 200 without `noindex`. Their snippets can inherit unrelated public metadata.

**Recommendation:** emit `noindex, nofollow`, exclude these routes from the sitemap, and keep sensitive/private URLs outside public navigation.

### Medium — product decision support is incomplete

Most product pages contain only short copy plus limited attributes. Key decision questions—ingredients, brew/preparation method, servings, caffeine, allergens, storage, delivery, returns, and product differences—are commonly unanswered.

**Recommendation:** add semantic, truthful product sections close to purchase controls and link relevant policies/guides. This should improve both search intent satisfaction and conversion confidence.

### Medium — missing policies weaken checkout trust

The public footer/route inventory lacks privacy, terms, shipping, returns/refund, payment, and cancellation pages.

**Recommendation:** publish and link policy pages from the footer, product detail, and checkout, using consistent legal business details.

## Accessibility foundations

### What works

- Public page templates generally use one H1 and semantic headings.
- Public image components include alt attributes; the navigation logo is correctly decorative within a labelled home link.
- Buttons and navigation controls commonly include accessible names.
- Next.js emits responsive viewport metadata.
- Visible focus styles are present on major navigation controls.

### Medium — gallery thumbnail naming is repetitive

Product gallery alts such as “Product thumbnail 1” and “Product - Image 1” can duplicate information already conveyed by labelled controls.

**Recommendation:** store image-specific factual alt text for meaningful images; use empty alt for redundant thumbnail images inside already-labelled buttons.

### Medium — interactive catalog needs keyboard/screen-reader regression testing

The filter, search, sort, pagination, cart drawer, mobile menu, product variant controls, and checkout form are client-driven. Source review shows useful labels and ARIA in several places, but a complete keyboard, focus-order, announcement, error-message, and screen-reader test was not performed.

**Recommendation:** add automated accessibility checks plus manual keyboard and VoiceOver/NVDA testing for the end-to-end browse-to-checkout flow.

## AI search readiness

### High — key facts are not encoded as a connected entity/product graph

No structured data was found. Search and answer engines must infer the relationship among Bean Leaf Brew, its location, contact details, products, offers, and pages.

**Recommendation:** add stable, canonical JSON-LD `@id` values connecting Organization/LocalBusiness, WebSite, WebPage, Product, Offer, and BreadcrumbList nodes.

### High — product passages are too thin to cite safely

Most product pages lack complete, self-contained answers and several claims are not visibly substantiated. This reduces passage-level usefulness and citation safety.

**Recommendation:** use answer-first sections, explicit units/ingredients/preparation, named sources or evidence where required, and clear update/ownership processes.

### Medium — named expertise and evidence are limited

The site has a first-party brand story and location data but no strong named expert profile, credentials, process evidence, or claim documentation in the examined templates.

**Recommendation:** publish truthful founder/roaster/technical profiles, sourcing and roasting methodology, and verifiable claim support. Keep NAP and entity naming consistent across all public pages and schema.

### Low — agent discovery files are optional later work

No `llms.txt` or agent-specific discovery file was found. These files are not a substitute for crawlability, canonicals, schema, and strong page content.

**Recommendation:** consider a concise discovery file only after the foundational fixes, ensuring it points to canonical public resources and does not expose private/API routes.

## Validation after fixes

1. Capture mobile/desktop Lighthouse lab baselines and real-user 75th-percentile LCP, INP, and CLS.
2. Confirm raw shop HTML contains product links and page-2 URLs.
3. Complete keyboard and screen-reader testing for browse, cart, product options, and checkout.
4. Validate JSON-LD on real product URLs and confirm visible/schema parity.
5. Re-check utility routes for noindex and verify no sensitive endpoints are publicly discoverable.
6. Test reduced-motion/data-saver behavior and mobile hero transfer size.

