# Vercel Migration For `grubclub.gg`

The Growth Specialists site is a server-capable Next.js App Router app. It uses a server action, API routes, email delivery, and optional Stripe Checkout, so GitHub Pages is not the right production host.

## What Went Wrong On GitHub Pages

- GitHub Pages is currently pointed at `grubclub.gg`.
- The previous Pages workflow expected a static export in `./out`.
- This project builds successfully with `next build`, but it does not generate `./out` because it is not configured as a static-only app.
- When the custom Pages workflow failed, GitHub Pages served the last successful Pages output or the fallback Jekyll/README page.

## Recommended Host

Use Vercel for the production deployment.

Vercel supports the current app structure:

- App Router pages
- Server actions
- API routes
- Server-only environment variables
- Stripe server SDK
- Email provider calls

## Vercel Project Setup

1. In Vercel, import `https://github.com/mlrspete/gcweb`.
2. Use the default Next.js framework preset.
3. Build command: `npm run build`.
4. Install command: `npm install`.
5. Output directory: leave blank/default.
6. Add production environment variables from `docs/env-checklist.md`.
7. Set `NEXT_PUBLIC_SITE_URL` to `https://grubclub.gg`.
8. Deploy a preview first, then promote to production after checking the form and metadata.

## Domain Cutover

Add these domains to the Vercel project:

- `grubclub.gg`
- `www.grubclub.gg`

Then update DNS at the domain registrar according to the exact records shown in the Vercel dashboard.

Current Vercel documentation says apex domains usually use an `A` record, while subdomains usually use a `CNAME` record. Vercel may show dynamic DNS targets in the dashboard, so copy the dashboard values exactly rather than relying on memory.

The Vercel project currently reports these required records:

- Apex `grubclub.gg`:
  - `A` record, name `@`, value `216.198.79.1`
  - `A` record, name `@`, value `64.29.17.1`
- `www.grubclub.gg`:
  - `CNAME` record, name `www`, value `fd2283a0da2b2ead.vercel-dns-017.com.`

Remove the old GitHub Pages records when cutting over:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

After Vercel verifies the domain and SSL works, remove or unpublish the GitHub Pages custom domain to avoid future confusion.

## Current Vercel Deployment

- Production URL: `https://gcweb-opal.vercel.app`
- Project: `mlrspetes-projects/gcweb`
- Production `NEXT_PUBLIC_SITE_URL` has been set to `https://grubclub.gg`.

Redeploy after changing production environment variables so the public metadata and canonical URLs use the final domain.

## Verification

After DNS changes:

```bash
Resolve-DnsName grubclub.gg
Resolve-DnsName www.grubclub.gg
```

Then check:

- `https://grubclub.gg`
- `https://www.grubclub.gg`
- `/sitemap.xml`
- `/robots.txt`
- `/api/health`
- Join form submission
- Stripe Checkout if environment variables are configured

DNS changes can take minutes to hours depending on registrar TTL and local cache.
