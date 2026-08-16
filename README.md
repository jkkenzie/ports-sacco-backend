# Ports SACCO site

Headless WordPress (Roots Bedrock) + React (Vite) SPA. WordPress powers content and `/wp-json`; the React app is the public site.

| Path | Role |
|------|------|
| **Repo root** | Bedrock WordPress, plugins, Apache entry points (`app.php`, `sitemap.php`, …) |
| **`web/frontend`** | React/Vite source + **published** SPA (`index.html`, hashed `assets/`) served as `public_html/frontend/` |

`web/frontend` lives in this repo (not a submodule). After `npm run build`, commit the published files so a server `git pull` updates the live SPA with no manual copy from `dist/`.

---

## Prerequisites

- PHP 8.1+, Composer
- Node.js 18+ and npm (for local/CI builds)
- Git
- Apache (WAMP/cPanel) with `mod_rewrite`

---

## First-time setup

```bash
git clone <bedrock-remote-url> site
cd site

# WordPress / PHP
composer install
cp .env.example .env
# Edit .env: DB_*, WP_HOME, salts, Twilio, etc.
# Production / cPanel: also set WEBROOT_DIR and PHP_ERROR_LOG (see .env.example)

# Apache rules (web/.htaccess is gitignored)
cp web/.htaccess.example web/.htaccess

# Frontend (only needed to develop or rebuild the SPA)
cd web/frontend
cp .env.example .env          # or .env.production.example on build machines
npm install
```

Point your vhost document root at `web/` (Bedrock web root). On cPanel, document root is usually `public_html` with `WEBROOT_DIR` set in `.env`.

---

## Local development

### WordPress

Use WAMP (or similar) so `WP_HOME` in the root `.env` resolves (e.g. `http://ports-sacco`).

### React (Vite)

```bash
cd web/frontend
npm run dev
```

- App: `http://localhost:3000`
- `/wp-json` is proxied to `WP_HOME` from the Bedrock root `.env`

### Production-like preview

```bash
cd web/frontend
npm run build
npm run preview
```

`npm run build` runs Vite then publishes `dist/` into `index.html` + `assets/` (fonts/images preserved). Preview serves the built bundle (default `http://localhost:4173`) and also proxies `/wp-json`.

---

## Building the frontend

Vite writes to `web/frontend/dist/` (gitignored). The publish step copies into paths Apache expects: `web/frontend/index.html` and `web/frontend/assets/…`. `app.php` reads `web/frontend/index.html`; `.htaccess` maps `/assets/...` → `/frontend/assets/...`.

### 1. Configure build env

In `web/frontend/.env` (or mode-specific files):

| Variable | Purpose |
|----------|---------|
| `VITE_BASE_PATH` | `/` when the SPA is at the site root; `/frontend/` when served under `/frontend/` |
| `VITE_WP_HOME` | Optional override; otherwise Vite reads `WP_HOME` from the Bedrock root `.env` |
| `VITE_WP_API_BASE` | Leave empty for same-origin `/wp-json`; set only if the API is on another host |
| `VITE_PUBLIC_URL` | Public site URL (canonicals / shares); defaults from `WP_HOME` + base |
| `VITE_WP_FRESH_API` | `true` for local cache-busting; omit on production |

Examples: `web/frontend/.env.example`, `.env.staging.example`, `.env.production.example`.

### 2. Build and publish

```bash
cd web/frontend
npm install
npm run build
```

This is equivalent to `vite build` + `node scripts/publish-dist.mjs`. Do **not** delete `assets/fonts` or `assets/image`.

### Base-path modes

| Mode | `VITE_BASE_PATH` | Typical URL |
|------|------------------|-------------|
| Site root (`.htaccess.example` + `app.php`) | `/` | `https://example.com/membership` |
| Subfolder | `/frontend/` | `https://example.com/frontend/membership` |

After changing `VITE_BASE_PATH` or `WP_HOME`, rebuild, commit published files, and deploy.

---

## Git workflow

One repo. Commit frontend source and published SPA files together (or in the same release as PHP changes).

```bash
cd web/frontend
npm run build
cd ../..
git add web/frontend
git commit -m "Describe the frontend change"
git push origin main
```

Do not commit `web/frontend/dist/` or `node_modules/`.

---

## Deploying `main` on the server

Published SPA files are in git. The server does **not** need Node for routine deploys.

### 1. Pull

```bash
cd /path/to/bedrock   # parent of public_html / web
git checkout main
git pull origin main
```

If this host previously used a submodule at `web/frontend`, remove the old submodule checkout once before relying on the absorbed tree (one-time).

### 2. PHP dependencies

```bash
composer install --no-dev --optimize-autoloader
```

Ensure production `.env` is present (never commit it), including `WEBROOT_DIR` / `PHP_ERROR_LOG` on cPanel. Refresh `web/.htaccess` from `web/.htaccess.example` when rewrite rules change.

### 3. Smoke-check

- Homepage loads (SEO shell via `app.php`)
- A content page (e.g. `/membership`) renders blocks from the API
- `/wp-json/portsacco/v1/...` responds (`/custom/v1` still aliased temporarily)
- `/sitemap.xml` and `/robots.txt` hit the PHP entry points, not the SPA
- `public_html/frontend/` contains updated `index.html` and hashed assets from the pull

Rebuild the SPA only on a build machine when source changes; commit the published output, then pull on the server.

---

## Apache / routing notes

`web/.htaccess` (from `.htaccess.example`) must keep this order:

1. `/assets/*` → `/frontend/assets/*`
2. `/wp-json` → `wp-api.php`
3. `/sitemap.xml`, `/robots.txt` → PHP scripts
4. WordPress admin / `wp/` paths pass through
5. Everything else → `app.php` (SPA shell + SEO `<head>`)

If the SPA catch-all runs first, sitemaps and the REST API will break.

---

## Cloudflare + security controls

Public forms and the WP REST API must keep working behind Cloudflare. Prefer **narrow exception rules** for the specific managed rulesets blocking editor saves / form POSTs (provider option 3), after compensating controls are in place:

### Already in application code
- Form POSTs: WordPress REST nonce + honeypot; optional Cloudflare Turnstile
- Nonce / form routes: `Cache-Control` / `CDN-Cache-Control: no-store` (never edge-cache auth tokens)
- Security HTTP headers via Headless Core (`inc/security-headers.php`), SPA `app.php`, and `web/.htaccess.example`:
  - `Strict-Transport-Security` (HTTPS)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (camera/mic/geo disabled)
  - `Cross-Origin-Opener-Policy: same-origin-allow-popups`
- Bedrock: `DISALLOW_FILE_EDIT`, `DISALLOW_FILE_MODS`, `FORCE_SSL_ADMIN` when `WP_HOME` is HTTPS

### Cloudflare dashboard (ops)
1. **Rocket Loader → Off** (breaks WP admin / Turnstile script timing)
2. **Cache Rule**: Bypass `/wp-json/*` (especially `/wp-json/portsacco/v1/nonce*` and legacy `/wp-json/custom/v1/nonce*`)
3. **Cloudflare Access** for `/wp-admin` and `/wp-login.php` only (not public forms)
4. Exception / skip **only** the 1–2 managed rulesets blocking legitimate `POST /wp-json/wp/v2/*` editor saves and `POST /wp-json/portsacco/v1/*` form submits — not a blanket WAF bypass

### Process recommendations
- VAPT before go-live
- Patch cycle for WordPress core, plugins, PHP, and OS packages
- Optional later: enable `HEADLESS_CONTENT_SECURITY_POLICY` / `_REPORT_ONLY` in `.env` after browser testing

---

## Useful paths

| Path | Purpose |
|------|---------|
| `.env` | Bedrock / WordPress env |
| `web/.htaccess.example` | Canonical Apache rules |
| `web/app.php` | SPA HTML + SEO injection |
| `web/frontend/` | React source + published SPA (`index.html`, `assets/`) |
| `web/app/plugins/headless-core/` | Headless CMS, blocks, REST, SEO |
| `web/app/plugins/chat-engine/` | Chat / WhatsApp (see its `DOCS.md`) |

---

## Based on Bedrock

WordPress layout and Composer setup follow [Roots Bedrock](https://roots.io/bedrock/). Project-specific behaviour (headless frontend, SEO shell, plugins) is documented above.
