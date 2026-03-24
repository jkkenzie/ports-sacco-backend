<?php

declare(strict_types=1);

/**
 * Normalize attachment URLs during WordPress WXR import so wp_safe_remote_get() receives valid absolute URLs.
 *
 * Common export issues: relative paths, Bedrock-style uploads paths, empty attachment_url with a ?p= guid,
 * or protocol-relative URLs. The core importer only prepends base_url when the path starts with a single "/".
 */

if (! defined('ABSPATH')) {
    exit;
}

add_filter('wp_import_post_data_raw', 'headless_core_wxr_import_normalize_attachment_post', 5);

/**
 * @param array<string, mixed> $post
 * @return array<string, mixed>
 */
function headless_core_wxr_import_normalize_attachment_post(array $post): array
{
    if (($post['post_type'] ?? '') !== 'attachment') {
        return $post;
    }

    $base = headless_core_wxr_import_get_export_base_url();
    $base = rtrim($base, '/');

    $rawAttachment = isset($post['attachment_url']) ? trim((string) $post['attachment_url']) : '';
    $rawGuid = isset($post['guid']) ? trim((string) $post['guid']) : '';

    $rawAttachment = html_entity_decode($rawAttachment, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $rawGuid = html_entity_decode($rawGuid, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    $attachedFile = headless_core_wxr_import_get_attached_file_from_postmeta($post);

    $candidates = [];

    if ($rawAttachment !== '') {
        $candidates[] = $rawAttachment;
    }

    if ($attachedFile !== '' && $base !== '') {
        $file = ltrim($attachedFile, '/');
        $candidates[] = $base . '/wp-content/uploads/' . $file;
        $candidates[] = $base . '/app/uploads/' . $file;
    }

    if ($rawGuid !== '') {
        $candidates[] = $rawGuid;
    }

    $resolved = '';
    foreach ($candidates as $candidate) {
        $absolute = headless_core_wxr_import_resolve_to_absolute_url($candidate, $base);
        if ($absolute !== '' && headless_core_wxr_import_is_http_url($absolute)) {
            $resolved = $absolute;
            break;
        }
    }

    if ($resolved !== '') {
        $post['attachment_url'] = $resolved;
        if (empty($post['guid']) || ! headless_core_wxr_import_is_http_url((string) $post['guid'])) {
            $post['guid'] = $resolved;
        }
    }

    return apply_filters('headless_core_wxr_attachment_import_post', $post, $resolved, $base);
}

function headless_core_wxr_import_get_export_base_url(): string
{
    global $wp_import;

    if (isset($wp_import) && is_object($wp_import) && isset($wp_import->base_url)) {
        $url = trim((string) $wp_import->base_url);
        if ($url !== '') {
            return $url;
        }
    }

    return rtrim(home_url(), '/');
}

/**
 * @param array<string, mixed> $post
 */
function headless_core_wxr_import_get_attached_file_from_postmeta(array $post): string
{
    if (empty($post['postmeta']) || ! is_array($post['postmeta'])) {
        return '';
    }

    foreach ($post['postmeta'] as $meta) {
        if (! is_array($meta)) {
            continue;
        }
        if (($meta['key'] ?? '') === '_wp_attached_file' && isset($meta['value'])) {
            return trim((string) $meta['value']);
        }
    }

    return '';
}

function headless_core_wxr_import_resolve_to_absolute_url(string $url, string $base): string
{
    $url = trim($url);
    if ($url === '' || $url === '#') {
        return '';
    }

    if (preg_match('#^https?://#i', $url)) {
        return $url;
    }

    if (strpos($url, '//') === 0) {
        return 'https:' . $url;
    }

    if ($base === '') {
        return '';
    }

    if (isset($url[0]) && $url[0] === '/') {
        return $base . $url;
    }

    if (preg_match('#^(wp-content/uploads/|app/uploads/)#i', $url)) {
        return $base . '/' . ltrim($url, '/');
    }

    if (preg_match('#^\d{4}/\d{2}/#', $url)) {
        return $base . '/wp-content/uploads/' . ltrim($url, '/');
    }

    return '';
}

function headless_core_wxr_import_is_http_url(string $url): bool
{
    if ($url === '' || ! preg_match('#^https?://#i', $url)) {
        return false;
    }

    if (function_exists('wp_http_validate_url')) {
        return (bool) wp_http_validate_url($url);
    }

    return (bool) filter_var($url, FILTER_VALIDATE_URL);
}
