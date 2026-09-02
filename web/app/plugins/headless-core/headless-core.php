<?php

/**
 * Plugin Name:       Headless Core
 * Description:       REST APIs, navigation locations, Gutenberg blocks, and seed data for the React headless frontend.
 * Version:           1.0.0
 * Author:            Ports SACCO
 * Text Domain:       headless-core
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

define('HEADLESS_CORE_PATH', plugin_dir_path(__FILE__));
define('HEADLESS_CORE_URL', plugin_dir_url(__FILE__));
define('HEADLESS_CORE_VERSION', '1.0.115');
define('HEADLESS_CORE_REST_NAMESPACE', 'portsacco/v1');
/** @deprecated Temporary alias so cached SPA builds keep working during cutover. */
define('HEADLESS_CORE_REST_NAMESPACE_LEGACY', 'custom/v1');

require_once HEADLESS_CORE_PATH . 'inc/cache.php';
require_once HEADLESS_CORE_PATH . 'inc/cors.php';
require_once HEADLESS_CORE_PATH . 'inc/security-headers.php';
require_once HEADLESS_CORE_PATH . 'inc/rest-namespace.php';
require_once HEADLESS_CORE_PATH . 'inc/turnstile.php';
require_once HEADLESS_CORE_PATH . 'inc/rest-nonce.php';
require_once HEADLESS_CORE_PATH . 'inc/rest-api.php';
require_once HEADLESS_CORE_PATH . 'inc/newsletter-subscribe.php';
require_once HEADLESS_CORE_PATH . 'inc/news-comments.php';
require_once HEADLESS_CORE_PATH . 'inc/youtube.php';
require_once HEADLESS_CORE_PATH . 'inc/migration.php';
require_once HEADLESS_CORE_PATH . 'inc/hc-api-routes.php';
require_once HEADLESS_CORE_PATH . 'inc/rest-proxy.php';
require_once HEADLESS_CORE_PATH . 'inc/block-labels.php';
require_once HEADLESS_CORE_PATH . 'inc/blocks.php';
require_once HEADLESS_CORE_PATH . 'inc/seo.php';
require_once HEADLESS_CORE_PATH . 'inc/sitemap.php';
require_once HEADLESS_CORE_PATH . 'inc/prerender.php';
require_once HEADLESS_CORE_PATH . 'inc/footer.php';
require_once HEADLESS_CORE_PATH . 'inc/header.php';
require_once HEADLESS_CORE_PATH . 'inc/team.php';
require_once HEADLESS_CORE_PATH . 'inc/admin.php';
require_once HEADLESS_CORE_PATH . 'inc/upload-mimes.php';
require_once HEADLESS_CORE_PATH . 'inc/post-types.php';
require_once HEADLESS_CORE_PATH . 'inc/form/form-spec.php';
require_once HEADLESS_CORE_PATH . 'inc/form/settings.php';
require_once HEADLESS_CORE_PATH . 'inc/form/submission-storage.php';
require_once HEADLESS_CORE_PATH . 'inc/form/register-cpt.php';
require_once HEADLESS_CORE_PATH . 'inc/form/admin-submission.php';
require_once HEADLESS_CORE_PATH . 'inc/form/email-notifications.php';
require_once HEADLESS_CORE_PATH . 'inc/form/rest-endpoint.php';
require_once HEADLESS_CORE_PATH . 'inc/mailhog.php';
require_once HEADLESS_CORE_PATH . 'inc/wxr-import.php';

add_action('after_setup_theme', static function (): void {
    register_nav_menus([
        'primary' => __('Primary Menu', 'headless-core'),
        'topbar_member_login' => __('Top Bar Member Login Menu', 'headless-core'),
    ]);
});

add_action('init', static function (): void {
    if (get_option('headless_core_page_content_v1') !== '1') {
        headless_core_seed_page_block_content();
    }
    headless_core_seed_page_block_content_v2();
    headless_core_seed_page_block_content_v3();
    headless_core_seed_page_block_content_v4();
}, 20);

register_activation_hook(__FILE__, 'headless_core_on_activation');

/**
 * @return void
 */
function headless_core_on_activation(): void
{
    headless_core_run_migration();

    if (function_exists('headless_core_sitemap_add_rewrite_rules')) {
        headless_core_sitemap_add_rewrite_rules();
    }
    delete_option('headless_core_sitemap_rewrite_v');
    flush_rewrite_rules(false);
}
