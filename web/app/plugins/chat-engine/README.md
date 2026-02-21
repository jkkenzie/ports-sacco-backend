# Chat Engine

Unified chat for WordPress (Bedrock) + React: automated FAQs, loan info, office hours, WhatsApp flows, and human agent handoff.

## Quick start

1. **Install & activate** — `composer install`, then activate the plugin in WordPress.
2. **Configure** — Add Twilio and business-hours variables to the project root `.env` (see [DOCS.md](DOCS.md#3-configuration)).
3. **Twilio webhook** — Set “When a message comes in” to `https://YOUR_DOMAIN/wp-json/chat/v1/twilio-webhook` (POST).
4. **Admin** — **Chat Engine** in the sidebar: manage FAQs, office settings, and view sessions.

## Features

- FAQ responses (keyword + intent)
- Loan and office/location answers
- WhatsApp via Twilio (webhook + flows)
- Business hours and agent handoff
- Admin UI for FAQs and office info

## Documentation

**Full documentation:** [DOCS.md](DOCS.md)

Covers installation, configuration, URL/headless setup, REST API, admin, Twilio, testing, troubleshooting, and customization.

## REST API (base: `/wp-json/chat/v1`)

| Endpoint        | Method | Purpose           |
|----------------|--------|-------------------|
| `/session`     | POST   | Create chat session |
| `/message`     | POST   | Send message      |
| `/twilio-webhook` | POST | Twilio WhatsApp   |
| `/test`        | GET    | Health check      |

## Requirements

- WordPress Bedrock, PHP 8.1+, Composer
- Twilio account for WhatsApp
- React frontend optional (FloatingHelpButton uses this API)
