# ProDown — Social Media Video Downloader

## Project Overview

**ProDown** is a free, zero-backend static web app that downloads videos from TikTok, Instagram, Facebook, YouTube Shorts, and Snapchat — with no watermarks, no signups, and no operating costs.

The app runs as a pure HTML/CSS/JS static site (no Node.js, no build step) and is optimized for Google AdSense monetization.

## Stack

- **Frontend:** HTML5, Tailwind CSS (CDN), FontAwesome 6 (CDN), Vanilla JS
- **Download Engines:** TiklyDown API, Cobalt API (multi-endpoint fallback), SaveFrom, SnapSave
- **Hosting Target:** Netlify (static site, no server-side code)
- **Fonts:** Plus Jakarta Sans (Google Fonts)

## File Structure

```
ProDown/
├── index.html                # Main downloader UI (AdSense-ready, SEO-optimized)
├── about.html                # About page
├── contact.html              # Contact & FAQ page
├── privacy-policy.html       # CCPA-compliant privacy policy (US English)
├── terms-of-service.html     # Terms of service (US English)
├── ads.txt                   # Google AdSense authorization (update publisher ID)
├── sitemap.xml               # SEO sitemap
├── robots.txt                # Search engine crawl rules
├── netlify.toml              # Netlify redirect & security headers config
├── assets/
│   ├── css/style.css         # Custom glassmorphism styles, skeleton loaders, ad slots
│   ├── js/app.js             # Download engine v2.0 with multi-API fallbacks
│   └── images/
│       ├── logo.png          # ProDown logo
│       └── image.jpeg        # Developer avatar
└── README.md
```

## How to Run Locally / on Replit

Since this is a static site with no build step, simply serve the root directory with any HTTP server:

```bash
npx serve . -p 5000
# or
python3 -m http.server 5000
```

The workflow is configured to run: `python3 -m http.server 5000`

## AdSense Setup

1. Open `ads.txt` and replace `pub-XXXXXXXXXXXXXXXX` with your actual AdSense Publisher ID.
2. In `index.html`, uncomment the AdSense `<script>` tag in the `<head>` and replace the publisher ID.
3. For each ad slot (`adSlotTop`, `adSlotInline`, `adSlotCTA`), uncomment the `<ins class="adsbygoogle">` tag and add your ad slot IDs.
4. Ad slots are clearly marked with `<!-- ProDown AdSense: ... -->` comments.

## Download Engine

The download engine (`assets/js/app.js`) uses a prioritized fallback chain:

| Engine     | Best For              | Endpoint                      |
|------------|-----------------------|-------------------------------|
| TiklyDown  | TikTok (no watermark) | api.tiklydown.eu.org          |
| Cobalt     | All platforms         | api.cobalt.tools + co.wuk.sh  |
| SaveFrom   | YouTube / Facebook    | worker.saveform.net           |
| SnapSave   | Snapchat              | snapsave.app                  |

## User Preferences

- Keep all UI text strictly in American English (US).
- Dark mode only — no light mode toggle.
- Neon-orange (#f97316) accent color throughout.
- No backend, no database, no dependencies to install.
- Maintain $0 operating cost philosophy.
