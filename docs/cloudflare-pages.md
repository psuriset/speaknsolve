# Deploy SpeakNSolve on Cloudflare Pages

This repo is a static site, so it can be deployed to Cloudflare Pages without a build step.

## Option 1: Deploy from GitHub in Cloudflare Pages

1. In Cloudflare, go to **Workers & Pages**.
2. Create a new **Pages** project.
3. Connect the GitHub repository: `psuriset/speaknsolve`.
4. Use these settings:
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** leave empty
   - **Build output directory:** `.`

Cloudflare Pages will publish the root of this repository as a static site.

## Option 2: Deploy with Wrangler

If you want CLI-based deploys later:

```bash
npx wrangler pages deploy .
