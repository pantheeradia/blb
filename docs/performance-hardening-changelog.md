# Performance Hardening and UX Improvements

## Overview

This document records the performance, reliability, and loading-experience work completed for the Bean Leaf Brew website.

The update focused on reducing unnecessary work, improving perceived speed, preventing duplicate operations, and making large datasets scale more safely.

## 1. Skeleton loading screens

Added route-level skeleton screens so visitors see a structured preview immediately while the requested page is loading.

Added loading states for:

- The main public website
- The shop
- Checkout
- The admin dashboard and its child pages

Files:

- `src/app/loading.tsx`
- `src/app/shop/loading.tsx`
- `src/app/checkout/loading.tsx`
- `src/app/admin/(dashboard)/loading.tsx`

The analytics page already had a dedicated loading state and retains it.

## 2. WebP image delivery and image caching

Updated Next.js Image Optimization to serve generated images as WebP.

Changes:

- WebP is now the configured optimized delivery format.
- Image quality options are limited to practical optimized values instead of forcing quality 100.
- Optimized images receive a 30-day minimum cache lifetime.
- Product-grid images below the initial screen are allowed to use normal lazy loading instead of being marked as high-priority requests.
- The shop hero remains eagerly loaded because it is above the fold.

Files:

- `next.config.ts`
- `src/components/shop/ShopClient.tsx`

Next.js performs the WebP conversion at request time and caches the optimized result. Original source files are not rewritten.

## 3. Duplicate request protection

Added immediate in-flight guards around customer-facing mutations. These guards use refs, so they take effect before React finishes another render.

Protected operations include:

- Coupon validation
- Free-order submission
- Razorpay order creation
- Payment verification
- Contact-form submission

The Razorpay browser script is also loaded through a shared promise, preventing multiple script tags and duplicate downloads.

Files:

- `src/components/shop/CheckoutClient.tsx`
- `src/components/ContactForm.tsx`

## 4. Payment idempotency and duplicate email prevention

Improved the shared paid-order creation path so it reports whether an order was newly created or had already been processed.

The Razorpay verification, callback, and webhook handlers now send an order-confirmation email only when they actually create the order. A repeated callback or webhook can safely recognize the existing order without scheduling another confirmation email.

Files:

- `src/lib/createOrderFromPending.ts`
- `src/app/api/razorpay/verify/route.ts`
- `src/app/api/razorpay/callback/route.ts`
- `src/app/api/razorpay/webhook/route.ts`

## 5. Debounced search and autocomplete

The public shop search now waits 200 milliseconds after the latest keystroke before running the complete product-filtering operation. The input remains responsive while filtering work is delayed.

The shop search also provides browser-native product-name suggestions through a datalist.

The admin search field already had a 300-millisecond route-update debounce and retains it.

Files:

- `src/components/shop/ShopClient.tsx`
- `src/app/admin/(dashboard)/_components/SearchInput.tsx` (existing behavior retained)

## 6. Server-side pagination

The admin product screen previously loaded every matching product and then filtered the collection in memory. It now queries only the requested page.

The admin products API now supports:

- `page`
- `pageSize` with a maximum of 100
- `q`
- `category`
- `stock`

The API returns both `data` and pagination metadata.

The admin product page now:

- Loads 25 rows per page
- Runs list, count, and category-count queries in parallel
- Preserves active search and filter parameters while paging
- Orders results by creation date

Files:

- `src/app/api/admin/products/route.ts`
- `src/app/admin/(dashboard)/products/page.tsx`

The customer and order admin screens already used server-side pagination and retain it. The public shop continues using client-side pagination because its product catalog is prerendered and cached as a single small collection.

## 7. N+1 query removal

The CSV order export previously ran one order-item query for every exported order.

It now:

1. Loads all orders once.
2. Loads all order items once.
3. Groups the items by order in memory.
4. Generates the CSV from those two result sets.

This changes the export from `1 + number of orders` database queries to two parallel database queries.

File:

- `src/app/api/admin/orders/export/route.ts`

## 8. Parallel database work

Independent work now runs concurrently where appropriate.

Examples:

- Product rows, totals, and category counts run together.
- Order export loads orders and items together.
- Dispatch-email preparation loads order items and customer notes together.
- Existing dashboard, analytics, customer, and order queries already used `Promise.all` and retain that behavior.

Files include:

- `src/app/admin/(dashboard)/products/page.tsx`
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/orders/export/route.ts`
- `src/app/api/admin/orders/[id]/route.ts`

An unused customer-count query was also removed from the admin dashboard.

## 9. Background work

Added a shared post-response background-job helper based on the stable Next.js `after` API.

The following slow email operations no longer hold up the HTTP response:

- Paid-order confirmation email
- Free-order confirmation email
- Dispatch email
- Contact-form email

Files:

- `src/lib/backgroundJobs.ts`
- `src/app/api/contact/route.ts`
- `src/app/api/orders/free/route.ts`
- `src/app/api/admin/orders/[id]/route.ts`
- Razorpay route handlers listed above

### Durability note

This is a supported post-response job mechanism, not a durable external message queue. It removes email latency from the user-facing response and keeps the server invocation alive for the returned promise.

If guaranteed retries, dead-letter handling, or long-running jobs are required, the next step is to connect a managed queue such as Cloudflare Queues, Upstash QStash, or an equivalent provider.

## 10. Optimistic interface updates

Admin controls now update visually before the server responds.

Implemented optimistic behavior for:

- Product stock status
- Product visibility
- Order status and tracking details

If a request fails, the previous values are restored. The order screen also displays an error message when rollback occurs.

Files:

- `src/app/admin/(dashboard)/products/ProductActions.tsx`
- `src/app/admin/(dashboard)/orders/[id]/OrderStatusUpdater.tsx`

## 11. Frequently accessed data caching

The existing five-minute public product cache was reviewed and retained.

Cached operations include:

- All visible products
- Product lookup by slug
- Products by category
- Featured products

Product create, update, and delete operations invalidate the shared product cache tag and revalidate affected public pages.

File:

- `src/lib/products.ts`

Image output caching was additionally increased to a 30-day minimum in `next.config.ts`.

## 12. Database indexes

Added indexes for common filters, sorting, and cleanup queries:

- `orders(status, created_at)`
- `products(visible, category)`
- `products(visible, featured)`
- `pending_orders(created_at)`

Files:

- `src/db/schema.ts`
- `scripts/turso-ddl.sql`
- `scripts/migrations/006-add-query-indexes.sql`
- `scripts/migrations/README.md`

### Deployment requirement

The migration must be applied to the production Turso database during deployment:

```bash
turso db shell <db-name> < scripts/migrations/006-add-query-indexes.sql
```

The statements use `CREATE INDEX IF NOT EXISTS`, so rerunning this particular migration is safe.

## 13. Dependency cleanup

Removed two unused runtime dependencies:

- `@radix-ui/react-dialog`
- `@radix-ui/react-slot`

Files:

- `package.json`
- `package-lock.json`

The MySQL driver was retained because it is used by the WordPress-order import script.

## 14. Next.js route compatibility cleanup

Next.js 16 rejects arbitrary exports from route-handler modules. Session-cookie helpers were moved into a normal library module so production route-type validation succeeds.

Files:

- `src/lib/adminSession.ts`
- `src/lib/adminAuth.ts`
- `src/app/api/admin/login/route.ts`

The session format remains compatible with existing admin sessions and middleware validation.

## 15. Additional lint cleanup

Cleared the remaining project-wide lint errors and warnings found during verification, including:

- Escaped copy in the About page
- Replaced an API download anchor with Next.js `Link`
- Removed unused imports and an unused dashboard query
- Replaced loose `any` database-error types
- Removed a product-option effect that synchronously changed state after render

## Verification

The completed project passes:

```text
npm run lint
npx tsc --noEmit
npx next build --webpack
```

The production build successfully compiled all public, checkout, admin, and API routes.

## Deployment checklist

Before deploying:

1. Apply `scripts/migrations/006-add-query-indexes.sql` to the production Turso database.
2. Confirm the deployment platform supports the Next.js `after` API. Vercel and standard Node.js hosting do; adapter support is platform-specific.
3. Confirm SMTP, Razorpay, Turso, and Blob environment variables remain configured.
4. Deploy the application normally.
5. Run a live Lighthouse or PageSpeed test after deployment to compare LCP, INP, CLS, and transfer size.

