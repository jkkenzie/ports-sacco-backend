<?php

/**
 * WordPress core REST proxy outside /wp-json (legacy entry — prefer hc-api.php).
 *
 * @deprecated Use /hc-api.php?rest_route=/wp/v2/... (HEADLESS_ADMIN_REST_PROXY=hc-api, default).
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
        'code' => 'hc_wp_rest_unavailable',
        'message' => 'REST proxy unavailable.',
        'data' => ['status' => 503],
    ]);
    exit;
}

headless_core_hc_api_run();
