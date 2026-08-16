# Ports SACCO site

Headless WordPress (Roots Bedrock) + React (Vite) SPA. WordPress powers content and `/wp-json`; the React app is the public site.

| Path / repo | Role |
|-------------|------|
| **This Bedrock repo** | WordPress, plugins, Apache entry points; **published** SPA under `web/frontend/` |
| **[ports-sacco-frontend](https://github.com/jkkenzie/ports-sacco-frontend)** | React/Vite project at `web/frontend/src/` for local builds |

On the server, `git pull` of Bedrock updates `public_html/frontend/` (`index.html`, `assets/`, …). **No npm on the server.** Build locally, then commit only the published files into Bedrock.

```mermaid
flowchart LR
  srcRepo["web/frontend/src Vite project"] --> build[npm run build]
  build --> dist["web/frontend/src/dist"]
  dist --> publish["publish up to web/frontend"]
  publish --> bedrock[Bedrock commit published files]
  bedrock --> server[git pull on cPanel]
```

---

## Headless REST namespace (`portsacco/v1`)

Custom Headless Core routes no longer use the generic `/wp-json/custom/v1/` prefix. The project namespace is:

| | Namespace | Example |
|---|-----------|---------|
| **Primary** | `portsacco/v1` | `/wp-json/portsacco/v1/nonce` |
| **Legacy alias** (temporary) | `custom/v1` | `/wp-json/custom/v1/nonce` |

Same callbacks are registered on both namespaces during cutover so cached old SPA builds keep working.

**PHP (Headless Core):** `HEADLESS_CORE_REST_NAMESPACE` / `HEADLESS_CORE_REST_NAMESPACE_LEGACY` in `web/app/plugins/headless-core/headless-core.php`, with dual registration via `inc/rest-namespace.php`.

**SPA:** `WP_CUSTOM_API = '/wp-json/portsacco/v1'` and `customApiUrl()` in `web/frontend/src/src/api/wp.js`.

**Deploy order:** ship the plugin (both namespaces live) before the SPA build that calls `portsacco/v1`. Update Cloudflare Cache / WAF notes for `/wp-json/portsacco/v1/*` and keep `/wp-json/custom/v1/*` until aliases are removed in a follow-up.

Common routes under the primary namespace include `/nonce`, `/contact`, `/submit-form`, `/page/{slug}`, CPT lists, `/header`, `/footer`, and `/seo/sitemap`.

---

## Prerequisites

- PHP 8.1+, Composer
- Node.js 18+ and npm (**build machines only**)
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
```

### Frontend source (local / build machine)

`web/frontend/src` is **not** in Bedrock. Use the nested repo there:

```bash
cd web/frontend/src
# If this folder has no .git yet:
git init
git remote add origin https://github.com/jkkenzie/ports-sacco-frontend.git
git fetch origin
git checkout -B main origin/main

cp .env.example .env
npm install
```

Point your vhost document root at `web/` (Bedrock web root). On cPanel, document root is usually `public_html` with `WEBROOT_DIR` set in `.env`.

---

## Local development

### WordPress

Use WAMP (or similar) so `WP_HOME` in the root `.env` resolves (e.g. `http://ports-sacco`).

### React (Vite) — inside ports-sacco-frontend

```bash
cd web/frontend/src
npm run dev
```

- App: `http://localhost:3000`
- `/wp-json` is proxied to `WP_HOME` from the Bedrock root `.env`

### Production-like preview

```bash
cd web/frontend/src
npm run build
npm run preview
```

`npm run build` = `vite build` + publish `dist/` **one level up** into `web/frontend/` (`index.html`, `assets/`, fonts/images synced).

---

## Building and shipping the SPA

### 1. Configure build env

In `web/frontend/src/.env` (ports-sacco-frontend):

| Variable | Purpose |
|----------|---------|
| `VITE_BASE_PATH` | `/` when the SPA is at the site root; `/frontend/` when served under `/frontend/` |
| `VITE_WP_HOME` | Optional override; otherwise Vite reads `WP_HOME` from the Bedrock root `.env` |
| `VITE_WP_API_BASE` | Leave empty for same-origin `/wp-json`; set only if the API is on another host |
| `VITE_PUBLIC_URL` | Public site URL (canonicals / shares); defaults from `WP_HOME` + base |
| `VITE_WP_FRESH_API` | `true` for local cache-busting; omit on production |

### 2. Build (local)

```bash
cd web/frontend/src
npm install
npm run build
```

### 3. Commit published files in **Bedrock** (what the server pulls)

```bash
cd ../../..   # Bedrock root
git add web/frontend/index.html web/frontend/favicon.svg web/frontend/team-bg.png web/frontend/team-bg.svg web/frontend/assets
git commit -m "Update published SPA build"
git push origin main
```

Do **not** add `web/frontend/src` (gitignored). Commit source changes only in the ports-sacco-frontend repo.

### Base-path modes

| Mode | `VITE_BASE_PATH` | Typical URL |
|------|------------------|-------------|
| Site root (`.htaccess.example` + `app.php`) | `/` | `https://example.com/membership` |
| Subfolder | `/frontend/` | `https://example.com/frontend/membership` |

---

## Git workflow (two remotes)

### A. Source (ports-sacco-frontend)

```bash
cd web/frontend/src
git status
git add .
git commit -m "Describe the frontend source change"
git push origin main
```

### B. Published SPA + PHP (Bedrock)

```bash
# after npm run build in web/frontend/src
cd /path/to/bedrock
git add web/frontend/index.html web/frontend/assets web/frontend/favicon.svg web/frontend/team-bg.png web/frontend/team-bg.svg
git add web/app/plugins/headless-core   # etc. for PHP
git commit -m "Describe the change"
git push origin main
```

---

## Server Deployment (cPanel / CloudLinux)

### Architecture

This Bedrock repo is the project root and lives **outside** the web-exposed directory. On production it is typically `~/portsacco_core/`. The cPanel document root, `public_html/`, contains **symlinks** into `portsacco_core/web/` (plus a real `.htaccess`):

```text
~/portsacco_core/                 ← git repo root (NOT web-accessible)
├── .env                          ← real DB creds, salts, secrets (gitignored, chmod 600)
├── config/
├── vendor/                       ← composer dependencies
├── web/                          ← Bedrock public webroot content
│   ├── app/                      (uploads, plugins, mu-plugins, themes)
│   ├── wp/                       (WordPress core, composer-managed)
│   ├── frontend/                 (published React SPA — index.html, assets/)
│   ├── app.php, index.php, wp-config.php, wp-api.php, …
└── deploy.sh                     ← optional server helper (git pull + composer)

~/public_html/                    ← actual document root (symlinks only, except .htaccess)
├── app            → ~/portsacco_core/web/app
├── app.php        → ~/portsacco_core/web/app.php
├── wp             → ~/portsacco_core/web/wp
├── wp-config.php  → ~/portsacco_core/web/wp-config.php
├── index.php      → ~/portsacco_core/web/index.php
├── frontend       → ~/portsacco_core/web/frontend
├── favicon.svg, robots.php, sitemap.php, wp-api.php, wp-index.php  (symlinked as needed)
└── .htaccess                     ← REAL FILE, not symlinked, not tracked by git
```

`WEBROOT_DIR` in `.env` must be the cPanel document root (`/home/USER/public_html`), **not** `~/portsacco_core/web`.

### What is and isn't tracked by git

**Tracked (deployed via `git pull`):**

- PHP entry points (`app.php`, `index.php`, `wp-api.php`, `sitemap.php`, `robots.php`, …)
- `composer.json` / `composer.lock`
- `config/application.php` + environment overrides
- Whitelisted plugins: `chat-engine`, `services-page-editor`, `headless-core`
- Custom mu-plugins that are committed (e.g. `web/app/mu-plugins/cors-header.php` when present)
- **Published SPA** under `web/frontend/` (`index.html`, hashed `assets/`, `favicon.svg`, `team-bg.*`) — built locally from [ports-sacco-frontend](https://github.com/jkkenzie/ports-sacco-frontend) (`web/frontend/src/`), then committed here. No npm on the server.

**Not tracked — installed by Composer on deploy:**

- `web/wp/` (WordPress core — `roots/wordpress`)
- Bedrock Composer mu-plugins (e.g. `bedrock-autoloader.php`, `bedrock-disallow-indexing/`)
- WPackagist plugins/themes such as `newsletter/`, `twentytwentyfive/`

**Not tracked — server-only; must persist across deploys (never delete):**

- `.env` — DB credentials, WP salts, Twilio / Turnstile secrets. **The site will not boot without this.**
- `web/app/uploads/` — media library
- Unmanaged plugins installed only on the server, e.g.:
  - `web/app/plugins/insert-headers-and-footers/`
  - `web/app/plugins/iyi-smtp-mail/`
  - `web/app/plugins/wordpress-importer/`
- `web/favicon.svg`, `web/wp-index.php` — legacy files outside the published SPA path when present
- `public_html/.htaccess` — server-specific rewrite rules; template is `web/.htaccess.example` (copy manually per server; never symlink)

`web/frontend/src/` (Vite source / nested frontend git) is gitignored in this repo and should not exist on production.

### Deploying updates

```bash
~/portsacco_core/deploy.sh
```

Typical `deploy.sh` behaviour: `git pull origin main` + `composer install --no-dev --optimize-autoloader`. It must **never** overwrite `.env`, wipe `uploads/`, or remove the unmanaged plugins listed above.

Equivalent manual steps:

```bash
cd ~/portsacco_core
git checkout main
git pull origin main
composer install --no-dev --optimize-autoloader
```

After pull, `public_html/frontend/` (symlink) already shows the new published SPA. Refresh `public_html/.htaccess` from `web/.htaccess.example` only when rewrite rules change.

**If `composer install` fails with a "package not present in lock file" error:**  
someone edited `composer.json` without updating the lock. Fix:

```bash
cd ~/portsacco_core
composer update <package-name> --no-dev
# Prefer fixing on a local/dev machine, then:
git add composer.lock
git commit -m "Fix composer.lock"
git push origin main
```

Then re-run `deploy.sh`. Going forward, always use `composer require` / `composer update` and commit `composer.lock` — never hand-edit `composer.json` alone.

### First-time server setup (new environment)

1. Generate an SSH deploy key on the server, add the public key to the GitHub repo’s Deploy Keys, and configure `~/.ssh/config` to use it for `github.com`.
2. `git clone git@github.com:jkkenzie/ports-sacco-backend.git ~/portsacco_core` (or this repo’s SSH URL).
3. `cd ~/portsacco_core && composer install --no-dev --optimize-autoloader`
4. Copy the real `.env` from the previous server or a password manager into `~/portsacco_core/.env`, then `chmod 600 ~/portsacco_core/.env`.  
   Set `WEBROOT_DIR` to the cPanel document root (`…/public_html`) and `PHP_ERROR_LOG` if desired (see `.env.example`).
5. Restore server-only data: `uploads/`, unmanaged plugins (list above). Published `web/frontend/` comes from git once it is committed on `main`.
6. In `public_html/`, symlink the web paths into `~/portsacco_core/web/<item>`. Copy `.htaccess` as a **real file** from `web/.htaccess.example`, then adjust per-server — never symlink `.htaccess`.
7. Verify: `curl -I --resolve <domain>:443:<server-ip> https://<domain>/` and check `~/public_html/error_log` (or `PHP_ERROR_LOG`).

### Smoke-check

- Homepage loads (SEO shell via `app.php`)
- A content page (e.g. `/membership`) renders blocks from the API
- `/wp-json/portsacco/v1/nonce` (and other `portsacco/v1` routes) respond; `/wp-json/custom/v1/...` still works via temporary alias
- `/sitemap.xml` and `/robots.txt` hit the PHP entry points, not the SPA
- `public_html/frontend/` has `index.html` + `assets/` from the pull (no `src/`, no `node_modules/`)

### Known gotchas

- **No `rsync`** on this CloudLinux jailed shell — use `cp -a` instead.
- **CloudLinux / `open_basedir`**: if PHP cannot read across the symlink boundary between `public_html` and `portsacco_core`, check `php -i | grep open_basedir`. It should be empty/unrestricted for this layout.
- **Cloudflare**: if the origin is healthy on direct-IP testing but the public domain 403s, the block is often at Cloudflare’s edge (Security → Events), not Apache. A burst of origin 5xx during a bad deploy can also trigger WAF heuristics. See also [Cloudflare + security controls](#cloudflare--security-controls) below.
- **`.htaccess` is never git-tracked** — `web/.htaccess.example` is the template; live rules stay in `public_html/.htaccess`.

---

## Apache / routing notes

`web/.htaccess` (from `.htaccess.example`) must keep this order:

1. `/assets/*` → `/frontend/assets/*`
2. SEO `/sitemap.xml`, `/robots.txt` → PHP scripts
3. WordPress admin / `wp/` / `wp-json` paths pass through
4. Everything else → `app.php` (SPA shell + SEO `<head>`)

If the SPA catch-all runs first, sitemaps and the REST API will break.

---

## Cloudflare + security controls

Public forms and the WP REST API must keep working behind Cloudflare. Prefer **narrow exception rules** for the specific managed rulesets blocking editor saves / form POSTs (provider option 3), after compensating controls are in place:

### Already in application code
- Form POSTs: WordPress REST nonce + honeypot; optional Cloudflare Turnstile
- Nonce / form routes: `Cache-Control` / `CDN-Cache-Control: no-store` (never edge-cache auth tokens)
- Security HTTP headers via Headless Core (`inc/security-headers.php`), SPA `app.php`, and `web/.htaccess.example`
- Bedrock: `DISALLOW_FILE_EDIT`, `DISALLOW_FILE_MODS`, `FORCE_SSL_ADMIN` when `WP_HOME` is HTTPS

### Cloudflare dashboard (ops)
1. **Rocket Loader → Off**
2. **Cache Rule**: Bypass `/wp-json/*` (especially `/wp-json/portsacco/v1/nonce*` and legacy `/wp-json/custom/v1/nonce*`)
3. **Cloudflare Access** for `/wp-admin` and `/wp-login.php` only (not public forms)
4. Exception / skip **only** the managed rulesets blocking legitimate editor/form POSTs — not a blanket WAF bypass

---

## Useful paths

| Path | Purpose |
|------|---------|
| `.env` | Bedrock / WordPress env |
| `web/.htaccess.example` | Canonical Apache rules |
| `web/app.php` | SPA HTML + SEO injection |
| `web/frontend/` | Published SPA (Bedrock tracks) |
| `web/frontend/src/` | Vite project / ports-sacco-frontend (local nested git) |
| `web/app/plugins/headless-core/` | Headless CMS, blocks, REST (`portsacco/v1`), SEO |
| `/wp-json/portsacco/v1/` | Primary headless REST API (legacy: `/wp-json/custom/v1/`) |
| `web/app/plugins/chat-engine/` | Chat / WhatsApp (see its `DOCS.md`) |

---

## Based on Bedrock

WordPress layout and Composer setup follow [Roots Bedrock](https://roots.io/bedrock/). Project-specific behaviour (headless frontend, SEO shell, plugins) is documented above.
