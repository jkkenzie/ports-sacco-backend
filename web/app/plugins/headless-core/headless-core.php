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
define('HEADLESS_CORE_VERSION', '1.0.69');

require_once HEADLESS_CORE_PATH . 'inc/cache.php';
require_once HEADLESS_CORE_PATH . 'inc/cors.php';
require_once HEADLESS_CORE_PATH . 'inc/rest-nonce.php';
require_once HEADLESS_CORE_PATH . 'inc/rest-api.php';
require_once HEADLESS_CORE_PATH . 'inc/newsletter-subscribe.php';
require_once HEADLESS_CORE_PATH . 'inc/news-comments.php';
require_once HEADLESS_CORE_PATH . 'inc/youtube.php';
require_once HEADLESS_CORE_PATH . 'inc/migration.php';
require_once HEADLESS_CORE_PATH . 'inc/blocks.php';
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
}
