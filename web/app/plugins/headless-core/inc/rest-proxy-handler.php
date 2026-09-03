<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * @param string $route REST route beginning with /
 */
function headless_core_rest_proxy_route_allowed(string $route): bool
{
    if ($route === '/' || $route === '') {
        return true;
    }

    return (bool) preg_match('#^/(wp/v2|batch/v1)(/|$)#', $route);
}

/**
 * Resolve /wp/v2/... from ?rest_route=, PATH_INFO, or /hc-wp-api.php/...
 */
function headless_core_rest_proxy_route_from_request(): string
{
    $fromQuery = isset($_GET['rest_route']) ? (string) $_GET['rest_route'] : '';
    if ($fromQuery !== '') {
        return '/' . ltrim($fromQuery, '/');
    }

    $pathInfo = (string) ($_SERVER['PATH_INFO'] ?? '');
    if ($pathInfo !== '') {
        return '/' . ltrim($pathInfo, '/');
    }

    $uri = (string) ($_SERVER['REQUEST_URI'] ?? '');
    $path = (string) (parse_url($uri, PHP_URL_PATH) ?: '');
    $marker = 'hc-wp-api.php';
    $pos = strpos($path, $marker);
    if ($pos !== false) {
        $after = substr($path, $pos + strlen($marker));

        return '/' . ltrim($after, '/');
    }

    return '/';
}

/**
 * @return never
 */
function headless_core_rest_proxy_json_exit(int $status, array $payload): void
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

function headless_core_rest_proxy_request_method(): string
{
    $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

    $override = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? '';
    if (is_string($override) && $override !== '') {
        $method = strtoupper($override);
    }

    return $method;
}

/**
 * Execute an allowlisted core REST request and emit JSON (wp-admin Gutenberg only).
 *
 * @return never
 */
function headless_core_rest_proxy_run(): void
{
    if (! function_exists('rest_do_request') || ! class_exists('WP_REST_Request')) {
        headless_core_rest_proxy_json_exit(503, [
            'code' => 'hc_wp_rest_unavailable',
            'message' => 'REST API unavailable.',
            'data' => ['status' => 503],
        ]);
    }

    $route = headless_core_rest_proxy_route_from_request();

    if (! headless_core_rest_proxy_route_allowed($route)) {
        headless_core_rest_proxy_json_exit(404, [
            'code' => 'hc_wp_route_not_allowed',
            'message' => 'Route not available via this endpoint.',
            'data' => ['status' => 404],
        ]);
    }

    $method = headless_core_rest_proxy_request_method();
    if ($method === 'OPTIONS') {
        if (! headers_sent()) {
            status_header(204);
            header('Cache-Control: private, no-store, no-cache, must-revalidate, max-age=0');
            header('CDN-Cache-Control: no-store');
            header('Cloudflare-CDN-Cache-Control: no-store');
        }
        exit;
    }

    if (! is_user_logged_in()) {
        headless_core_rest_proxy_json_exit(401, [
            'code' => 'hc_wp_rest_auth_required',
            'message' => 'Authentication required.',
            'data' => ['status' => 401],
        ]);
    }

    $request = new WP_REST_Request($method, $route);

    foreach ($_GET as $key => $value) {
        if ($key === 'rest_route' || $key === 'action') {
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

    headless_core_rest_proxy_json_exit($status > 0 ? $status : 200, is_array($data) ? $data : ['data' => $data]);
}

function headless_core_ajax_rest_proxy_handler(): void
{
    headless_core_rest_proxy_run();
}
