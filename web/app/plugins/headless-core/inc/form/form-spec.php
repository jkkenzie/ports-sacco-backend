<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Load a registered form export by slug.
 *
 * @return array<string, mixed>|null
 */
function ports_form_get_export(string $slug): ?array
{
    static $cache = [];

    if (isset($cache[$slug])) {
        return $cache[$slug];
    }

    $file = HEADLESS_CORE_PATH . 'inc/form/onboarding-form-export.php';
    if ($slug === 'onboarding_form' && is_readable($file)) {
        $data = require $file;
        if (is_array($data)) {
            $cache[$slug] = $data;
            return $data;
        }
    }

    return null;
}

/**
 * Ordered list of field definitions (input + display fields).
 *
 * @return list<array<string, mixed>>
 */
function ports_form_get_ordered_fields(string $slug): array
{
    $export = ports_form_get_export($slug);
    if ($export === null || ! isset($export['fields']) || ! is_array($export['fields'])) {
        return [];
    }

    $order = $export['field_order'] ?? array_keys($export['fields']);
    $fields = [];
    foreach ($order as $id) {
        $id = (string) $id;
        if (! isset($export['fields'][$id])) {
            continue;
        }
        $field = $export['fields'][$id];
        $field['id'] = $id;
        $fields[] = $field;
    }

    return $fields;
}

/**
 * Fields that accept user input (excludes dividers).
 *
 * @return list<array<string, mixed>>
 */
function ports_form_get_input_fields(string $slug): array
{
    return array_values(array_filter(
        ports_form_get_ordered_fields($slug),
        static fn (array $field): bool => ($field['type'] ?? '') !== 'divider'
    ));
}

/**
 * @param array<string, mixed> $field
 */
function ports_form_field_is_required(array $field, bool $visible): bool
{
    if (! $visible) {
        return false;
    }

    return ! empty($field['required']);
}

/**
 * Whether a field should be shown for the current submission values.
 *
 * @param array<string, mixed> $field
 * @param array<string, mixed> $values Normalized flat values (field keys).
 */
function ports_form_field_is_visible(array $field, array $values): bool
{
    if (empty($field['conditional_logic'])) {
        return true;
    }

    $groups = $field['conditionals'] ?? [];
    if (! is_array($groups) || $groups === []) {
        return true;
    }

    foreach ($groups as $group) {
        if (! is_array($group)) {
            continue;
        }
        $match = true;
        foreach ($group as $rule) {
            if (! is_array($rule)) {
                $match = false;
                break;
            }
            if (! ports_form_evaluate_conditional_rule($rule, $values)) {
                $match = false;
                break;
            }
        }
        if ($match) {
            return ($field['conditional_type'] ?? 'show') !== 'hide';
        }
    }

    return ($field['conditional_type'] ?? 'show') === 'hide';
}

/**
 * @param array<string, mixed> $rule
 * @param array<string, mixed> $values
 */
function ports_form_evaluate_conditional_rule(array $rule, array $values): bool
{
    $fieldId = (string) ($rule['field'] ?? '');
    $operator = (string) ($rule['operator'] ?? '==');
    $expected = (string) ($rule['value'] ?? '');
    $actual = ports_form_get_value_for_field_id($fieldId, $values);

    if (is_array($actual)) {
        $actual = in_array($expected, array_map('strval', $actual), true) ? $expected : '';
    } else {
        $actual = (string) $actual;
    }

    return match ($operator) {
        '!=', 'not' => $actual !== $expected,
        '>', 'gt' => is_numeric($actual) && is_numeric($expected) && (float) $actual > (float) $expected,
        '<', 'lt' => is_numeric($actual) && is_numeric($expected) && (float) $actual < (float) $expected,
        'contains' => $expected !== '' && str_contains($actual, $expected),
        'empty' => $actual === '' || $actual === null,
        'not_empty' => $actual !== '' && $actual !== null,
        default => $actual === $expected,
    };
}

/**
 * @param array<string, mixed> $values
 */
function ports_form_get_value_for_field_id(string $fieldId, array $values): mixed
{
    $key = 'field_' . $fieldId;
    if (array_key_exists($key, $values)) {
        return $values[$key];
    }
    if (array_key_exists($fieldId, $values)) {
        return $values[$fieldId];
    }

    return '';
}

/**
 * @return list<string> Meta / payload keys for a field.
 */
function ports_form_field_meta_keys(array $field): array
{
    $id = (string) ($field['id'] ?? '');
    $type = (string) ($field['type'] ?? '');
    $format = (string) ($field['format'] ?? '');

    if ($type === 'name' && $format === 'first-last') {
        return ["field_{$id}_first", "field_{$id}_last"];
    }

    return ["field_{$id}"];
}

/**
 * Human-readable label for errors / emails.
 */
function ports_form_field_label(array $field): string
{
    $label = trim((string) ($field['label'] ?? ''));
    if ($label !== '') {
        return wp_strip_all_tags($label);
    }

    return sprintf(__('Field %s', 'headless-core'), (string) ($field['id'] ?? ''));
}

/**
 * @return array<string, mixed>|null
 */
function ports_form_get_field_definition(string $slug, string $fieldId): ?array
{
    $export = ports_form_get_export($slug);
    if ($export === null || ! isset($export['fields'][$fieldId])) {
        return null;
    }

    $field = $export['fields'][$fieldId];
    $field['id'] = $fieldId;

    return $field;
}

/**
 * Map a stored choice value to its human-readable label.
 */
function ports_form_choice_label_for_value(array $field, string $value): string
{
    $value = trim($value);
    if ($value === '') {
        return '';
    }

    foreach ($field['choices'] ?? [] as $choice) {
        if ((string) ($choice['value'] ?? '') === $value) {
            $label = trim((string) ($choice['label'] ?? ''));
            return $label !== '' ? $label : $value;
        }
    }

    return $value;
}

/**
 * @param array<string, string> $meta
 */
function ports_form_resolve_meta_display_value(array $field, array $meta): string
{
    $id = (string) ($field['id'] ?? '');
    $type = (string) ($field['type'] ?? '');
    $key = 'field_' . $id;

    if ($type === 'name' && ($field['format'] ?? '') === 'first-last') {
        $first = trim((string) ($meta["{$key}_first"] ?? ''));
        $last = trim((string) ($meta["{$key}_last"] ?? ''));

        return trim($first . ' ' . $last);
    }

    if ($type === 'file-upload') {
        return trim((string) ($meta[$key] ?? ''));
    }

    $storedLabel = trim((string) ($meta["{$key}_label"] ?? ''));
    if ($storedLabel !== '') {
        return $storedLabel;
    }

    $stored = trim((string) ($meta[$key] ?? ''));
    if ($stored === '') {
        return '';
    }

    if (in_array($type, ['select', 'radio'], true)) {
        return ports_form_choice_label_for_value($field, $stored);
    }

    return $stored;
}

/**
 * @return callable(string): string
 */
function ports_form_sanitize_callback_for_type(string $type): callable
{
    return match ($type) {
        'email' => static fn (string $v): string => sanitize_email($v),
        'number', 'phone' => static fn (string $v): string => preg_replace('/[^\d\+\-\(\)\s\.]/', '', $v) ?? '',
        'file-upload' => static fn (string $v): string => esc_url_raw($v),
        default => static fn (string $v): string => sanitize_text_field($v),
    };
}

/**
 * @param mixed $raw
 */
function ports_form_sanitize_field_value(array $field, $raw): mixed
{
    $type = (string) ($field['type'] ?? 'text');

    if ($type === 'checkbox' && is_array($raw)) {
        return array_values(array_map(
            static fn ($v): string => sanitize_text_field((string) $v),
            $raw
        ));
    }

    if ($type === 'name' && ($field['format'] ?? '') === 'first-last' && is_array($raw)) {
        return [
            'first' => sanitize_text_field((string) ($raw['first'] ?? '')),
            'last' => sanitize_text_field((string) ($raw['last'] ?? '')),
        ];
    }

    $sanitize = ports_form_sanitize_callback_for_type($type);
    return $sanitize((string) $raw);
}

/**
 * Max length for a field (0 = no limit).
 */
function ports_form_field_maxlength(array $field): int
{
    if (! empty($field['limit_enabled']) && isset($field['limit_count'])) {
        return max(0, (int) $field['limit_count']);
    }
    if (isset($field['limit_count']) && ($field['limit_mode'] ?? '') === 'characters') {
        $count = (int) $field['limit_count'];
        return $count > 1 ? $count : 0;
    }

    return 0;
}

/**
 * @param array<string, mixed> $values
 * @return array<string, string>
 */
function ports_form_validate_submission(string $slug, array $values): array
{
    $errors = [];

    foreach (ports_form_get_input_fields($slug) as $field) {
        $visible = ports_form_field_is_visible($field, $values);
        if (! $visible) {
            continue;
        }

        $type = (string) ($field['type'] ?? 'text');
        $label = ports_form_field_label($field);
        $keys = ports_form_field_meta_keys($field);

        if ($type === 'name' && ($field['format'] ?? '') === 'first-last') {
            $first = trim((string) ($values[$keys[0]] ?? ''));
            $last = trim((string) ($values[$keys[1]] ?? ''));
            if (ports_form_field_is_required($field, true)) {
                if ($first === '') {
                    $errors[$keys[0]] = sprintf(__('%s (first name) is required.', 'headless-core'), $label);
                }
                if ($last === '') {
                    $errors[$keys[1]] = sprintf(__('%s (last name) is required.', 'headless-core'), $label);
                }
            }
            continue;
        }

        if ($type === 'checkbox') {
            $selected = $values[$keys[0]] ?? [];
            if (! is_array($selected)) {
                $selected = $selected === '' || $selected === null ? [] : [(string) $selected];
            }
            if (ports_form_field_is_required($field, true) && $selected === []) {
                $errors[$keys[0]] = sprintf(__('%s is required.', 'headless-core'), $label);
            }
            continue;
        }

        if ($type === 'file-upload') {
            $val = trim((string) ($values[$keys[0]] ?? ''));
            if (ports_form_field_is_required($field, true) && $val === '') {
                $errors[$keys[0]] = sprintf(__('%s is required.', 'headless-core'), $label);
            }
            continue;
        }

        $value = trim((string) ($values[$keys[0]] ?? ''));

        if (ports_form_field_is_required($field, true) && $value === '') {
            $errors[$keys[0]] = sprintf(__('%s is required.', 'headless-core'), $label);
            continue;
        }

        if ($value === '') {
            continue;
        }

        $max = ports_form_field_maxlength($field);
        if ($max > 0 && strlen($value) > $max) {
            $errors[$keys[0]] = sprintf(
                __('%1$s must be at most %2$d characters.', 'headless-core'),
                $label,
                $max
            );
        }

        if ($type === 'email' && ! is_email($value)) {
            $errors[$keys[0]] = sprintf(__('%s must be a valid email address.', 'headless-core'), $label);
        }

        if ($type === 'url' && filter_var($value, FILTER_VALIDATE_URL) === false) {
            $errors[$keys[0]] = sprintf(__('%s must be a valid URL.', 'headless-core'), $label);
        }

        if (! empty($field['pattern']) && @preg_match('/' . $field['pattern'] . '/', '') !== false) {
            if (! preg_match('/' . $field['pattern'] . '/', $value)) {
                $errors[$keys[0]] = sprintf(__('%s format is invalid.', 'headless-core'), $label);
            }
        }
    }

    return $errors;
}

/**
 * Flatten submitted payload to meta storage.
 *
 * @param array<string, mixed> $values
 * @return array<string, string>
 */
function ports_form_flatten_meta(string $slug, array $values): array
{
    $meta = [];

    foreach (ports_form_get_input_fields($slug) as $field) {
        if (! ports_form_field_is_visible($field, $values)) {
            continue;
        }

        $type = (string) ($field['type'] ?? 'text');
        $id = (string) $field['id'];
        $keys = ports_form_field_meta_keys($field);

        if ($type === 'name' && ($field['format'] ?? '') === 'first-last') {
            $meta["field_{$id}_first"] = sanitize_text_field((string) ($values[$keys[0]] ?? ''));
            $meta["field_{$id}_last"] = sanitize_text_field((string) ($values[$keys[1]] ?? ''));
            $meta["field_{$id}"] = trim($meta["field_{$id}_first"] . ' ' . $meta["field_{$id}_last"]);
            continue;
        }

        if ($type === 'checkbox') {
            $selected = $values[$keys[0]] ?? [];
            if (! is_array($selected)) {
                $selected = $selected === '' ? [] : [(string) $selected];
            }
            $labels = [];
            foreach ($selected as $choiceVal) {
                foreach ($field['choices'] ?? [] as $choice) {
                    if ((string) ($choice['value'] ?? '') === (string) $choiceVal) {
                        $labels[] = (string) ($choice['label'] ?? $choiceVal);
                    }
                }
            }
            $meta["field_{$id}"] = implode(', ', $labels);
            continue;
        }

        if ($type === 'file-upload') {
            $raw = $values[$keys[0]] ?? [];
            $names = [];
            $attachmentIds = [];
            if (is_array($raw)) {
                foreach ($raw as $file) {
                    if (! is_array($file)) {
                        continue;
                    }
                    $names[] = (string) ($file['name'] ?? 'file');
                    if (! empty($file['id'])) {
                        $attachmentIds[] = (string) (int) $file['id'];
                    }
                }
            } elseif (is_string($raw) && $raw !== '') {
                foreach (array_filter(array_map('trim', explode("\n", $raw))) as $url) {
                    $names[] = basename($url);
                }
            }
            $meta["field_{$id}"] = implode(', ', $names);
            if ($attachmentIds !== []) {
                $meta["field_{$id}_attachments"] = implode(',', $attachmentIds);
            }
            continue;
        }

        if ($type === 'select' || $type === 'radio') {
            $raw = $values[$keys[0]] ?? '';
            $storedValue = trim((string) ports_form_sanitize_field_value($field, $raw));
            $meta["field_{$id}_value"] = $storedValue;
            $meta["field_{$id}_label"] = ports_form_choice_label_for_value($field, $storedValue);
            $meta["field_{$id}"] = $meta["field_{$id}_label"] !== '' ? $meta["field_{$id}_label"] : $storedValue;
            continue;
        }

        $raw = $values[$keys[0]] ?? '';
        $sanitized = ports_form_sanitize_field_value($field, $raw);
        if (is_array($sanitized)) {
            $meta["field_{$id}"] = wp_json_encode($sanitized) ?: '';
        } else {
            $meta["field_{$id}"] = (string) $sanitized;
        }
    }

    return $meta;
}

/**
 * Resolve submitter email from field values.
 */
function ports_form_submitter_email(string $slug, array $values): string
{
    $export = ports_form_get_export($slug);
    $candidates = $export['email_field_ids']
        ?? $export['settings']['submitter_email_field_ids']
        ?? ['2', '32', '84', '95', '109', '155'];

    foreach ($candidates as $id) {
        $key = 'field_' . $id;
        $email = sanitize_email((string) ($values[$key] ?? ''));
        if ($email !== '' && is_email($email)) {
            return $email;
        }
    }

    return '';
}

/**
 * Build {all_fields} plain-text block.
 *
 * @param array<string, string> $meta
 */
function ports_form_format_all_fields(string $slug, array $meta): string
{
    $lines = [];
    foreach (ports_form_get_ordered_fields($slug) as $field) {
        if (($field['type'] ?? '') === 'divider') {
            continue;
        }
        $id = (string) $field['id'];
        $label = ports_form_field_label($field);
        $value = ports_form_resolve_meta_display_value($field, $meta);
        if ($value !== '') {
            $lines[] = $label . ': ' . $value;
        }
    }

    return implode("\n", $lines);
}
