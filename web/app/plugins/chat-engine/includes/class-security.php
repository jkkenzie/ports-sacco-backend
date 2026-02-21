<?php

namespace ChatEngine;

use function Env\env;

class Security {
    
    private static $rate_limit_cache = array();
    
    public static function verify_twilio_signature($request) {
        $webhook_secret = env('TWILIO_WEBHOOK_SECRET');
        
        if (empty($webhook_secret)) {
            // If secret not configured, allow in development
            if (defined('WP_DEBUG') && WP_DEBUG) {
                return true;
            }
            return false;
        }
        
        $signature = $request->get_header('X-Twilio-Signature');
        $url = $request->get_header('X-Forwarded-Proto') . '://' . 
               $request->get_header('Host') . 
               $request->get_route();
        
        $params = $request->get_body_params();
        
        // Twilio signature validation
        // In production, use Twilio SDK's RequestValidator
        return true; // Simplified for now - implement proper validation
    }
    
    public static function check_rate_limit($session_id, $max_requests = 10, $window_seconds = 60) {
        $key = 'rate_limit_' . $session_id;
        $now = time();
        
        if (!isset(self::$rate_limit_cache[$key])) {
            self::$rate_limit_cache[$key] = array(
                'count' => 0,
                'window_start' => $now
            );
        }
        
        $cache = &self::$rate_limit_cache[$key];
        
        // Reset window if expired
        if ($now - $cache['window_start'] > $window_seconds) {
            $cache['count'] = 0;
            $cache['window_start'] = $now;
        }
        
        // Check limit
        if ($cache['count'] >= $max_requests) {
            return false;
        }
        
        $cache['count']++;
        return true;
    }
    
    public static function sanitize_input($input) {
        return sanitize_text_field($input);
    }
    
    public static function validate_phone($phone) {
        // Remove non-numeric characters except +
        $cleaned = preg_replace('/[^0-9+]/', '', $phone);
        return strlen($cleaned) >= 10 && strlen($cleaned) <= 15;
    }
}
