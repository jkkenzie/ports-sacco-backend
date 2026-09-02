<?php

/**
 * WordPress core REST proxy outside /wp-json (Gutenberg / wp-admin editor saves).
 *
 * Prefer admin-ajax (default via Headless Core rest-proxy.php) when Cloudflare blocks
 * root-level hc-*.php files. Set HEADLESS_ADMIN_REST_PROXY=hc-wp-api to force this entry.
 *
 * Usage: /hc-wp-api.php?rest_route=/wp/v2/pages/211&_locale=user
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
