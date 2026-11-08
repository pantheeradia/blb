# On-Page SEO and SXO Findings

**Audit target:** https://blb-weld.vercel.app/  
**Checked:** 3 November 2026  
**On-page score:** **46/100**  
**SXO score:** **48/100**

## What works

- Sampled pages use one clear H1 and broadly match commercial or navigational intent.
- Homepage title is 42 characters and description is 128 characters.
- Product pages have unique titles/descriptions generated from catalog data.
- Navigation, category choices, search, sorting, and purchase actions are understandable after JavaScript loads.
- Image alt coverage is strong.

## Findings

### High — Shop internal linking disappears without JavaScript

The server response contains the shop hero and skeleton but no product cards or product anchors. This disconnects the primary category page from 23 product URLs in raw HTML.

**Recommendation:** Server-render the default grid and real links, then layer search, sorting, and filtering on top.

### High — Product pages provide insufficient decision support

The product template lacks related products, breadcrumb navigation, reviews, delivery/return certainty, detailed specifications, and substantial preparation guidance.

**Recommendation:** Add visible breadcrumbs, structured specifications, trust/logistics blocks, verified reviews, and contextual related-product/category links.

### Medium — Metadata coverage is incomplete

- Shop title is 28 characters; About is 22; Contact is 24.
- Contact inherits the 128-character homepage description rather than using a contact-specific description.
- Several product descriptions are only 41-82 characters.
- Canonical, Open Graph, and Twitter/X metadata are absent.

**Recommendation:** Build page-type metadata templates with unique, intent-matched titles/descriptions, canonical URLs, and social previews. Titles should generally be descriptive rather than padded to a character count.

### Medium — About and Contact pages are thin

The About page exposes roughly 118 main-content words and the Contact page about 45. The About page lacks founder/team expertise and deeper process/estate evidence.

**Recommendation:** Expand only with useful, verifiable content: founder story, roasting method, sourcing relationships, certifications, location purpose, and customer-service expectations.

### Medium — Category query URLs need an indexation strategy

Footer links use query-string filters such as `/shop?category=ground-coffee`. These are useful UX states but are not server-rendered landing pages and have no canonical strategy.

**Recommendation:** Keep filter parameters canonicalized to `/shop` unless a category has enough unique demand/content to justify a dedicated server-rendered route.

### Low — Custom 404 experience is missing

404 responses are correct but inherit the homepage title and provide little recovery guidance.

**Recommendation:** Add a dedicated not-found page with search/shop links while preserving the 404 status.

## Leading indicators

- Raw product-anchor count on `/shop`
- Organic landing sessions and conversion by product/category
- Search Console CTR after metadata improvements
- Filter/category duplicate indexing remains at zero
