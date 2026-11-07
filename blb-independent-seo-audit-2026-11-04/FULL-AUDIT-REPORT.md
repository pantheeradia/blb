# BLB Independent SEO Audit

**Audit date:** 4 November 2026 (Asia/Calcutta)  
**Audited property:** `https://blb-weld.vercel.app` and the current repository build  
**Business type:** direct-to-consumer coffee and beverage ecommerce, with a Bengaluru production/local-business presence  
**Method:** fresh live HTTP checks, rendered/raw HTML inspection, current source review, current catalog inspection, asset analysis, and a production build. Existing audit folders and competitor data were excluded.

## Executive summary

## SEO health score: 43/100

BLB has a visually distinctive, server-rendered site with clean public URLs, unique product titles, one H1 on measured public pages, descriptive product slugs, useful first-party location/sourcing signals, and solid baseline HTTPS/security headers. The main constraint is not visual quality; it is discoverability and machine-readable clarity.

The current deployment has no robots file, no XML sitemap, no canonical URLs, no structured data, and no crawlable catalog pagination. Several utility/authentication pages are indexable. Most product pages are thin, nine visible products have no image, and four product families appear near-duplicate. A public debug endpoint is a separate Critical security and trust incident that must be handled before routine SEO work.

The score is a transparent audit heuristic, not a Google score or ranking forecast.

| Category | Weight | Score | Weighted contribution |
|---|---:|---:|---:|
| Technical SEO | 22% | 43 | 9.46 |
| Content quality | 23% | 52 | 11.96 |
| On-page SEO | 20% | 48 | 9.60 |
| Structured data | 10% | 5 | 0.50 |
| Performance implementation | 10% | 40 | 4.00 |
| AI search readiness | 10% | 45 | 4.50 |
| Image SEO | 5% | 58 | 2.90 |
| **Total** | **100%** |  | **42.92 → 43/100** |

Performance is scored only from verified implementation and asset evidence. Google PageSpeed returned HTTP 429, and no CrUX/GSC field data was available, so this audit does not claim measured LCP, INP, or CLS values.

## Immediate alert

### Critical — public debug endpoint exposes production information and writes to the database

Fresh live checks found that `/api/debug` is publicly accessible, returns secret-derived payment information, the database URL, and pending-order identifiers, and performs a database write on every GET. Sensitive values are intentionally omitted from this report.

**Required today:** remove or authenticate the route, rotate the Razorpay secret, review Razorpay/Turso/Vercel access logs, remove diagnostic writes, and purge retained cache/log copies where possible.

## Top findings

1. **Critical:** public diagnostic API exposes production payment/database information and mutates production state.
2. **High:** `/robots.txt` and `/sitemap.xml` both return 404.
3. **High:** no canonical URLs are emitted on measured public pages or products.
4. **High:** raw `/shop` HTML contains no product-detail links; pagination is button-only client state.
5. **High:** checkout, order-success, admin-login, and admin-reset pages are indexable.
6. **High:** no Product, Offer, Organization/LocalBusiness, WebSite, or Breadcrumb structured data exists.
7. **High:** 23 of 24 product descriptions are under 100 words; 16 are under 50 words.
8. **High:** nine visible products have no product image.
9. **High:** four near-duplicate product families need consolidation or explicit differentiation.
10. **Medium:** large hero/video and source-image assets create mobile performance risk, but field CWV was unavailable.

## Quick wins

1. Add `noindex, nofollow` to checkout, success, admin login, and admin reset.
2. Add a production-host `metadataBase`, self-referencing canonicals, and page-specific social metadata.
3. Generate `robots.ts` and a complete `sitemap.ts` containing all active public product URLs.
4. Add server-rendered Product + Offer + Breadcrumb JSON-LD to the product template.
5. Add unique contact metadata and remove reliance on the legacy keywords field.
6. Add an original image to each of the nine image-less products before asking search engines to index them.
7. Link privacy, terms, shipping, returns/refund, payment, and cancellation policies from the footer/checkout.

## Technical SEO

**Score: 43/100**

### What works

- HTTPS is enforced and the deployment sends strong HSTS.
- Clean, descriptive, hyphenated public URLs are used.
- Invalid routes return a real 404 with `noindex`, avoiding soft-404 behavior.
- Primary homepage, about, contact, and product content is present in server HTML.
- Measured public pages and products use one H1.
- Security headers include `X-Content-Type-Options`, `X-Frame-Options`, Referrer-Policy, and Permissions-Policy.

### Main gaps

- Missing robots and sitemap files remove the crawl-control and URL-discovery foundation.
- Canonicals are absent across all measured templates, including parameter variants.
- Product discovery is JavaScript-dependent: raw shop HTML had zero `/shop/{slug}` links and client-side pagination uses buttons instead of URLs.
- Preview/staging hostname indexing is not controlled.
- Utility/authentication routes inherit public metadata and remain indexable.
- A Content Security Policy is absent.

See `findings/technical.md` for the full evidence set.

## Content quality

**Score: 52/100**

BLB communicates a clear coffee proposition and supplies meaningful first-party facts: Whitefield location, Coorg/Chikmagalur sourcing, altitude, address, phone, email, hours, and a brand story. The shop language is distinctive and product titles/slugs are clear.

The largest weakness is product completeness. Across 24 visible products, the mean long description is about 48 words; 23 are below 100 words and 16 are below 50. Most pages do not fully answer ingredients, preparation, serving size, caffeine, allergens, storage, origin, freshness, delivery, returns, or product-specific questions.

Claims such as traceability, freshness windows, low-glycemic positioning, antioxidant/nutrition benefits, protein content, and estate quality need visible substantiation. Create a claim register with permitted wording, owner, evidence, test date/method, and the supporting document.

## On-page SEO

**Score: 48/100**

Unique product title generation and one H1 per page are positive. Gaps include absent canonicals, incomplete descriptions, no Open Graph/Twitter fields, no metadata base, weak contact-page description handling, flat product-detail structure, and no visible breadcrumbs.

Category/filter states currently use query parameters and client state. If those states are not intended landing pages, canonicalize them to `/shop`. If they are intended to rank, build dedicated server-rendered category URLs with unique content and metadata.

## Structured data

**Score: 5/100**

No JSON-LD, Microdata, or RDFa was found. Add:

- Organization or the most accurate LocalBusiness subtype on core pages;
- WebSite plus appropriate WebPage/AboutPage/ContactPage nodes;
- Product + Offer on every product page with truthful price, INR currency, availability, absolute image URL, brand, and canonical URL;
- BreadcrumbList with matching visible breadcrumbs.

Do not add rating/review, SKU, or GTIN data unless it is real, visible where required, and policy-compliant.

## Performance and Core Web Vitals readiness

**Implementation score: 40/100; field CWV not measured**

Verified risks include a roughly 976 KB hero poster, a roughly 14.2 MB hero video, several 2–2.7 MB source images, and a roughly 139 KB homepage HTML response. `next/image`, responsive `sizes`, modern formats, font optimization, and delayed video source assignment are useful foundations, but the hero media remains a likely mobile-bandwidth and LCP risk.

The default `npm run build` hit a Turbopack internal CSS-processing error in this environment. The supported `next build --webpack` path completed successfully, type-checked, generated 52 routes, and produced 24 product pages. Treat this as release reliability, not a direct ranking failure.

Recommended next measurement: collect real-user LCP, INP, and CLS at the 75th percentile after deployment, segmented mobile/desktop, then use Lighthouse only as repeatable lab diagnostics.

## Image SEO

**Score: 58/100**

Positive foundations include `next/image`, responsive sizes, modern formats, and alt attributes on public image components. The current catalog has nine products with no image. Product-card alts often repeat only the product name, while gallery alts use generic image numbering. Five checked remote source images were approximately 0.7–2.7 MB, and the repository image directory contains many large/duplicate assets.

Add accurate product-specific images, store per-image alt text, mark redundant thumbnails decorative where appropriate, normalize descriptive filenames, cap upload dimensions/bytes, and remove unused delivery-path duplicates.

## AI search readiness

**Score: 45/100**

BLB has specific entity/location/product facts that answer engines can extract, but it lacks the explicit structure and evidence that make facts safe to cite. The main gaps are missing structured data, unsupported claims, thin product explanations, no first-party educational content, limited named expertise, no clear policy corpus, and incomplete machine-readable discovery.

Priorities are the same fundamentals required for search: consistent entity details, evidence-backed claims, answer-first product content, visible authorship/expertise, crawlable URLs, and validated schema. `llms.txt` may be considered later as a discovery convenience, but it is not a substitute for these foundations.

## Content and trust gaps

- No visible privacy, terms, shipping, return/refund, payment, or cancellation pages in the current public route/footer inventory.
- No named founder/roaster/food-technologist profile with relevant experience or credentials.
- Testimonials lack source/date/product verification context.
- Four product families have near-duplicate URLs and intent.
- Product pages lack semantic sections for ingredients, preparation, nutrition, allergens, storage, sourcing, and FAQs.

## Prioritized roadmap

### Phase 0 — Security incident response (today)

1. Remove or lock `/api/debug`.
2. Rotate the Razorpay secret and review payment/database/hosting logs.
3. Remove diagnostic database writes and sensitive response fields.

### Phase 1 — Indexing foundation (1–3 days)

1. Choose the production hostname and prevent preview-host indexing.
2. Add `metadataBase`, self-canonicals, and page-specific robots metadata.
3. Add `robots.ts` and a complete `sitemap.ts`.
4. Noindex checkout/success/admin authentication pages.
5. Server-render product links and use URL-based crawlable pagination.

### Phase 2 — Rich-result and catalog quality (1–2 weeks)

1. Add Product/Offer/Breadcrumb and Organization/LocalBusiness/WebSite JSON-LD.
2. Consolidate or differentiate the four duplicate product families.
3. Add images to nine image-less products.
4. Expand the 16 thinnest product pages with truthful structured content.
5. Publish and link the core ecommerce policy pages.

### Phase 3 — Performance and authority (2–6 weeks)

1. Resize the hero poster, compress/shorten the video, and ship mobile-aware delivery.
2. Enforce image upload limits and clean unused/duplicate assets.
3. Publish evidence-backed brewing, grind, roast, storage, and preparation guidance.
4. Add named expertise, sourcing/roasting process detail, and claim substantiation.
5. Establish Search Console, analytics, merchant/rich-result validation, and real-user CWV monitoring.

## Validation requirements after implementation

- `robots.txt` and `sitemap.xml` return 200 and reference only the chosen production hostname.
- Every public URL has one correct self-canonical; preview/utility/auth pages are non-indexable.
- Raw shop HTML contains crawlable product links and page-2 URLs.
- Product schema matches visible name, price, availability, image, and canonical URL.
- Redirects exist for every retired duplicate product URL.
- All sellable/indexable products have an accurate image and complete essential product information.
- Rich Results Test and Schema.org Validator pass on representative URLs.
- Search Console confirms index coverage and Google-selected canonicals.
- Real-user LCP/INP/CLS are collected before and after media changes.

## Limitations

- PageSpeed Insights returned HTTP 429, so no Lighthouse/CrUX scores are asserted.
- No Search Console, analytics, merchant-center, or server-log access was provided.
- Actual Google-selected canonicals, indexed URL counts, query performance, and field CWV therefore remain unverified.
- The audit did not compare BLB with any competitor or prior audit.

