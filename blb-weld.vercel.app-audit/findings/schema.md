# Structured Data Findings

**Audit target:** https://blb-weld.vercel.app/  
**Checked:** 3 November 2026  
**Category score:** **5/100**

The production deployment exposes no structured data on the sampled homepage, shop, About, Contact, or three representative product pages. Raw HTML contained zero JSON-LD blocks, zero `itemscope` microdata markers, and zero RDFa `typeof` markers.

## What works

- Product names, prices, descriptions, images, availability controls, category labels, address, phone, and opening hours are already visible in server-rendered HTML. These are credible inputs for truthful JSON-LD.
- Product pages have one clear H1 and unique metadata generated from product records (`src/app/shop/[slug]/page.tsx:21-29`).
- The Contact page exposes a full Bengaluru address, phone number, email, and hours (`src/app/contact/page.tsx:22-43`), which can support an Organization or verified LocalBusiness entity.

## Findings

### High — Product and Offer markup is absent

Representative production pages `/shop/south-indian-filter-coffee`, `/shop/morning-buzz`, and `/shop/black-tea-lemon` each returned zero JSON-LD blocks. The product template renders name, price, description, roast/blend/notes and purchase controls, but no Product, ProductGroup, Offer, Brand, or BreadcrumbList graph (`src/app/shop/[slug]/page.tsx:21-103`).

**Impact:** Google and commerce systems must infer product identity, price, availability, variants, and brand from presentation markup. The pages cannot qualify through page markup for product rich-result/merchant-listing features.

**Recommendation:** Emit server-rendered Product JSON-LD on each product page. Use ProductGroup only where genuine variants exist; otherwise use Product with one or more truthful Offer nodes. Include absolute URLs, `priceCurrency: INR`, current price, availability, brand, image URLs, stable SKU/GTIN/MPN where real, seller, and shipping/return data only when it matches visible policies. Add BreadcrumbList using canonical page URLs.

**Dependency:** Canonical production host and canonical URL strategy must be finalized first. Product identifiers, stock state, shipping, and returns must come from the same source of truth used by the page.

**Validation / failure test:** A representative product should pass Schema.org Validator and Google's Rich Results Test without Product errors, and every price/availability value must match visible page content. Treat any mismatch as a failed implementation.

### High — No site-wide Organization / WebSite entity graph

The homepage returned no Organization, WebSite, WebPage, or LocalBusiness JSON-LD. The root metadata currently contains only title, description, and keywords (`src/app/layout.tsx:17-22`); no stable `@id` entity is defined.

**Impact:** Search engines receive weaker machine-readable brand/entity linkage. This also makes future Product publisher/seller and ContactPage references less coherent.

**Recommendation:** Add one site-wide JSON-LD graph with Organization and WebSite, stable `@id` values, canonical URL, legal name `Bean Leaf Brew LLP`, logo, verified contact point, and only verified `sameAs` profiles. Add WebPage nodes per public page only where they improve linkage.

**Dependency:** Resolve the canonical domain (the Vercel hostname versus the intended custom domain) and confirm official social profiles and legal contact details.

**Validation / failure test:** All referenced URLs should be absolute, crawlable, canonical, and owned by the brand. The graph fails if it mixes unverified social accounts or conflicting NAP values.

### Medium — Local business type should not be guessed

The Contact page lists a Whitefield address and business hours, but the audited materials do not prove whether the location is a walk-in cafe, customer-facing roastery, office, or service-area operation.

**Recommendation:** Use Organization until the physical-location model is verified. If customers can visit during posted hours and a matching Google Business Profile exists, add the most accurate LocalBusiness subtype with the exact NAP, hours, geo coordinates, and map URL. Do not label the entity `CafeOrCoffeeShop` unless it genuinely operates as one.

**Validation / failure test:** Website, Google Business Profile, invoices, and major listings should show the same location name, address, phone, and hours.

### Medium — Breadcrumb and contact semantics are missing

No BreadcrumbList is emitted on product pages, and `/contact` has no ContactPage schema. These are secondary to Product and Organization, but they help define page roles and relationships.

**Recommendation:** Add BreadcrumbList on shop/product pages and a ContactPage node linked to the Organization. Breadcrumb rich results are desktop-only, so do not overstate the benefit.

### Low — Hero media has no VideoObject, but it may be decorative

The homepage uses an autoplay background loop (`src/components/home/Hero.tsx:84-95`). VideoObject is appropriate only if the video is a meaningful, indexable content asset with a truthful name, description, thumbnail, upload date, duration, and content URL. If it remains decorative, do not add VideoObject merely to increase schema count.

## Leading indicators

- Valid Product items and Merchant listing enhancements in Search Console
- Zero structured-data price/availability mismatches after catalog updates
- Stable brand entity/name and logo presentation in search results
- Rich Results Test passes on at least one page per product template/variant type

