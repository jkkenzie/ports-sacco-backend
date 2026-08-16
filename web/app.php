<?php

/**
 * SPA HTML entry with server-side SEO <head> injection.
 *
 * The React SPA shell (frontend/index.html) is served through this file so we
 * can inject route-specific SEO tags (title, meta, canonical, Open Graph,
 * Twitter, JSON-LD) into the <head> before sending it — making the page
 * crawlable by bots that do not run JavaScript.
 *
 * Routing: .htaccess sends the SPA catch-all here (see web/.htaccess.example).
 *
 * Safety: this file is intentionally defensive. If WordPress fails to load or
 * anything throws, a shutdown handler emits the untouched shell, so behaviour
 * degrades to exactly the current client-rendered SPA — it can never take the
 * site down.
 */

declare(strict_types=1);

$hcShellPath = __DIR__ . '/frontend/index.html';
$hcShell = @file_get_contents($hcShellPath);

if ($hcShell === false) {
    http_response_code(404);
    if (! headers_sent()) {
        header('Content-Type: text/html; charset=UTF-8');
    }
    echo '<!doctype html><html><head><title>Not found</title></head><body></body></html>';
    exit;
}

$hcSent = false;

// If we die before emitting (e.g. a WP bootstrap fatal), serve the raw shell.
register_shutdown_function(static function () use (&$hcSent, &$hcShell): void {
    if ($hcSent) {
        return;
    }
    if (! headers_sent()) {
        header('Content-Type: text/html; charset=UTF-8');
    }
    echo $hcShell;
});

try {
    if (! defined('WP_USE_THEMES')) {
        define('WP_USE_THEMES', false);
    }

    require __DIR__ . '/wp/wp-blog-header.php';

    $output = $hcShell;

    if (function_exists('headless_core_seo_render_shell')) {
        $path = function_exists('headless_core_seo_request_path')
            ? headless_core_seo_request_path()
            : (string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
        $rendered = headless_core_seo_render_shell($path, $hcShell);
        if (is_string($rendered) && $rendered !== '') {
            $output = $rendered;
        }
    }

    if (! headers_sent()) {
        header('Content-Type: text/html; charset=UTF-8');
        if (function_exists('headless_core_send_security_headers')) {
            headless_core_send_security_headers();
        }
    }

    $hcSent = true;
    echo $output;
} catch (\Throwable $e) {
    // The shutdown handler will emit the untouched shell.
    $hcSent = false;
}
