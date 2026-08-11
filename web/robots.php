<?php

/**
 * Headless robots.txt entry point (physical file — bypasses the React SPA fallback).
 *
 * Optional Apache alias (see web/.htaccess.example):
 *   /robots.txt → this file
 */

declare(strict_types=1);

define('WP_USE_THEMES', false);

require __DIR__ . '/wp/wp-blog-header.php';

$public = (bool) get_option('blog_public');
$output = '';

if (function_exists('headless_core_robots_txt_content')) {
    $output = headless_core_robots_txt_content($public);
} else {
    $output = apply_filters('robots_txt', '', $public);
}

status_header(200);
header('Content-Type: text/plain; charset=UTF-8');
header('X-Robots-Tag: noindex', true);
echo $output;
