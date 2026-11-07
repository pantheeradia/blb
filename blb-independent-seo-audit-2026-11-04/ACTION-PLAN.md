# BLB SEO Action Plan

Audit date: 4 November 2026  
Scope: BLB only; no comparison data used.

## P0 — Today

| Action | Why | Owner | Effort | Done when |
|---|---|---|---:|---|
| Remove or authenticate `/api/debug` | Public endpoint exposes production payment/database details and writes to the database | Engineering | 1–2 h | Unauthenticated requests return 404/401 and no sensitive values are emitted |
| Rotate Razorpay secret; review Razorpay, Turso, and Vercel logs | Secret fragments were publicly exposed | Engineering/ops | 2–4 h | Old secret revoked, new secret deployed, access review recorded |
| Remove diagnostic write behavior | Crawler/user GET requests currently mutate production state | Engineering | <1 h | No public diagnostic GET changes database state |

## P1 — Indexing foundation (1–3 days)

| Action | Priority | Effort | Acceptance test |
|---|---:|---:|---|
| Choose the single production hostname; block preview indexing | High | 2–4 h | Production emits self-canonicals; preview returns global noindex or requires authentication |
| Add `metadataBase` and self-canonicals | High | 3–5 h | Home, shop, about, contact, and products each emit one correct canonical |
| Add `robots.ts` | High | 1–2 h | `/robots.txt` returns 200, references sitemap, excludes non-public crawl paths |
| Add complete `sitemap.ts` | High | 3–5 h | `/sitemap.xml` returns 200 and contains all active public products, no utility/admin/API URLs |
| Noindex checkout, success, admin login/reset | High | 1–2 h | Meta robots or X-Robots-Tag says `noindex, nofollow` on every utility/auth URL |
| Make catalog links and pagination crawlable | High | 1–2 d | Raw `/shop` HTML contains product anchors; `/shop?page=2` is a real linked server-rendered URL |

## P2 — Catalog and rich results (1–2 weeks)

| Action | Priority | Effort | Acceptance test |
|---|---:|---:|---|
| Add Product + Offer + Breadcrumb schema | High | 1–2 d | Validated JSON-LD matches visible product data on representative pages |
| Add Organization/LocalBusiness + WebSite schema | High | 0.5–1 d | Validated entity data uses the canonical hostname and consistent NAP |
| Consolidate/differentiate four duplicate product families | High | 1–2 d | One clear intent per URL; retired URLs 301 to keeper; sitemap contains keepers only |
| Add images for nine image-less products | High | 2–5 d | Every indexable product has at least one accurate original image |
| Expand the 16 sub-50-word product pages | High | 3–7 d | Each page truthfully covers ingredients, preparation, pack/servings, storage, allergens/diet, delivery/returns, and useful FAQs as applicable |
| Publish core policies | Medium | 1–2 d | Privacy, terms, shipping, returns/refund, payment, cancellation pages are linked from footer/checkout |
| Add Open Graph/Twitter metadata | Medium | 0.5–1 d | Each template has accurate title, description, canonical URL, and 1200×630 image |

## P3 — Performance and authority (2–6 weeks)

| Action | Priority | Effort | Acceptance test |
|---|---:|---:|---|
| Optimize hero poster/video | Medium | 1–3 d | Correct responsive poster; substantially smaller video; reduced-motion/data-saver behavior verified |
| Enforce image upload limits and clean duplicates | Medium | 1–2 d | Uploads capped; delivery-path duplicates removed; image alts stored per asset |
| Substantiate product/health/sourcing claims | High | 2–5 d | Every material claim has an owner, evidence, allowed wording, and visible support where needed |
| Add named expertise and process pages | Medium | 2–4 d | Founder/roaster/technical expertise and sourcing/roasting process are verifiable and linked |
| Publish first-party brew guidance | Medium | Ongoing | Guides answer real grind, brew-ratio, roast, storage, and preparation questions and link to products |
| Establish measurement | High | 1–2 d | Search Console, analytics, schema validation, sitemap submission, and real-user CWV monitoring operational |

## Recommended implementation sequence

1. Security incident response.
2. Indexability/canonical/robots/sitemap foundation.
3. Crawlable catalog and pagination.
4. Product schema and duplicate consolidation.
5. Missing images, complete product content, and policies.
6. Hero/media performance.
7. Authority content, substantiation, and ongoing measurement.

