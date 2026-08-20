# SpeakNSolve Site

Static landing page for SpeakNSolve.

## Deploy on Cloudflare Pages

This project is a static site and can be deployed directly to Cloudflare Pages.

Use the following settings when creating the Pages project:

- Framework preset: `None`
- Production branch: `main`
- Build command: leave blank
- Build output directory: `public`

Do not use `npx wrangler deploy` for this repo. That command is for Workers, not
Pages. If you need a CLI deploy, use `npx wrangler pages deploy public`.

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

## Login, WhatsApp signup, and support chat

The static site includes lightweight frontend account flows for the pilot:

- Google login with separate role contexts for `Admin`, `Teacher`, and `Parent`
- WhatsApp signup that captures role, name, phone number, and student grade
- A customer-service chat widget that stores messages locally and is ready for a future WhatsApp handoff

Configuration lives in `public/config.js`:

```js
window.SPEAKNSOLVE_CONFIG = {
  formEndpoint: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL",
  googleClientId: "YOUR_GOOGLE_CLIENT_ID",
  parentPortalUrl: "https://bhithashri385.github.io/math-quest-portal/",
  whatsappNumber: "+15551234567",
};
```

If `googleClientId` is blank, the Google button uses a local preview prompt so
the flow can still be tested without production OAuth setup. The current account
and chat queue are stored in browser `localStorage`; production persistence can
be added behind the same UI later.

Parents can use the **Parent portal with Gmail** button in the practice section.
That button opens the Google login modal with the `Parent` role already selected.
After sign-in, the modal shows an **Open parent portal** link using
`parentPortalUrl`.

For production Gmail login, create a Google OAuth web client and set
`googleClientId` in `public/config.js`. Without that client ID, the site only
uses the local preview prompt and does not perform real Google verification.

## Open locally

Open `public/index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/public/`.

## Files

- `public/index.html` - page structure and content
- `public/styles.css` - layout, visual system, and responsive styling
- `public/script.js` - signup modal and live form submission behavior
- `public/config.js` - frontend configuration including the form endpoint
- `public/assets/` - brand assets used by the site
- `google-apps-script/Code.gs` - Google Apps Script backend for Sheets + email
# speaknsolve
