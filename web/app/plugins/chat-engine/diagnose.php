<?php
/**
 * Diagnostic script to check Chat Engine plugin status
 * 
 * Access this file directly: http://ports-sacco/wp-content/plugins/chat-engine/diagnose.php
 * Or: http://ports-sacco/app/plugins/chat-engine/diagnose.php
 */

// Load WordPress
require_once('../../../wp/wp-load.php');

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Chat Engine Diagnostic</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        .info { color: blue; }
        h2 { border-bottom: 2px solid #333; padding-bottom: 10px; }
        pre { background: #f5f5f5; padding: 10px; border-left: 3px solid #333; overflow-x: auto; }
        ul { line-height: 1.8; }
    </style>
</head>
<body>
    <h1>Chat Engine Plugin Diagnostic</h1>
    
    <?php
    $checks = array();
    
    // Check 1: WordPress loaded
    $checks['wordpress'] = defined('ABSPATH');
    
    // Check 2: Plugin file exists
    $plugin_file = __DIR__ . '/chat-engine.php';
    $checks['plugin_file'] = file_exists($plugin_file);
    
    // Check 3: Plugin is active
    $checks['plugin_active'] = is_plugin_active('chat-engine/chat-engine.php');
    
    // Check 4: REST API enabled
    $checks['rest_api_enabled'] = function_exists('rest_url');
    
    // Check 5: REST API routes registered
    $rest_server = rest_get_server();
    $routes = $rest_server->get_routes();
    $checks['chat_routes'] = isset($routes['/chat/v1']);
    
    // Check 6: Database tables exist
    global $wpdb;
    $tables = array(
        $wpdb->prefix . 'chat_faqs',
        $wpdb->prefix . 'chat_sessions',
        $wpdb->prefix . 'chat_messages',
        $wpdb->prefix . 'chat_flow_data'
    );
    $existing_tables = array();
    foreach ($tables as $table) {
        $result = $wpdb->get_var("SHOW TABLES LIKE '$table'");
        $existing_tables[$table] = ($result === $table);
    }
    $checks['database_tables'] = count(array_filter($existing_tables)) === count($tables);
    
    // Check 7: Composer dependencies
    $twilio_autoload = __DIR__ . '/../../../vendor/twilio/sdk/src/Twilio/Rest/Client.php';
    $checks['twilio_installed'] = file_exists($twilio_autoload);
    
    // Check 8: Environment variables
    $env_vars = array(
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'TWILIO_WHATSAPP_NUMBER'
    );
    $env_set = array();
    foreach ($env_vars as $var) {
        $env_set[$var] = !empty(env($var));
    }
    $checks['env_vars'] = count(array_filter($env_set)) === count($env_vars);
    
    // Display results
    ?>
    
    <h2>System Checks</h2>
    <ul>
        <li>
            WordPress Loaded: 
            <?php echo $checks['wordpress'] ? '<span class="success">✓ Yes</span>' : '<span class="error">✗ No</span>'; ?>
        </li>
        <li>
            Plugin File Exists: 
            <?php echo $checks['plugin_file'] ? '<span class="success">✓ Yes</span>' : '<span class="error">✗ No</span>'; ?>
        </li>
        <li>
            Plugin Active: 
            <?php echo $checks['plugin_active'] ? '<span class="success">✓ Yes</span>' : '<span class="error">✗ No - <strong>ACTIVATE THE PLUGIN!</strong></span>'; ?>
        </li>
        <li>
            REST API Enabled: 
            <?php echo $checks['rest_api_enabled'] ? '<span class="success">✓ Yes</span>' : '<span class="error">✗ No</span>'; ?>
        </li>
        <li>
            Chat Routes Registered: 
            <?php 
            if ($checks['chat_routes']) {
                echo '<span class="success">✓ Yes</span>';
                echo '<pre>';
                foreach ($routes['/chat/v1'] as $route => $handlers) {
                    echo $route . "\n";
                }
                echo '</pre>';
            } else {
                echo '<span class="error">✗ No - Routes not registered</span>';
            }
            ?>
        </li>
        <li>
            Database Tables: 
            <?php 
            if ($checks['database_tables']) {
                echo '<span class="success">✓ All tables exist</span>';
            } else {
                echo '<span class="error">✗ Missing tables:</span>';
                echo '<ul>';
                foreach ($existing_tables as $table => $exists) {
                    echo '<li>' . $table . ': ' . ($exists ? '<span class="success">✓</span>' : '<span class="error">✗</span>') . '</li>';
                }
                echo '</ul>';
            }
            ?>
        </li>
        <li>
            Twilio SDK Installed: 
            <?php echo $checks['twilio_installed'] ? '<span class="success">✓ Yes</span>' : '<span class="warning">✗ No - Run: composer install</span>'; ?>
        </li>
        <li>
            Environment Variables: 
            <?php 
            if ($checks['env_vars']) {
                echo '<span class="success">✓ All set</span>';
            } else {
                echo '<span class="warning">✗ Missing:</span>';
                echo '<ul>';
                foreach ($env_set as $var => $set) {
                    echo '<li>' . $var . ': ' . ($set ? '<span class="success">✓</span>' : '<span class="error">✗</span>') . '</li>';
                }
                echo '</ul>';
            }
            ?>
        </li>
    </ul>
    
    <h2>REST API Test URLs</h2>
    <ul>
        <li>
            <a href="<?php echo rest_url('chat/v1/test'); ?>" target="_blank">
                Test Endpoint: <?php echo rest_url('chat/v1/test'); ?>
            </a>
        </li>
        <li>
            <a href="<?php echo rest_url(); ?>" target="_blank">
                WordPress REST API Root: <?php echo rest_url(); ?>
            </a>
        </li>
    </ul>
    
    <h2>Actions</h2>
    <ul>
        <?php if (!$checks['plugin_active']): ?>
        <li><strong>1. Activate the plugin:</strong> Go to <a href="<?php echo admin_url('plugins.php'); ?>">Plugins</a> and activate "Chat Engine"</li>
        <?php endif; ?>
        
        <?php if (!$checks['chat_routes']): ?>
        <li><strong>2. Flush permalinks:</strong> Go to <a href="<?php echo admin_url('options-permalink.php'); ?>">Settings → Permalinks</a> and click "Save Changes"</li>
        <?php endif; ?>
        
        <?php if (!$checks['database_tables']): ?>
        <li><strong>3. Create database tables:</strong> Deactivate and reactivate the plugin</li>
        <?php endif; ?>
        
        <?php if (!$checks['twilio_installed']): ?>
        <li><strong>4. Install dependencies:</strong> Run <code>composer install</code> in the project root</li>
        <?php endif; ?>
    </ul>
    
    <h2>All Routes</h2>
    <pre><?php print_r(array_keys($routes)); ?></pre>
    
</body>
</html>
