<?php
/**
 * Plugin Name: CORS Headers
 * Description: Enable CORS for React frontend
 */

add_action('init', function() {
    // For development
    $allowed_origin = '*';
    
    // For production, use specific domain:
    $allowed_origin = 'https://portsacco.iyisolutions.com/';
    
    header('Access-Control-Allow-Origin: ' . $allowed_origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
});