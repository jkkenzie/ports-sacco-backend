<?php

namespace ChatEngine;

use function Env\env;

class REST_API {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Use rest_api_init hook which fires after WordPress is fully loaded
        add_action('rest_api_init', array($this, 'register_routes'), 10);
    }
    
    public function register_routes() {
        // Register routes with proper namespace and version
        register_rest_route('chat/v1', '/message', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_message'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('chat/v1', '/twilio-webhook', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_twilio_webhook'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('chat/v1', '/session', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_session'),
            'permission_callback' => '__return_true',
        ));
        
        // Add a test endpoint to verify routes are registered
        register_rest_route('chat/v1', '/test', array(
            'methods' => 'GET',
            'callback' => array($this, 'test_endpoint'),
            'permission_callback' => '__return_true',
        ));
    }
    
    public function test_endpoint($request) {
        return rest_ensure_response(array(
            'status' => 'success',
            'message' => 'Chat Engine REST API is working!',
            'timestamp' => current_time('mysql'),
            'available_endpoints' => array(
                'POST /chat/v1/session' => 'Create a new chat session',
                'POST /chat/v1/message' => 'Send a message',
                'POST /chat/v1/twilio-webhook' => 'Twilio webhook handler',
            )
        ));
    }
    
    public function handle_message($request) {
        global $wpdb;
        
        $params = $request->get_json_params();
        $session_id = sanitize_text_field($params['session_id'] ?? '');
        $message = sanitize_text_field($params['message'] ?? '');
        
        if (empty($session_id) || empty($message)) {
            return new \WP_Error('missing_params', 'Session ID and message are required', array('status' => 400));
        }
        
        // Rate limiting check
        if (!Security::check_rate_limit($session_id)) {
            return new \WP_Error('rate_limit', 'Too many requests. Please wait a moment.', array('status' => 429));
        }
        
        // Get or create session
        $session = $this->get_or_create_session($session_id, 'web');
        
        // Save user message
        $this->save_message($session_id, 'user', $message);
        
        // Check business hours
        $business_hours = new Business_Hours();
        $is_business_hours = $business_hours->is_within_hours();
        
        // Detect intent
        $intent_classifier = new Intent_Classifier();
        $intent_result = $intent_classifier->classify($message, 'web');
        
        // Check if WhatsApp-only intent on web channel
        if ($intent_result['intent'] === 'membership_inquiry' || $intent_result['intent'] === 'document_request') {
            return rest_ensure_response(array(
                'reply' => 'Please continue this process via WhatsApp. Click here to chat: ' . $this->get_whatsapp_link(),
                'type' => 'whatsapp_redirect',
                'intent' => $intent_result['intent']
            ));
        }
        
        // Generate response (pass channel so agent handoff shows contact info for web)
        $response = $this->generate_response($intent_result, $is_business_hours, $session_id, $session->channel ?? 'web');
        
        // Save bot response
        $this->save_message($session_id, 'bot', $response['reply'], null, $intent_result['intent']);
        
        return rest_ensure_response($response);
    }
    
    public function handle_twilio_webhook($request) {
        // Verify Twilio signature
        if (!Security::verify_twilio_signature($request)) {
            return new \WP_Error('invalid_signature', 'Invalid Twilio signature', array('status' => 401));
        }
        
        $body = $request->get_body_params();
        $from = sanitize_text_field($body['From'] ?? '');
        $message_body = sanitize_text_field($body['Body'] ?? '');
        $media_url = sanitize_url($body['MediaUrl0'] ?? '');
        
        // Extract phone number from Twilio format (whatsapp:+1234567890)
        $phone = str_replace('whatsapp:', '', $from);
        $session_id = 'whatsapp_' . md5($phone);
        
        // Get or create session
        $session = $this->get_or_create_session($session_id, 'whatsapp', $phone);
        
        // Save user message
        $this->save_message($session_id, 'user', $message_body, $media_url);
        
        // Check WhatsApp flows state
        $whatsapp_flows = new WhatsApp_Flows();
        $flow_response = $whatsapp_flows->process_message($session_id, $phone, $message_body, $media_url);
        
        if ($flow_response) {
            $this->send_twilio_response($from, $flow_response);
            return rest_ensure_response(array('status' => 'ok'));
        }
        
        // Check business hours
        $business_hours = new Business_Hours();
        $is_business_hours = $business_hours->is_within_hours();
        
        // Detect intent
        $intent_classifier = new Intent_Classifier();
        $intent_result = $intent_classifier->classify($message_body, 'whatsapp');
        
        // Generate response
        $response = $this->generate_response($intent_result, $is_business_hours, $session_id, $session->channel ?? 'whatsapp');
        
        // Save bot response
        $this->save_message($session_id, 'bot', $response['reply'], null, $intent_result['intent']);
        
        // Send Twilio response
        $this->send_twilio_response($from, $response['reply']);
        
        return rest_ensure_response(array('status' => 'ok'));
    }
    
    public function create_session($request) {
        $session_id = 'web_' . wp_generate_uuid4();
        $session = $this->get_or_create_session($session_id, 'web');
        
        return rest_ensure_response(array(
            'session_id' => $session_id,
            'status' => 'created'
        ));
    }
    
    private function get_or_create_session($session_id, $channel, $user_identifier = null) {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_sessions';
        
        $session = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE session_id = %s",
            $session_id
        ));
        
        if (!$session) {
            $wpdb->insert(
                $table,
                array(
                    'session_id' => $session_id,
                    'channel' => $channel,
                    'user_identifier' => $user_identifier,
                    'status' => 'bot'
                ),
                array('%s', '%s', '%s', '%s')
            );
            return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE session_id = %s", $session_id));
        }
        
        return $session;
    }
    
    private function save_message($session_id, $sender, $message, $media_url = null, $intent = null) {
        global $wpdb;
        $table = $wpdb->prefix . 'chat_messages';
        
        $wpdb->insert(
            $table,
            array(
                'session_id' => $session_id,
                'sender' => $sender,
                'message' => $message,
                'media_url' => $media_url,
                'intent' => $intent
            ),
            array('%s', '%s', '%s', '%s', '%s')
        );
    }
    
    private function generate_response($intent_result, $is_business_hours, $session_id, $channel = 'web') {
        $intent = $intent_result['intent'];
        $confidence = $intent_result['confidence'];
        
        $handoff_reply = Agent_Handoff::get_handoff_reply_for_channel($channel);
        
        // Low confidence - escalate to agent if business hours
        if ($confidence < 0.5) {
            if ($is_business_hours) {
                $handoff = new Agent_Handoff();
                $handoff_result = $handoff->escalate($session_id);
                return array(
                    'reply' => $handoff_reply,
                    'type' => 'agent_transfer',
                    'conversation_sid' => $handoff_result['conversation_sid'] ?? null
                );
            } else {
                return array(
                    'reply' => 'I\'m sorry, I didn\'t quite understand that. Our office hours are Monday to Friday, 8:00 AM to 5:00 PM. Please try again during business hours or rephrase your question.',
                    'type' => 'bot'
                );
            }
        }
        
        // Handle specific intents
        switch ($intent) {
            case 'office_hours':
                $responder = new Office_Responder();
                return array(
                    'reply' => $responder->get_response(),
                    'type' => 'bot'
                );
                
            case 'location':
                $responder = new Office_Responder();
                return array(
                    'reply' => $responder->get_location(),
                    'type' => 'bot'
                );
                
            case 'loan_product_info':
                $responder = new Loan_Responder();
                return array(
                    'reply' => $responder->get_response(),
                    'type' => 'bot'
                );
                
            case 'faq_general':
                return array(
                    'reply' => $intent_result['answer'] ?? 'I can help you with FAQs, loan information, office hours, and location. What would you like to know?',
                    'type' => 'bot'
                );
                
            case 'human_agent':
                if ($is_business_hours) {
                    $handoff = new Agent_Handoff();
                    $handoff_result = $handoff->escalate($session_id);
                    return array(
                        'reply' => $handoff_reply,
                        'type' => 'agent_transfer',
                        'conversation_sid' => $handoff_result['conversation_sid'] ?? null
                    );
                } else {
                    return array(
                        'reply' => 'Our office hours are Monday to Friday, 8:00 AM to 5:00 PM. Please contact us during business hours for agent assistance.',
                        'type' => 'bot'
                    );
                }
                
            default:
                if ($is_business_hours) {
                    $handoff = new Agent_Handoff();
                    $handoff_result = $handoff->escalate($session_id);
                    return array(
                        'reply' => $handoff_reply,
                        'type' => 'agent_transfer',
                        'conversation_sid' => $handoff_result['conversation_sid'] ?? null
                    );
                } else {
                    return array(
                        'reply' => 'I\'m sorry, I couldn\'t find a specific answer. Our office hours are Monday to Friday, 8:00 AM to 5:00 PM. Please try again during business hours.',
                        'type' => 'bot'
                    );
                }
        }
    }
    
    private function send_twilio_response($to, $message) {
        $account_sid = env('TWILIO_ACCOUNT_SID');
        $auth_token = env('TWILIO_AUTH_TOKEN');
        $whatsapp_number = env('TWILIO_WHATSAPP_NUMBER');
        
        if (!$account_sid || !$auth_token || !$whatsapp_number) {
            error_log('Twilio credentials not configured');
            return false;
        }
        
        $client = new \Twilio\Rest\Client($account_sid, $auth_token);
        
        try {
            $client->messages->create(
                $to,
                array(
                    'from' => $whatsapp_number,
                    'body' => $message
                )
            );
            return true;
        } catch (\Exception $e) {
            error_log('Twilio error: ' . $e->getMessage());
            return false;
        }
    }
    
    private function get_whatsapp_link() {
        $whatsapp_number = env('TWILIO_WHATSAPP_NUMBER');
        if ($whatsapp_number) {
            $number = str_replace('whatsapp:', '', $whatsapp_number);
            return 'https://wa.me/' . preg_replace('/[^0-9]/', '', $number);
        }
        return '#';
    }
}
