/* Dev helper: generates the thin HTML shells for dynamic pages.
   Run once: node tools/make-shells.js */
const fs = require('fs');
const path = require('path');

const head = (title, desc) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="@@css/main.css">
</head>`;

const scripts = (b) => `  <script src="@@js/config.js"></script>
  <script src="@@js/components.js"></script>
  <script src="@@js/gallery.js"></script>
  <script src="@@js/booking.js"></script>
  <script src="@@js/pages.js"></script>
  <script src="@@js/app.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>`;

function shell({file, page, title, desc, crumb, base='', city=null}) {
  const pageObj = { page };
  // Home uses seo.defaultTitle as-is; other pages run through titleTemplate.
  if (page !== 'home') pageObj.title = title;
  pageObj.description = desc;
  if (crumb) pageObj.breadcrumb = crumb;
  const cityLine = city ? `\n  <script>window.__CITY__ = ${JSON.stringify(city)};</script>` : '';
  let html = `${head(title, desc)}
<body data-page="${page}">
  <script>window.__BASE__ = ${JSON.stringify(base)};</script>${cityLine}
  <script>window.__PAGE__ = ${JSON.stringify(pageObj)};</script>

  <div data-mount="header"></div>

  <main id="main" data-page-body></main>

  <div data-mount="footer"></div>
  <div data-mount="fabs"></div>

${scripts(base)}
</body>
</html>
`;
  html = html.split('@@').join(base);   // only replaces the @@ path tokens
  fs.writeFileSync(path.join(__dirname, '..', file), html);
  console.log('wrote', file);
}

const pages = [
  {file:'index.html',    page:'home',     title:'Deep Auto Care | Trusted Auto Repair in Surrey, BC', desc:'Honest, warrantied auto repair in Surrey, BC. Certified technicians, free digital inspections and up-front pricing. Book online or call today.'},
  {file:'services.html', page:'services', title:'Auto Repair Services', desc:'Oil changes, brakes, diagnostics, transmission, A/C and more. Certified technicians, factory-grade parts and a written warranty on every job.', crumb:[{name:'Home',path:''},{name:'Services',path:'services.html'}]},
  {file:'about.html',    page:'about',    title:'About Us', desc:'Family-owned and community-trusted since 2008. Meet the team behind honest, modern auto repair in Surrey, BC.', crumb:[{name:'Home',path:''},{name:'About',path:'about.html'}]},
  {file:'gallery.html',  page:'gallery',  title:'Gallery', desc:'See our modern facility and the quality of our repairs, from routine maintenance to full restorations.', crumb:[{name:'Home',path:''},{name:'Gallery',path:'gallery.html'}]},
  {file:'reviews.html',  page:'reviews',  title:'Customer Reviews', desc:'Read why we are one of the most-reviewed independent auto shops in the area. Real customers, real cars, real results.', crumb:[{name:'Home',path:''},{name:'Reviews',path:'reviews.html'}]},
  {file:'faq.html',      page:'faq',      title:'FAQ', desc:'Answers to common questions about warranties, pricing, appointments, financing and more.', crumb:[{name:'Home',path:''},{name:'FAQ',path:'faq.html'}]},
  {file:'book.html',     page:'book',     title:'Book an Appointment', desc:'Reserve a service bay in under a minute. We will text or call to confirm your appointment time.', crumb:[{name:'Home',path:''},{name:'Book',path:'book.html'}]},
  {file:'contact.html',  page:'contact',  title:'Contact Us', desc:'Call, text, message or send us a note. We reply within one business hour during opening times.', crumb:[{name:'Home',path:''},{name:'Contact',path:'contact.html'}]},
];
if (require.main === module) {
  pages.forEach(shell);
}
module.exports = { shell, head, scripts };
