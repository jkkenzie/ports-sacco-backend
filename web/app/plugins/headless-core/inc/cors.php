<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Allowed browser Origin for headless REST (Access-Control-Allow-Origin).
 *
 * CORS is enforced by the browser on WordPress responses — React cannot set this.
 * Set HEADLESS_CORS_ORIGIN in the root .env (Bedrock) when the frontend and API
 * are on different origins (e.g. Vite on :3000, or a CDN separate from WP).
 *
 * When unset, same-origin requests (e.g. /frontend + /wp-json on one host) need
 * no CORS headers. Local dev with Vite proxying /wp-json also needs no CORS.
 *
 * @see web/frontend/.env.example — VITE_* vars for the React app only
 */
function headless_core_get_cors_origin(): string
{
    $explicit = getenv('HEADLESS_CORS_ORIGIN');
    if (is_string($explicit) && $explicit !== '') {
        return rtrim($explicit, '/');
    }

    // Optional alias: same value you use for VITE_PUBLIC_URL in frontend/.env
    $frontend = getenv('HEADLESS_FRONTEND_URL');
    if (is_string($frontend) && $frontend !== '') {
        return rtrim($frontend, '/');
    }

    return '';
}

/**
 * Apply CORS headers for custom REST routes when an origin is configured.
 */
function headless_core_maybe_send_cors_headers(WP_REST_Request $request, string $routePrefix = '/custom/v1/'): void
{
    $origin = headless_core_get_cors_origin();

    if ($origin === '' && defined('WP_ENV') && WP_ENV === 'development') {
        $requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';
        if (
            $requestOrigin !== ''
            && preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#i', $requestOrigin)
        ) {
            $origin = $requestOrigin;
        }
    }

    if ($origin === '') {
        return;
    }

    $route = (string) $request->get_route();
    if (strpos($route, $routePrefix) !== 0) {
        return;
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept, X-WP-Nonce');
    header('Access-Control-Allow-Credentials: true');
}
