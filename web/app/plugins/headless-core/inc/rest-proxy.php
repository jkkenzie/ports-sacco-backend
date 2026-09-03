<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Proxy mode for wp-admin Gutenberg REST when Cloudflare blocks /wp-json.
 *
 * - hc-wp-api (default): /hc-wp-api.php/wp/v2/... — path-style, Gutenberg-compatible
 * - admin-ajax: /wp/wp-admin/admin-ajax.php?action=headless_core_rest_proxy&rest_route=
 * - off / 0 / false: disabled
 */
function headless_core_admin_rest_proxy_mode(): string
{
    $flag = '';
    if (function_exists('Env\\env')) {
        $fromEnv = \Env\env('HEADLESS_ADMIN_REST_PROXY');
        if (is_string($fromEnv) && $fromEnv !== '') {
            $flag = $fromEnv;
        }
    }
    if ($flag === '') {
        $flag = (string) (getenv('HEADLESS_ADMIN_REST_PROXY') ?: ($_ENV['HEADLESS_ADMIN_REST_PROXY'] ?? ''));
    }

    $flag = strtolower(trim($flag));
    if ($flag === '0' || $flag === 'false' || $flag === 'off') {
        return 'off';
    }
    if ($flag === 'admin-ajax') {
        return 'admin-ajax';
    }

    return 'hc-wp-api';
}

/**
 * Whether wp-admin should route core REST through a Cloudflare-safe proxy.
 */
function headless_core_use_admin_rest_proxy(): bool
{
    if (headless_core_admin_rest_proxy_mode() === 'off') {
        return false;
    }

    if (! is_admin()) {
        return false;
    }

    if (wp_doing_ajax()) {
        return false;
    }

    if (function_exists('wp_is_json_request') && wp_is_json_request()) {
        return false;
    }

    return true;
}

/**
 * REST root used by wpApiSettings.root in the block editor.
 */
function headless_core_admin_rest_proxy_root_url(): string
{
    if (headless_core_admin_rest_proxy_mode() === 'admin-ajax') {
        return admin_url('admin-ajax.php?action=headless_core_rest_proxy&rest_route=/');
    }

    return home_url('/hc-wp-api.php/');
}

/**
 * Replace the REST API root in wp-admin so Gutenberg saves bypass Cloudflare wp-json blocks.
 *
 * Only the root (path "/") is rewritten. Named routes keep canonical /wp-json URLs in content.
 *
 * @param string $url  Full REST URL.
 * @param string $path Route path (e.g. / or /wp/v2/pages/211).
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
