<?php

/**
 * WordPress core REST proxy outside /wp-json (Gutenberg / wp-admin editor saves).
 *
 * Cloudflare WAF rules often match URI paths containing "wp-json" and return HTML 403,
 * which surfaces in the block editor as "The response is not a valid JSON response."
 * Heavy product archive pages and CPT items (services, loans, savings) are blocked more
 * often because POST bodies are larger or trip body-inspection rules.
 *
 * Usage: /hc-wp-api.php?rest_route=/wp/v2/pages/211&_locale=user
 */

declare(strict_types=1);

define('WP_USE_THEMES', false);

require __DIR__ . '/wp/wp-load.php';

/**
 * @param string $route REST route beginning with /
 */
function hc_wp_api_route_allowed(string $route): bool
{
    if ($route === '/' || $route === '') {
        return true;
    }

    return (bool) preg_match('#^/wp/v2/#', $route);
}

/**
 * @return never
 */
function hc_wp_api_json_exit(int $status, array $payload): void
{
    if (! headers_sent()) {
        status_header($status);
        header('Content-Type: application/json; charset=UTF-8');
        header('Cache-Control: private, no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('CDN-Cache-Control: no-store');
        header('Cloudflare-CDN-Cache-Control: no-store');
        if (function_exists('headless_core_send_security_headers')) {
            headless_core_send_security_headers();
        }
    }

    echo wp_json_encode($payload);
    exit;
}

if (! function_exists('rest_do_request') || ! class_exists('WP_REST_Request')) {
    hc_wp_api_json_exit(503, [
        'code' => 'hc_wp_rest_unavailable',
        'message' => 'REST API unavailable.',
        'data' => ['status' => 503],
    ]);
}

$routeRaw = isset($_GET['rest_route']) ? (string) $_GET['rest_route'] : '';
$route = '/' . ltrim($routeRaw, '/');

if (! hc_wp_api_route_allowed($route)) {
    hc_wp_api_json_exit(404, [
        'code' => 'hc_wp_route_not_allowed',
        'message' => 'Route not available via this endpoint.',
        'data' => ['status' => 404],
    ]);
}

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'OPTIONS') {
    if (! headers_sent()) {
        status_header(204);
        header('Cache-Control: private, no-store, no-cache, must-revalidate, max-age=0');
        header('CDN-Cache-Control: no-store');
        header('Cloudflare-CDN-Cache-Control: no-store');
    }
    exit;
}

if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true) && ! is_user_logged_in()) {
    hc_wp_api_json_exit(401, [
        'code' => 'hc_wp_rest_auth_required',
        'message' => 'Authentication required.',
        'data' => ['status' => 401],
    ]);
}

$request = new WP_REST_Request($method, $route);

foreach ($_GET as $key => $value) {
    if ($key === 'rest_route') {
        continue;
    }
    if (is_array($value)) {
        continue;
    }
    $request->set_param((string) $key, $value);
}

$contentType = (string) ($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '');
$rawBody = file_get_contents('php://input');
if (is_string($rawBody) && $rawBody !== '') {
    $request->set_body($rawBody);
    if (stripos($contentType, 'application/json') !== false) {
        $decoded = json_decode($rawBody, true);
        if (is_array($decoded)) {
            $request->set_body_params($decoded);
        }
        $request->set_header('Content-Type', 'application/json');
    }
} elseif (! empty($_POST) && is_array($_POST)) {
    $request->set_body_params($_POST);
}

$nonceHeader = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
if (is_string($nonceHeader) && $nonceHeader !== '') {
    $request->set_header('X-WP-Nonce', $nonceHeader);
}

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
if (is_string($authHeader) && $authHeader !== '') {
    $request->set_header('Authorization', $authHeader);
}

$response = rest_do_request($request);
$server = rest_get_server();
$data = $server->response_to_data($response, false);
$status = (int) $response->get_status();

hc_wp_api_json_exit($status > 0 ? $status : 200, is_array($data) ? $data : ['data' => $data]);
