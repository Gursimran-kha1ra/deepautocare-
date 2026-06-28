# Deploying to GitHub Pages

Free hosting straight from a GitHub repository. Great for demos and live client sites
on a custom domain.

## 1. Create the repository
```bash
cd automech-template
git init
git add .
git commit -m "Initial commit: AutoMech template"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 2. Set the site URL and build
Edit `config.json` → `seo.siteUrl`:

- **Project site:** `https://<your-username>.github.io/<repo-name>`
- **User/org or custom domain:** `https://yourdomain.com`

Then regenerate SEO files and commit:
```bash
node tools/build.js
git add .
git commit -m "Build location pages + sitemap"
git push
```

## 3. Enable Pages
1. On GitHub, open the repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**. Save.
4. Wait ~1 minute. Your site appears at the URL shown on that page.

> No build action is required — the repo is served as-is, which is exactly what this
> static template needs.

## 4. Custom domain (optional)
1. In **Settings → Pages → Custom domain**, enter the domain and save (this adds a
   `CNAME` file).
2. At your domain registrar, add the DNS records GitHub lists (an `A`/`ALIAS` for an
   Deep domain, or a `CNAME` to `<username>.github.io` for `www`).
3. Tick **Enforce HTTPS** once the certificate is issued.
4. Update `seo.siteUrl` to the custom domain, run `node tools/build.js`, commit and push.

## Note on project-site paths
If you deploy to `…github.io/<repo-name>` (a subpath), the internal links in this
template are root-relative-friendly because every page sets its own `__BASE__`. For
the cleanest result, prefer a **custom domain** or a **user/organization site**
(`<username>.github.io`) so everything sits at the domain root.
