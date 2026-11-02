# Bean Leaf Brew SEO Action Plan

## Phase 1 — Immediate trust and index-control fixes (Week 1)

| Priority | Action | Owner | Success check |
|---|---|---|---|
| P0 | Delete the spam Morning Buzz review and recalculate Product aggregateRating | Store admin / developer | Review absent from page and JSON-LD; rating matches remaining visible reviews |
| P0 | Remove Lorem Ipsum, “See the recipe,” and fragmented homepage headings | Content / developer | One descriptive H1; no placeholder copy in raw or rendered HTML |
| P0 | Review, substantiate, soften, or remove health/function claims | Legal/compliance + content | Every retained claim has evidence, exact context, and compliant wording |
| P1 | Remove utility, template, form, author, and default URLs from XML sitemaps | Developer / SEO | Sitemap contains only 200, canonical, indexable URLs |
| P1 | Delete or noindex `/hello-world/`, builder templates, form artifacts, and `/author/admin/` | Developer | URLs removed or emit `noindex`; none remain in sitemap |
| P1 | Add homepage title, meta description, one H1, and self-canonical | SEO / developer | Source contains one correct version of each element |
| P1 | Add self-canonicals to indexable shop/category pages | Developer | Canonicals pass a representative template crawl |

## Phase 2 — Performance, commerce, and structured data (Weeks 2–3)

| Priority | Action | Owner | Success check |
|---|---|---|---|
| P1 | Replace five heavy homepage videos with poster-first and load-on-interaction delivery | Developer / creative | Mobile payload under 5 MB initially; no secondary video downloaded before intent |
| P1 | Compress/resize large PNGs and serve responsive AVIF/WebP | Developer / creative | No key photographic image above 300 KB without justification; `srcset` and dimensions present |
| P1 | Correct Product variants/offers, SKU mismatch, breadcrumb encoding, shipping and returns schema | Developer / ecommerce | Rich Results Test and Merchant Center show no critical Product errors |
| P1 | Add Organization/WebSite/WebPage graph and stable entity `@id` | Developer / SEO | Homepage JSON-LD validates and product brand/seller references it |
| P1 | Expand top products with ingredients, nutrition, allergens, preparation, shelf life, storage, FSSAI/manufacturer, delivery and returns | Product / content | Top revenue products contain complete, unique buying information |
| P1 | Expand category pages with comparison and selection guidance | Content / merchandising | Priority categories have 250–500 useful words plus guide links |
| P2 | Rewrite product/category title and meta templates | SEO / content | Unique titles and useful 140–155 character descriptions on priority URLs |
| P2 | Add descriptive alt text and dimensions to informative images | Content / developer | Informative images have accurate alt; decorative images intentionally use empty alt |

## Phase 3 — Authority and demand capture (Month 2)

| Priority | Action | Owner | Success check |
|---|---|---|---|
| P1 | Publish founder, roastery, sourcing, and estate proof pages | Founder / content | Verifiable credentials, photos, process, sources, and entity links published |
| P1 | Normalize NAP and create one page/schema entity per real location | Local SEO / operations | Website, GBP, social, and directory NAP agree for each location |
| P1 | Import only verified reviews with source/date/product linkage | Ecommerce / support | Product pages display verified reviews; schema mirrors visible reviews |
| P2 | Publish 6–10 high-intent guides and link them to products/categories | Content / SEO | Guides indexed and earning non-brand impressions |
| P2 | Add Merchant Center/free listings and validate feed identifiers | Ecommerce | Products approved; feed and on-page price/availability match |
| P2 | Improve delivery, returns, FSSAI, payment, and freshness trust blocks near CTAs | Ecommerce / design | Trust content visible without leaving the product page |

## Phase 4 — Next.js migration gate (Before production cutover)

Do not switch production until every item below passes:

- [ ] Every current sitemap URL has a keep, redirect, noindex, or retire decision.
- [ ] All `/product/*`, category, about, contact, policy, and high-value legacy URLs have one-hop 301 mappings.
- [ ] `robots.txt` and sitemap outputs are generated from the production host.
- [ ] `metadataBase`, canonicals, Open Graph, Twitter, and page-specific metadata are present.
- [ ] Organization, Product/Offer or ProductGroup, and Breadcrumb JSON-LD validate.
- [ ] Admin, checkout, success, and internal routes emit `noindex` and are absent from sitemaps.
- [ ] Mobile Lighthouse is run on home, shop, one category, and three product templates.
- [ ] Redirects are tested from both HTTP/HTTPS and `www`/non-`www` variants.
- [ ] Search Console change-of-platform monitoring and rollback criteria are documented.

## Phase 5 — Monitoring (Ongoing)

Track weekly for the first eight weeks after major changes or migration:

1. Indexed versus submitted URLs and crawl errors.
2. Rich-result and Merchant Center errors.
3. Mobile field LCP, INP, and CLS.
4. Branded versus non-brand impressions, clicks, position, and CTR.
5. Organic product/category sessions and conversion rate.
6. Organic revenue and assisted conversions.
7. Local profile discovery, calls, and direction requests.

## Acceptance targets

- Zero spam or unrelated reviews in visible content or structured data.
- Zero noindex, redirected, 4xx, template, form, or admin URLs in XML sitemaps.
- Initial mobile homepage payload below 5 MB; stretch target below 3 MB.
- LCP at or below 2.5 seconds in CrUX at the 75th percentile.
- All priority product pages valid for Product rich results and Merchant listings where eligible.
- Unique title, description, canonical, and one H1 on every indexable template.
- No traffic loss caused by unmapped legacy URLs during the Next.js migration.
