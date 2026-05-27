<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Allow SVG uploads for the media library (stat icons, inline SVG in REST).
 * Only users who can upload files get the extra mime types.
 *
 * @param array<string, string> $mimes
 * @return array<string, string>
 */
add_filter('upload_mimes', static function (array $mimes): array {
    if (! current_user_can('upload_files')) {
        return $mimes;
    }
    $mimes['svg'] = 'image/svg+xml';
    $mimes['svgz'] = 'image/svg+xml';

    return $mimes;
}, 10, 1);

/**
 * WordPress may strip SVG on upload; ensure filetype matches for allowed SVGs.
 *
 * @param array{type?: string, ext?: string, ...}|mixed $data
 * @param array<string, string> $mimes
 * @return array{type?: string, ext?: string, ...}|mixed
 */
add_filter('wp_check_filetype_and_ext', static function ($data, $file, $filename, $mimes) {
    if (! is_array($data)) {
        $data = [];
    }
    if (! current_user_can('upload_files')) {
        return $data;
    }
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    if ($ext === 'svg' || $ext === 'svgz') {
        $data['ext'] = $ext === 'svgz' ? 'svgz' : 'svg';
        $data['type'] = 'image/svg+xml';
    }

    return $data;
}, 10, 4);
