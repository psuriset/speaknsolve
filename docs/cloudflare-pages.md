# Deploy SpeakNSolve on Cloudflare Pages

This repo is a static site, so it should be deployed as a Cloudflare Pages project
with the `public/` directory published directly.

## GitHub-backed Pages project

1. In Cloudflare, go to **Workers & Pages**.
2. Create a new **Pages** project.
3. Connect the GitHub repository: `psuriset/speaknsolve`.
4. Use these settings:
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** leave empty
   - **Build output directory:** `public`

Cloudflare Pages should then publish the contents of `public/` automatically for
each push to `main`.

## Important: do not use `wrangler deploy`

This project is a Pages site, not a Worker. Using:

```bash
npx wrangler deploy
```

will try to deploy a Worker and can fail with messages like:

- `wrangler deploy on a Pages project`
- `Missing entry-point to Worker script or to assets directory`

If you need a CLI deploy, use:

```bash
npx wrangler pages deploy public
```

## Quick verification checklist

In the Cloudflare Pages project, confirm:

- the GitHub repo is `psuriset/speaknsolve`
- the production branch is `main`
- the build command is empty
- the build output directory is `public`
- the custom domain `speaknsolve.org` is attached to this Pages project

After a successful production deploy, `View Source` on `https://speaknsolve.org/`
should match `public/index.html` from the latest `main` branch.
