# Customization Guide

Everything on the website is controlled by **`config.json`** in the project root.
Edit that one file and every page updates automatically. This guide walks through
each section.

> After editing service areas (cities), always re-run `node tools/build.js` so the
> location pages, `sitemap.xml` and `robots.txt` regenerate. Other changes appear as
> soon as you refresh the browser.

---

## 1. Business details — `business`

```json
"business": {
  "name": "Deep Auto Care",
  "tagline": "Dealership-quality repairs without the dealership price",
  "shortName": "DEEP",
  "phone": "+1(778) 240-1617",
  "phoneDisplay": "(778) 240-1617",
  "sms": "+1(778) 240-1617",
  "email": "service@deepautocare.ca",
  ...
}
```

| Field | Where it appears |
|---|---|
| `name` | Header, footer, titles, schema, copyright |
| `tagline` | Footer, meta fallbacks |
| `phone` | `tel:` links — **use full international format** `+1…` |
| `phoneDisplay` | The human-readable number shown on buttons |
| `sms` | `sms:` links (floating Text button, mobile bar) |
| `whatsapp.enabled` | `true` shows the WhatsApp button; `false` hides it |
| `whatsapp.number` / `presetMessage` | WhatsApp deep-link + prefilled text |
| `email` | `mailto:` links, contact card, schema |
| `address` | Footer, contact page, location pages, schema |
| `geo.lat` / `geo.lng` | Map coordinates in LocalBusiness schema |
| `mapsEmbed` | The Google Maps **embed** URL (see below) |
| `mapsLink` | "Get directions" link target |
| `hours` | Footer "open today", contact/location hours tables, schema |
| `emergency247` | Reserved flag for the roadside banner |
| `licenses` | Trust chips on About + footer license line |

### Getting the Google Maps embed URL
1. Open [Google Maps](https://maps.google.com) and search the business.
2. Click **Share → Embed a map → Copy HTML**.
3. Paste **only the `src="…"` URL** (the part inside the quotes) into `mapsEmbed`.

### Business hours
Each day is an object. For a closed day, set `open` and `close` to `null`:
```json
{ "day": "Sunday", "open": null, "close": null }
```
Times are 24-hour `"HH:MM"` and are auto-formatted to 12-hour for display.

---

## 2. Colours — `theme`

```json
"theme": {
  "primary":   "#0E1116",   // dark base (headers, footers, hero)
  "secondary": "#2563EB",   // secondary accent (avatars, glows)
  "accent":    "#FF6A2C",   // main call-to-action / brand colour
  "emergency": "#E11D2A",   // roadside banner, form errors
  "radius":    "20px"       // global corner roundness
}
```

These are injected as CSS variables at runtime, so changing a hex value instantly
re-themes the whole site — buttons, icons, links, glows and accents all follow
`accent`. Pick an `accent` with enough contrast on white for accessible buttons.

---

## 3. Stats & trust badges — `stats`, `trustBadges`

`stats` are the floating cards in the hero (value + suffix + label). `trustBadges`
is the scrolling strip under the hero — short phrases like "12-Month Warranty".

---

## 4. Hero — `hero`

```json
"hero": {
  "image": "assets/images/hero.jpg",
  "headline": "Your car, handled by people who actually care.",
  "subheadline": "Honest diagnostics, factory-grade parts…",
  "kicker": "Surrey's most-reviewed independent auto shop"
}
```
Replace `hero.jpg` with a high-quality wide photo (≈1600×900). Keep the headline
short and benefit-led.

---

## 5. Services — `services`

Services drive the home "Featured services" grid, the full Services page, the footer
list and the Service schema. Each item:

```json
{
  "id": "brake-repair",
  "name": "Brake Repair",
  "icon": "disc",
  "image": "assets/images/services/brakes.jpg",
  "short": "Pads, rotors, calipers and brake fluid service…",
  "description": "Longer description used in schema…",
  "benefits": ["Lifetime-warranty pads", "Calibrated measurement", "Quiet options"],
  "priceFrom": 189,
  "featured": true
}
```

- `id` — used as the anchor (`services.html#brake-repair`) and must be unique.
- `icon` — one of the built-in icon names (see list at the bottom).
- `priceFrom` — a number, or `null` to show "Custom quote".
- `featured: true` — includes the service in the home page grid.

Add or remove services by adding/removing objects — the grids, footer and schema all
update automatically.

---

## 6. Reviews — `reviews` and `review`

`review` holds the aggregate (rating, count, platform, link) shown in the hero,
rating summaries and schema. `reviews` is the array of individual testimonials:

```json
{ "name": "Priya Sandhu", "rating": 5, "date": "2025-04-18",
  "vehicle": "2019 Honda CR-V", "text": "They sent me photos…" }
```
All testimonials are loaded from here — nothing is hardcoded.

---

## 7. Gallery & before/after — `gallery`, `beforeAfter`

`gallery.categories` are the filter buttons (keep `"All"` first). Each image:
```json
{ "src": "assets/images/gallery/shop-1.jpg", "category": "Shop", "alt": "Service bay" }
```
`beforeAfter` powers the draggable comparison sliders — each needs a `before` and
`after` image and a `title`. Always write descriptive `alt` text for accessibility.

---

## 8. Service areas (Local SEO) — `serviceAreas`

```json
{ "city": "Langley", "slug": "langley", "primary": false,
  "neighbourhoods": ["Willoughby", "Walnut Grove", "Fort Langley"] }
```
Each entry generates `/locations/<slug>.html` with its own title, meta, H1,
canonical, local copy and schema, plus footer links and sitemap entries.

**To add a city:** add an object, then run `node tools/build.js`.
**To remove one:** delete the object, delete the matching file in `/locations/`, then
re-run the build.
`slug` must be lowercase with hyphens (e.g. `white-rock`).

---

## 9. Social links — `social`

```json
{ "platform": "facebook", "url": "https://facebook.com/yourpage", "label": "Facebook" }
```
Supported `platform` icons: `facebook`, `instagram`, `google`, `youtube`. Remove an
entry to hide that icon.

---

## 10. Booking form — `booking`

```json
"booking": {
  "services": ["Oil & Filter Change", "Brake Repair", "…", "Other / Not sure"],
  "times": ["Morning (8am-11am)", "Midday (11am-2pm)", "Afternoon (2pm-5pm)"],
  "endpoint": "",
  "successMessage": "Thanks! Your request is in…"
}
```
`services` and `times` populate the dropdowns. Leave `endpoint` empty for demo mode,
or set it to a form backend URL to receive submissions (see MAINTENANCE.md).

---

## 11. SEO — `seo`

```json
"seo": {
  "siteUrl": "https://www.deepautocare.ca",
  "titleTemplate": "%s | Deep Auto Care",
  "defaultTitle": "Deep Auto Care | Trusted Auto Repair in Surrey, BC",
  "defaultDescription": "Honest, warrantied auto repair…",
  "keywords": ["auto repair Surrey", "mechanic Surrey BC"],
  "ogImage": "assets/images/og-image.jpg",
  "locale": "en_CA"
}
```
`siteUrl` is used for canonical URLs and the sitemap — set it to the client's real
domain **before** running `node tools/build.js`.

---

## Built-in icon names

`phone, message, whatsapp, star, check, check-circle, droplet, disc, gear, activity,
battery, wave, target, snow, circle, truck, alert, shield, eye, tag, clock, wrench,
heart, mapPin, mail, arrow, plus, facebook, instagram, youtube, google`

Use any of these for service `icon` values. To add more, extend the `ICONS` map in
`js/config.js`.
