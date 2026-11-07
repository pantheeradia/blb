# BLB Independent Technical SEO & Indexability Audit

**Audit date:** 2026-11-04 (Asia/Calcutta)  
**Primary audited deployment:** `https://blb-weld.vercel.app`  
**Evidence basis:** fresh live HTTP requests plus current repository inspection. Existing `*-audit` folders and reports were not read or used.  
**Scope:** BLB only; no competitor or market comparison.

## Technical score: 43/100

The deployment serves valid HTML over HTTPS and has clean public URLs, correct hard 404s, one H1 on measured public pages, and useful security headers. The score is constrained by three foundational problems: there is no crawl-control layer (`robots.txt` and XML sitemap both return 404), there are no canonical URLs on any measured indexable page, and key catalog discovery is JavaScript-dependent. A public debug API that exposes production payment/database details is a separate Critical security and trust problem.

### Category breakdown

| Category | Status | Score | Checks behind score |
|---|---:|---:|---|
| Crawlability | Fail | 35/100 | robots missing; sitemap missing; raw shop HTML has no product links; homepage exposes only 6 product URLs; valid internal links otherwise |
| Indexability | Fail | 30/100 | canonicals absent; parameter variants return 200; private/utility pages are indexable; true 404s correctly return 404 + `noindex` |
| Security | Fail | 25/100 | HTTPS/HSTS and several headers pass; public debug endpoint leaks sensitive operational data; CSP absent |
| URL structure | Pass | 80/100 | clean slugs and consistent trailing-slash redirect; catalog pagination has no crawlable URLs |
| Mobile foundations | Pass | 75/100 | Next.js emits viewport metadata and layouts are responsive in code; visual parity/touch testing was not measured |
| Core Web Vitals | Not measured | — | Google PSI request returned HTTP 429 quota exhausted; no CrUX/GSC field access was available |
| Structured data | Fail | 0/100 | 0 JSON-LD blocks on all measured public pages and products |
| JavaScript rendering | Warn | 45/100 | primary page copy is server-rendered; product catalog links and pagination are client-dependent |
| IndexNow | Fail | 0/100 | no IndexNow key/route/submission implementation found |

The aggregate excludes Core Web Vitals because it was not measured. Scores reflect only verified checks, with Critical/High failures weighted more heavily.

## Critical issue

### 1. Public debug endpoint leaks production secrets and order/database information

**Evidence**

- `GET https://blb-weld.vercel.app/api/debug` returned HTTP 200 and public JSON containing the live Razorpay key ID, Razorpay secret length plus its first and last four characters, the Turso database URL, pending order IDs/timestamps, and database test status.
- The live response had no `X-Robots-Tag` and was cacheable with `Cache-Control: public, max-age=0, must-revalidate`.
- Repository evidence: `src/app/api/debug/route.ts:8` reads `RAZORPAY_KEY_SECRET`; lines 38-40 return secret fragments and the Turso URL; line 44 exposes the insert test result.
- Every GET also performs `INSERT OR REPLACE` against the settings table, meaning a public, nominally read-only URL mutates production state.

**Impact**

This is primarily a security incident, but it also creates search/trust risk: a crawlable public URL exposes sensitive infrastructure and order identifiers, and repeated crawler access writes to the database.

**Required fix**

1. Remove the route from production immediately or require authenticated admin access and return `404` to unauthenticated users.
2. Rotate the Razorpay secret because part of it was publicly disclosed; review Razorpay and Turso access logs.
3. Remove all secret-derived values, database URLs, order IDs, and write operations from diagnostic GET endpoints.
4. Purge any edge cache/log copies and add an automated production check that `/api/debug` is absent.

## High-priority findings

### 2. `robots.txt` is missing

**Evidence:** `https://blb-weld.vercel.app/robots.txt` returned HTTP 404 on 2026-11-04. No `src/app/robots.ts`, `src/app/robots.txt`, or equivalent public file exists.

**Impact:** Crawlers receive no sitemap location or explicit handling for `/admin`, `/api`, `/checkout`, and AI-search/training agents. Missing robots rules do **not** block crawling; everything is allowed by default.

**Fix:** Add a Next.js 16 `src/app/robots.ts` that allows public pages, declares the production sitemap, and disallows non-public crawl paths. Apply `noindex` separately to utility/private pages because robots blocking alone does not remove URLs from an index. Set crawler-specific AI rules only after BLB chooses its training/search visibility policy.

### 3. XML sitemap is missing

**Evidence:** `https://blb-weld.vercel.app/sitemap.xml` returned HTTP 404 and no sitemap file/generator exists in `src/app`. Common discovery failed because robots is also absent.

**Impact:** Search engines lack an authoritative inventory of public product URLs. This is especially damaging because the shop catalog is not fully discoverable from raw HTML.

**Fix:** Add `src/app/sitemap.ts` using the canonical production hostname. Include `/`, `/shop`, `/about`, `/contact`, and every active product route; exclude checkout, success, admin, API, search/filter states, redirects, and missing products. Emit accurate `lastModified` values only when backed by actual content/product updates. Reference the sitemap from robots.txt.

### 4. Canonical URLs are absent site-wide

**Evidence:** No `<link rel="canonical">` was present on the homepage, `/shop`, `/about`, `/contact`, `/checkout`, `/checkout/success`, or six measured product pages. The root metadata at `src/app/layout.tsx:17` defines title/description/keywords but no `metadataBase` or alternates/canonical.

**Impact:** BLB does not state which hostname or parameter-free URL is authoritative. The Vercel deployment is publicly indexable while a separate BLB domain is also live, and `/shop?category=...` plus tracking-parameter variants return HTTP 200 without canonical consolidation.

**Fix:** Choose the single production hostname, configure `metadataBase`, emit self-referencing canonicals for public pages/products, and canonicalize filter/tracking variants to the clean route where the page content is not independently index-worthy. Keep preview/staging deployments authentication-protected or globally `noindex`.

### 5. Catalog discovery and pagination depend on JavaScript

**Evidence**

- Raw HTML for `https://blb-weld.vercel.app/shop` returned 200 but contained **zero** `/shop/{slug}` product links and only about 141 extracted words.
- Raw homepage HTML exposed only six product routes: `black-tea-lemon`, `deja-brew`, `matcha-latte`, `milk-tea-ginger`, `morning-buzz`, and `south-indian-filter-coffee`.
- `src/components/shop/ShopClient.tsx:4,115` uses `useSearchParams` in a client component.
- Pagination controls at lines 59, 71, and 86 are `<button>` interactions, not crawlable `<a href>` links; page changes exist only in client state.

**Impact:** Google can render JavaScript, but discovery and recrawl become slower and less reliable; non-rendering crawlers and agents cannot reach the full catalog. Products beyond the homepage subset and the first client-rendered page have no crawlable pagination path. The missing sitemap removes the fallback discovery mechanism.

**Fix:** Server-render the initial catalog and real product anchors. Model pagination as URLs such as `/shop?page=2` with crawlable `<a href>` links, self-referencing canonicals, and unique server-rendered result sets. Keep client filters as progressive enhancement. The sitemap must include every active product URL.

### 6. Checkout, success, and admin authentication routes are indexable

**Evidence:** `/checkout`, `/checkout/success`, `/admin/login`, and `/admin/reset` have no `robots` metadata or `X-Robots-Tag`. `/admin/login` returns 200 and inherits the public homepage title/description. `src/middleware.ts:51` protects dashboard paths but intentionally leaves login/reset public. Checkout files set only titles.

**Impact:** Thin utility/authentication pages can enter the index, waste crawl attention, surface undesirable search results, and inherit misleading descriptions.

**Fix:** Add `robots: { index: false, follow: false }` metadata to checkout/success/admin login/reset layouts or an equivalent `X-Robots-Tag: noindex, nofollow` response header. Keep admin/API URLs out of the sitemap and disallow them in robots after noindex is deployable/crawlable.

## Medium-priority findings

### 7. Filter and tracking variants return 200 without consolidation

**Evidence:** `/shop?category=ground-coffee` and `/shop?utm_source=test` both return 200 with the same title/description and no canonical. Category selection is handled in client state.

**Impact:** Crawl duplication and inconsistent indexing signals can grow as marketing links and filters are used.

**Fix:** Canonicalize non-indexable parameter states to `/shop`. If category pages are intended to rank, create dedicated server-rendered category URLs with unique metadata/content and self-canonicals rather than relying on query-only client state.

### 8. No structured data on commercial pages

**Evidence:** Zero `application/ld+json` blocks were found on the homepage, shop, about, contact, checkout, or six measured product pages.

**Impact:** Search engines must infer business/product entities and cannot validate Product, Offer, Breadcrumb, or Organization data from explicit markup.

**Fix:** Add server-rendered JSON-LD for Organization/LocalBusiness on core pages and Product + Offer + BreadcrumbList on every product page. Validate each live URL against Google Rich Results Test and Schema.org Validator. Do not invent ratings, reviews, availability, or price data.

### 9. Large hero resources create measurable performance risk

**Evidence:** the homepage HTML transfer was ~139 KB. `public/images/HB_03.webp` is 975,882 bytes and is preloaded directly in `src/app/layout.tsx:32`; it is also the hero video poster (`Hero.tsx:91`). `public/videos/file.mp4` is 14,236,751 bytes and is assigned after window load (`Hero.tsx:17`). Live uncached-style samples showed TTFB of ~0.40-0.69 seconds across four public pages. Field CWV was not available; PSI returned 429 quota exhausted.

**Impact:** A near-1 MB poster is a likely mobile LCP cost, and the 14.2 MB video can consume bandwidth shortly after load even though `preload="none"` is set.

**Fix:** Create properly sized responsive poster variants (AVIF/WebP), preload only the exact above-fold candidate with correct responsive attributes, compress/shorten the video and provide mobile-specific delivery, honor `prefers-reduced-motion`/data-saver, and capture real LCP/INP/CLS at the 75th percentile after launch. Treat this as a measured resource risk, not a claimed CWV failure.

### 10. Content Security Policy is absent

**Evidence:** Vercel responses include HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, Referrer-Policy, and Permissions-Policy, but no `Content-Security-Policy`. `next.config.ts:3-8` confirms the configured header set omits CSP.

**Impact:** CSP is defense-in-depth rather than a direct ranking factor, but it materially limits script-injection risk on an e-commerce checkout site.

**Fix:** Introduce a tested nonce/hash-based CSP compatible with Next.js, Vercel, Razorpay checkout, fonts, images, and API calls. Roll out in `Content-Security-Policy-Report-Only` mode first.

## Confirmed positives

- HTTPS is enforced: HTTP permanently redirects (308) to HTTPS.
- HSTS is strong on the Vercel deployment: `max-age=63072000; includeSubDomains; preload`.
- `/shop/` permanently redirects (308) to the consistent no-trailing-slash form `/shop`.
- Public pages and all six measured products returned HTTP 200 with one H1.
- Invalid public and product URLs returned genuine HTTP 404 responses with `noindex`, avoiding soft-404 indexing.
- Primary homepage/about/contact/product content is present in raw server HTML; the site is not a fully client-rendered SPA.
- Security headers present: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy.
- Product URLs are descriptive and hyphenated.

## Technical action order

1. **Today:** remove `/api/debug`, rotate the Razorpay secret, review access logs and affected data.
2. **Next deployment:** add `noindex` controls for admin/checkout/success and prevent preview-host indexing.
3. **Next deployment:** add production-domain canonicals, `robots.ts`, and a complete `sitemap.ts`.
4. **Within one week:** server-render product links and implement crawlable URL-based pagination.
5. **Within two weeks:** add validated Product/Offer/Breadcrumb/Organization structured data.
6. **Within one month:** optimize hero poster/video; then measure mobile CrUX or Lighthouse and monitor LCP/INP/CLS.

## Measurement limitations

- Google PageSpeed Insights returned HTTP 429 (`RESOURCE_EXHAUSTED`), so no Lighthouse score or Core Web Vitals values are claimed.
- No Google Search Console or analytics access was provided, so actual index coverage, Google-selected canonicals, crawl stats, and query performance were not measured.
- Headless Chromium produced no DOM output in this environment; the raw-HTML result and current React/Next source were used for the JavaScript-discovery finding.

