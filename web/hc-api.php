<?php

/**
 * Headless form REST proxy outside /wp-json.
 *
 * Proxies only allowlisted custom/v1 (and portsacco/v1) form routes so
 * Cloudflare rules that match URI Path containing "wp-json" do not block
 * contact, membership, newsletter, or comment submissions.
 *
 * Usage: /hc-api.php?rest_route=/custom/v1/contact
 */

declare(strict_types=1);

define('WP_USE_THEMES', false);

require __DIR__ . '/wp/wp-load.php';

/**
 * @param string $route
 */
function hc_api_route_allowed(string $route): bool
{
    if (preg_match('#^/(custom|portsacco)/v1/(nonce|contact|submit-form|newsletter-subscribe)(/|$)#', $route)) {
        return true;
    }

    return (bool) preg_match('#^/(custom|portsacco)/v1/news/[a-z0-9\-_]+/comments$#', $route);
}

/**
 * @return never
 */
function hc_api_json_exit(int $status, array $payload): void
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
    hc_api_json_exit(503, [
        'code' => 'hc_rest_unavailable',
        'message' => 'REST API unavailable.',
        'data' => ['status' => 503],
    ]);
}

$routeRaw = isset($_GET['rest_route']) ? (string) $_GET['rest_route'] : '';
$route = '/' . ltrim($routeRaw, '/');

if ($route === '/' || ! hc_api_route_allowed($route)) {
    hc_api_json_exit(404, [
        'code' => 'hc_route_not_allowed',
        'message' => 'Route not available via this endpoint.',
        'data' => ['status' => 404],
    ]);
}

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'OPTIONS') {
    hc_api_json_exit(204, []);
}

$request = new WP_REST_Request($method, $route);

foreach ($_GET as $key => $value) {
    if ($key === 'rest_route') {
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

$response = rest_do_request($request);
$server = rest_get_server();
$data = $server->response_to_data($response, false);
$status = (int) $response->get_status();

hc_api_json_exit($status > 0 ? $status : 200, is_array($data) ? $data : ['data' => $data]);
