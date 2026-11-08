# Bean Leaf Brew SEO Action Plan

## Phase 0 — Production-domain decision (before implementation)

| Priority | Action | Owner | Success check |
|---|---|---|---|
| P0 | Decide whether `blb-weld.vercel.app` is staging or production | Product / engineering / SEO | Decision is documented and used consistently |
| P0 | If staging, apply site-wide `noindex` and keep Vercel previews out of sitemaps | Engineering | Preview source contains `noindex`; no preview URL is indexed |
| P0 | If replacing WordPress, set `beanleafbrew.com` as the canonical production origin | Engineering / SEO | Metadata, schema, sitemap, and OG URLs all use the production domain |
| P0 | Inventory every valuable legacy URL and assign keep/redirect/retire behavior | SEO / engineering | One-hop redirect map covers products, categories, About, Contact, and policies |

## Phase 1 — Launch blockers (Week 1)

| Priority | Action | Dependency | Success check |
|---|---|---|---|
| P0 | Fix the reproducible `next build` Turbopack failure | None | Two clean production builds succeed from a fresh checkout |
| P1 | Deploy the intended commit and verify live/repo parity | Build green | Git SHA, logo, image quality, caching, and markup match |
| P1 | Server-render the default `/shop` catalog | Build green | Raw HTML contains product cards and 23 crawlable product anchors |
| P1 | Add `metadataBase` and absolute canonicals | Host decision | Clean and UTM URLs declare the correct production canonical |
| P1 | Add `robots.ts` and `sitemap.ts` | Host decision + SSR catalog | Endpoints return 200 and list only canonical public URLs |
| P1 | Noindex admin, reset, checkout, and success routes | None | Direct source contains intended robots directives |
| P1 | Add Organization/WebSite and Product/Offer/Breadcrumb JSON-LD | Canonicals + product data | Validators pass and values match visible content |

## Phase 2 — Commerce trust and performance (Weeks 2-3)

| Priority | Action | Owner | Success check |
|---|---|---|---|
| P1 | Publish privacy, terms, shipping, cancellation, return/refund, and payment policies | Operations / legal / content | Policies are accurate, linked in footer, and visible near checkout |
| P1 | Expand priority product pages with verified buying information | Product / content | Top products answer at least ten common purchase questions |
| P1 | Optimize hero poster and remove duplicate preload | Creative / engineering | One responsive poster, preferably below 200-300 KB |
| P1 | Re-encode and conditionally load hero video | Creative / engineering | Automatic media transfer is materially reduced on mobile |
| P2 | Add unique OG/Twitter previews and stronger metadata templates | SEO / design | Every indexable template has unique title, description, canonical, and preview |
| P2 | Add related products, breadcrumbs, and category links | Merchandising / engineering | Product pages expose contextual internal links in raw HTML |
| P2 | Replace mechanical gallery alts with asset-specific descriptions | Content / catalog | Main images distinguish pack front, back label, ingredients, and serving |

## Phase 3 — Authority and demand capture (Month 2)

| Priority | Action | Owner | Success check |
|---|---|---|---|
| P1 | Add founder/roaster expertise, process, producer, and certification evidence | Founder / content | Claims identify accountable sources and real proof |
| P1 | Normalize each genuine location's NAP and role | Operations / local SEO | Website, GBP, listings, and schema agree per location |
| P1 | Import only verified reviews with source/date/product linkage | Support / ecommerce | Visible reviews and any schema match exactly |
| P2 | Publish 6-10 first-hand brewing/selection guides | Content / SEO | Guides earn non-brand impressions and link to products/categories |
| P2 | Add Merchant Center/free listings after Product schema is stable | Ecommerce | Feed and page price/availability match; products approved |

## Phase 4 — Migration validation and monitoring

### Cutover checklist

- [ ] Vercel preview hosts remain non-indexable.
- [ ] All legacy high-value URLs redirect once to equivalent production pages.
- [ ] Production robots and sitemap use `beanleafbrew.com`.
- [ ] Every indexable page has one canonical, title, description, and H1.
- [ ] Raw `/shop` HTML contains the complete default product-link graph.
- [ ] Organization and representative Product schema pass validation.
- [ ] Admin, checkout, success, API, and internal routes are excluded from sitemaps and indexation.
- [ ] Mobile and desktop Lighthouse run on home, shop, and representative products.
- [ ] Search Console sitemap and URL Inspection tests pass.
- [ ] Rollback criteria and monitoring owners are documented.

### Leading indicators

1. Indexed canonical URLs versus submitted sitemap URLs.
2. Legacy redirect 404s and redirect-chain rate.
3. Raw product-anchor count on `/shop`.
4. Rich-result/Merchant errors and price/availability mismatches.
5. Mobile field LCP, INP, and CLS.
6. Non-brand impressions/clicks for product, category, and guide queries.
7. Organic product conversion and revenue.

### Falsifiability

- If SSR catalog changes do not increase crawl discovery/indexation, inspect crawl demand, internal architecture, and content value rather than repeating the same fix.
- If product-content expansion does not improve qualified traffic or conversion after sufficient impressions, reassess query intent and merchandising relevance.
- If the hero video produces no measurable engagement/conversion benefit, remove its automatic download.
- If Google continues selecting another canonical, check host redirects, internal links, sitemap URLs, legacy canonicals, and duplicate content.
