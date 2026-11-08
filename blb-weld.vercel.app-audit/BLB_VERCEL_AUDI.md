# Bean Leaf Brew Next.js SEO Audit

**Site:** https://blb-weld.vercel.app/  
**Audit date:** 3 November 2026  
**Business type:** Ecommerce specialty coffee and instant-premix brand with local Bengaluru operations  
**SEO Health Score:** **49/100**

> This score is an audit heuristic, not a Google score. It combines live HTTP/raw-HTML checks, a crawl of linked public routes and representative products, source review, search visibility checks, asset analysis, lint/build verification, and the installed SEO framework. Search Console, GA4, Merchant Center, GBP, platform-specific AI citation data, and CrUX field data were unavailable. PageSpeed Insights was quota-blocked, so performance is provisional.

## Executive summary

The new Next.js storefront is visually cleaner and technically stronger than the legacy WordPress site in several ways: HTTPS/security headers are good, public pages return correct status codes, homepage/product content is server-rendered, headings are disciplined, and image-alt coverage is strong.

It is **not ready for an SEO-safe production cutover**. The highest-leverage problem is migration control: `beanleafbrew.com` remains the indexed production site, while the Vercel host has no canonical strategy and did not surface in the sampled `site:` search. Before any launch, choose the production host and keep the preview host out of the index.

The second major constraint is `/shop`: the initial HTML contains a client-rendering bailout and only a loading skeleton. Twenty-three product slugs are serialized in RSC data, but there are zero raw product anchors. This weakens crawl discovery, internal-link equity, no-JS resilience, and the main commercial landing page.

Other launch blockers are missing sitemap/robots/canonicals, indexable utility routes, no Product/Offer/Organization schema, thin product content, absent ecommerce policy pages, and a deployed build that does not match the current workspace. The current source also fails `npm run build` with a reproducible Turbopack error, although lint passes.

## Scorecard

| Category | Weight | Score | Weighted contribution |
|---|---:|---:|---:|
| Technical SEO | 22% | 55 | 12.1 |
| Content quality | 23% | 55 | 12.7 |
| On-page SEO | 20% | 46 | 9.2 |
| Schema / structured data | 10% | 5 | 0.5 |
| Performance | 10% | 56 | 5.6 |
| AI search readiness | 10% | 53 | 5.3 |
| Images | 5% | 66 | 3.3 |
| **Total** | **100%** |  | **48.7 -> 49/100** |

## Crawl snapshot

| Page | Status | Title length | Description length | H1 | Approx. main words | Canonical | JSON-LD |
|---|---:|---:|---:|---:|---:|---|---:|
| `/` | 200 | 42 | 128 | 1 | 464 | Missing | 0 |
| `/shop` | 200 | 28 | 104 | 1 | 69 + loading skeleton | Missing | 0 |
| `/about` | 200 | 22 | 76 | 1 | 118 | Missing | 0 |
| `/contact` | 200 | 24 | inherited root description | 1 | 45 | Missing | 0 |
| Six sampled products | 200 | 26-49 | 41-82 | 1 each | 51-75 | Missing | 0 |
| `/robots.txt` | 404 | - | - | - | - | - | - |
| `/sitemap.xml` | 404 | - | - | - | - | - | - |

## What is working

- Public routes and sampled products return `200`; invalid routes return a real `404`.
- HTTPS, HSTS, frame denial, MIME-sniffing protection, referrer policy, and permissions policy are present.
- Homepage is prerendered and served from Vercel cache.
- Homepage and product copy is present in initial HTML.
- One H1 appears on each sampled public page.
- All sampled image elements had alt attributes; homepage Next Image output uses responsive sources.
- `next/font` self-hosts the fonts.
- Homepage contains concrete brand/location/sourcing facts and visible contact information.
- `npm run lint` passes.

## Priority findings

### 1. Critical migration gate — Resolve host, indexation, and redirect strategy

The Vercel host has no canonical tags. The old `beanleafbrew.com` site remains indexed with product/category URLs, while the staging host did not surface in the sampled site search.

**Action:** If Vercel is staging, apply site-wide `noindex` immediately and do not submit its sitemap. If this code will replace production, generate all canonical metadata and schema with `https://beanleafbrew.com`, keep preview hosts non-indexable, and build a complete legacy redirect map.

**Dependency:** This decision must happen before sitemap, schema, social metadata, or Search Console submission.

**Failure test:** Both hosts appear indexed, Google selects a Vercel canonical, or high-value legacy URLs become 404s.

### 2. High — Server-render the shop catalog and product links

`/shop` includes `BAILOUT_TO_CLIENT_SIDE_RENDERING`, a skeleton, 23 serialized product slugs, and zero raw product anchors. The main cause is the client component's search-parameter dependency.

**Action:** Render the default catalog and links on the server. Pass initial filters from route `searchParams` and retain client-side search/sort as enhancement.

**Dependency:** Unblocks crawl discovery, on-page relevance, internal linking, schema/breadcrumb work, and no-JS resilience.

**Failure test:** `curl`/View Source still shows only the loading skeleton or no `/shop/{slug}` anchors.

### 3. High — Add sitemap, robots, canonicals, and noindex controls

`robots.txt` and `sitemap.xml` return `404`; canonicals are absent; checkout/success/admin routes are indexable.

**Action:** After host selection, add Next metadata routes for robots/sitemap, absolute canonicals for indexable pages, and `noindex` controls for operational routes. Exclude all noncanonical/utility URLs from the sitemap.

**Failure test:** Sitemap lists a redirect/noindex/4xx URL, parameter URLs index separately, or admin/checkout appears in search.

### 4. High — Add truthful ecommerce and brand structured data

All sampled pages have zero JSON-LD, microdata, or RDFa.

**Action:** Add a linked Organization/WebSite graph and Product/Offer or ProductGroup/BreadcrumbList on product pages. Use absolute canonical URLs, INR, current price/availability, real identifiers, and only visible/verified reviews, shipping, and return details.

**Dependency:** Canonical host, product identifiers, inventory, and policy content must be reliable first.

**Failure test:** Structured price/availability diverges from the visible page or validators report Product errors.

### 5. High — Expand product pages and publish store policies

Representative products contain roughly 51-75 main-content words and omit many purchase-critical facts. Privacy, terms, shipping, return/refund, and payment policy routes are absent.

**Action:** Add verified specifications, preparation, ingredients/nutrition/allergens, origin, shelf life/storage, roast/pack cadence, logistics, policies, reviews, and related links. Keep claims accurate and visible.

**Failure test:** A shopper still needs external research or support to answer common pre-purchase questions.

### 6. High — Fix deployment parity and production build health

Live markup uses image quality/logo behavior that differs from the current repo. The current workspace fails `next build` with a Turbopack error while processing `globals.css`, even outside the restricted environment.

**Action:** Diagnose against the bundled Next 16.3.6 docs, get a clean build, deploy the intended SHA, and repeat the crawl/Lighthouse checks.

**Failure test:** Release cannot be reproduced from a clean checkout or live markup still differs from the intended commit.

### 7. High — Reduce hero media cost

The direct hero poster is about 976 KB and is duplicated in preload hints. The deferred video is about 14.2 MB and downloads automatically after page load.

**Action:** Use one responsive poster below roughly 200-300 KB, encode smaller mobile/desktop loops, respect reduced data/motion, and load video only when justified.

**Failure test:** The original poster/video still transfers automatically on constrained mobile, or p75 LCP remains above 2.5 seconds.

### 8. Medium — Improve metadata and social previews

Shop/About/Contact titles are under 30 characters; Contact inherits the root description; product descriptions are short; Open Graph and Twitter/X metadata are absent.

**Action:** Add page-type metadata templates, intent-matched copy, canonical URLs, and social-preview images. Avoid padding titles solely to meet length targets.

### 9. Medium — Strengthen E-E-A-T and claim substantiation

Visible NAP and sourcing facts are useful, but founder/team expertise, producer evidence, certifications, review provenance, and traceability proof are thin. Some product data uses health/function language without visible evidence.

**Action:** Add accountable people, process/producer evidence, verified reviews, certification/FSSAI context, and compliance-reviewed claims.

### 10. Medium — Build a small first-hand content cluster

There is no resource layer for grind selection, South Indian filter ratios, coffee/chicory comparisons, roast choice, premix preparation, storage, or whole bean versus ground.

**Action:** Publish a focused set of expert guides using original process photos/data and link them bidirectionally with categories/products.

## AI search readiness

**Score: 53/100.** Search-focused AI crawlers are not blocked because robots is absent, and the homepage has citable raw HTML with concrete facts. The main limitations are the same upstream SEO constraints: weak product facts, no entity/product graph, unsubstantiated claims, and limited informational coverage. Missing `llms.txt` is informational only and should not outrank core SEO work.

## Search experience

**SXO score: 48/100.** The visual design and page intent are sound, but the shop skeleton in raw HTML, thin product detail, absent policies, limited proof, and media cost create discovery and conversion friction.

## Limitations

- No Search Console, GA4, Merchant Center, GBP, or provider-specific AI visibility data
- No CrUX field data; PageSpeed Insights quota prevented a fresh Lighthouse run
- Performance score is provisional and must be remeasured after the intended deployment
- Search visibility was sampled, not a complete rank-tracking study
- The live deployment differs from the workspace, so post-deploy revalidation is mandatory

## Next audit

Re-audit immediately after the intended commit is deployed and again 28 days after production cutover. The next audit should verify raw shop anchors, canonical/redirect behavior, sitemap indexation, schema validity, utility-route exclusion, mobile/desktop Lighthouse, and field LCP/INP/CLS. Monitor indexed versus submitted URLs and non-brand product/category impressions as the leading indicators.
