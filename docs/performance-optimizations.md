# Performance and Shop Improvements

This document records the performance and shop usability changes implemented so far, what each change does, and what it does not do.

## 1. Product-query caching

**Implementation:** `src/lib/products.ts`

The public product queries are wrapped with Next.js `unstable_cache`:

- `getAllProducts()`
- `getProductBySlug(slug)`
- `getProductsByCategory(category)`
- `getFeaturedProducts()`

Each result is cached for **300 seconds (5 minutes)** and assigned the shared `products` cache tag. On a cache hit, Next.js can reuse the previous query result instead of querying the database again. A cache miss still runs the database query.

**Keeping edits fresh:** Product create, update, and delete handlers call `invalidateProductCache()` after a successful database mutation. That expires entries tagged `products`, so the next page request fetches current product data instead of waiting for the five-minute lifetime.

**Relevant files:**

- `src/lib/products.ts`
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/products/[id]/route.ts`

## 2. Prerendering public catalog pages

The Next.js production build currently prerenders the homepage and shop page, and generates product pages for the slugs returned by `generateStaticParams()` in `src/app/shop/[slug]/page.tsx`. The build reports a **5-minute revalidation interval** for the homepage, shop, and generated product pages, consistent with the product data cache lifetime.

Prerendered pages can be served without rebuilding the complete page for each visit. Revalidation lets them refresh as product data changes; the admin product handlers also revalidate the affected public paths.

## 3. Image delivery settings

**Implementation:** `next.config.ts`

Next.js Image Optimization is enabled for `<Image>` components, with AVIF and WebP selected as delivery formats and `qualities: [100]`. The optimizer can produce responsive image sizes for the requested display sizes, and the browser receives a supported modern format.

**Quality caveat:** `100` is the maximum encoder quality allowed here; AVIF and WebP are still generally lossy formats. This setting does **not** make the conversion mathematically lossless or guarantee pixel-identical output. It does avoid lowering the configured quality level, but can produce larger files than lower-quality encoding. Original source images are not rewritten by this configuration.

## 4. Deferred homepage hero video

**Implementation:** `src/components/home/Hero.tsx`

The hero video has `preload="none"` and its source URL is assigned only after the browser's page `load` event. If the component mounts after that event has already fired, the video source is assigned after a short delay. The poster image is available as the initial visual while the video is deferred.

This helps keep the large video from competing with initial page resources. It does **not** reduce the video file's size or change its quality. Video download still begins after the initial page load, and playback may start later as a result.

## 5. Shop search and pagination

**Implementation:** `src/components/shop/ShopClient.tsx`

The shop now has a client-side search field and displays up to **9 products per page** (or 9 instant-premix product groups). Search checks product names, descriptions, categories, weights, tags, notes, and premix variant names and weights. Changing the category or search query returns the view to the first page.

This is mainly a browsing and usability improvement, not server-side pagination: the shop still fetches the visible product list before filtering and paging it in the browser. It therefore does not reduce the initial database query or the product data sent to the shop page.

## Validation performed

- `npm run build` passed after the changes. The build output confirmed prerendering and the five-minute revalidation interval.
- ESLint passed for the shop search and pagination component, and for the core cache, hero-video, and image-configuration files.
- Project-wide `npm run lint` reports existing errors in other files, including unescaped apostrophes, an anchor to an API route, state updates in effects, and `any` types in the product API routes. These were not part of the optimization changes.

## Useful next steps

1. Measure the live site with Lighthouse or PageSpeed Insights and record LCP, INP, CLS, and transfer sizes before and after deployment.
2. Consider true server-side pagination and search if the catalog grows substantially; this would require passing search/page parameters to a server query instead of sending all products to the browser.
3. If reducing transfer size further is more important than maximum image encoder quality, compare quality settings with visual review and real image-size measurements. For genuinely lossless delivery, use a lossless source/format workflow rather than assuming quality 100 is lossless.
4. Measure and optimize the hero video separately if it remains a significant transfer cost. The current change delays its request but leaves the media asset unchanged.
