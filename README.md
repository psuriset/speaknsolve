# SpeakNSolve Site

Static landing page for SpeakNSolve.

## Deploy on Cloudflare Pages

This project is a static site and can be deployed directly to Cloudflare Pages.

Use the following settings when creating the Pages project:

- Framework preset: `None`
- Production branch: `main`
- Build command: leave blank
- Build output directory: `public`

After the first deploy, Cloudflare will give you a `*.pages.dev` URL. You can
then add your custom domain from the Pages project under `Custom domains`.

## Form integration

The pilot form can submit to Google Sheets and email through a Google Apps Script
web app.

1. Create a Google Sheet with a tab named `Leads`.
2. Open `Extensions` -> `Apps Script`.
3. Paste the contents of `google-apps-script/Code.gs`.
4. Update the config values at the top of that script.
5. Deploy the Apps Script as a web app with access set to `Anyone`.
6. Copy the deployment URL into `public/config.js` as `formEndpoint`.

When the form submits successfully, the Apps Script:

- appends the lead to Google Sheets
- sends an email notification
- returns JSON to the static site

## Open locally

Open `public/index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/public/`.

Public blog: https://speaknsolve.org/
## Files

- `public/index.html` - page structure and content
- `public/styles.css` - layout, visual system, and responsive styling
- `public/script.js` - interest chip interaction and live form submission
- `public/config.js` - frontend configuration including the form endpoint
- `public/bianca-hero.png` - hero image
- `public/assets/` - brand assets used by the site
- `google-apps-script/Code.gs` - Google Apps Script backend for Sheets + email
# speaknsolve
