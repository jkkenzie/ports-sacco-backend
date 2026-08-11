# Ports SACCO site

Headless WordPress (Roots Bedrock) + React (Vite) SPA. WordPress powers content and `/wp-json`; the React app is the public site.

| Repo | Path | Role |
|------|------|------|
| **Bedrock (this repo)** | repo root | WordPress, plugins, Apache entry points (`app.php`, `sitemap.php`, …) |
| **Frontend submodule** | `web/frontend` | React/Vite source; build output is published for Apache |

`web/frontend` is a **git submodule**. Never commit frontend source from the Bedrock root — commit and push inside the submodule first, then update the parent pointer.

---

## Prerequisites

- PHP 8.1+, Composer
- Node.js 18+ and npm
- Git with submodule support
- Apache (WAMP/cPanel) with `mod_rewrite`

---

## First-time setup

```bash
# Clone with submodule
git clone --recurse-submodules <bedrock-remote-url> site
cd site

# If you already cloned without submodules:
git submodule update --init --recursive

# WordPress / PHP
composer install
cp .env.example .env
# Edit .env: DB_*, WP_HOME, salts, Twilio, etc.

# Apache rules (web/.htaccess is gitignored)
cp web/.htaccess.example web/.htaccess

# Frontend
cd web/frontend
cp .env.example .env          # or .env.production.example on servers
npm install
```

Point your vhost document root at `web/` (Bedrock web root).

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

Preview serves the built bundle (default `http://localhost:4173`) and also proxies `/wp-json`.

---

## Building the frontend

Vite writes to `web/frontend/dist/`. Apache does **not** serve `dist/` directly — `app.php` reads `web/frontend/index.html`, and `.htaccess` maps `/assets/...` → `/frontend/assets/...`.

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

### 2. Build

```bash
cd web/frontend
npm install
npm run build
```

### 3. Publish `dist` for Apache

Copy the build into the paths Apache expects (do **not** delete tracked source assets such as `assets/fonts` or `assets/image`):

**PowerShell (Windows / WAMP):**

```powershell
cd web/frontend
Copy-Item -Force dist/index.html index.html
Copy-Item -Force dist/assets/* assets/
# Optional static files from Vite public/
if (Test-Path dist/favicon.svg) { Copy-Item -Force dist/favicon.svg favicon.svg }
```

**Bash (Linux server):**

```bash
cd web/frontend
cp -f dist/index.html index.html
cp -f dist/assets/* assets/
# Optional:
# cp -f dist/favicon.svg favicon.svg
```

### Base-path modes

| Mode | `VITE_BASE_PATH` | Typical URL |
|------|------------------|-------------|
| Site root (`.htaccess.example` + `app.php`) | `/` | `https://example.com/membership` |
| Subfolder | `/frontend/` | `https://example.com/frontend/membership` |

After changing `VITE_BASE_PATH` or `WP_HOME`, rebuild and re-publish.

---

## Git: submodule then Bedrock

Frontend and Bedrock are **two remotes**. Always finish the submodule before updating the parent.

### A. Frontend-only changes

```bash
cd web/frontend
git checkout main
git pull
git add .
git commit -m "Describe the frontend change"
git push origin main
```

Then record the new SHA in Bedrock:

```bash
cd ../..   # repo root
git add web/frontend
git commit -m "Update frontend submodule reference"
git push origin main
```

### B. Bedrock / PHP-only changes

```bash
# from repo root — do not stage web/frontend/src
git add web/app/plugins/headless-core web/.htaccess.example .env.example   # etc.
git commit -m "Describe the backend change"
git push origin main
```

### C. Both in one release

1. Commit + push inside `web/frontend`
2. Commit PHP/plugin changes in Bedrock (if any)
3. Commit the updated `web/frontend` submodule pointer
4. Push Bedrock `main`

### Dirty submodule warning

If `git status` at the repo root shows `m web/frontend` (or modified content), there are uncommitted changes inside the submodule. Commit or discard them in `web/frontend` before relying on the parent pointer.

---

## Deploying `main` on the server

Build artifacts (`dist/`, published `index.html` / hashed JS+CSS) are generally **not** what you ship via git alone — pull source, then build on the server (or in CI), then publish.

### 1. Pull Bedrock at the recorded submodule SHA

```bash
cd /path/to/site
git checkout main
git pull origin main
git submodule update --init --recursive
```

Use `git submodule update --init --recursive` (no `--remote`) so the server checks out the **exact commit** Bedrock recorded, not whatever happens to be tip of the frontend remote.

### 2. PHP dependencies

```bash
composer install --no-dev --optimize-autoloader
```

Ensure production `.env` is present (never commit it). Refresh `web/.htaccess` from `web/.htaccess.example` when rewrite rules change.

### 3. Build and publish the SPA

```bash
cd web/frontend
# Point .env / .env.production at this environment’s URLs
npm ci   # or: npm install
npm run build
cp -f dist/index.html index.html
cp -f dist/assets/* assets/
```

### 4. Smoke-check

- Homepage loads (SEO shell via `app.php`)
- A content page (e.g. `/membership`) renders blocks from the API
- `/wp-json/custom/v1/...` responds
- `/sitemap.xml` and `/robots.txt` hit the PHP entry points, not the SPA

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

## Useful paths

| Path | Purpose |
|------|---------|
| `.env` | Bedrock / WordPress env |
| `web/.htaccess.example` | Canonical Apache rules |
| `web/app.php` | SPA HTML + SEO injection |
| `web/frontend/` | Submodule (source + published build) |
| `web/app/plugins/headless-core/` | Headless CMS, blocks, REST, SEO |
| `web/app/plugins/chat-engine/` | Chat / WhatsApp (see its `DOCS.md`) |

---

## Based on Bedrock

WordPress layout and Composer setup follow [Roots Bedrock](https://roots.io/bedrock/). Project-specific behaviour (headless frontend, SEO shell, plugins) is documented above.
