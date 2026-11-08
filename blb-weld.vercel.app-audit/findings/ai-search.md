# AI Search / GEO / Agent Readiness Findings

**Audit target:** https://blb-weld.vercel.app/  
**Checked:** 3 November 2026  
**Qualitative readiness score:** **53/100**

This is a heuristic readiness score, not a Google or LLM-provider score. Platform-specific citation visibility in Google AI Overviews/AI Mode, ChatGPT Search, Claude, and Perplexity was not measured with provider data.

## What works

- The homepage's core text is present in raw server-rendered HTML (about 559 visible words after scripts/styles were removed), so crawlers do not need client-side JavaScript to understand the offer.
- The page has one H1 followed by descriptive H2 sections and short paragraphs/lists. It includes concrete facts such as Whitefield, Coorg, Chikmagalur, 3,100-4,000 ft, weekly roasting, and 48-hour packing.
- Brand identity and contact signals are visible: `Bean Leaf Brew LLP`, a Bengaluru address, phone, email, and hours are presented across the footer and Contact page (`src/components/layout/Footer.tsx:31-66`, `src/app/contact/page.tsx:22-43`).
- `/robots.txt` returns 404. That is a technical gap for SEO governance, but it does **not** block OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, GPTBot, ClaudeBot, or other standards-compliant crawlers. Search citability and training access should still be treated as separate capabilities.
- The page uses labeled navigation, product controls, and image alt text, providing a useful accessibility-tree foundation for browsing agents.

## Findings

### High — Product pages lack complete, verifiable answer material

Sampled product descriptions are short sales summaries such as coffee/chicory percentage, roast, or a general “refreshing & healthy” claim. They do not consistently expose ingredients, nutrition/allergens, exact pack contents, preparation ratios, shelf life, storage, sourcing/estate, roast/pack date, caffeine, shipping/returns, or evidence for health/freshness claims.

**Impact:** Search and answer systems have little primary, specific material to cite for high-intent questions. The content is easy to parse but often too incomplete to answer buying and comparison queries reliably.

**Recommendation:** Expand priority product pages with visible, factual specification tables and concise answer sections: what it is, who it is for, how to prepare/brew it, ingredients/allergens, origin, roast/grind, pack size, storage, dispatch cadence, shipping, and returns. Cite certifications, lab/nutrition data, or estate sources where claims depend on them. Do not manufacture statistics or reviews.

**Dependency:** Product, compliance, and operations teams must verify the facts before publication.

**Validation / failure test:** A reviewer should be able to answer at least ten common pre-purchase questions using only visible page content and cited evidence. If answers still require guessing, the page is not ready.

### High — No machine-readable entity/product graph

Production samples contained no JSON-LD, microdata, or RDFa. Google explicitly says structured data is not a special AI-visibility lever, so this should not be sold as an “AI citation hack.” It is still useful SEO infrastructure for consistently identifying the Organization, products, offers, and page relationships.

**Recommendation:** Implement the truthful Organization/WebSite/Product/Offer/Breadcrumb graph described in `schema.md`, and keep the values aligned with visible content.

**Validation / failure test:** Entity values must remain stable across pages and match the public business profile, contact details, catalog, and policies.

### Medium — Authority claims are present without visible substantiation

The homepage says the coffee is `100% Traceable` and sourced from `award-winning estates`, and testimonials are displayed with names/locations. The sampled pages do not link to estate profiles, award sources, traceability records, verified review sources, certifications, or a named expert/founder.

**Impact:** These are marketing claims rather than citable evidence. AI systems and users cannot independently verify them from the page.

**Recommendation:** Add genuine estate/producer profiles, verifiable awards/certifications, roasting methodology, traceability examples, and review provenance. Create a named founder/roaster profile with relevant credentials and external profiles. Avoid fake freshness dates or unsupported quantitative claims.

**Validation / failure test:** Every material claim should have a named source, record, methodology, or accountable person. Remove or soften claims that cannot be supported.

### Medium — Limited informational coverage restricts query fan-out opportunities

The site primarily contains homepage, shop, product, About, and Contact content. There is no visible guide/resource layer for questions such as grind size by brewer, South Indian filter ratios, coffee-to-chicory comparison, whole bean versus ground, premix ingredients, storage, or selecting roast levels.

**Recommendation:** Publish a small number of expert, first-hand guides based on actual Bean Leaf Brew processes and products. Use question-led headings, direct answers, comparison tables, original photography/data, and bidirectional links between guides, categories, and products. Optimize for people; Google's published guidance says generative-AI search optimization is still SEO and rejects AI-specific rewriting/chunking myths.

**Validation / failure test:** Monitor non-brand impressions and citations for the questions each guide is designed to answer. Retire or improve pages that attract no qualified discovery or engagement.

### Medium — Discovery/governance files are absent

- `/robots.txt`: 404
- `/sitemap.xml`: 404
- `/llms.txt`: 404

The missing robots and sitemap files matter for ordinary crawl governance and URL discovery. Missing `llms.txt` is informational only: Google Search ignores it, and no major AI search provider has confirmed that it improves citation visibility. It receives no score penalty here.

**Recommendation:** Add production robots and XML sitemap routes, explicitly preserving access for Googlebot, OAI-SearchBot, Claude-SearchBot, and PerplexityBot unless the business chooses otherwise. Decide training-crawler access separately for GPTBot, ClaudeBot, CCBot, and Google-Extended based on licensing preference. Do not conflate Google-Extended with Google Search/AI Overviews eligibility. Add `llms.txt` only as low-cost optionality, not as a ranking task.

**Validation / failure test:** Test each named crawler against the final robots rules and confirm the sitemap lists only canonical, indexable public URLs.

### Medium — Canonical, social-preview, and brand-linkage metadata are missing

Sampled pages had no canonical link, Open Graph metadata, or Twitter/X card metadata. These are primarily standard SEO/social controls, but they also reduce ambiguity when URLs are shared, cited, or discovered through multiple hosts.

**Recommendation:** Establish `metadataBase`, page-level canonicals, Open Graph/Twitter cards, and a stable brand/entity URL before adding schema or submitting sitemaps (`src/app/layout.tsx:17-22`).

### Low — Agent transaction readiness is not established

The storefront exposes usable HTML controls, but no UCP profile/WebMCP contract was found or measured. These are emerging commerce/agent capabilities, not prerequisites for indexing or citation.

**Recommendation:** Revisit only after core SEO, product data, accessibility, and checkout reliability are strong. Do not prioritize experimental agent protocols over the missing sitemap, canonicals, product facts, and schema.

## Platform access status

| Capability | Relevant crawler/control | Observed status |
|---|---|---|
| Google Search and AI Overviews/AI Mode eligibility | Googlebot + Search Console generative-AI control | Robots does not block; indexation/control status not measured |
| ChatGPT Search citability | OAI-SearchBot | Not blocked because robots.txt is absent |
| OpenAI training | GPTBot | Not blocked; separate from ChatGPT Search |
| Claude search citability | Claude-SearchBot | Not blocked because robots.txt is absent |
| Anthropic training | ClaudeBot | Not blocked; separate from Claude search |
| Perplexity search | PerplexityBot | Not blocked because robots.txt is absent |
| Gemini/Vertex training and grounding | Google-Extended | Not blocked; does not govern Google Search inclusion |

## Leading indicators

- Google Search Console indexed canonical URLs versus submitted sitemap URLs
- Non-brand impressions/clicks for question and comparison queries
- Product-page engagement/conversion after adding decision-support facts
- Cited/linked brand mentions from genuine estates, partners, publications, and customers
- Provider-specific AI citation checks for a fixed query set, measured separately by platform

