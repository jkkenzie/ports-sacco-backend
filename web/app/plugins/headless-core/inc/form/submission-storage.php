<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

require_once HEADLESS_CORE_PATH . 'inc/form/form-spec.php';

const PORTS_FORM_META_SNAPSHOT = '_ports_submission_snapshot';

/**
 * @param list<array{id: int, name: string, url: string, mime: string}> $fromSnapshot
 * @return list<array{id: int, name: string, url: string, mime: string}>
 */
function ports_form_collect_submission_files(int $postId, string $fieldId, array $fromSnapshot = []): array
{
    if ($fromSnapshot !== []) {
        return $fromSnapshot;
    }

    $files = [];
    $attachMeta = (string) get_post_meta($postId, 'field_' . $fieldId . '_attachments', true);
    if ($attachMeta !== '') {
        foreach (explode(',', $attachMeta) as $rawId) {
            $attachId = (int) trim($rawId);
            if ($attachId <= 0) {
                continue;
            }
            $file = ports_form_attachment_to_file_array($attachId);
            if ($file !== null) {
                $files[] = $file;
            }
        }
    }

    if ($files !== []) {
        return $files;
    }

    $metaValue = trim((string) get_post_meta($postId, 'field_' . $fieldId, true));
    if ($metaValue === '') {
        return [];
    }

    $candidates = preg_split('/\s*[\n,]\s*/', $metaValue) ?: [];
    foreach ($candidates as $candidate) {
        $candidate = trim($candidate);
        if ($candidate === '' || ! filter_var($candidate, FILTER_VALIDATE_URL)) {
            continue;
        }
        $files[] = [
            'id' => 0,
            'name' => basename(wp_parse_url($candidate, PHP_URL_PATH) ?: 'file'),
            'url' => esc_url_raw($candidate),
            'mime' => '',
        ];
    }

    return $files;
}

/**
 * @return array{id: int, name: string, url: string, mime: string}|null
 */
function ports_form_attachment_to_file_array(int $attachmentId): ?array
{
    if ($attachmentId <= 0) {
        return null;
    }

    $url = wp_get_attachment_url($attachmentId);
    if (! is_string($url) || $url === '') {
        return null;
    }

    $path = get_attached_file($attachmentId);
    $name = is_string($path) && $path !== '' ? basename($path) : get_the_title($attachmentId);
    if ($name === '') {
        $name = 'file';
    }

    return [
        'id' => $attachmentId,
        'name' => $name,
        'url' => esc_url_raw($url),
        'mime' => (string) (get_post_mime_type($attachmentId) ?: ''),
    ];
}

/**
 * @param mixed $file
 * @return array{id: int, name: string, url: string, mime: string}|null
 */
function ports_form_store_uploaded_file_as_attachment($file, int $parentPostId): ?array
{
    if (! is_array($file)) {
        return null;
    }

    $name = sanitize_file_name((string) ($file['name'] ?? 'upload.bin'));
    $data = (string) ($file['data'] ?? '');
    if ($data === '') {
        return null;
    }

    if (str_contains($data, ',')) {
        $data = substr($data, (int) strpos($data, ',') + 1);
    }

    $decoded = base64_decode($data, true);
    if ($decoded === false) {
        return null;
    }

    $upload = wp_upload_bits($name, null, $decoded);
    if (! empty($upload['error'])) {
        error_log('[FORM_MAILER_ERROR] Upload failed: ' . $upload['error']);

        return null;
    }

    $filePath = (string) ($upload['file'] ?? '');
    $fileUrl = (string) ($upload['url'] ?? '');
    if ($filePath === '' || $fileUrl === '') {
        return null;
    }

    $fileType = wp_check_filetype($name, null);
    $attachmentId = wp_insert_attachment([
        'post_mime_type' => (string) ($fileType['type'] ?? 'application/octet-stream'),
        'post_title' => preg_replace('/\.[^.]+$/', '', $name) ?: $name,
        'post_content' => '',
        'post_status' => 'inherit',
        'post_parent' => $parentPostId,
    ], $filePath, $parentPostId);

    if (is_wp_error($attachmentId) || ! $attachmentId) {
        return null;
    }

    require_once ABSPATH . 'wp-admin/includes/image.php';
    $metadata = wp_generate_attachment_metadata((int) $attachmentId, $filePath);
    if (is_array($metadata)) {
        wp_update_attachment_metadata((int) $attachmentId, $metadata);
    }

    return [
        'id' => (int) $attachmentId,
        'name' => $name,
        'url' => esc_url_raw($fileUrl),
        'mime' => (string) ($fileType['type'] ?? 'application/octet-stream'),
    ];
}

/**
 * @param array<string, mixed> $values
 * @return array<string, mixed>
 */
function ports_form_process_file_fields_for_post(string $slug, array $values, int $postId): array
{
    foreach (ports_form_get_input_fields($slug) as $field) {
        if (($field['type'] ?? '') !== 'file-upload') {
            continue;
        }
        if (! ports_form_field_is_visible($field, $values)) {
            continue;
        }

        $key = 'field_' . ($field['id'] ?? '');
        if (! isset($values[$key])) {
            continue;
        }

        $raw = $values[$key];
        if (is_string($raw) && $raw !== '' && filter_var($raw, FILTER_VALIDATE_URL)) {
            continue;
        }

        $files = is_array($raw) ? $raw : [$raw];
        $stored = [];
        foreach ($files as $file) {
            $attachment = ports_form_store_uploaded_file_as_attachment($file, $postId);
            if ($attachment !== null) {
                $stored[] = $attachment;
            }
        }

        $values[$key] = $stored;
    }

    return $values;
}

/**
 * @param array<string, mixed> $values
 * @param array<string, string> $meta
 * @return array<string, mixed>
 */
function ports_form_build_structured_snapshot(string $slug, array $values, array $meta, int $postId = 0): array
{
    $sections = [];
    $currentSection = [
        'label' => __('General', 'headless-core'),
        'fields' => [],
    ];
    $flatRows = [];

    foreach (ports_form_get_ordered_fields($slug) as $field) {
        $type = (string) ($field['type'] ?? '');
        $id = (string) ($field['id']);
        $label = ports_form_field_label($field);

        if ($type === 'divider') {
            if ($currentSection['fields'] !== []) {
                $sections[] = $currentSection;
            }
            $currentSection = [
                'label' => $label !== '' ? $label : __('Section', 'headless-core'),
                'fields' => [],
            ];
            continue;
        }

        if (! ports_form_field_is_visible($field, $values)) {
            continue;
        }

        $entry = [
            'field_id' => $id,
            'type' => $type,
            'label' => $label,
            'value' => '',
            'excel_value' => '',
            'files' => [],
        ];

        if ($type === 'name' && ($field['format'] ?? '') === 'first-last') {
            $first = trim((string) ($meta["field_{$id}_first"] ?? ''));
            $last = trim((string) ($meta["field_{$id}_last"] ?? ''));
            $entry['value'] = trim($first . ' ' . $last);
            $entry['excel_value'] = $entry['value'];
            $entry['parts'] = ['first' => $first, 'last' => $last];
        } elseif ($type === 'file-upload') {
            $snapshotFiles = [];
            $rawFiles = $values['field_' . $id] ?? [];
            if (is_array($rawFiles)) {
                foreach ($rawFiles as $file) {
                    if (is_array($file) && isset($file['url'])) {
                        $snapshotFiles[] = [
                            'id' => (int) ($file['id'] ?? 0),
                            'name' => (string) ($file['name'] ?? 'file'),
                            'url' => (string) ($file['url'] ?? ''),
                            'mime' => (string) ($file['mime'] ?? ''),
                        ];
                    }
                }
            }
            $entry['files'] = $postId > 0
                ? ports_form_collect_submission_files($postId, $id, $snapshotFiles)
                : $snapshotFiles;
            $names = array_map(static fn (array $f): string => (string) ($f['name'] ?? 'file'), $entry['files']);
            $entry['value'] = $names !== [] ? implode(', ', $names) : '';
            $entry['excel_value'] = $entry['value'] !== ''
                ? $entry['value'] . ' (' . count($entry['files']) . ' ' . _n('file', 'files', count($entry['files']), 'headless-core') . ')'
                : '';
        } else {
            $entry['value'] = ports_form_resolve_meta_display_value($field, $meta);
            $entry['excel_value'] = $entry['value'];
        }

        $currentSection['fields'][] = $entry;
        $flatRows[] = [
            'field_id' => $id,
            'label' => $label,
            'value' => $entry['excel_value'],
        ];
    }

    if ($currentSection['fields'] !== [] || $sections === []) {
        $sections[] = $currentSection;
    }

    return [
        'version' => 1,
        'form_slug' => $slug,
        'sections' => $sections,
        'flat' => $flatRows,
    ];
}

/**
 * @param array<string, mixed> $snapshot
 */
function ports_form_save_submission_snapshot(int $postId, array $snapshot): void
{
    $json = wp_json_encode($snapshot);
    update_post_meta($postId, PORTS_FORM_META_SNAPSHOT, is_string($json) ? $json : '');
}

/**
 * @return array<string, string>
 */
function ports_form_get_submission_meta_map(int $postId): array
{
    $raw = get_post_meta($postId);
    $meta = [];
    foreach ($raw as $key => $values) {
        if (! is_string($key) || ! is_array($values)) {
            continue;
        }
        $meta[$key] = isset($values[0]) ? (string) $values[0] : '';
    }

    return $meta;
}

/**
 * @return array<string, mixed>|null
 */
function ports_form_get_submission_snapshot(int $postId): ?array
{
    $raw = get_post_meta($postId, PORTS_FORM_META_SNAPSHOT, true);
    if (! is_string($raw) || $raw === '') {
        return null;
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : null;
}

/**
 * @return list<array{label: string, value: string}>
 */
function ports_form_snapshot_flat_rows(int $postId): array
{
    $snapshot = ports_form_get_submission_snapshot($postId);
    $slug = (string) get_post_meta($postId, 'form_slug', true);
    if ($slug === '') {
        $slug = 'onboarding_form';
    }

    if ($snapshot !== null && isset($snapshot['flat']) && is_array($snapshot['flat'])) {
        $rows = [];
        foreach ($snapshot['flat'] as $row) {
            if (! is_array($row)) {
                continue;
            }
            $value = (string) ($row['value'] ?? '');
            $fieldId = (string) ($row['field_id'] ?? '');
            if ($fieldId !== '') {
                $fieldDef = ports_form_get_field_definition($slug, $fieldId);
                if ($fieldDef !== null) {
                    $type = (string) ($fieldDef['type'] ?? '');
                    if (in_array($type, ['select', 'radio'], true)) {
                        $resolved = ports_form_choice_label_for_value($fieldDef, $value);
                        if ($resolved !== '') {
                            $value = $resolved;
                        }
                    }
                }
            }
            $rows[] = [
                'label' => (string) ($row['label'] ?? ''),
                'value' => $value,
            ];
        }
        if ($rows !== []) {
            return $rows;
        }
    }

    $meta = ports_form_get_submission_meta_map($postId);
    $lines = ports_form_format_all_fields($slug, $meta);
    $rows = [];
    foreach (explode("\n", $lines) as $line) {
        $parts = explode(': ', $line, 2);
        if (count($parts) === 2) {
            $rows[] = ['label' => $parts[0], 'value' => $parts[1]];
        }
    }

    return $rows;
}
