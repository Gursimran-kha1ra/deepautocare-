# Deployment Guide

This is a **static site** — plain HTML, CSS, JS, JSON and images. It runs on any web
host or static-hosting service with no server-side runtime, database or build step.

## Before you deploy — the one rule

The site reads `config.json` with `fetch()`, which browsers only allow over **HTTP/HTTPS**,
not `file://`. So:

- ✅ Works on any real web host, local server, or static host.
- ❌ Does **not** work by double-clicking `index.html` from your file explorer.

## Pre-flight checklist

1. **Edit `config.json`** with the client's real details (see CUSTOMIZATION.md).
2. **Replace placeholder images** in `/assets/images` with real photos.
3. **Set `seo.siteUrl`** to the client's final domain (e.g. `https://www.theirshop.com`).
4. **Generate SEO files:**
   ```bash
   node tools/build.js
   ```
   This (re)creates `/locations/*.html`, `sitemap.xml` and `robots.txt`.
5. **Preview locally:**
   ```bash
   python3 -m http.server 8080   # then open http://localhost:8080
   ```
   Click through every page, test the forms, the gallery lightbox, the before/after
   sliders, and the Call / Text / WhatsApp buttons on a phone.

## Deploying

Upload the **entire folder contents** (everything, keeping the folder structure) to
your host's web root. Host-specific walkthroughs:

- **Hostinger** → [HOSTINGER.md](HOSTINGER.md)
- **GitHub Pages** → [GITHUB.md](GITHUB.md)
- **Netlify / Vercel / Cloudflare Pages** → drag-and-drop the folder, or connect the
  Git repo. No build command needed; publish directory is the project root.
- **Any cPanel / FTP host** → upload everything into `public_html` (or the domain's
  document root).

## Custom domain & HTTPS

Point the domain's DNS to your host and enable the host's free SSL (Let's Encrypt).
Always serve over HTTPS — it's required for SEO, trust, and the click-to-call/SMS
features to behave well on mobile.

## After going live

- Submit `https://yourdomain.com/sitemap.xml` in **Google Search Console**.
- Create / claim the **Google Business Profile** and match the name, address and phone
  (NAP) exactly to `config.json` — consistency boosts local ranking.
- Run **Lighthouse** (Chrome DevTools) and confirm scores once real, compressed images
  are in place.
