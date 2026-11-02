# Bean Leaf Brew SEO Audit

**Site:** https://beanleafbrew.com/  
**Audit date:** 1 November 2026  
**Business type:** E-commerce specialty coffee and instant premix brand with a local Bengaluru experience-center presence  
**SEO Health Score:** **52/100**

> Scores in this report are audit heuristics, not Google scores. The overall score uses the installed audit framework's category weights. Public pages, all 47 sitemap URLs, representative product/category pages, raw HTML, response headers, mobile Lighthouse, and the local Next.js replacement were reviewed. Search Console, GA4, Merchant Center, Google Business Profile, and CrUX field data were not available.

## Executive summary

The site is crawlable, HTTPS is enforced, product pages are server-rendered, and Product/Breadcrumb schema gives the store a workable base. The main problems are quality and control rather than a site-wide indexing block.

The most urgent issue is a link-spam review published in the Morning Buzz Product JSON-LD and counted in its aggregate rating. The homepage also contains visible Lorem Ipsum, three H1 elements, no meta description, generic commercial messaging, and unsupported health/function claims. The XML sitemap lists utility pages, internal builder templates, a default post, a form artifact, and an admin author archive. Performance is undermined by a roughly 65 MB mobile page payload, including five homepage videos totaling about 58.9 MB.

The checked-in Next.js storefront is not yet the live site. It improves presentation and basic metadata, but deploying it without legacy redirects, robots/sitemap generation, canonical metadata, JSON-LD, and noindex controls would create a migration-related organic traffic risk.

## Scorecard

| Category | Weight | Score | Weighted contribution |
|---|---:|---:|---:|
| Technical SEO | 22% | 67 | 14.7 |
| Content quality | 23% | 42 | 9.7 |
| On-page SEO | 20% | 39 | 7.8 |
| Schema / structured data | 10% | 42 | 4.2 |
| Performance | 10% | 81 | 8.1 |
| AI search readiness | 10% | 59 | 5.9 |
| Images | 5% | 38 | 1.9 |
| **Total** | **100%** |  | **52.3 → 52/100** |

## What is working

- `robots.txt` returns 200, permits public crawling, blocks WordPress admin/log areas, and declares a working sitemap.
- `sitemap.xml` redirects to the valid `wp-sitemap.xml` index.
- HTTP and HTTPS `www` variants redirect to the HTTPS non-`www` canonical host.
- Primary product and homepage content is present in raw HTML; crawlers do not depend on client-side rendering.
- Product pages include Product and BreadcrumbList JSON-LD.
- Cart, checkout, and account pages already emit `noindex`.
- Mobile Lighthouse: Performance 81, SEO 92, Accessibility 93, Best Practices 92.
- Founder, sourcing regions, physical address, phone, policies, and testimonials provide a useful E-E-A-T foundation.
- AI search crawlers are not specifically blocked. OAI-SearchBot, Claude-SearchBot, PerplexityBot, and Googlebot inherit the general allow rule.

## Priority findings

### 1. High — Spam review is emitted in Product schema

The [Morning Buzz product page](https://beanleafbrew.com/product/morning-buzz/) publishes an unrelated promotional/link-spam review in JSON-LD. It links to YouTube, an unrelated pet-food store, and a marketing-tool Reddit page. The review contributes to the displayed schema rating of 4.5 from two reviews.

**Why it matters:** This makes the structured rating unreliable and can undermine rich-result eligibility and trust.

**Fix:** Delete the spam review, recalculate the visible and structured aggregate rating, ensure visible content matches schema, and moderate reviews before they are included in Product JSON-LD.

### 2. High — Homepage sends weak and unfinished relevance signals

The [homepage](https://beanleafbrew.com/) has:

- title `Bean Leaf Brew` (14 characters);
- no meta description;
- three H1 elements: “We make delicious products,” “Shop with us,” and “What Makes BeanLeaf Brew Better?”;
- visible Lorem Ipsum and an irrelevant “See the recipe” CTA;
- fragmented headings such as “Premium arabic / beans and / freshly / ground...”;
- no homepage JSON-LD.

**Fix:** Use one descriptive H1, for example “Freshly Roasted Coffee & Instant Premixes from Bengaluru.” Replace all placeholder copy, write a query-aligned title and 140–155 character description, and add Organization/WebSite/WebPage JSON-LD.

### 3. High — Sitemap exposes low-value and non-indexable URLs

The sitemap index exposes 47 URLs. It includes:

- noindex utility pages: `/cart/`, `/checkout/`, `/my-account/`;
- `/checkout/`, which redirects to `/cart/` when sampled;
- `/hello-world/`;
- `/jkit-header/header-template/`;
- `/elementor-hf/297/` and `/elementor-hf/footer/`;
- `/metform-form/new-form-1739265993/`;
- `/author/admin/`;
- a thin `/category/blog/` archive.

**Why it matters:** A sitemap should identify important canonical URLs. Listing redirected, noindex, default, template, form, or author artifacts wastes crawl attention and sends poor quality signals. See [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

**Fix:** Remove these URLs and their post types from the sitemap. Delete or `noindex` the junk pages while keeping them crawlable until Google observes the directive. Do not use robots.txt as a substitute for `noindex`; see [Google's noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

### 4. High — Homepage payload is approximately 65 MB

Mobile Lighthouse measured:

| Metric | Result | Target / interpretation |
|---|---:|---|
| Performance score | 81 | Lab score only |
| FCP | 2.1 s | Needs improvement |
| LCP | 2.9 s | Misses the 2.5 s target |
| TBT | 170 ms | Reasonable lab proxy; not INP |
| CLS | 0 | Good |
| Speed Index | 16.9 s | Poor visual completion |
| Total network payload | ~65,089 KiB | Extremely heavy |

Five MP4 files account for about 58.9 MB:

- `file-2.mp4`: 20.18 MB
- `file-8.mp4`: 15.20 MB
- `file-3.mp4`: 14.24 MB
- `file-6.mp4`: 7.22 MB
- `file-4.mp4`: 2.07 MB

Lighthouse also estimated 5.06 seconds of render-blocking savings, 384 KiB unused JavaScript, 90 KiB unused CSS, and four long main-thread tasks.

**Fix:** Replace autoplay/multi-video delivery with poster-first images, one short optimized hero loop at most, load-on-interaction for secondary videos, lower bitrates/resolutions, and CDN caching. Re-run Lighthouse and collect 28 days of CrUX/Search Console field data after release.

### 5. High — Product and category pages lack purchase-critical depth

Sampled product pages contain roughly 100–180 words and basic roast/blend/notes. Category pages are primarily product grids.

Common omissions:

- ingredients, nutrition, allergens, and exact pack/sachet counts;
- preparation or brewing steps;
- shelf life and storage;
- manufacturer/FSSAI information;
- roast/pack date and traceability;
- delivery and return details near the purchase action;
- SKU/GTIN/MPN consistency;
- verified on-page reviews;
- comparison or selection guidance.

**Fix:** Add unique product information, structured specifications, brewing/preparation instructions, trust/logistics blocks, and verified reviews. Add 250–500 useful words to priority category pages, including comparison guidance and internal links to relevant guides.

### 6. High — Health/function claims lack visible substantiation

The homepage makes claims around immune support, gut health, low glycemic impact, and “less than 1/4th the glycemic index of regular sugar” without visible studies, lab reports, ingredient doses, or qualified sources.

**Fix:** Have the claims reviewed for regulatory compliance. Add specific evidence and citations where supportable; otherwise soften or remove them. Provide ingredient quantities, nutrition, and appropriate disclaimers.

### 7. High — Product structured data is inconsistent

Positive: Product and BreadcrumbList JSON-LD is in the initial HTML.

Problems found:

- House Brew and Morning Buzz use `AggregateOffer` with `offerCount: 18`, while only two weights are visibly purchasable;
- House Brew visibly shows `SKU: N/A` while schema outputs SKU `181`;
- breadcrumb names are double encoded (`Roasted &amp;amp; Ground Coffee`);
- `brand`, GTIN/MPN, shipping details, and return policy are absent;
- simple offers rely on UnitPriceSpecification instead of a direct Offer price;
- availability uses `http://schema.org/InStock` rather than the HTTPS form;
- fixed `2027-12-31` promotion validity must match the actual sale.

**Fix:** Model real variants accurately with ProductGroup/Product/Offer or a truthful AggregateOffer. Align every schema value with visible content. Add stable Organization `@id`, brand/seller linkage, shipping, returns, and real identifiers. Validate representative pages in Google's Rich Results Test and Merchant Center.

### 8. Medium — Image SEO and delivery need cleanup

Measured raw-HTML samples:

| Page | Images | Empty alt | No dimensions | Notes |
|---|---:|---:|---:|---|
| Homepage | 53 | 31 | 9 | 17 lacked `srcset` |
| House Brew | 22 | 18 | 0 | primary PNG ~810 KB |
| About | 4 | 4 | 0 | no descriptive alts |

Other large files include a homepage banner PNG at ~615 KB and a logo PNG at ~275 KB. The logo receives `fetchpriority="high"`, while the likely LCP banner does not.

**Fix:** Convert photographic PNGs to responsive AVIF/WebP, add descriptive alt text for informative/product imagery, retain empty alt only for decorative images, provide dimensions, add `srcset`/`sizes`, prioritize the actual LCP asset, and remove high priority from the logo.

### 9. Medium — Metadata and canonical coverage is inconsistent

- Homepage, shop, and category pages have no tailored meta descriptions.
- Sample product descriptions are 430–472 characters, far too long for useful snippet control.
- Product titles are generic, such as `House Brew – Bean Leaf Brew`.
- Sampled shop and product-category pages had no canonical tag.
- About had no H1.
- Two viewport tags are emitted on the homepage.

**Fix:** Create page-type metadata templates, self-canonicals for all indexable pages, one clear H1 per template, and remove the duplicate viewport declaration.

### 10. Medium — Brand/entity and local NAP signals are fragmented

The website, LinkedIn activity, Zomato, and Magicpin surface different addresses, phone numbers, and email addresses. These may represent real separate locations, but the relationship is not clearly expressed.

**Fix:** Define one canonical NAP for each genuine entity/location. Create a unique page and stable schema `@id` for each customer-facing location, link the correct Google Business Profile/map, and do not classify a non-public office as a cafe.

### 11. Medium — Content authority and non-brand coverage are limited

Strengths include the named founder, 30+ years of claimed food-industry experience, sourcing regions, policies, physical contact information, and testimonials. Gaps include credential verification, estate/producer evidence, roasting-process proof, citations, dates, certifications, and editorial content.

A sampled search for “freshly roasted coffee beans Bangalore buy online” returned competitors with dedicated local landing pages, roast cadence, origin, brewing methods, delivery, COD, and FSSAI signals; Bean Leaf Brew was not among the returned leading results.

**Fix:** Publish evidence-led founder/roastery/estate pages and high-intent guides: grind-size selection, South Indian filter ratios, whole bean vs ground, coffee-chicory ratios, premix ingredients, preparation, and storage. Link guides to products and categories bidirectionally.

### 12. Low — Security headers can be improved

HTTPS works, but the live response lacked HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy. CSP was limited to `upgrade-insecure-requests`.

**Fix:** Add these headers after testing. This is primarily security hardening; do not overstate it as a ranking lever.

## AI search readiness

**Score: 59/100.** Primary content is in raw HTML and search-focused AI crawlers are not blocked. `/llms.txt` returns 404, but that is informational and should not be prioritized because it is not a Google visibility lever. `/.well-known/ucp` also returns 404; UCP is an optional commerce opportunity, not an SEO failure.

The main constraints on AI citability are the same as the SEO constraints: vague marketing copy, placeholder text, unsupported claims, limited answer-first passages, incomplete product facts, and weak entity/schema linkage.

## Search experience and conversion alignment

**SXO score: 48/100** (reported separately from the SEO Health Score).

The page types are generally aligned with commercial intent, but competitors provide richer decision support. Bean Leaf Brew needs faster pages, clearer product differentiation, complete buying information, verified reviews, delivery/return certainty, and content that answers how-to and selection questions.

## Next.js migration readiness

The local workspace contains a newer Next.js storefront, while production still serves WordPress/PHP.

Positive local signals:

- improved root metadata in `src/app/layout.tsx`;
- product-specific `generateMetadata`;
- `next/image` and AVIF/WebP configuration;
- several security headers.

Required before deployment:

1. Create a complete redirect map from every live WordPress URL, including `/product/{slug}/` to `/shop/{slug}`, `/about-us/` to `/about`, `/contact-us/` to `/contact`, all category URLs, policies, and intentionally retired pages.
2. Generate production `robots.txt` and XML sitemap files.
3. Add `metadataBase`, self-canonicals, Open Graph, and Twitter metadata.
4. Render Organization/WebSite/WebPage, Product, Offer/ProductGroup, and BreadcrumbList JSON-LD in initial HTML.
5. Add `noindex` to admin, checkout, success, and internal utility routes.
6. Preserve content parity and validate all redirects, canonicals, status codes, and sitemap URLs before DNS/cutover.
7. Expand the new product template beyond its current single “About this product” paragraph with breadcrumbs, specifications, shipping/returns, related products, and verified reviews.

Relevant local evidence:

- `src/app/layout.tsx:17`
- `src/app/shop/[slug]/page.tsx:21`
- `src/app/shop/[slug]/page.tsx:88`
- `src/app/admin/layout.tsx:1`
- `src/app/checkout/page.tsx:6`
- `next.config.ts:11`

## Measurement limitations

- No Search Console index coverage, query, impression, click, or CTR data.
- No GA4 organic landing-page or conversion data.
- No Merchant Center feed diagnostics or free-listing data.
- No verified Google Business Profile access.
- No CrUX field data; Lighthouse is a one-run lab measurement.
- Desktop Lighthouse timed out.
- Platform-specific ChatGPT/Perplexity/Google AI citation visibility was not measured.

## Recommended next measurement set

After the first remediation release, collect:

- Search Console indexed pages versus submitted sitemap URLs;
- rich-result and Merchant Center validation errors;
- mobile CrUX LCP, INP, and CLS at the 75th percentile;
- non-brand impressions/clicks for coffee and premix queries;
- product/category organic CTR and conversion rate;
- organic revenue and assisted conversions;
- local profile discovery and direction/call actions where applicable.
