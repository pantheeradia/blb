# Schema, AI Search, and Image Findings

## Scores

- Structured data: 42/100
- AI search readiness: 59/100
- Images: 38/100

## Main findings

- Morning Buzz exposes an unrelated spam review in Product JSON-LD and aggregateRating.
- Product variant counts, visible SKU, breadcrumb encoding, and structured values are inconsistent.
- Homepage and About contain no Organization/WebSite/WebPage JSON-LD.
- AI search crawlers are not specifically blocked and primary content is raw-HTML accessible.
- `llms.txt` and the optional UCP profile are absent; neither is a priority over core SEO work.
- Image samples show widespread empty alt, several missing dimensions, large PNG assets, and incorrect fetch priority.
- Public brand sources show potentially fragmented NAP data that should be modeled per genuine location.

## Priority

1. Remove the spam review and repair Product schema.
2. Add a stable Organization/entity graph.
3. Normalize NAP and location entities.
4. Convert large images to responsive AVIF/WebP and correct alt/priority/dimensions.
5. Build answer-first, evidence-led product and guide content for AI citability.
