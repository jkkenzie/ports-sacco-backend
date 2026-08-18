<?php

/**
 * Form bootstrap outside /wp-json (nonce + Turnstile public config).
 *
 * Cloudflare WAF often blocks wp-json nonce GETs while still allowing plain PHP
 * entry points. The SPA prefers app.php inline bootstrap, then this file on
 * force-refresh, then GET /nonce as a last resort.
 */

declare(strict_types=1);

define('WP_USE_THEMES', false);

require __DIR__ . '/wp/wp-load.php';

if (! headers_sent()) {
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: private, no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('CDN-Cache-Control: no-store');
    header('Cloudflare-CDN-Cache-Control: no-store');
    if (function_exists('headless_core_send_security_headers')) {
        headless_core_send_security_headers();
    }
}

if (! function_exists('headless_core_form_bootstrap_payload')) {
    http_response_code(503);
    echo wp_json_encode([
        'nonce' => '',
        'turnstileEnabled' => false,
        'turnstileSiteKey' => '',
        'code' => 'hc_bootstrap_unavailable',
        'message' => 'Form bootstrap unavailable.',
    ]);
    exit;
}

echo wp_json_encode(headless_core_form_bootstrap_payload());
exit;
