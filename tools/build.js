#!/usr/bin/env node
/* ==========================================================================
   tools/build.js — local SEO generator.
   Reads config.json and generates:
     • /locations/<slug>.html  — one landing page per service area
     • sitemap.xml             — all root pages + location pages
     • robots.txt              — allow-all + sitemap reference
   Run from the project root:  node tools/build.js
   Re-run whenever you add or rename a service area in config.json.
   ========================================================================== */
const fs = require("fs");
const path = require("path");
const { shell } = require("./make-shells.js");

const root = path.join(__dirname, "..");
const cfg = JSON.parse(fs.readFileSync(path.join(root, "config.json"), "utf8"));
const siteUrl = (cfg.seo && cfg.seo.siteUrl ? cfg.seo.siteUrl : "").replace(/\/$/, "");
const region = cfg.business.address.region;

/* ---- 1) Location pages -------------------------------------------------- */
const locDir = path.join(root, "locations");
fs.mkdirSync(locDir, { recursive: true });

const areas = cfg.serviceAreas || [];
areas.forEach((a) => {
  const title = `Auto Repair in ${a.city}, ${region}`;
  const desc = `Trusted, warrantied auto repair for ${a.city} drivers. ${cfg.business.name} offers certified technicians, free inspections and up-front pricing. Call ${cfg.business.phoneDisplay}.`;
  shell({
    file: `locations/${a.slug}.html`,
    page: "location",
    title,
    desc,
    base: "../",
    city: a.slug,
    crumb: [
      { name: "Home", path: "" },
      { name: "Service Areas", path: "" },
      { name: a.city, path: `locations/${a.slug}.html` }
    ]
  });
  console.log("location:", `locations/${a.slug}.html`);
});

/* ---- 2) sitemap.xml ----------------------------------------------------- */
const today = new Date().toISOString().slice(0, 10);
const rootPages = [
  { loc: "", pri: "1.0" },
  { loc: "services.html", pri: "0.9" },
  { loc: "book.html", pri: "0.9" },
  { loc: "about.html", pri: "0.7" },
  { loc: "gallery.html", pri: "0.7" },
  { loc: "reviews.html", pri: "0.8" },
  { loc: "faq.html", pri: "0.6" },
  { loc: "contact.html", pri: "0.7" },
  { loc: "privacy.html", pri: "0.3" },
  { loc: "terms.html", pri: "0.3" }
];
const urls = rootPages
  .map((p) => `  <url><loc>${siteUrl}/${p.loc}</loc><lastmod>${today}</lastmod><priority>${p.pri}</priority></url>`)
  .concat(
    areas.map(
      (a) => `  <url><loc>${siteUrl}/locations/${a.slug}.html</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>`
    )
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);
console.log("wrote sitemap.xml");

/* ---- 3) robots.txt ------------------------------------------------------ */
const robots = `# robots.txt for ${cfg.business.name}
User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(root, "robots.txt"), robots);
console.log("wrote robots.txt");

console.log(`\nDone. Generated ${areas.length} location pages + sitemap.xml + robots.txt.`);
