<?php

/**
 * Headless sitemap entry point (physical file — bypasses the React SPA fallback).
 *
 * URLs:
 *   /sitemap.php              → sitemap index
 *   /sitemap.php?type=page    → pages sitemap
 *
 * Optional Apache aliases (see web/.htaccess.example):
 *   /sitemap.xml              → this file
 *   /sitemap-{type}.xml       → this file?type={type}
 */

declare(strict_types=1);

define('WP_USE_THEMES', false);

require __DIR__ . '/wp/wp-blog-header.php';

$type = 'index';

if (isset($_GET['type']) && is_string($_GET['type']) && $_GET['type'] !== '') {
    $type = sanitize_key($_GET['type']);
}

if (! function_exists('headless_core_sitemap_render')) {
    status_header(503);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Sitemap unavailable (Headless Core plugin not loaded).';
    exit;
}

$subLoc = $type === 'index' && function_exists('headless_core_sitemap_php_sub_loc')
    ? 'headless_core_sitemap_php_sub_loc'
    : null;

headless_core_sitemap_render($type, $subLoc);
