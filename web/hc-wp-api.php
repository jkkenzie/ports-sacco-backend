<?php

/**
 * WordPress core REST proxy outside /wp-json.
 *
 * Gutenberg in wp-admin posts HTML + JSON (block comments, hex colors) to
 * /wp-json/wp/v2/pages/{id}. Cloudflare WAF often blocks that URI/body combo
 * ("Sorry, you have been blocked") while still allowing this entry point.
 *
 * Usage (query-string, same pattern as /hc-api.php forms):
 *   /hc-wp-api.php?rest_route=/wp/v2/pages/211&context=edit
 *
 * Logged-in users only. Public SPA traffic stays on /wp-json.
 */

declare(strict_types=1);

define('WP_USE_THEMES', false);

require __DIR__ . '/wp/wp-load.php';

if (! function_exists('headless_core_rest_proxy_run')) {
    if (! headers_sent()) {
        header('Content-Type: application/json; charset=UTF-8');
        status_header(503);
    }
    echo wp_json_encode([
        'code' => 'hc_wp_rest_unavailable',
        'message' => 'REST proxy unavailable.',
        'data' => ['status' => 503],
    ]);
    exit;
}

headless_core_rest_proxy_run();
