# Technical SEO Findings

**Audit target:** https://blb-weld.vercel.app/  
**Checked:** 3 November 2026  
**Category score:** **55/100**

## What works

- Homepage, shop, About, Contact, checkout, and sampled product routes return `200`.
- Invalid pages and product slugs return a real `404`; `/shop/` normalizes to `/shop` with `308`.
- HTTPS, HSTS, `nosniff`, frame denial, referrer policy, and permissions policy are active.
- The homepage is prerendered and served from Vercel cache.
- The homepage and product pages contain primary copy in initial HTML.

## Findings

### Critical migration gate — Canonical host and staging policy are unresolved

The audited Vercel host has no canonicals, while the existing `beanleafbrew.com` site remains indexed. The Vercel host itself did not surface in the sampled `site:` search.

**Recommendation:** Decide whether this host is staging or the future production deployment. If it is staging, apply site-wide `noindex` and do not submit a sitemap. If it is the cutover candidate, generate metadata using `https://beanleafbrew.com`, keep the Vercel preview non-indexable, and prepare one-hop redirects from every valuable legacy URL.

**Validation / failure test:** Google URL Inspection should report the production domain as canonical. The migration fails if both hosts are indexed or if legacy product/category URLs become 404s.

### High — The shop catalog is absent from raw HTML

`/shop` contains `BAILOUT_TO_CLIENT_SIDE_RENDERING`, renders a loading skeleton, and exposes 23 product slugs only inside RSC serialization. The raw document contains zero product anchors. `src/components/shop/ShopClient.tsx` calls `useSearchParams`.

**Recommendation:** Server-render the default catalog and product links. Pass the initial category/search state from the route into a client enhancement layer instead of bailing the entire catalog to client rendering.

**Validation / failure test:** Fetch `/shop` without executing JavaScript. The response must contain the visible product names and crawlable `/shop/{slug}` anchors. A JS-disabled browser should still show the default catalog.

### High — XML sitemap is missing

`/sitemap.xml` returns `404`, and no `src/app/sitemap.ts` metadata route exists.

**Recommendation:** After the production host is chosen, generate a sitemap containing `/`, `/shop`, `/about`, `/contact`, and every visible canonical product. Exclude checkout, success, admin, API, and search/filter parameters.

**Validation / failure test:** Sitemap returns valid XML with only `200`, canonical, indexable URLs, and the submitted count matches the visible catalog count.

### High — Canonicals are absent site-wide

Homepage, shop, About, Contact, checkout, success, and sampled product pages expose no canonical. `src/app/layout.tsx` has no `metadataBase`; product metadata sets only title and description.

**Recommendation:** Set the final production origin and emit clean self-canonicals. Query-string variants such as UTM URLs should canonicalize to the clean route.

**Validation / failure test:** Source HTML contains one absolute canonical per indexable page, and Search Console's selected canonical agrees.

### High — Utility routes are indexable

`/checkout`, `/checkout/success`, and `/admin/login` return `200` without `noindex`. Admin login inherits the homepage metadata.

**Recommendation:** Apply `noindex, nofollow` to admin/reset and payment-success routes, and `noindex, follow` or the appropriate policy to checkout. Keep all of them out of the sitemap.

**Validation / failure test:** Rendered HTML contains the intended robots directive, and the URLs do not appear in indexed-page reports.

### High — Live deployment differs from the workspace

Live HTML requests `q=100` images and references `/images/BeanLeaf-Logo.png`; current source allows image qualities 75/85 and uses another logo asset. The audited deployment is therefore older than the current workspace.

**Recommendation:** Resolve the current production-build failure, deploy the intended commit, then repeat the crawl before using this audit as a launch sign-off.

**Validation / failure test:** Live markup, image quality behavior, logo path, cache headers, and the Git deployment SHA agree with the release candidate.

### Medium — `robots.txt` is missing

`/robots.txt` returns `404`. This permits crawling by default, but provides no sitemap discovery or explicit crawler governance.

**Recommendation:** Generate `robots.ts` only after the host decision. Allow canonical public pages, reference the sitemap, and keep operational paths out of crawl focus. Do not use robots blocking as a substitute for `noindex`.

### Medium — Current production build fails locally

`npm run lint` passes. `npm run build` fails reproducibly, including outside the restricted environment, with a Turbopack internal error while processing `src/app/globals.css`. The build also warns that the `middleware` convention is deprecated in this Next.js version.

**Recommendation:** Treat build health as a release gate. Diagnose the CSS/PostCSS/Turbopack process failure against the bundled Next.js 16.3.6 documentation, and migrate middleware to the current convention separately.

**Validation / failure test:** A clean production build succeeds twice from a fresh checkout using the same environment as Vercel.

## Leading indicators

- Indexed canonical URLs versus submitted sitemap URLs
- Number of product anchors present in raw `/shop` HTML
- Utility URLs excluded from indexation
- Legacy redirect hit/error rate after cutover
- Deployment SHA and crawl baseline remain aligned
