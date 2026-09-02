<?php

/**
 * Headless REST proxy outside /wp-json (forms, product catalog, Gutenberg editor saves).
 *
 * Cloudflare WAF rules often match URI paths containing "wp-json" and return HTML 403.
 * This entry point allowlists routes under custom/v1, portsacco/v1, and wp/v2.
 *
 * Usage:
 *   /hc-api.php?rest_route=/custom/v1/loan-products/asset-finance
 *   /hc-api.php?rest_route=/wp/v2/loan-products/181&_locale=user
 */

declare(strict_types=1);

define('WP_USE_THEMES', false);

require __DIR__ . '/wp/wp-load.php';

if (! function_exists('headless_core_hc_api_run')) {
    if (! headers_sent()) {
        header('Content-Type: application/json; charset=UTF-8');
        status_header(503);
    }
    echo wp_json_encode([
        'code' => 'hc_rest_unavailable',
        'message' => 'REST proxy unavailable.',
        'data' => ['status' => 503],
    ]);
    exit;
}

headless_core_hc_api_run();
