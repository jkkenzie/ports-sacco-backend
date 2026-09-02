<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

require_once HEADLESS_CORE_PATH . 'inc/rest-proxy-handler.php';

/**
 * Proxy mode for wp-admin Gutenberg REST saves when Cloudflare blocks /wp-json.
 *
 * - admin-ajax (default): /wp/wp-admin/admin-ajax.php — usually allowed by CF Access / WAF
 * - hc-wp-api: /hc-wp-api.php at web root
 * - off / 0 / false: disabled
 */
function headless_core_admin_rest_proxy_mode(): string
{
    $flag = getenv('HEADLESS_ADMIN_REST_PROXY');
    if ($flag === '0' || $flag === 'false' || $flag === 'off') {
        return 'off';
    }
    if ($flag === 'hc-wp-api') {
        return 'hc-wp-api';
    }

    return 'admin-ajax';
}

/**
 * Whether wp-admin should route core REST (wp/v2) through a Cloudflare-safe proxy.
 */
function headless_core_use_admin_rest_proxy(): bool
{
    return is_admin() && headless_core_admin_rest_proxy_mode() !== 'off';
}

/**
 * REST root used by wpApiSettings.root in the block editor.
 */
function headless_core_admin_rest_proxy_root_url(): string
{
    if (headless_core_admin_rest_proxy_mode() === 'hc-wp-api') {
        return home_url('/hc-wp-api.php?rest_route=');
    }

    return admin_url('admin-ajax.php?action=headless_core_rest_proxy&rest_route=');
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

    return headless_core_admin_rest_proxy_root_url();
}

add_filter('rest_url', 'headless_core_filter_admin_rest_url', 10, 2);
add_action('wp_ajax_headless_core_rest_proxy', 'headless_core_ajax_rest_proxy_handler');
