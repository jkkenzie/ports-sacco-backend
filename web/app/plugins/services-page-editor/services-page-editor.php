<?php
/**
 * Plugin Name: Services Page Editor
 * Description: Edit Services page content (hero banner, menu items, buttons, intro, cards) and expose via REST API for the frontend.
 * Version: 1.0.0
 * Author: Portsacco
 */

if (!defined('ABSPATH')) {
    exit;
}

define('PORTS_SERVICES_EDITOR_VERSION', '1.0.0');
define('PORTS_SERVICES_EDITOR_PLUGIN_DIR', plugin_dir_path(__FILE__));

require_once __DIR__ . '/includes/class-services-page-admin.php';
require_once __DIR__ . '/includes/class-services-page-rest.php';

function ports_services_editor_init() {
    call_user_func([ 'PortsServices\Admin', 'get_instance' ]);
    call_user_func([ 'PortsServices\REST', 'get_instance' ]);
}
add_action('plugins_loaded', 'ports_services_editor_init');

register_activation_hook(__FILE__, function () {
    $defaults = call_user_func([ 'PortsServices\Admin', 'get_default_settings' ]);
    if (get_option('ports_services_page') === false) {
        add_option('ports_services_page', $defaults);
    }
});
