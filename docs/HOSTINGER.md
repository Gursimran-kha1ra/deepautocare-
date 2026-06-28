# Deploying to Hostinger

Two ways: the **hPanel File Manager** (no extra software) or **FTP** (best for large
uploads). Either works — the site is fully static.

## Before uploading
Finish the pre-flight checklist in [DEPLOYMENT.md](DEPLOYMENT.md): edit `config.json`,
replace the images, set `seo.siteUrl`, then run `node tools/build.js` locally so
`/locations`, `sitemap.xml` and `robots.txt` are up to date.

## Option A — hPanel File Manager (easiest)

1. Log in to **Hostinger → hPanel**.
2. Open **Files → File Manager**.
3. Enter the **`public_html`** folder (this is your site root).
   - Deploying to the main domain? Upload here.
   - Using a subdomain/addon domain? Open that domain's document root instead.
4. (Optional) Delete the default `default.php` / placeholder `index.html` Hostinger put there.
5. Click **Upload**. The simplest path:
   - On your computer, **zip the contents** of the `automech-template` folder
     (select the files *inside* it — not the outer folder — so `index.html` lands at
     the root of `public_html`).
   - Upload the `.zip`, then right-click it in File Manager → **Extract**.
6. Confirm `index.html` sits directly in `public_html` (not inside a nested folder).
7. Visit your domain. Done.

## Option B — FTP (FileZilla)

1. In hPanel, go to **Files → FTP Accounts** and note the host, username and password
   (create an account if needed).
2. In **FileZilla**, connect with those details (port 21).
3. On the right (server) side, open **`public_html`**.
4. On the left (local) side, open your `automech-template` folder.
5. Select **all files and folders inside it** and drag them to `public_html`,
   preserving the structure (`css/`, `js/`, `assets/`, `locations/`, etc.).
6. Wait for the transfer to finish, then load your domain.

## SSL / HTTPS
In hPanel go to **Security → SSL** and install the free certificate for the domain.
Then enable **Force HTTPS**. Your site will load on `https://`.

## Troubleshooting
- **Page is blank / "Configuration could not load":** `config.json` isn't reachable.
  Make sure it sits in the same folder as `index.html` and that you're loading the
  site over `https://yourdomain.com` (not a `file://` path).
- **Images missing:** the files in `/assets/images` weren't uploaded, or the paths in
  `config.json` don't match the uploaded filenames (paths are case-sensitive on Linux
  hosts).
- **Location pages 404:** you didn't run `node tools/build.js` before uploading, or
  the `/locations` folder wasn't transferred.
