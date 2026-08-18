<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', static function (): void {
    headless_core_register_rest_route('/nonce', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_nonce',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * @return array{nonce: string, turnstileEnabled: bool, turnstileSiteKey: string}
 */
function headless_core_form_bootstrap_payload(): array
{
    $turnstile = function_exists('headless_core_turnstile_public_config')
        ? headless_core_turnstile_public_config()
        : ['enabled' => false, 'siteKey' => ''];

    return [
        'nonce' => wp_create_nonce('wp_rest'),
        'turnstileEnabled' => ! empty($turnstile['enabled']),
        'turnstileSiteKey' => (string) ($turnstile['siteKey'] ?? ''),
    ];
}

/**
 * @return WP_REST_Response
 */
function headless_core_rest_nonce(): WP_REST_Response
{
    $response = new WP_REST_Response(headless_core_form_bootstrap_payload(), 200);

    // Nonces are per-session; Cloudflare/browser must never cache this.
    headless_core_rest_nocache_headers($response);

    return $response;
}

/**
 * Inject form bootstrap into the SPA HTML shell so clients can skip /nonce when CF blocks it.
 */
function headless_core_inject_form_bootstrap_script(string $html): string
{
    if ($html === '' || ! function_exists('wp_create_nonce')) {
        return $html;
    }

    $json = wp_json_encode(
        headless_core_form_bootstrap_payload(),
        JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
    );
    if (! is_string($json) || $json === '') {
        return $html;
    }

    $script = '<script>window.__HC_FORM_BOOTSTRAP__=' . $json . ';</script>';
    if (stripos($html, '</head>') !== false) {
        $replaced = preg_replace('/<\/head>/i', $script . '</head>', $html, 1);
        return is_string($replaced) ? $replaced : ($html . $script);
    }

    return $html . $script;
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
