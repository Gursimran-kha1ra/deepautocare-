/* ==========================================================================
   pages.js — builds the body content of each page from config.json.
   Each HTML file is a thin shell with <main data-page-body></main>.
   app.js calls Pages[name](cfg) and injects the returned markup.
   ========================================================================== */
(function () {
  "use strict";
  var A = window.AppConfig, C = window.Components, esc = A.esc, icon = A.icon, asset = A.asset;

  function pageHero(cfg, opts) {
    var trail = (opts.crumbs || []).map(function (c, i, arr) {
      return (c.href ? '<a href="' + A.base + c.href + '">' + esc(c.name) + "</a>" : "<span>" + esc(c.name) + "</span>")
        + (i < arr.length - 1 ? '<span class="sep">/</span>' : "");
    }).join("");
    return '<section class="page-hero"><div class="container">'
      + '<nav class="breadcrumb" aria-label="Breadcrumb">' + trail + '</nav>'
      + '<h1>' + esc(opts.title) + "</h1>"
      + (opts.intro ? "<p>" + esc(opts.intro) + "</p>" : "")
      + '</div></section>';
  }

  function ctaBlock(cfg, head, sub) {
    var b = cfg.business;
    return '<section class="section"><div class="container"><div class="cta-block" data-reveal>'
      + '<span class="eyebrow is-center">Ready when you are</span>'
      + '<h2>' + esc(head) + '</h2><p class="lead">' + esc(sub) + '</p>'
      + '<div class="cta-actions">'
      +   '<a class="btn btn--accent btn--lg" href="' + A.base + 'book.html">Book an appointment' + icon("arrow") + '</a>'
      +   '<a class="btn btn--glass btn--lg" href="tel:' + esc(b.phone) + '">' + icon("phone") + 'Call ' + esc(b.phoneDisplay) + '</a>'
      + '</div></div></div></section>';
  }

  /* ====================================================================== */
  var Pages = {

  home: function (cfg) {
    var b = cfg.business, h = cfg.hero;
    var statCards = (cfg.stats || []).slice(0, 4).map(function (s, i) {
      return '<div class="stat-card float ' + (i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : "") + '">'
        + '<div class="num">' + esc(s.value) + '<span>' + esc(s.suffix) + '</span></div>'
        + '<div class="lbl">' + esc(s.label) + '</div></div>';
    }).join("");
    var trust = (cfg.trustBadges || []).map(function (t) { return '<span class="item">' + icon("check-circle") + esc(t) + "</span>"; }).join("");
    var featured = (cfg.services || []).filter(function (s) { return s.featured; }).slice(0, 6);
    var svcCards = featured.map(function (s) { return C.serviceCard(s, cfg); }).join("");
    var why = (cfg.whyChooseUs || []).map(function (w) {
      return '<div class="why-card" data-reveal><span class="why-ic">' + icon(w.icon) + '</span><div><h3>' + esc(w.title) + "</h3><p>" + esc(w.text) + "</p></div></div>";
    }).join("");
    var reviews = (cfg.reviews || []).slice(0, 3).map(function (r) { return C.reviewCard(r); }).join("");
    var galleryPreview = (cfg.gallery.images || []).slice(0, 6).map(function (img) {
      return '<figure class="gal-item" data-i="0"><img src="' + asset(img.src) + '" alt="' + esc(img.alt) + '" loading="lazy"><figcaption class="gal-cap">' + esc(img.alt) + '</figcaption></figure>';
    }).join("");

    return ''
    /* HERO */
    + '<section class="hero"><div class="hero-media"><img src="' + asset(h.image) + '" alt="" aria-hidden="true" fetchpriority="high"></div>'
    + '<div class="container hero-inner">'
    +   '<div data-reveal>'
    +     '<span class="eyebrow">' + esc(h.kicker) + '</span>'
    +     '<h1>' + esc(h.headline) + '</h1>'
    +     '<p class="lead">' + esc(h.subheadline) + '</p>'
    +     '<div class="hero-rating">' + A.stars(cfg.review.rating) + '<span>' + cfg.review.rating + '/5 from ' + cfg.review.count + ' ' + esc(cfg.review.platform) + ' reviews</span></div>'
    +     '<div class="hero-actions">'
    +       '<a class="btn btn--accent btn--lg" href="' + A.base + 'book.html">Book appointment' + icon("arrow") + '</a>'
    +       '<a class="btn btn--glass btn--lg" href="tel:' + esc(b.phone) + '">' + icon("phone") + 'Call now</a>'
    +       '<a class="btn btn--glass btn--lg" href="sms:' + esc(b.sms) + '">' + icon("message") + 'Text us</a>'
    +     '</div>'
    +   '</div>'
    +   '<div class="hero-cluster" data-reveal data-delay="1"><div class="stat-grid">' + statCards + '</div></div>'
    + '</div>'
    + '<div class="trust-strip"><div class="container"><div class="trust-track">' + trust + '</div></div></div>'
    + '</section>'

    /* FEATURED SERVICES */
    + '<section class="section"><div class="container">'
    +   '<div class="section-head is-center"><span class="eyebrow is-center">What we fix</span><h2>Full-service repair, done right the first time</h2>'
    +   '<p>From quick maintenance to complex diagnostics, every job is backed by our written warranty and a free digital inspection.</p></div>'
    +   '<div class="grid cols-3">' + svcCards + '</div>'
    +   '<div class="text-center mt-3"><a class="btn btn--ghost btn--lg" href="' + A.base + 'services.html">View all services' + icon("arrow") + '</a></div>'
    + '</div></section>'

    /* WHY CHOOSE US */
    + '<section class="section section--dark"><div class="container">'
    +   '<div class="section-head"><span class="eyebrow">Why drivers choose ' + esc(b.shortName || b.name) + '</span><h2>Trust you can see, pricing you can predict</h2>'
    +   '<p>We earn repeat customers by doing the opposite of what gives shops a bad name: clear pricing, honest recommendations, and work we stand behind.</p></div>'
    +   '<div class="grid cols-3">' + why + '</div>'
    + '</div></section>'

    /* EMERGENCY BANNER */
    + '<section class="section"><div class="container"><div class="emergency" data-reveal>'
    +   '<div class="emergency-body"><span class="pulse-ic">' + icon("alert") + '</span>'
    +   '<div><span class="eyebrow" style="color:rgba(255,255,255,.85)">24/7 Roadside assistance</span>'
    +   '<h2>Broken down? We\'ll come to you.</h2><p>Jump-starts, lockouts and towing straight back to our shop, day or night.</p></div></div>'
    +   '<a class="btn btn--lg" style="background:#fff;color:var(--c-emergency)" href="tel:' + esc(b.phone) + '">' + icon("phone") + 'Call ' + esc(b.phoneDisplay) + '</a>'
    + '</div></div></section>'

    /* REVIEWS */
    + '<section class="section section--soft"><div class="container">'
    +   '<div class="section-head is-center"><span class="eyebrow is-center">Real customers, real cars</span><h2>Rated ' + cfg.review.rating + ' across ' + cfg.review.count + ' reviews</h2>'
    +   '<div class="mt-2">' + C.ratingSummary(cfg) + '</div></div>'
    +   '<div class="grid cols-3">' + reviews + '</div>'
    +   '<div class="text-center mt-3"><a class="btn btn--ghost btn--lg" href="' + A.base + 'reviews.html">Read all reviews' + icon("arrow") + '</a></div>'
    + '</div></section>'

    /* BEFORE & AFTER */
    + '<section class="section"><div class="container">'
    +   '<div class="section-head is-center"><span class="eyebrow is-center">Before &amp; after</span><h2>The difference is in the details</h2>'
    +   '<p>Drag the slider to see the results of our work. Every repair is documented and photographed.</p></div>'
    +   '<div data-before-after></div>'
    + '</div></section>'

    /* GALLERY PREVIEW */
    + '<section class="section section--soft"><div class="container">'
    +   '<div class="section-head is-center"><span class="eyebrow is-center">Inside the shop</span><h2>A clean, modern facility you can trust</h2></div>'
    +   '<div class="masonry">' + galleryPreview + '</div>'
    +   '<div class="text-center mt-3"><a class="btn btn--ghost btn--lg" href="' + A.base + 'gallery.html">See the full gallery' + icon("arrow") + '</a></div>'
    + '</div></section>'

    /* FAQ */
    + '<section class="section"><div class="container">'
    +   '<div class="section-head is-center"><span class="eyebrow is-center">Good questions</span><h2>Answers before you ask</h2></div>'
    +   '<div style="display:flex;justify-content:center">' + C.faqList((cfg.faqs || []).slice(0, 5)) + '</div>'
    + '</div></section>'

    /* MAP + CONTACT */
    + '<section class="section section--soft"><div class="container">'
    +   '<div class="grid cols-2" style="align-items:stretch">'
    +     '<div data-reveal><span class="eyebrow">Find us</span><h2 class="mt-1">' + esc(b.address.city) + '\'s neighbourhood shop</h2>'
    +       '<p class="mt-1">' + esc(b.address.street) + ', ' + esc(b.address.city) + ', ' + esc(b.address.region) + ' ' + esc(b.address.postalCode) + '</p>'
    +       '<div class="mt-2">' + hoursTable(b.hours) + '</div>'
    +       '<div class="flex-wrap-gap mt-2"><a class="btn btn--accent" href="' + esc(b.mapsLink) + '" target="_blank" rel="noopener">' + icon("mapPin") + 'Get directions</a>'
    +       '<a class="btn btn--ghost" href="' + A.base + 'contact.html">Contact us</a></div>'
    +     '</div>'
    +     '<div data-reveal data-delay="1">' + C.mapEmbed(cfg) + '</div>'
    +   '</div>'
    + '</div></section>'

    /* CTA */
    + ctaBlock(cfg, "Your car deserves better than a guess.", "Book online in 60 seconds or call and talk to a technician who'll tell you straight what your vehicle needs.");
  },

  /* ---------------------------------------------------------------------- */
  services: function (cfg) {
    var cards = (cfg.services || []).map(function (s) { return C.serviceCard(s, cfg); }).join("");
    var process = [
      { t: "Book or drop in", d: "Reserve a bay online in a minute, or call and we'll fit you in." },
      { t: "Free digital inspection", d: "We inspect, photograph and send findings to your phone." },
      { t: "Approve the estimate", d: "You see the price up front and approve before any work starts." },
      { t: "Drive away warrantied", d: "Every repair is covered 12 months / 20,000 km, in writing." }
    ];
    var steps = process.map(function (p, i) {
      return '<div class="card" data-reveal data-delay="' + (i % 3) + '"><span class="eyebrow">Step 0' + (i + 1) + '</span><h3 class="mt-1">' + esc(p.t) + '</h3><p class="mt-1">' + esc(p.d) + '</p></div>';
    }).join("");
    return pageHero(cfg, { title: "Auto repair & maintenance services", intro: "Dealership-level capability without the dealership markup. Certified technicians, factory-grade parts and a written warranty on every job.", crumbs: [{ name: "Home", href: "index.html" }, { name: "Services" }] })
      + '<section class="section"><div class="container"><div class="grid cols-3">' + cards + '</div></div></section>'
      + '<section class="section section--soft"><div class="container">'
      +   '<div class="section-head is-center"><span class="eyebrow is-center">How it works</span><h2>A repair process built on transparency</h2></div>'
      +   '<div class="grid cols-4">' + steps + '</div></div></section>'
      + ctaBlock(cfg, "Not sure what your car needs?", "Bring it in for a free inspection. We'll diagnose the issue and give you an honest, written estimate.");
  },

  /* ---------------------------------------------------------------------- */
  about: function (cfg) {
    var b = cfg.business;
    var stats = (cfg.stats || []).map(function (s) {
      return '<div class="card text-center" data-reveal><div class="num" style="font-family:var(--font-display);font-weight:800;font-size:2.4rem">' + esc(s.value) + esc(s.suffix) + '</div><p class="mt-1">' + esc(s.label) + '</p></div>';
    }).join("");
    var values = (cfg.whyChooseUs || []).slice(0, 6).map(function (w) {
      return '<div class="why-card" data-reveal><span class="why-ic">' + icon(w.icon) + '</span><div><h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></div></div>';
    }).join("");
    return pageHero(cfg, { title: "Family-owned, community-trusted since " + b.foundedYear, intro: "We opened " + esc(b.name) + " to prove a local shop could be more honest, more modern and more reliable than the dealership. Thousands of repairs later, that's still the whole point.", crumbs: [{ name: "Home", href: "index.html" }, { name: "About" }] })
      + '<section class="section"><div class="container"><div class="grid cols-2" style="align-items:center">'
      +   '<div data-reveal class="prose"><span class="eyebrow">Our story</span><h2 class="mt-1">Built by technicians, not a franchise</h2>'
      +     '<p>' + esc(b.name) + ' started in ' + b.foundedYear + ' with a single bay and a simple promise: explain every repair clearly, charge a fair price, and stand behind the work. We grew by word of mouth from drivers who were tired of being talked down to.</p>'
      +     '<p>Today our certified team services every make and model with factory-level diagnostic tools, but the promise hasn\'t changed. You\'ll always talk to the person working on your car, see photos of what we find, and approve the price before we start.</p>'
      +     '<div class="flex-wrap-gap mt-2">' + (b.licenses || []).map(function (l) { return '<span class="chip">' + icon("shield") + esc(l.label) + '</span>'; }).join("") + '</div>'
      +   '</div>'
      +   '<div class="grid cols-2" data-reveal data-delay="1">' + stats + '</div>'
      + '</div></div></section>'
      + '<section class="section section--soft"><div class="container">'
      +   '<div class="section-head is-center"><span class="eyebrow is-center">What we stand for</span><h2>The standards behind every repair</h2></div>'
      +   '<div class="grid cols-3">' + values + '</div></div></section>'
      + ctaBlock(cfg, "Come see the difference for yourself.", "Book a service or stop by the shop. We think you'll notice the difference within five minutes.");
  },

  /* ---------------------------------------------------------------------- */
  reviews: function (cfg) {
    var cards = (cfg.reviews || []).map(function (r) { return C.reviewCard(r); }).join("");
    return pageHero(cfg, { title: "What our customers say", intro: "We're proud to be " + esc(cfg.business.address.city) + "'s most-reviewed independent shop. Here's what drivers tell others about us.", crumbs: [{ name: "Home", href: "index.html" }, { name: "Reviews" }] })
      + '<section class="section"><div class="container">'
      +   '<div class="text-center" style="margin-bottom:2.5rem">' + C.ratingSummary(cfg) + '</div>'
      +   '<div class="grid cols-3">' + cards + '</div>'
      +   '<div class="text-center mt-3"><a class="btn btn--accent btn--lg" href="' + esc(cfg.review.url) + '" target="_blank" rel="noopener">' + icon("google") + 'Read more on ' + esc(cfg.review.platform) + icon("arrow") + '</a></div>'
      + '</div></section>'
      + ctaBlock(cfg, "Join thousands of happy drivers.", "Experience the service everyone's reviewing. Book your appointment today.");
  },

  /* ---------------------------------------------------------------------- */
  faq: function (cfg) {
    return pageHero(cfg, { title: "Frequently asked questions", intro: "Everything you might want to know before you book. Still curious? Call, text or message us anytime.", crumbs: [{ name: "Home", href: "index.html" }, { name: "FAQ" }] })
      + '<section class="section"><div class="container" style="display:flex;justify-content:center">' + C.faqList(cfg.faqs || []) + '</div></section>'
      + ctaBlock(cfg, "Didn't find your answer?", "Our team is happy to help. Reach out and we'll get back to you within the hour.");
  },

  /* ---------------------------------------------------------------------- */
  gallery: function (cfg) {
    return pageHero(cfg, { title: "Our work & our shop", intro: "Take a look inside our facility and see the quality of our repairs, from routine maintenance to full restorations.", crumbs: [{ name: "Home", href: "index.html" }, { name: "Gallery" }] })
      + '<section class="section"><div class="container"><div data-gallery></div></div></section>'
      + '<section class="section section--soft"><div class="container">'
      +   '<div class="section-head is-center"><span class="eyebrow is-center">Before &amp; after</span><h2>Results worth showing off</h2></div>'
      +   '<div data-before-after></div></div></section>'
      + ctaBlock(cfg, "Want results like these?", "Book your vehicle in and see the difference quality work makes.");
  },

  /* ---------------------------------------------------------------------- */
  contact: function (cfg) {
    var b = cfg.business;
    return pageHero(cfg, { title: "Get in touch", intro: "Call, text, message or send us a note. We reply within one business hour during opening times.", crumbs: [{ name: "Home", href: "index.html" }, { name: "Contact" }] })
      + '<section class="section"><div class="container"><div class="grid cols-2" style="align-items:start">'
      +   '<div data-reveal>'
      +     '<div class="card"><span class="eyebrow">Send a message</span><h2 class="mt-1" style="font-size:1.6rem">We\'ll get right back to you</h2>'
      +     '<div class="mt-2" data-form="contact"></div></div>'
      +   '</div>'
      +   '<div data-reveal data-delay="1">'
      +     '<div class="card"><h3>Reach us directly</h3><div class="footer-contact mt-2" style="color:var(--ink-2)">'
      +       '<a href="tel:' + esc(b.phone) + '" style="color:var(--ink-2)">' + icon("phone") + '<span>' + esc(b.phoneDisplay) + '</span></a>'
      +       '<a href="sms:' + esc(b.sms) + '" style="color:var(--ink-2)">' + icon("message") + '<span>Text us — fastest reply</span></a>'
      +       '<a href="mailto:' + esc(b.email) + '" style="color:var(--ink-2)">' + icon("mail") + '<span>' + esc(b.email) + '</span></a>'
      +       '<a href="' + esc(b.mapsLink) + '" target="_blank" rel="noopener" style="color:var(--ink-2)">' + icon("mapPin") + '<span>' + esc(b.address.street) + ', ' + esc(b.address.city) + '</span></a>'
      +     '</div></div>'
      +     '<div class="card mt-2"><h3>Opening hours</h3><div class="mt-2">' + hoursTable(b.hours) + '</div></div>'
      +     '<div class="mt-2">' + C.mapEmbed(cfg) + '</div>'
      +   '</div>'
      + '</div></div></section>';
  },

  /* ---------------------------------------------------------------------- */
  book: function (cfg) {
    var b = cfg.business;
    var assure = [
      { i: "clock", t: "60-second booking", d: "Tell us what you need and pick a time. Done." },
      { i: "tag", t: "No surprise pricing", d: "We confirm a written estimate before any work." },
      { i: "shield", t: "Warrantied work", d: "Every repair covered 12 months / 20,000 km." }
    ];
    return pageHero(cfg, { title: "Book your appointment", intro: "Reserve a service bay in under a minute. We'll text or call to confirm your time.", crumbs: [{ name: "Home", href: "index.html" }, { name: "Book appointment" }] })
      + '<section class="section"><div class="container"><div class="grid cols-2" style="align-items:start">'
      +   '<div class="card" data-reveal><span class="eyebrow">Appointment request</span><h2 class="mt-1" style="font-size:1.6rem">Tell us about your vehicle</h2>'
      +     '<div class="mt-2" data-form="booking"></div></div>'
      +   '<div data-reveal data-delay="1">'
      +     assure.map(function (a) { return '<div class="why-card" style="margin-bottom:1.25rem"><span class="why-ic">' + icon(a.i) + '</span><div><h3>' + esc(a.t) + '</h3><p>' + esc(a.d) + '</p></div></div>'; }).join("")
      +     '<div class="card"><h3>Prefer to talk?</h3><p class="mt-1">Call or text us and we\'ll book you in.</p>'
      +     '<div class="flex-wrap-gap mt-2"><a class="btn btn--accent" href="tel:' + esc(b.phone) + '">' + icon("phone") + esc(b.phoneDisplay) + '</a>'
      +     '<a class="btn btn--ghost" href="sms:' + esc(b.sms) + '">' + icon("message") + 'Text us</a></div></div>'
      +   '</div>'
      + '</div></div></section>';
  },

  /* ---------------------------------------------------------------------- */
  privacy: function (cfg) {
    var b = cfg.business, updated = "January 2025";
    return pageHero(cfg, { title: "Privacy Policy", intro: "How " + esc(b.name) + " collects, uses and protects your information.", crumbs: [{ name: "Home", href: "index.html" }, { name: "Privacy" }] })
      + '<section class="section"><div class="container"><div class="prose">'
      + '<p><em>Last updated: ' + updated + '</em></p>'
      + '<p>' + esc(b.name) + ' ("we", "us") respects your privacy. This policy explains what information we collect when you use our website or services and how we handle it.</p>'
      + '<h2>Information we collect</h2>'
      + '<p>When you book an appointment, request a quote or contact us, we collect the details you provide: your name, phone number, email address, vehicle information and any message you send. When you browse the site, we may collect standard technical data such as your device type, browser and pages visited, through cookies and analytics tools.</p>'
      + '<h2>How we use your information</h2>'
      + '<ul><li>To schedule, perform and follow up on the services you request.</li><li>To respond to your enquiries by phone, text or email.</li><li>To improve our website and understand how visitors use it.</li><li>To meet legal, tax and warranty record-keeping obligations.</li></ul>'
      + '<h2>Sharing your information</h2>'
      + '<p>We do not sell your personal information. We share it only with service providers who help us operate (such as booking, payment and analytics providers) and only as needed, or where required by law.</p>'
      + '<h2>Data retention &amp; security</h2>'
      + '<p>We keep your information only as long as necessary for the purposes above and to comply with our legal obligations, and we use reasonable safeguards to protect it. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.</p>'
      + '<h2>Your choices</h2>'
      + '<p>You may request access to, correction of, or deletion of your personal information, and you can opt out of marketing messages at any time. To make a request, contact us at <a href="mailto:' + esc(b.email) + '">' + esc(b.email) + '</a> or ' + esc(b.phoneDisplay) + '.</p>'
      + '<h2>Contact</h2>'
      + '<p>' + esc(b.legalName || b.name) + '<br>' + esc(b.address.street) + ', ' + esc(b.address.city) + ', ' + esc(b.address.region) + ' ' + esc(b.address.postalCode) + '<br><a href="mailto:' + esc(b.email) + '">' + esc(b.email) + '</a></p>'
      + '</div></div></section>';
  },

  /* ---------------------------------------------------------------------- */
  terms: function (cfg) {
    var b = cfg.business, updated = "January 2025";
    return pageHero(cfg, { title: "Terms & Conditions", intro: "The terms that apply when you use this website and our services.", crumbs: [{ name: "Home", href: "index.html" }, { name: "Terms" }] })
      + '<section class="section"><div class="container"><div class="prose">'
      + '<p><em>Last updated: ' + updated + '</em></p>'
      + '<p>These terms govern your use of the ' + esc(b.name) + ' website and the booking of services through it. By using this site you agree to these terms.</p>'
      + '<h2>Quotes &amp; estimates</h2>'
      + '<p>Prices shown on this website are starting points and may vary based on your vehicle, parts and the scope of work. We always provide a written estimate for your approval before beginning any repair.</p>'
      + '<h2>Appointments</h2>'
      + '<p>Submitting a booking request reserves a request, not a guaranteed time, until we confirm it by phone or text. Please give us reasonable notice if you need to reschedule or cancel.</p>'
      + '<h2>Warranty</h2>'
      + '<p>Eligible repairs are covered by our written warranty for the period stated on your invoice. The warranty covers the specific parts and labour listed and excludes wear items, pre-existing conditions and damage caused by misuse or further faults outside the original repair.</p>'
      + '<h2>Payment</h2>'
      + '<p>Payment is due on completion unless other arrangements are agreed in writing. Vehicles may be held until outstanding balances are settled, as permitted by law.</p>'
      + '<h2>Limitation of liability</h2>'
      + '<p>To the fullest extent permitted by law, our liability for any claim relating to our services is limited to the amount you paid for the service in question. Nothing in these terms limits liability that cannot be limited by law.</p>'
      + '<h2>Contact</h2>'
      + '<p>Questions about these terms? Contact ' + esc(b.name) + ' at <a href="mailto:' + esc(b.email) + '">' + esc(b.email) + '</a> or ' + esc(b.phoneDisplay) + '.</p>'
      + '</div></div></section>';
  },

  /* ---------------------------------------------------------------------- */
  notFound: function (cfg) {
    var b = cfg.business;
    return '<section class="section" style="min-height:70vh;display:flex;align-items:center"><div class="container text-center">'
      + '<span class="eyebrow is-center">Error 404</span>'
      + '<h1 style="font-size:clamp(3rem,12vw,7rem);margin-top:1rem">Wrong turn.</h1>'
      + '<p class="lead" style="max-width:46ch;margin:1rem auto 0">We couldn\'t find that page. It may have moved, or the link might be out of date.</p>'
      + '<div class="cta-actions mt-3">'
      +   '<a class="btn btn--accent btn--lg" href="' + A.base + 'index.html">Back to home' + icon("arrow") + '</a>'
      +   '<a class="btn btn--ghost btn--lg" href="tel:' + esc(b.phone) + '">' + icon("phone") + 'Call ' + esc(b.phoneDisplay) + '</a>'
      + '</div></div></section>';
  },
  location: function (cfg) {
    var slug = window.__CITY__;
    var area = (cfg.serviceAreas || []).filter(function (a) { return a.slug === slug; })[0];
    if (!area) { return '<section class="section"><div class="container"><h1>Area not found</h1><p>Return to the <a href="' + A.base + 'index.html">homepage</a>.</p></div></section>'; }
    var b = cfg.business;
    var hoods = (area.neighbourhoods || []).join(", ");
    var svc = (cfg.services || []).slice(0, 8).map(function (s) {
      return '<div class="why-card" data-reveal><span class="why-ic">' + icon(s.icon) + '</span><div><h3>' + esc(s.name) + ' in ' + esc(area.city) + '</h3><p>' + esc(s.short) + '</p></div></div>';
    }).join("");
    var localFaqs = [
      { q: "Do you serve all of " + area.city + "?", a: "Yes — we serve drivers across " + area.city + (hoods ? ", including " + hoods : "") + ", with easy booking and a free local shuttle." },
      { q: "How far is the shop from " + area.city + "?", a: "We're a short drive from " + area.city + " at " + b.address.street + ", " + b.address.city + ". Many " + area.city + " customers drop off on their way to work." }
    ].concat((cfg.faqs || []).slice(0, 3));
    return pageHero(cfg, { title: "Auto repair in " + area.city + ", " + b.address.region, intro: "Honest, warrantied car repair for " + area.city + " drivers. Certified technicians, factory-grade parts and up-front pricing — book online or call " + b.phoneDisplay + ".", crumbs: [{ name: "Home", href: "index.html" }, { name: "Service areas" }, { name: area.city }] })
      + '<section class="section"><div class="container"><div class="prose" data-reveal>'
      +   '<span class="eyebrow">Trusted by ' + esc(area.city) + ' drivers</span><h2 class="mt-1">Your local choice for ' + esc(area.city) + ' auto repair</h2>'
      +   '<p>Looking for a reliable mechanic in ' + esc(area.city) + '? ' + esc(b.name) + ' has served the community since ' + b.foundedYear + ' with the kind of service that keeps drivers coming back: clear pricing, free digital inspections, and a written warranty on every repair.</p>'
      +   (hoods ? '<p>We proudly serve every corner of ' + esc(area.city) + ', including ' + esc(hoods) + '. Whether you need a quick oil change or a complex engine diagnosis, our certified technicians handle all makes and models.</p>' : "")
      + '</div></div></section>'
      + '<section class="section section--soft"><div class="container">'
      +   '<div class="section-head is-center"><span class="eyebrow is-center">Services in ' + esc(area.city) + '</span><h2>Everything your vehicle needs, close to home</h2></div>'
      +   '<div class="grid cols-2">' + svc + '</div></div></section>'
      + '<section class="section"><div class="container"><div class="grid cols-2" style="align-items:center">'
      +   '<div data-reveal><span class="eyebrow">Easy to reach from ' + esc(area.city) + '</span><h2 class="mt-1">Drop off on your way, we\'ll handle the rest</h2>'
      +     '<p class="mt-1">' + esc(b.address.street) + ', ' + esc(b.address.city) + ', ' + esc(b.address.region) + ' ' + esc(b.address.postalCode) + '</p>'
      +     '<div class="flex-wrap-gap mt-2"><a class="btn btn--accent" href="' + A.base + 'book.html">Book from ' + esc(area.city) + icon("arrow") + '</a>'
      +     '<a class="btn btn--ghost" href="tel:' + esc(b.phone) + '">' + icon("phone") + esc(b.phoneDisplay) + '</a></div></div>'
      +   '<div data-reveal data-delay="1">' + C.mapEmbed(cfg) + '</div>'
      + '</div></div></section>'
      + '<section class="section section--soft"><div class="container">'
      +   '<div class="section-head is-center"><span class="eyebrow is-center">' + esc(area.city) + ' FAQs</span><h2>Questions from ' + esc(area.city) + ' drivers</h2></div>'
      +   '<div style="display:flex;justify-content:center">' + C.faqList(localFaqs) + '</div></div></section>'
      + ctaBlock(cfg, esc(area.city) + ", your car is in good hands.", "Book your " + esc(area.city) + " appointment online or call us today.");
  }

  };

  /* ---- Shared bits ------------------------------------------------------ */
  function fmt(t) { if (!t) return ""; var p = t.split(":"), hh = +p[0], m = p[1]; var ap = hh >= 12 ? "pm" : "am"; return (hh % 12 || 12) + (m !== "00" ? ":" + m : "") + ap; }
  function hoursTable(hours) {
    var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var today = names[new Date().getDay()];
    return '<table style="width:100%;border-collapse:collapse;font-size:.95rem">'
      + (hours || []).map(function (h) {
        var is = h.day === today;
        return '<tr style="border-bottom:1px solid var(--line)' + (is ? ';font-weight:700' : '') + '">'
          + '<td style="padding:.6rem 0;color:var(--ink-2)">' + esc(h.day) + (is ? ' <span class="chip" style="padding:.1rem .5rem;font-size:.65rem">Today</span>' : '') + '</td>'
          + '<td style="padding:.6rem 0;text-align:right;font-family:var(--font-mono);color:var(--ink)">' + (h.open ? fmt(h.open) + " – " + fmt(h.close) : "Closed") + '</td></tr>';
      }).join("") + '</table>';
  }

  Pages._hoursTable = hoursTable;
  window.Pages = Pages;
})();
