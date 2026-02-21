<?php

namespace ChatEngine;

use function Env\env;

class Agent_Handoff {
    
    public function escalate($session_id) {
        global $wpdb;
        
        // Update session status
        $sessions_table = $wpdb->prefix . 'chat_sessions';
        $session = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $sessions_table WHERE session_id = %s",
            $session_id
        ));
        
        if (!$session) {
            return array('success' => false);
        }
        
        // Create Twilio Conversation if WhatsApp channel
        $conversation_sid = null;
        if ($session->channel === 'whatsapp') {
            $conversation_sid = $this->create_twilio_conversation($session->user_identifier);
        }
        
        // Update session status
        $wpdb->update(
            $sessions_table,
            array(
                'status' => 'agent',
                'twilio_conversation_sid' => $conversation_sid
            ),
            array('session_id' => $session_id),
            array('%s', '%s'),
            array('%s')
        );
        
        // Log escalation
        $this->log_escalation($session_id);
        
        // In production, notify agent dashboard via webhook or database trigger
        $this->notify_agents($session_id);
        
        return array(
            'success' => true,
            'conversation_sid' => $conversation_sid
        );
    }
    
    private function create_twilio_conversation($user_identifier) {
        $account_sid = env('TWILIO_ACCOUNT_SID');
        $auth_token = env('TWILIO_AUTH_TOKEN');
        $conversations_service_sid = env('TWILIO_CONVERSATIONS_SERVICE_SID');
        
        if (!$account_sid || !$auth_token || !$conversations_service_sid) {
            error_log('Twilio Conversations not configured');
            return null;
        }
        
        try {
            $client = new \Twilio\Rest\Client($account_sid, $auth_token);
            
            $conversation = $client->conversations->v1->services($conversations_service_sid)
                ->conversations
                ->create(array(
                    'friendlyName' => 'Chat Support - ' . substr($user_identifier, -4)
                ));
            
            return $conversation->sid;
        } catch (\Exception $e) {
            error_log('Twilio Conversation creation error: ' . $e->getMessage());
            return null;
        }
    }
    
    private function log_escalation($session_id) {
        // Log to analytics table or file
        error_log("Agent escalation for session: {$session_id}");
    }
    
    private function notify_agents($session_id) {
        // In production, implement webhook to agent dashboard
        // or use WordPress hooks to trigger notifications
        do_action('chat_engine_agent_escalation', $session_id);
    }
    
    /**
     * Get the message to show when handing off to agent (e.g. for web chat where
     * there is no live agent in the same window yet). Includes configured message
     * plus contact options so the user is not stuck.
     */
    public static function get_handoff_reply_for_channel($channel) {
        $message = get_option('chat_engine_agent_handoff_message', "We've noted your request. For immediate assistance, please contact us:");
        $message = trim($message);
        
        if ($channel === 'web') {
            $lines = array();
            if (get_option('chat_engine_agent_show_whatsapp', true)) {
                $whatsapp_number = env('TWILIO_WHATSAPP_NUMBER');
                if ($whatsapp_number) {
                    $num = preg_replace('/[^0-9]/', '', str_replace('whatsapp:', '', $whatsapp_number));
                    $wa_url = 'https://wa.me/' . $num;
                    $lines[] = 'WhatsApp: ' . $wa_url;
                }
            }
            if (get_option('chat_engine_agent_show_phone', true)) {
                $phone = get_option('chat_engine_office_phone', '');
                if ($phone) {
                    // Clean phone for tel: link (remove spaces, dashes, keep + and digits)
                    $phone_clean = preg_replace('/[^\d+]/', '', $phone);
                    // Format: Phone: +1234567890 (tel:+1234567890)
                    // Frontend will detect (tel:...) and make the phone number clickable
                    $lines[] = 'Phone: ' . $phone . ' (tel:' . $phone_clean . ')';
                }
            }
            if (get_option('chat_engine_agent_show_email', true)) {
                $email = get_option('chat_engine_office_email', '');
                if ($email) {
                    // Format: Email: test@example.com (mailto:test@example.com)
                    // Frontend will detect (mailto:...) and make the email clickable
                    $lines[] = 'Email: ' . $email . ' (mailto:' . $email . ')';
                }
            }
            if (!empty($lines)) {
                $message .= "\n\n" . implode("\n", $lines);
            }
        }
        
        return apply_filters('chat_engine_agent_handoff_reply', $message, $channel);
    }
}
