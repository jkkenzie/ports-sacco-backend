<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Whether wp-admin should route core REST (wp/v2) through /hc-wp-api.php instead of /wp-json.
 */
function headless_core_use_admin_rest_proxy(): bool
{
    $flag = getenv('HEADLESS_ADMIN_REST_PROXY');
    if ($flag === '0' || $flag === 'false' || $flag === 'off') {
        return false;
    }

    return is_admin();
}

/**
 * Replace the REST API root in wp-admin so Gutenberg saves bypass Cloudflare wp-json blocks.
 *
 * @param string $url   Full REST URL.
 * @param string $path  Route path (e.g. /wp/v2/pages/211).
 */
function headless_core_filter_admin_rest_url(string $url, string $path): string
{
    if (! headless_core_use_admin_rest_proxy()) {
        return $url;
    }

    // Only rewrite the API root used by wpApiSettings.root (path is "/" or "").
    if ($path !== '/' && $path !== '') {
        return $url;
    }

    return home_url('/hc-wp-api.php?rest_route=');
}

add_filter('rest_url', 'headless_core_filter_admin_rest_url', 10, 2);
