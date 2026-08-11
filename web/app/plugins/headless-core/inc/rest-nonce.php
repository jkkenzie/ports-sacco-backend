<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', static function (): void {
    register_rest_route('custom/v1', '/nonce', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_nonce',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * @return WP_REST_Response
 */
function headless_core_rest_nonce(): WP_REST_Response
{
    $turnstile = headless_core_turnstile_public_config();

    $response = new WP_REST_Response([
        'nonce' => wp_create_nonce('wp_rest'),
        'turnstileEnabled' => ! empty($turnstile['enabled']),
        'turnstileSiteKey' => (string) ($turnstile['siteKey'] ?? ''),
    ], 200);

    // Nonces are per-session; Cloudflare/browser must never cache this.
    headless_core_rest_nocache_headers($response);

    return $response;
}

/**
 * Verify wp_rest nonce for public form POST endpoints.
 *
 * @return true|WP_Error
 */
function headless_core_rest_verify_nonce_permission(WP_REST_Request $request)
{
    $nonce = $request->get_header('X-WP-Nonce');
    if (! is_string($nonce) || $nonce === '') {
        $nonce = (string) $request->get_param('_wpnonce');
    }

    if ($nonce === '' || ! wp_verify_nonce($nonce, 'wp_rest')) {
        return new WP_Error(
            'rest_cookie_invalid_nonce',
            __('Invalid or missing nonce.', 'headless-core'),
            ['status' => 403]
        );
    }

    return true;
}
