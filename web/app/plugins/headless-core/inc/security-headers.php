<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Whether the current request is over HTTPS (incl. Cloudflare / reverse proxy).
 */
function headless_core_request_is_https(): bool
{
    if (! empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
        return true;
    }

    $forwarded = isset($_SERVER['HTTP_X_FORWARDED_PROTO'])
        ? strtolower((string) $_SERVER['HTTP_X_FORWARDED_PROTO'])
        : '';
    if ($forwarded === 'https') {
        return true;
    }

    if (isset($_SERVER['HTTP_CF_VISITOR'])) {
        $visitor = json_decode((string) $_SERVER['HTTP_CF_VISITOR'], true);
        if (is_array($visitor) && ($visitor['scheme'] ?? '') === 'https') {
            return true;
        }
    }

    if (function_exists('home_url')) {
        return str_starts_with((string) home_url('/'), 'https://');
    }

    return false;
}

/**
 * Baseline security headers (compensating controls for Cloudflare WAF exemptions).
 *
 * @return array<string, string>
 */
function headless_core_security_header_map(): array
{
    $headers = [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'SAMEORIGIN',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
        'Permissions-Policy' => 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
        'Cross-Origin-Opener-Policy' => 'same-origin-allow-popups',
        'X-DNS-Prefetch-Control' => 'off',
    ];

    if (headless_core_request_is_https()) {
        $headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    /**
     * Optional CSP. Off by default — enable via env once vetted against Turnstile / YouTube / admin.
     * Example:
     * HEADLESS_CONTENT_SECURITY_POLICY=default-src 'self'; img-src 'self' data: https:; script-src 'self' https://challenges.cloudflare.com; ...
     */
    $csp = getenv('HEADLESS_CONTENT_SECURITY_POLICY');
    if (is_string($csp) && trim($csp) !== '') {
        $headers['Content-Security-Policy'] = trim($csp);
    }

    $cspReport = getenv('HEADLESS_CONTENT_SECURITY_POLICY_REPORT_ONLY');
    if (is_string($cspReport) && trim($cspReport) !== '') {
        $headers['Content-Security-Policy-Report-Only'] = trim($cspReport);
    }

    return $headers;
}

/**
 * Emit security headers if not already sent.
 */
function headless_core_send_security_headers(): void
{
    if (headers_sent()) {
        return;
    }

    foreach (headless_core_security_header_map() as $name => $value) {
        header($name . ': ' . $value, false);
    }
}

add_action('send_headers', 'headless_core_send_security_headers', 0);
add_action('login_init', 'headless_core_send_security_headers', 0);
add_action('admin_init', 'headless_core_send_security_headers', 0);

add_filter('rest_post_dispatch', static function ($response) {
    if (! $response instanceof WP_REST_Response && ! $response instanceof WP_HTTP_Response) {
        return $response;
    }

    foreach (headless_core_security_header_map() as $name => $value) {
        $response->header($name, $value, false);
    }

    return $response;
}, 5);
