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
define('HEADLESS_CORE_VERSION', '1.0.55');

require_once HEADLESS_CORE_PATH . 'inc/cache.php';
require_once HEADLESS_CORE_PATH . 'inc/rest-api.php';
require_once HEADLESS_CORE_PATH . 'inc/migration.php';
require_once HEADLESS_CORE_PATH . 'inc/blocks.php';
require_once HEADLESS_CORE_PATH . 'inc/footer.php';
require_once HEADLESS_CORE_PATH . 'inc/header.php';
require_once HEADLESS_CORE_PATH . 'inc/team.php';
require_once HEADLESS_CORE_PATH . 'inc/admin.php';
require_once HEADLESS_CORE_PATH . 'inc/upload-mimes.php';
require_once HEADLESS_CORE_PATH . 'inc/post-types.php';
require_once HEADLESS_CORE_PATH . 'inc/wxr-import.php';

add_action('after_setup_theme', static function (): void {
    register_nav_menus([
        'primary' => __('Primary Menu', 'headless-core'),
    ]);
});

register_activation_hook(__FILE__, 'headless_core_on_activation');

/**
 * @return void
 */
function headless_core_on_activation(): void
{
    headless_core_run_migration();
}
