<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const HEADLESS_CORE_OPTION_TURNSTILE_ENABLED = 'headless_core_turnstile_enabled';
const HEADLESS_CORE_OPTION_TURNSTILE_SITE_KEY = 'headless_core_turnstile_site_key';
const HEADLESS_CORE_OPTION_TURNSTILE_SECRET = 'headless_core_turnstile_secret';

/**
 * Site key (public). Env overrides WP option.
 */
function headless_core_get_turnstile_site_key(): string
{
    $fromEnv = getenv('HEADLESS_TURNSTILE_SITE_KEY');
    if (is_string($fromEnv) && trim($fromEnv) !== '') {
        return trim($fromEnv);
    }

    return trim((string) get_option(HEADLESS_CORE_OPTION_TURNSTILE_SITE_KEY, ''));
}

/**
 * Secret key (server-only). Env overrides WP option.
 */
function headless_core_get_turnstile_secret(): string
{
    $fromEnv = getenv('HEADLESS_TURNSTILE_SECRET');
    if (is_string($fromEnv) && trim($fromEnv) !== '') {
        return trim($fromEnv);
    }

    return trim((string) get_option(HEADLESS_CORE_OPTION_TURNSTILE_SECRET, ''));
}

/**
 * Turnstile is active only when explicitly enabled and both keys are present.
 */
function headless_core_turnstile_is_enabled(): bool
{
    $fromEnv = getenv('HEADLESS_TURNSTILE_ENABLED');
    if (is_string($fromEnv) && $fromEnv !== '') {
        $enabled = in_array(strtolower(trim($fromEnv)), ['1', 'true', 'yes', 'on'], true);
    } else {
        $enabled = get_option(HEADLESS_CORE_OPTION_TURNSTILE_ENABLED, '0') === '1';
    }

    if (! $enabled) {
        return false;
    }

    return headless_core_get_turnstile_site_key() !== '' && headless_core_get_turnstile_secret() !== '';
}

/**
 * Public bootstrap payload for the React SPA.
 *
 * @return array{enabled: bool, siteKey: string}
 */
function headless_core_turnstile_public_config(): array
{
    $enabled = headless_core_turnstile_is_enabled();

    return [
        'enabled' => $enabled,
        'siteKey' => $enabled ? headless_core_get_turnstile_site_key() : '',
    ];
}

/**
 * Verify Turnstile when enabled; no-op (true) when disabled.
 *
 * @return true|WP_Error
 */
function headless_core_verify_turnstile_from_request(WP_REST_Request $request)
{
    if (! headless_core_turnstile_is_enabled()) {
        return true;
    }

    $token = trim((string) $request->get_param('turnstileToken'));
    if ($token === '') {
        $token = trim((string) $request->get_param('cf-turnstile-response'));
    }
    if ($token === '') {
        return new WP_Error(
            'headless_turnstile_required',
            __('Verification failed. Please try again.', 'headless-core'),
            ['status' => 403]
        );
    }

    $secret = headless_core_get_turnstile_secret();
    if ($secret === '') {
        return new WP_Error(
            'headless_turnstile_misconfigured',
            __('Verification is not configured.', 'headless-core'),
            ['status' => 500]
        );
    }

    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    $body = [
        'secret' => $secret,
        'response' => $token,
    ];
    if ($ip !== '') {
        $body['remoteip'] = $ip;
    }

    $verify = wp_remote_post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
        'timeout' => 8,
        'headers' => ['Content-Type' => 'application/x-www-form-urlencoded'],
        'body' => $body,
    ]);

    if (is_wp_error($verify)) {
        return new WP_Error(
            'headless_turnstile_unavailable',
            __('Verification failed. Please try again.', 'headless-core'),
            ['status' => 503]
        );
    }

    $raw = wp_remote_retrieve_body($verify);
    $payload = is_string($raw) && $raw !== '' ? json_decode($raw, true) : null;
    if (! is_array($payload) || empty($payload['success'])) {
        return new WP_Error(
            'headless_turnstile_failed',
            __('Verification failed. Please try again.', 'headless-core'),
            ['status' => 403]
        );
    }

    return true;
}
