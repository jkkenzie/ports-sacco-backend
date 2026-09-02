<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Proxy mode for wp-admin Gutenberg REST when Cloudflare blocks /wp-json.
 *
 * - hc-api (default): /hc-api.php — same CF-safe path as public forms
 * - admin-ajax: /wp/wp-admin/admin-ajax.php
 * - hc-wp-api: /hc-wp-api.php at web root
 * - off / 0 / false: disabled
 */
function headless_core_admin_rest_proxy_mode(): string
{
    $flag = getenv('HEADLESS_ADMIN_REST_PROXY');
    if ($flag === '0' || $flag === 'false' || $flag === 'off') {
        return 'off';
    }
    if ($flag === 'admin-ajax') {
        return 'admin-ajax';
    }
    if ($flag === 'hc-wp-api') {
        return 'hc-wp-api';
    }

    return 'hc-api';
}

/**
 * Whether wp-admin should route core REST through a Cloudflare-safe proxy.
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
    $mode = headless_core_admin_rest_proxy_mode();

    if ($mode === 'hc-wp-api') {
        return home_url('/hc-wp-api.php?rest_route=');
    }

    if ($mode === 'admin-ajax') {
        return admin_url('admin-ajax.php?action=headless_core_rest_proxy&rest_route=');
    }

    return home_url('/hc-api.php?rest_route=');
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

    if ($path !== '/' && $path !== '') {
        return $url;
    }

    return headless_core_admin_rest_proxy_root_url();
}

add_filter('rest_url', 'headless_core_filter_admin_rest_url', 10, 2);
add_action('wp_ajax_headless_core_rest_proxy', 'headless_core_ajax_rest_proxy_handler');
