# SpeakNSolve Site

Static landing page for SpeakNSolve.

## Form integration

The pilot form can submit to Google Sheets and email through a Google Apps Script
web app.

1. Create a Google Sheet with a tab named `Leads`.
2. Open `Extensions` -> `Apps Script`.
3. Paste the contents of `google-apps-script/Code.gs`.
4. Update the config values at the top of that script.
5. Deploy the Apps Script as a web app with access set to `Anyone`.
6. Copy the deployment URL into `config.js` as `formEndpoint`.

When the form submits successfully, the Apps Script:

- appends the lead to Google Sheets
- sends an email notification
- returns JSON to the static site

## Open locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/speaknsolve-site/`.

## Files

- `index.html` - page structure and content
- `styles.css` - layout, visual system, and responsive styling
- `script.js` - interest chip interaction and live form submission
- `config.js` - frontend configuration including the form endpoint
- `google-apps-script/Code.gs` - Google Apps Script backend for Sheets + email
# speaknsolve
