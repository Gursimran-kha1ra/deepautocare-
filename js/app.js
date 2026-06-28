/* ==========================================================================
   app.js — page bootstrap.
   Runs on every page. Reads window.__PAGE__ (set in each HTML shell),
   loads config, mounts chrome, renders the page body, applies SEO meta
   and the right JSON-LD schema, then initializes feature modules.
   ========================================================================== */
(function () {
  "use strict";
  var A = window.AppConfig;

  A.ready.then(function (cfg) {
    var page = window.__PAGE__ || { page: "home" };
    var key = page.page;

    // 1) Render dynamic page body (static pages — privacy/terms/404 — skip this)
    var body = document.querySelector("[data-page-body]");
    if (body && window.Pages && typeof window.Pages[key] === "function") {
      body.innerHTML = window.Pages[key](cfg);
    }

    // 2) Mount header / footer / floating buttons + wire global behavior
    window.Components.mountChrome(cfg);

    // 3) SEO: title, meta, OG/Twitter, canonical
    A.applySEO(cfg, page);

    // 4) Structured data (JSON-LD) — tailored per page
    A.injectSchema(A.schema.localBusiness(cfg), "ld-business");

    var trail = (page.breadcrumb || []).map(function (c) { return { name: c.name, path: c.path }; });
    if (trail.length) A.injectSchema(A.schema.breadcrumb(cfg, trail), "ld-breadcrumb");

    if (key === "home" || key === "faq" || key === "location") {
      A.injectSchema(A.schema.faq(cfg.faqs || []), "ld-faq");
    }
    if (key === "home" || key === "reviews") {
      A.injectSchema(A.schema.review(cfg), "ld-review");
    }
    if (key === "services") {
      (cfg.services || []).forEach(function (s) {
        A.injectSchema({
          "@context": "https://schema.org", "@type": "Service",
          name: s.name, description: s.description || s.short,
          provider: { "@type": "AutoRepair", name: cfg.business.name },
          areaServed: (cfg.serviceAreas || []).map(function (a) { return a.city; })
        });
      });
    }
    if (key === "location" && window.__CITY__) {
      var area = (cfg.serviceAreas || []).filter(function (a) { return a.slug === window.__CITY__; })[0];
      if (area) {
        A.injectSchema({
          "@context": "https://schema.org", "@type": "Service",
          name: "Auto repair in " + area.city,
          provider: { "@type": "AutoRepair", name: cfg.business.name },
          areaServed: { "@type": "City", name: area.city }
        }, "ld-local-service");
      }
    }

    // 5) Feature modules (only act if their containers exist)
    if (window.BookingForm) window.BookingForm.init(cfg);
    if (window.Gallery) { window.Gallery.init(cfg); window.Gallery.initBeforeAfter(cfg); }

    // 6) Reveal any nodes added after initial wire()
    window.Components.initReveal();

    document.documentElement.setAttribute("data-ready", "true");
  }).catch(function () {
    var body = document.querySelector("[data-page-body]");
    if (body) {
      body.innerHTML = '<section class="section"><div class="container" style="text-align:center;padding:4rem 0">'
        + '<h1>Configuration could not load</h1>'
        + '<p style="margin-top:1rem">This template reads <code>config.json</code> over HTTP. '
        + 'Open the site through a local server or your live host — not by double-clicking the file. '
        + 'See <code>docs/DEPLOYMENT.md</code>.</p></div></section>';
    }
  });
})();
