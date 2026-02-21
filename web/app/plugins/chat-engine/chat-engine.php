<?php
/**
 * Plugin Name: Chat Engine
 * Plugin URI: https://portssacco.com
 * Description: Unified chat system with Twilio integration for automated FAQs, loan queries, WhatsApp flows, and human agent handoff
 * Version: 1.0.0
 * Author: Ports Sacco
 * Author URI: https://portssacco.com
 * License: GPL v2 or later
 * Text Domain: chat-engine
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CHAT_ENGINE_VERSION', '1.0.0');
define('CHAT_ENGINE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CHAT_ENGINE_PLUGIN_URL', plugin_dir_url(__FILE__));

// Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'ChatEngine\\';
    $base_dir = CHAT_ENGINE_PLUGIN_DIR . 'includes/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});

// Main plugin class
class ChatEngine {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->init_hooks();
    }
    
    private function init_hooks() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        add_action('plugins_loaded', array($this, 'load_plugin'));
    }
    
    public function activate() {
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-database.php';
        ChatEngine\Database::create_tables();
        
        // Set default options
        add_option('chat_engine_version', CHAT_ENGINE_VERSION);
        
        // Insert default FAQs
        $this->insert_default_faqs();
    }
    
    public function deactivate() {
        // Cleanup if needed
    }
    
    public function load_plugin() {
        // Load core classes
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-database.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-rest-api.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-intent-classifier.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-faq-responder.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-loan-responder.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-office-responder.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-business-hours.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-agent-handoff.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-whatsapp-flows.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-security.php';
        require_once CHAT_ENGINE_PLUGIN_DIR . 'includes/class-admin.php';
        
        // Initialize REST API
        ChatEngine\REST_API::get_instance();
        
        // Initialize Admin (only in admin)
        if (is_admin()) {
            ChatEngine\Admin::get_instance();
        }
    }
    
    private function insert_default_faqs() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'chat_faqs';
        
        $default_faqs = array(
            array(
                'question' => 'What are your office hours?',
                'keywords' => 'hours,office hours,open,closed,when',
                'answer' => 'Our office hours are Monday to Friday, 8:00 AM to 5:00 PM (Africa/Nairobi timezone). We are closed on weekends and public holidays.',
                'intent' => 'office_hours',
                'channel_allowed' => 'both'
            ),
            array(
                'question' => 'Where is your office located?',
                'keywords' => 'location,address,where,office,find',
                'answer' => 'Our main office is located at [Your Address]. You can also visit our website for detailed directions and a map.',
                'intent' => 'location',
                'channel_allowed' => 'both'
            ),
            array(
                'question' => 'What loan products do you offer?',
                'keywords' => 'loan,loans,products,types,borrow',
                'answer' => 'We offer various loan products including personal loans, business loans, and emergency loans. For detailed information about interest rates and requirements, please contact us during business hours or visit our website.',
                'intent' => 'loan_product_info',
                'channel_allowed' => 'both'
            ),
            array(
                'question' => 'How do I become a member?',
                'keywords' => 'membership,join,become member,register',
                'answer' => 'To become a member, please continue this process via WhatsApp. We will guide you through the membership application process.',
                'intent' => 'membership_inquiry',
                'channel_allowed' => 'whatsapp'
            ),
            array(
                'question' => 'How can I request documents?',
                'keywords' => 'documents,request,forms,papers',
                'answer' => 'Document requests are handled via WhatsApp only. Please continue this conversation on WhatsApp to request documents.',
                'intent' => 'document_request',
                'channel_allowed' => 'whatsapp'
            ),
        );
        
        foreach ($default_faqs as $faq) {
            $wpdb->insert(
                $table_name,
                $faq,
                array('%s', '%s', '%s', '%s', '%s')
            );
        }
    }
}

// Initialize plugin
ChatEngine::get_instance();
