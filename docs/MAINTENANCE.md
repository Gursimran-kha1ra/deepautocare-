# Maintenance Guide

Day-to-day upkeep is just editing `config.json` and, for city changes, re-running one
command. No framework, no dependencies to update.

## Common edits

| Task | What to do |
|---|---|
| Change phone / email / address | Edit `business` in `config.json` |
| Change colours | Edit `theme` in `config.json` |
| Update hours | Edit `business.hours` (use `null` for closed days) |
| Add / edit a service | Add or edit an object in `services` |
| Add a testimonial | Add an object to `reviews`; update `review.count` |
| Add gallery photos | Drop files in `/assets/images/gallery`, add to `gallery.images` |
| Add a service-area city | Add to `serviceAreas`, then `node tools/build.js` |
| Change social links | Edit `social` |
| Swap the logo / hero | Replace files in `/assets/images` (keep names or update paths) |

Most changes show up on refresh. **Anything touching `serviceAreas` or `seo.siteUrl`
requires** `node tools/build.js` to regenerate `/locations`, `sitemap.xml` and
`robots.txt`.

## Replacing images
Keep file sizes small for speed:
- Hero ≈ 1600×900, services/gallery ≈ 800×600–1000.
- Export as **WebP** (or compressed JPG) at ~70–80% quality.
- Always set meaningful `alt` text in `config.json` for gallery images.

The included images are branded placeholders — replace them all before launch.

## Connecting the booking form
By default `booking.endpoint` is empty, so the form validates and shows a success
message but doesn't send anywhere ("demo mode"). To receive submissions, point it at
any backend that accepts a JSON `POST`:

1. **Formspree** — create a form, copy its endpoint, set
   `"endpoint": "https://formspree.io/f/xxxx"`.
2. **Basin / Getform / FormSubmit** — same idea: paste their endpoint URL.
3. **Your own serverless function** (Netlify/Vercel/Cloudflare) — accept the JSON body
   and email or store it.

The form sends a JSON object with: `name, phone, email, make, model, year, service,
date, time, message`. The success message shown to the user comes from
`booking.successMessage`.

## Minified assets
`css/main.min.css` is a production-minified copy of `css/main.css`. The pages load the
readable `main.css` for easy editing; to use the minified file in production, change
the stylesheet link in the HTML shells (or in `tools/make-shells.js`, then re-run it)
to `main.min.css`. To minify the JavaScript as well, run any standard minifier, e.g.:
```bash
npx terser js/config.js js/components.js js/gallery.js js/booking.js js/pages.js js/app.js \
  -o js/site.min.js -c -m
```
and point the pages at the single `js/site.min.js` bundle.

## Performance / Lighthouse
The structure already supports high scores (deferred scripts, lazy-loaded images,
preconnected fonts, minimal CSS). To hit the 95+/100 targets in production:
- replace placeholders with **compressed WebP** images at the right dimensions,
- serve over **HTTPS with gzip/brotli** (every host above does this by default),
- keep the readable JS or ship the minified bundle as above.

## Updating the year, copyright, etc.
The footer copyright year is automatic. License text comes from `business.licenses`.

## Backups
Because the whole site is plain files, a backup is just a copy of the folder (or the
Git repo). Keep each client's `config.json` and `/assets/images` safe — that's their
entire brand.
