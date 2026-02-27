# Chat Engine — Documentation

Unified chat system with Twilio integration for automated FAQs, loan queries, WhatsApp flows, and human agent handoff.

---

## Table of contents

1. [Overview & features](#1-overview--features)
2. [Installation](#2-installation)
3. [Configuration](#3-configuration)
4. [URL structure & headless setup](#4-url-structure--headless-setup)
4.5 [Production configuration](#45-production-configuration)
5. [REST API reference](#5-rest-api-reference)
6. [Admin pages](#6-admin-pages)
6.5 [Human agent handoff](#65-human-agent-handoff)
7. [Twilio webhook & WhatsApp](#7-twilio-webhook--whatsapp)
8. [Testing](#8-testing)
9. [Troubleshooting](#9-troubleshooting)
10. [Architecture & customization](#10-architecture--customization)
11. [Project deployment plan](#11-project-deployment-plan)

---

## 1. Overview & features

- **Automated FAQ responses** — Keyword-based matching and intent detection
- **Loan product information** — Configurable loan responses
- **Office hours & location** — Business hours engine and office settings
- **WhatsApp (Twilio)** — Webhook handling, sending replies, media
- **WhatsApp-only flows** — Membership inquiry and document request (state machine)
- **Business hours** — Configurable start/end and timezone
- **Human agent handoff** — Escalation and Twilio Conversations
- **Session & message logging** — Stored in database

### Plugin structure

| File / folder | Purpose |
|---------------|--------|
| `chat-engine.php` | Main plugin, activation hooks |
| `includes/class-database.php` | Table creation |
| `includes/class-rest-api.php` | REST endpoints |
| `includes/class-intent-classifier.php` | Intent detection |
| `includes/class-faq-responder.php` | FAQ responses |
| `includes/class-loan-responder.php` | Loan responses |
| `includes/class-office-responder.php` | Office hours & location |
| `includes/class-business-hours.php` | Business hours logic |
| `includes/class-agent-handoff.php` | Agent escalation |
| `includes/class-whatsapp-flows.php` | WhatsApp flows |
| `includes/class-security.php` | Rate limit, Twilio validation |
| `includes/class-admin.php` | Admin UI |

### Database tables

- `wp_chat_faqs` — Questions, keywords, answers, intent, channel
- `wp_chat_sessions` — Session id, channel, user, status
- `wp_chat_messages` — Session id, sender, message, media_url, timestamp
- `wp_chat_flow_data` — WhatsApp flow state

---

## 2. Installation

**Prerequisites:** WordPress Bedrock, PHP 8.1+, MySQL, Composer, Twilio account (for WhatsApp).

1. **Composer**
   ```bash
   composer install
   ```

2. **Activate plugin**
   - WordPress Admin → Plugins → Activate **Chat Engine**
   - Tables are created on activation.

3. **Environment**
   - Add variables to project root `.env` (see [Configuration](#3-configuration)).

4. **Twilio webhook**
   - Set webhook URL in Twilio Console (see [Twilio webhook](#7-twilio-webhook--whatsapp)).

5. **Frontend**
   - Set `web/frontend/.env` if using React chat widget (see [Configuration](#3-configuration)).

---

## 3. Configuration

### Root `.env` (project root)

```env
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_CONVERSATIONS_SERVICE_SID=ISxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
TWILIO_WEBHOOK_SECRET=your_secret

# Business hours
CHAT_BUSINESS_HOURS_START=08:00
CHAT_BUSINESS_HOURS_END=17:00
CHAT_TIMEZONE=Africa/Nairobi
```

### Frontend `web/frontend/.env`

```env
VITE_PUBLIC_URL=http://your-site
VITE_WP_HOME=http://your-site
VITE_WP_REST_PATH=/wp-json/chat/v1
VITE_WHATSAPP_NUMBER=+1234567890
```

### Office info (WordPress options or Admin)

- `chat_engine_office_address`
- `chat_engine_office_phone`
- `chat_engine_office_email`

Set via **Chat Engine → Office Settings** in admin.

---

## 4. URL structure & headless setup

- **REST API** is at **root** `/wp-json/` (via `.htaccess` → `wp-api.php`).
- **WordPress admin** remains at `/wp/wp-admin/` (via `index.php`).
- **Frontend** is served for all other routes (e.g. React SPA).

### Relevant files

- `web/wp-api.php` — REST only, `WP_USE_THEMES = false`
- `web/.htaccess` — Routes `/wp-json` to `wp-api.php`, rest to frontend
- `web/index.php` — Used for wp-admin

### Base URL for chat API

Use the same origin as the site (or ngrok in dev):

- Local: `http://ports-sacco/wp-json/chat/v1`
- Production: `https://yourdomain.com/wp-json/chat/v1`
- ngrok: `https://YOUR_SUBDOMAIN.ngrok-free.dev/wp-json/chat/v1`

---

## 4.5 Production configuration

To enable the Chat Engine REST endpoints in production, configure the following on the server.

### 1. Environment variables (production)

Set these in the **project root** `.env` on the server (do not commit `.env`):

```env
# App URL (Bedrock)
APP_URL=https://yourdomain.com

# WordPress URLs (if used by your Bedrock setup)
WP_HOME=https://yourdomain.com
WP_SITEURL=https://yourdomain.com/wp

# Twilio (required for WhatsApp and webhook validation)
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_CONVERSATIONS_SERVICE_SID=ISxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+1234567890
TWILIO_WEBHOOK_SECRET=your_webhook_signing_secret

# Chat
CHAT_BUSINESS_HOURS_START=08:00
CHAT_BUSINESS_HOURS_END=17:00
CHAT_TIMEZONE=Africa/Nairobi
```

Frontend build env (e.g. `web/frontend/.env.production` or build-time vars) so the chat widget calls the correct API:

```env
VITE_PUBLIC_URL=https://yourdomain.com
VITE_WP_HOME=https://yourdomain.com
VITE_WP_REST_PATH=/wp-json/chat/v1
VITE_WHATSAPP_NUMBER=+1234567890
```

### 2. Apache (enable chat endpoints)

Ensure `mod_rewrite` is enabled and `AllowOverride` allows `.htaccess` in the `web/` (document root) directory.

The following rules must be present in `web/.htaccess` so `/wp-json` is routed to the headless API entry and the chat endpoints are reachable:

```apache
# REST API (including chat) → wp-api.php (no theme)
RewriteCond %{REQUEST_URI} ^/(wp-json|wp/wp-json) [NC]
RewriteRule ^.*$ wp-api.php [L]
```

Full context: REST rules must run **before** any catch-all to `index.php` or `frontend/index.html`. The Chat Engine endpoints are:

- `GET  /wp-json/chat/v1/test`
- `POST /wp-json/chat/v1/session`
- `POST /wp-json/chat/v1/message`
- `POST /wp-json/chat/v1/twilio-webhook`

### 3. Nginx (if not using Apache)

If the production server uses Nginx, `.htaccess` is ignored. Add a location block so `/wp-json` is handled by `wp-api.php`:

```nginx
server {
    server_name yourdomain.com;
    root /path/to/site/web;

    index index.php frontend/index.html;

    location /wp-json {
        try_files $uri $uri/ /wp-api.php?$args;
    }
    location /wp/wp-json {
        try_files $uri $uri/ /wp-api.php?$args;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;   # adjust to your PHP-FPM
    }

    location / {
        try_files $uri $uri/ /frontend/index.html;
    }
}
```

Ensure `wp-api.php` is in the document root (`web/`) and PHP is configured to run it.

### 4. Twilio webhook URL (production)

In **Twilio Console** → your WhatsApp sender / sandbox → **Webhook**:

- **URL:** `https://yourdomain.com/wp-json/chat/v1/twilio-webhook`
- **Method:** POST
- Use **HTTPS** only.

### 5. Permalinks

WordPress permalinks must not be “Plain” (default) for the REST API to work. In **WP Admin → Settings → Permalinks**, use any “pretty” structure (e.g. “Post name”) and save. Bedrock typically has this set already.

### 6. Verify endpoints

After deployment:

```bash
# Health check
curl -s https://yourdomain.com/wp-json/chat/v1/test

# Create session (optional)
curl -s -X POST https://yourdomain.com/wp-json/chat/v1/session \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expect JSON responses. If you get HTML or 404, the routing (Apache/Nginx) or `wp-api.php` path is wrong.

### 7. Is `wp-api.php` required? (404 on production)

**Yes. The file `web/wp-api.php` is required** for the chat (and all REST) endpoints to work.

- `.htaccess` sends every `/wp-json` request to `wp-api.php`.
- `wp-api.php` loads WordPress with themes disabled so the API returns JSON.
- If this file is missing or not in the document root, the API will 404.

**Checklist when you get 404 in production:**

| Check | What to do |
|-------|------------|
| **File present** | Ensure `web/wp-api.php` exists on the server (it is in the Bedrock repo). |
| **Document root** | Apache/Nginx document root must be the directory that contains `wp-api.php` (usually `web/`). |
| **Apache** | `mod_rewrite` on; `AllowOverride All` (or at least `FileInfo`) for `web/` so `.htaccess` runs. |
| **Nginx** | `.htaccess` is ignored; use the [Nginx config](#3-nginx-if-not-using-apache) to route `/wp-json` to `wp-api.php`. |
| **WordPress core** | `web/wp/` must exist (Bedrock: run `composer install` on the server). `wp-api.php` requires `wp/wp-blog-header.php`. |

If the document root is something like `public/` and your app lives in `public/`, then `wp-api.php` and `.htaccess` must be in `public/`, and the `require` path inside `wp-api.php` must still point correctly to `wp/wp-blog-header.php` (e.g. `__DIR__ . '/wp/wp-blog-header.php'` if `wp/` is next to `wp-api.php`).

---

## 5. REST API reference

Base path: `/wp-json/chat/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/test` | Health check, returns JSON |
| POST | `/session` | Create session; returns `session_id` |
| POST | `/message` | Send message; body: `session_id`, `message` |
| POST | `/twilio-webhook` | Twilio WhatsApp webhook |

### Examples

**Create session**
```http
POST /wp-json/chat/v1/session
Content-Type: application/json
```
Response: `{ "session_id": "web_xxx", "status": "created" }`

**Send message**
```http
POST /wp-json/chat/v1/message
Content-Type: application/json

{ "session_id": "web_xxx", "message": "What are your office hours?" }
```
Response: `{ "reply": "...", "type": "bot" }` or `"agent_transfer"` / `"whatsapp_redirect"`

---

## 6. Admin pages

- **Chat Engine → FAQs** — Add/edit/delete FAQs (question, keywords, answer, intent, channel).
- **Chat Engine → Office Settings** — Address, phone, email for location responses.
- **Chat Engine → Agent Handoff** — Message and contact options shown when a user is transferred to an agent (see [§6.5](#65-human-agent-handoff)).
- **Chat Engine → Chat Sessions** — List sessions and view message history.
- **Chat Engine → Loan Products** — Info only; loan text is in `class-loan-responder.php`.

Intents: `faq_general`, `office_hours`, `location`, `loan_product_info`, `membership_inquiry`, `document_request`.  
Channels: `both`, `web`, `whatsapp`.

---

## 6.5 Human agent handoff

When the bot escalates to a human agent, the session is marked as `agent` and the user sees a **configurable message** plus **contact options** (WhatsApp, phone, email) so they are not stuck on “Connecting you to a human agent. Please wait...”.

### When handoff is triggered

- User explicitly asks for an agent (e.g. “talk to agent”, “human”, “representative”).
- Intent confidence is low (&lt; 0.5) and it’s business hours.
- Intent is unknown and it’s business hours.

Outside business hours, the user gets an “office hours” message instead of handoff.

### Configuration

1. **Chat Engine → Agent Handoff** in WordPress admin.
2. **Message when transferring to agent** — Shown in the chat when escalation happens. Example: *“We've noted your request. For immediate assistance, please contact us:”*
3. **Append contact options** — Check which to append (all use existing data):
   - **WhatsApp link** — From `TWILIO_WHATSAPP_NUMBER` in `.env`. Outputs as clickable `https://wa.me/...` link.
   - **Office phone** — From **Chat Engine → Office Settings**. Outputs as clickable phone number (opens phone dialer on mobile).
   - **Office email** — From **Chat Engine → Office Settings**. Outputs as clickable email (opens email client).

The API builds one reply: your message plus the selected contact lines (e.g. WhatsApp URL, phone, email). The user sees that in the chat instead of an endless “Please wait...”.

### Web vs WhatsApp

| Channel   | What happens |
|----------|----------------|
| **Web**  | Session status set to `agent`. User sees the configured handoff message + contact options. There is no live agent in the same chat window unless you add an agent dashboard that uses the same session and API. |
| **WhatsApp** | Session status set to `agent`. If `TWILIO_CONVERSATIONS_SERVICE_SID` is set in `.env`, a Twilio Conversation is created so an agent can join via Twilio Conversations. Otherwise the conversation stays in WhatsApp and your team can reply via Twilio/WhatsApp as usual. |

### Optional: Twilio Conversations (WhatsApp)

To create a Twilio Conversation on WhatsApp handoff (so agents can use Twilio’s agent UI):

1. In [Twilio Console](https://console.twilio.com): **Conversations** → **Services** → create or select a service.
2. Copy the **Service SID** (starts with `IS...`).
3. In project `.env` set:
   ```env
   TWILIO_CONVERSATIONS_SERVICE_SID=ISxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Configure the Conversation so agents can join (Twilio docs: Conversations setup).

If this is not set, handoff still works: the user keeps chatting on WhatsApp and your team replies there; no Conversation is created.

### WordPress hook

When a session is escalated, the plugin runs:

```php
do_action('chat_engine_agent_escalation', $session_id);
```

You can use this to notify an agent dashboard, send an email, or create a ticket (e.g. in a CRM).

### Summary

- **Stuck “Please wait...”** — Fixed by showing a single reply with your message + WhatsApp/phone/email from **Agent Handoff** and **Office** settings.
- **Full live agent in same chat** — Would require an agent dashboard that reads/writes messages for that session (e.g. polling or WebSocket + your API). The plugin does not include that dashboard; it only marks the session and shows the handoff message + contact options.

---

## 7. Twilio webhook & WhatsApp

### Webhook URL

Use this in Twilio Console → Messaging → WhatsApp → “When a message comes in”:

- **Production:** `https://YOUR_DOMAIN/wp-json/chat/v1/twilio-webhook`
- **Local (ngrok):** `https://YOUR_NGROK_URL.ngrok-free.dev/wp-json/chat/v1/twilio-webhook`

**Method:** POST.

Twilio needs a **public HTTPS** URL; for local dev use ngrok (e.g. `ngrok http 80`).

### Steps in Twilio Console

1. [Twilio Console](https://console.twilio.com) → Messaging → Try it out → Send a WhatsApp message (or your number).
2. Under Sandbox/Configure, set **When a message comes in**:
   - URL: (one of the URLs above)
   - HTTP: POST
3. Save. Use `TWILIO_WEBHOOK_SECRET` in `.env` for signature validation.

### WhatsApp flows

- **Membership:** full name → ID number → membership type → confirm.
- **Document:** document type → upload → confirm.

These run only on WhatsApp; web chat shows a “Continue on WhatsApp” style redirect for those intents.

---

## 8. Testing

### Quick checks

1. **REST API**
   - `GET /wp-json/` — JSON with namespaces
   - `GET /wp-json/chat/v1/test` — Chat test JSON

2. **Web chat**
   - Open site, click floating help, send e.g. “What are your office hours?” and confirm reply.

3. **WhatsApp**
   - Send a message to your Twilio number; bot should reply. Try “membership” or “document” for flows.

### Diagnostic script

If the plugin is under `app/plugins/chat-engine/` and the site serves it:

```
http://YOUR_SITE/app/plugins/chat-engine/diagnose.php
```

Checks: plugin active, routes registered, tables, env, Twilio SDK.

### Checklist

- [ ] Plugin activated; permalinks saved
- [ ] `.env` and frontend `.env` set
- [ ] Twilio webhook URL set (POST)
- [ ] `/wp-json/chat/v1/test` returns JSON
- [ ] Web chat gets replies
- [ ] WhatsApp gets replies (with ngrok if local)

---

## 9. Troubleshooting

### REST API / 404

1. **Plugin active** — Plugins → Chat Engine = Active.
2. **Permalinks** — Settings → Permalinks → Save (no “Plain”).
3. **REST base** — Open `/wp-json/` in browser; expect JSON.
4. **Headless routing** — `/wp-json` must hit `wp-api.php` (see `.htaccess`).
5. **Diagnose** — Run `diagnose.php` if available.

### “Unable to connect” in chat widget

- Open the site from the **same URL** the API uses (same origin or same ngrok host).
- Check browser Network tab: `POST .../session` and `POST .../message` should return 200.
- Console: look for `Chat session failed: <status> <url>`.

### WhatsApp not replying

- Twilio Logs: confirm webhook is called and response is 200.
- URL exactly as above; method POST.
- ngrok running and pointing at the same server as the site.
- Twilio credentials and `TWILIO_WHATSAPP_NUMBER` correct in `.env`.

### Plugin won’t activate

- PHP 8.1+; run `composer install`.
- Check `debug.log` and server error logs.
- Confirm all `includes/class-*.php` and `chat-engine.php` exist.

### Database

- Tables: `wp_chat_faqs`, `wp_chat_sessions`, `wp_chat_messages`, `wp_chat_flow_data`.
- Deactivate and reactivate plugin to recreate tables if needed.
- Table prefix must match `DB_PREFIX` in config.

---

## 10. Architecture & customization

### Flow (simplified)

```
React (FloatingHelpButton)  →  POST /wp-json/chat/v1/message
       →  Intent classifier  →  FAQ / Loan / Office / Agent handoff
       →  Response back to frontend

WhatsApp  →  Twilio  →  POST /wp-json/chat/v1/twilio-webhook
       →  WhatsApp flows or intent  →  Reply via Twilio API
```

### Customizing responses

- **FAQs:** Admin → Chat Engine → FAQs (or `wp_chat_faqs`).
- **Office:** Admin → Office Settings or options `chat_engine_office_*`.
- **Loans:** Edit `includes/class-loan-responder.php`.
- **Business hours:** `.env` `CHAT_BUSINESS_HOURS_*` and `CHAT_TIMEZONE`.

### Security

- Rate limiting per session (configurable in code).
- Twilio request validation via `TWILIO_WEBHOOK_SECRET`.
- Sanitization and prepared statements in plugin code.

### Possible next steps

- CRM for membership submissions
- Richer intent detection (e.g. AI)
- Multi-language
- Agent dashboard and analytics
- Loan eligibility flow

---

## 11. Project deployment plan

### Future workflow

**Frontend changes → commit & push inside `web/frontend` only**

```bash
cd web/frontend
git add .
git commit -m "Update frontend"
git push
```

**Update Bedrock pointer → commit & push in Bedrock repo**

```bash
cd ../../
git add web/frontend
git commit -m "Update frontend submodule reference"
git push
```

**Server / production pull**

```bash
git pull
git submodule update --init --recursive --remote
cd web/frontend
npm install
npm run build
```

---

For a short overview and quick start, see [README.md](README.md).
