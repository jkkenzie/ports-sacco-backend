<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Global transient toggle. Enabled by default.
 */
function headless_core_transients_enabled(): bool
{
    return get_option('headless_core_enable_transients', '1') === '1';
}

/**
 * @return int Seconds
 */
function headless_core_cache_ttl(): int
{
    $ttl = (int) apply_filters('headless_core_cache_ttl', 5 * MINUTE_IN_SECONDS);

    return max(60, $ttl);
}

/**
 * @param non-empty-string $group
 * @param non-empty-string $key
 * @return string
 */
function headless_core_cache_key(string $group, string $key): string
{
    if ($group === 'page') {
        $ver = (string) get_option('headless_page_cache_ver', '1');
        $api = defined('HEADLESS_CORE_VERSION') ? HEADLESS_CORE_VERSION : '0';

        return 'headless_' . $group . '_v1_' . $ver . '_' . md5($api . '|' . $key);
    }

    return 'headless_' . $group . '_v1_' . md5($key);
}

/**
 * @param non-empty-string $group
 * @param non-empty-string $key
 * @return mixed|null
 */
function headless_core_cache_get(string $group, string $key)
{
    if (! headless_core_transients_enabled()) {
        return null;
    }

    if (wp_using_ext_object_cache()) {
        return wp_cache_get(headless_core_cache_key($group, $key), $group);
    }

    return get_transient(headless_core_cache_key($group, $key));
}

/**
 * @param non-empty-string $group
 * @param non-empty-string $key
 * @param mixed            $value
 * @return void
 */
function headless_core_cache_set(string $group, string $key, $value): void
{
    if (! headless_core_transients_enabled()) {
        return;
    }

    $ttl = headless_core_cache_ttl();
    $full = headless_core_cache_key($group, $key);

    if (wp_using_ext_object_cache()) {
        wp_cache_set($full, $value, $group, $ttl);

        return;
    }

    set_transient($full, $value, $ttl);
}

/**
 * @param non-empty-string $group
 * @param non-empty-string $key
 * @return void
 */
function headless_core_cache_delete(string $group, string $key): void
{
    $full = headless_core_cache_key($group, $key);

    if (wp_using_ext_object_cache()) {
        wp_cache_delete($full, $group);

        return;
    }

    delete_transient($full);
}

/**
 * Low-level transient wrappers for direct keys.
 *
 * @return mixed|null
 */
function headless_core_transient_get_raw(string $key)
{
    if (! headless_core_transients_enabled()) {
        return null;
    }

    return get_transient($key);
}

/**
 * @param mixed $value
 */
function headless_core_transient_set_raw(string $key, $value, int $ttl): void
{
    if (! headless_core_transients_enabled()) {
        return;
    }

    set_transient($key, $value, $ttl);
}

function headless_core_transient_delete_raw(string $key): void
{
    delete_transient($key);
}

/**
 * @return void
 */
function headless_core_bump_menu_cache_version(): void
{
    $v = (int) get_option('headless_menu_cache_ver', 1);
    update_option('headless_menu_cache_ver', $v + 1, false);
}

/**
 * @return void
 */
function headless_core_bump_page_cache_version(): void
{
    $v = (int) get_option('headless_page_cache_ver', 1);
    update_option('headless_page_cache_ver', $v + 1, false);
}

/**
 * @return void
 */
function headless_core_bump_savings_products_cache_version(): void
{
    $v = (int) get_option('headless_savings_products_cache_ver', 1);
    update_option('headless_savings_products_cache_ver', $v + 1, false);
}

/**
 * @return void
 */
function headless_core_bump_loan_products_cache_version(): void
{
    $v = (int) get_option('headless_loan_products_cache_ver', 1);
    update_option('headless_loan_products_cache_ver', $v + 1, false);
}

/**
 * @return void
 */
function headless_core_bump_services_cache_version(): void
{
    $v = (int) get_option('headless_services_cache_ver', 1);
    update_option('headless_services_cache_ver', $v + 1, false);
}

add_action('save_post_page', static function (int $postId, WP_Post $post, bool $update): void {
    if (wp_is_post_revision($postId) || $post->post_status === 'auto-draft') {
        return;
    }
    headless_core_bump_page_cache_version();
}, 10, 3);

add_action('wp_update_nav_menu', static function (): void {
    headless_core_bump_menu_cache_version();
});

add_action('wp_delete_nav_menu', static function (): void {
    headless_core_bump_menu_cache_version();
});

add_action('save_post_savings_product', static function (int $postId, WP_Post $post): void {
    if (wp_is_post_revision($postId) || $post->post_status === 'auto-draft') {
        return;
    }
    headless_core_bump_savings_products_cache_version();
}, 10, 2);

add_action('save_post_loan_product', static function (int $postId, WP_Post $post): void {
    if (wp_is_post_revision($postId) || $post->post_status === 'auto-draft') {
        return;
    }
    headless_core_bump_loan_products_cache_version();
}, 10, 2);

add_action('save_post_service', static function (int $postId, WP_Post $post): void {
    if (wp_is_post_revision($postId) || $post->post_status === 'auto-draft') {
        return;
    }
    headless_core_bump_services_cache_version();
}, 10, 2);
