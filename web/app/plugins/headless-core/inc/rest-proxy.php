<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Proxy mode for wp-admin Gutenberg REST when Cloudflare blocks /wp-json.
 *
 * - admin-ajax (default): /wp/wp-admin/admin-ajax.php — under /wp/, skips SPA catch-all
 * - hc-wp-api: /hc-wp-api.php?rest_route=/wp/v2/... — same pattern as public forms
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
    if ($flag === 'hc-wp-api') {
        return 'hc-wp-api';
    }

    return 'admin-ajax';
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

    return true;
}

/**
 * REST root used by wpApiSettings.root and the apiFetch middleware.
 */
function headless_core_admin_rest_proxy_root_url(): string
{
    if (headless_core_admin_rest_proxy_mode() === 'hc-wp-api') {
        return home_url('/hc-wp-api.php?rest_route=/');
    }

    return admin_url('admin-ajax.php?action=headless_core_rest_proxy&rest_route=/');
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

function headless_core_enqueue_admin_rest_proxy_script(): void
{
    if (! headless_core_use_admin_rest_proxy()) {
        return;
    }

    wp_enqueue_script(
        'headless-core-admin-rest-proxy',
        HEADLESS_CORE_URL . 'blocks/shared/admin-rest-proxy.js',
        ['wp-api-fetch'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_localize_script('headless-core-admin-rest-proxy', 'headlessCoreAdminRestProxy', [
        'root' => headless_core_admin_rest_proxy_root_url(),
        'mode' => headless_core_admin_rest_proxy_mode(),
        'forcePost' => headless_core_admin_rest_proxy_mode() === 'admin-ajax',
    ]);
}

add_filter('rest_url', 'headless_core_filter_admin_rest_url', 10, 2);
add_action('wp_ajax_headless_core_rest_proxy', 'headless_core_ajax_rest_proxy_handler');
add_action('enqueue_block_editor_assets', 'headless_core_enqueue_admin_rest_proxy_script', 1);
add_action('admin_enqueue_scripts', 'headless_core_enqueue_admin_rest_proxy_script', 20);
