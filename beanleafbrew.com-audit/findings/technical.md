# Technical SEO Findings

## Score: 67/100

- Robots and the WordPress sitemap are reachable and primary content is server-rendered.
- The sitemap contains 47 URLs, including redirected/noindex utility pages and indexable template, form, author, and default-content artifacts.
- Sampled shop/category pages lacked self-canonicals; the homepage emits two viewport tags.
- HTTPS works, but the live response lacks HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.
- Mobile Lighthouse: Performance 81, SEO 92, Accessibility 93, Best Practices 92; LCP 2.9s, FCP 2.1s, TBT 170ms, CLS 0, Speed Index 16.9s.
- The homepage transfers about 65 MB; five MP4 files account for about 58.9 MB.

## Priority

1. Clean the sitemap and index controls.
2. Replace heavy multi-video delivery.
3. Add metadata/canonicals and remove duplicate viewport output.
4. Optimize images and add dimensions.
5. Add and test security headers.
