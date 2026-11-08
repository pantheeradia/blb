# BLB Independent SEO Audit — Content, On-Page, Schema, and Images

Audit date: 2026-11-04  
Scope: current public Next.js source plus a read-only snapshot of the current visible product catalog (24 products). Existing audit folders and reports were excluded. No competitor research or comparison was used.

These scores are audit heuristics, not Google-internal scores or ranking guarantees.

## Category scores

| Category | Score | Summary |
|---|---:|---|
| Content quality | 52/100 | Clear brand positioning and useful origin cues, but nearly every product page is thin and several product families are duplicated. |
| On-page SEO | 48/100 | One H1 per public page and dynamic product titles are good; canonical, social metadata, richer descriptions, and stronger intent coverage are missing. |
| Structured data | 5/100 | No JSON-LD, Microdata, or RDFa was found in the current public source. |
| Image SEO | 58/100 | `next/image`, responsive `sizes`, modern formats, and image alts are used well; nine visible products have no image and several source assets are extremely large. |
| AI citation readiness | 45/100 | BLB has specific claims and first-party business details, but claims lack evidence, attribution, and answer-first supporting content. |

## What is already working

- Public pages use a single, descriptive H1: home, shop, about, contact, checkout, success, and product templates.
- The homepage establishes entity and location quickly: “Roasted in Whitefield, Bengaluru,” Karnataka origins, Coorg/Chikmagalur, altitude, freshness, and brew format.
- About and contact pages contain useful first-party facts, including business address, phone, email, opening hours, sourcing regions, and a first-person brand story.
- The shop page has a strong transactional H1 and explanatory copy tied to roast, grind, and brew intent.
- Product pages generate unique titles from the product name and use the product’s short description as the meta description.
- Product images use `next/image`; responsive `sizes` are present throughout the public UI, and the first product-detail image receives priority treatment.
- The current product catalog has 24 distinct slugs and titles; none of the generated title strings exceeds 60 characters.

## Priority findings

### High — 23 of 24 product descriptions are under 100 words

Evidence: a read-only query of the current visible catalog found 24 products. Mean long-description length is 48 words; 23/24 are below 100 words, and 16/24 are below 50 words. Only `instant-premix-black-tea-blueberry` reaches 103 words. Examples include `green-tea-cardamom` (25 words), `green-tea-lemon` (26), `milk-tea-ginger` (28), `black-tea-masala` (29), and `whole-bean-deja-brew` (31).

Why it matters: the product template renders only one “About this product” paragraph plus a few attributes. Most pages do not fully answer purchase questions such as ingredients, brew method, serving size, taste profile, caffeine, allergens, storage, origin, roast date/freshness, shipping, returns, or product-specific FAQs. The concern is topical completeness, not word count as a ranking factor.

Recommendation: create a product-content model with distinct, truthful sections: concise summary, ingredients, preparation/brew guide, tasting notes, source/processing, pack size and servings, dietary/allergen details, storage, delivery/returns, and 2–4 genuinely useful product questions. Aim for complete coverage rather than a fixed word target. Prioritize the 16 pages below 50 words.

### High — four near-duplicate product families create cannibalization and trust risk

Evidence from the current catalog:

- `instant-premix-black-tea-blueberry` and `black-tea-blueberry`
- `matcha-latte-1` and `matcha-latte`
- `malt-choco-hazelnut` and `malt-protein-choco-hazelnut`
- `malt-kesar-badam` and `malt-protein-kesar-badam`

The paired pages target essentially the same product intent while differing in content depth and imagery. For example, the first blueberry page has 103 words and one image; the second has 30 words and no image.

Recommendation: decide one canonical sellable product per family. Merge inventory/content into the keeper URL, redirect obsolete slugs with a permanent redirect, update internal links, and include only keeper URLs in the sitemap. If the products are genuinely different, make the distinction explicit in the name, ingredients, pack size, formulation, price, imagery, and copy.

### High — no Product, Offer, Organization/LocalBusiness, WebSite, or Breadcrumb schema

Evidence: repository-wide scans found no `application/ld+json`, `@context`, `@type`, `itemscope`, `itemprop`, RDFa `typeof`, or RDFa `property` in public app/components.

Impact: search engines receive no explicit structured entity connection for BLB and no machine-readable product price, currency, availability, brand, image, or breadcrumb information. This prevents eligibility for supported product and merchant-result enhancements when all policy and data requirements are met.

Recommendation:

1. Add server-rendered `Organization` or the most accurate `LocalBusiness` subtype with legal name, URL, logo, address, phone, contact point, and truthful `sameAs` links.
2. Add `WebSite` and `WebPage`/`AboutPage`/`ContactPage` nodes as appropriate.
3. Add `Product` + `Offer` on every product URL with stable `@id`, name, canonical URL, absolute image URLs, description, brand, price, `priceCurrency: INR`, availability, and valid offer URL. Add SKU/GTIN only when real.
4. Add `BreadcrumbList` to shop/product pages and render matching visible breadcrumbs.
5. Include `AggregateRating`/`Review` only if the cited reviews are genuine, visible on that product page, and collected under Google’s policies.

### High — product pages lack unique canonical and social metadata

Evidence: root metadata defines only `title`, `description`, and `keywords`; product `generateMetadata` returns only `title` and `description`. No `metadataBase`, `alternates.canonical`, `openGraph`, or `twitter` metadata appears in the current public source. About and shop have titles/descriptions, while contact supplies only a title.

Recommendation: define a production `metadataBase`; add self-referencing canonical URLs; add page-specific Open Graph/Twitter title, description, canonical URL, type, and 1200×630 image. Product metadata should use the primary product image and a useful description. Give contact a distinct description. Do not rely on the legacy `keywords` field.

### High — nine visible products have no image

Evidence: 9/24 current visible products have an empty `images` array: `black-tea-peach-lemon`, `black-tea-blueberry`, `black-tea-masala`, `green-tea-masala`, `green-tea-cardamom`, `green-tea-lemon`, `milk-tea-masala`, `malt-protein-choco-hazelnut`, and `malt-protein-kesar-badam`.

Impact: the shop card renders an “image unavailable” state, weakening product trust, conversion, image-search eligibility, and Product schema completeness.

Recommendation: add at least one original, accurate hero image per sellable product before indexing it; ideally include pack front/back, prepared drink, and ingredient/serving context. Ensure every image matches the exact formulation and variant.

### High — health, nutrition, sourcing, and freshness claims need visible substantiation

Evidence: public copy makes claims such as “100% traceable,” “award-winning estates,” “packed in 48 hours,” “low glycemic,” antioxidant/catechin/Vitamin C benefits, “15g protein,” “30% of RDA,” and “supports sustained release of amino acids.” No linked lab report, nutrition panel, certification, named estate, methodology, or source citation is surfaced in the examined page templates.

Recommendation: create a claim-verification inventory. For each claim, record owner, evidence, test date/method, precise wording allowed, and source document. Show verifiable nutrition/ingredient panels on relevant products. Name estates/certifications only when permission and evidence exist. Remove or soften claims that cannot be substantiated. This is especially important for health- and nutrition-adjacent content.

### Medium — ecommerce trust content is incomplete

Evidence: the public route and footer inventory includes shop, about, and contact, but no visible privacy, terms, shipping, returns/refund, payment, or cancellation pages/links. Product pages do not state delivery estimate, return constraints, or support terms.

Recommendation: publish clear policy pages and link them from the footer and checkout. Add concise delivery, freshness, damage/return, and support summaries near purchase controls. Ensure legal entity name, address, phone, and email remain consistent sitewide.

### Medium — E-E-A-T signals are present but underdeveloped

Internal heuristic breakdown:

| Factor | Score | Evidence |
|---|---:|---|
| Experience | 13/20 | First-person sourcing/roasting narrative and original business imagery, but little process proof or named product testing. |
| Expertise | 11/25 | Specific roast/origin/nutrition details, but no named coffee professional, food technologist, author, reviewer, or credentials. |
| Authoritativeness | 12/25 | Partner logos and customer testimonials are present, but claims and testimonials lack source links, dates, or verification context. |
| Trustworthiness | 19/30 | Strong contact details and physical address; weakened by missing policies, unsubstantiated claims, duplicate products, and incomplete catalog imagery. |

Recommendation: add a named founder/roaster profile, relevant qualifications and experience, a transparent “how we source and roast” page, verifiable partner/review context, roast/batch information where operationally possible, and full customer policies.

### Medium — homepage and about content communicate brand, but not enough searchable guidance

Evidence: homepage headings are clear and distinctive, but supporting copy is mostly short marketing statements. The About page explains origin and sourcing but does not include a named founder, timeline, roasting process details, or evidence for “award-winning estates.” There is no editorial/help content for brew methods, grind selection, coffee-vs-chicory selection, roast profiles, or premix preparation.

Recommendation: build first-party guides directly from BLB expertise, beginning with high-intent questions already implied by the catalog: how to choose grind size, whole bean vs ground coffee, South Indian filter ratios, selecting coffee/chicory percentage, espresso/moka/French press fit, how BLB packs for freshness, and product-specific preparation. Link guides contextually from shop and product pages.

### Medium — meta descriptions are mostly too terse to communicate differentiation

Evidence: the 24 product meta descriptions range from 41 to 124 characters; 23 are under 120 characters. Many are generic formulations such as “refreshing and healthy” or “easy to prepare.” This is not a hard Google limit, but it leaves useful snippet space and buyer intent unanswered.

Recommendation: write unique, accurate descriptions that combine product type, primary flavor/ingredient, format/pack size, and the key differentiator. Avoid unqualified health language. Keep the main benefit near the front because snippets can be rewritten or truncated.

### Medium — product image alt text is technically present but not consistently descriptive

Evidence: product cards use `alt={product.name}`; the gallery uses strings such as “{productName} - Image 1” and “{productName} thumbnail 1.” Category images use broad alts such as “Ground coffee from Bean Leaf Brew.” Decorative navigation logo correctly uses an empty alt.

Recommendation: store image-specific alt text with each product image (for example, “Bean Leaf Brew Golden Crema coffee pouch front” or “Golden Crema dark-roast coffee beans close-up”). Use empty alt on redundant thumbnails inside already-labelled buttons to avoid duplicate screen-reader announcements. Keep alt factual and do not repeat keywords mechanically.

### Medium — five current remote source images are 0.7–2.7 MB

Evidence: 15 unique remote catalog images were checked by response headers. Six exceed 200 KB and five exceed 500 KB; the five largest are approximately 0.73 MB, 1.98 MB, 2.46 MB, 2.56 MB, and 2.56 MB. The remote set totals 10.95 MB. The repository’s image directory contains 189 files totaling 41.03 MB; 26 exceed 200 KB and 20 exceed 500 KB, although many may be unused. `next/image` transformation reduces normal rendered transfer size, so these are source-asset findings, not proof that every visitor downloads the originals.

Recommendation: retain `next/image`, but preprocess upload sources to sensible dimensions and quality, remove unused duplicates, and enforce upload limits. Preserve originals outside the delivery path if needed. Keep the existing long-lived CDN cache policy.

### Medium — descriptive filenames are inconsistent

Evidence: several catalog/source names are meaningful (`HB_01`, `Golden Crema`-derived URLs), while others are opaque hashes, timestamps, or imported names such as `a32a5f_...` and `179277...jpg`.

Recommendation: use stable, lowercase, hyphenated, product-specific filenames before upload (for example, `golden-crema-coffee-pouch-front.webp`). Filenames are secondary to page context and alt text but improve asset organization and image relevance signals.

### Low — social proof lacks verification context

Evidence: homepage testimonials show first name/initial, location, text, and five stars but no date, product linkage, source platform, or “verified purchase” basis.

Recommendation: connect each genuine testimonial to its product and collection source/date where consent permits. Avoid adding review schema until the visible review data and eligibility requirements are met.

### Low — content presentation is scannable, but product detail structure is too flat

Evidence: product pages use an H1 and one H2 (“About this product”), with ingredients/preparation embedded as newline-heavy database text where present. The template renders that content in a single paragraph, so newline structure may not become meaningful sections or lists.

Recommendation: model and render ingredients, preparation, nutrition, allergens, storage, source, and FAQs as semantic headings, lists, and definition tables. This will improve scanning, accessibility, and extractability without manufacturing extra copy.

## Image audit summary

| Metric | Current evidence |
|---|---:|
| Visible products | 24 |
| Products with no image | 9 |
| Product image references | 27 |
| Unique product image URLs | 21 (15 remote, 6 local) |
| Remote source images over 200 KB | 6/15 |
| Remote source images over 500 KB | 5/15 |
| Repository image assets | 189 files / 41.03 MB |
| Repository assets over 200 KB | 26 |
| Repository assets over 500 KB | 20 |
| Public `next/image` usages missing alt | 0 found |

## Recommended implementation order

1. Consolidate the four duplicate product families and redirect retired URLs.
2. Complete images and truthful core content for all indexable products, starting with nine image-less and sixteen sub-50-word pages.
3. Add Product/Offer, Organization/LocalBusiness, WebSite, and Breadcrumb JSON-LD in initial server-rendered HTML.
4. Add metadata base, canonical, Open Graph, Twitter, and unique page descriptions/images.
5. Publish customer policy pages and surface delivery/return information near purchase actions.
6. Audit and substantiate health, nutrition, sourcing, freshness, and traceability claims.
7. Add named expertise/process evidence and useful first-party brewing guidance.
8. Normalize image alt text, filenames, and upload-size controls; remove unused duplicate assets.

## Validation checklist after changes

- Verify rendered `<head>` output on every public template, not just source objects.
- Validate JSON-LD syntax and Google-supported rich-result requirements; test real product URLs.
- Confirm one canonical URL per product family and test every redirect.
- Re-query the visible catalog for missing images and content-depth gaps.
- Confirm Product price/availability schema matches the visible UI and database at render time.
- Re-crawl internal links and verify policy pages are linked from footer and checkout.
