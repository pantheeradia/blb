# Content Quality Findings

**Audit target:** https://blb-weld.vercel.app/  
**Checked:** 3 November 2026  
**Category score:** **55/100**

## What works

- The homepage communicates Bengaluru roasting, Karnataka sourcing, altitude, freshness, and product categories in understandable language.
- About and Contact pages expose a physical address, phone, email, hours, sourcing regions, and a basic origin story.
- The homepage includes testimonials and concrete product/roasting claims.
- Copy is visually scannable and each sampled public page uses one H1.

## Findings

### High — Product pages are too thin for competitive buying intent

Sampled product pages expose roughly 51-75 words inside `<main>` in raw HTML. They usually contain name, price, a short description, and a few roast/blend/note fields.

**Recommendation:** Add verified ingredients/nutrition/allergens where relevant, exact pack contents, brew/preparation instructions, origin, roast/grind, storage and shelf life, roast/pack cadence, shipping/returns, manufacturer/FSSAI details, reviews, and related products.

**Validation / failure test:** A shopper should be able to answer at least ten common pre-purchase questions from the visible page without guessing. Measure conversion and organic engagement after expansion.

### High — Ecommerce trust and policy coverage is incomplete

No privacy, terms, shipping, return/refund, or dedicated policy routes are present in `src/app`, and the footer links only to About and Contact. These omissions weaken trust for an online store and prevent truthful shipping/return schema.

**Recommendation:** Publish accurate legal, shipping, cancellation, return/refund, and payment information and link it from the footer and near purchase actions.

### Medium — E-E-A-T proof is limited

The new site omits much of the founder/professional context still visible on the existing production site. It does not visibly substantiate `award-winning estates`, `100% traceable`, partner relationships, or roasting expertise.

**Recommendation:** Add a named founder/roaster profile, credentials, real process photography, producer/estate profiles, certifications, traceability examples, and review provenance.

**Validation / failure test:** Every material authority claim should identify an accountable person, source, record, or method. Soften claims that cannot be evidenced.

### Medium — Testimonials lack provenance

Testimonials use partial names and locations without a platform, date, product, or purchase-verification context.

**Recommendation:** Show only genuine reviews with source/date/product linkage and do not add AggregateRating until the visible review set supports it.

### Medium — Health/function language needs evidence review

Product data includes language such as `healthy`, `low glycemic index`, antioxidants, vitamin C, and bromelain benefits without visible substantiation.

**Recommendation:** Obtain compliance review, publish accurate nutrition/ingredient evidence, and remove or soften unsupported claims.

### Medium — No informational content layer

The project has no blog/resource routes for grind selection, South Indian filter ratios, coffee-versus-chicory, roast selection, whole bean versus ground, premix preparation, or storage.

**Recommendation:** Publish a small, first-hand guide cluster and link it bidirectionally with products and categories.

## E-E-A-T assessment

- Experience: moderate foundation, limited first-hand proof
- Expertise: weak-to-moderate; no named expert or credentials on the new site
- Authoritativeness: weak; external recognition is not integrated
- Trust: moderate contact/NAP foundation, weakened by missing policies and evidence

## Leading indicators

- Product conversion and organic entrances after content expansion
- Non-brand impressions for buying and brewing questions
- Verified review count and review-source coverage
- Policy-page engagement and checkout-support contacts
