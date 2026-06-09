<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

require_once HEADLESS_CORE_PATH . 'inc/form/form-spec.php';
require_once HEADLESS_CORE_PATH . 'inc/form/submission-storage.php';

add_action('init', static function (): void {
    register_post_type('form_submission', [
        'labels' => [
            'name' => __('Form Submissions', 'headless-core'),
            'singular_name' => __('Form Submission', 'headless-core'),
            'add_new_item' => __('Add New Submission', 'headless-core'),
            'edit_item' => __('View Submission', 'headless-core'),
            'search_items' => __('Search Submissions', 'headless-core'),
            'not_found' => __('No submissions found.', 'headless-core'),
            'menu_name' => __('Form Submissions', 'headless-core'),
        ],
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'form_submissions',
        'capability_type' => 'post',
        'map_meta_cap' => true,
        'has_archive' => false,
        'rewrite' => false,
        'query_var' => false,
        'menu_icon' => 'dashicons-feedback',
        'supports' => ['title'],
    ]);

    ports_form_register_submission_meta();
});

/**
 * Register post meta for every onboarding form field.
 */
function ports_form_register_submission_meta(): void
{
    $export = ports_form_get_export('onboarding_form');
    if ($export === null) {
        return;
    }

    $keys = [
        'form_slug',
        'submitter_ip',
        'submitter_user_agent',
        'submitter_email',
        PORTS_FORM_META_SNAPSHOT,
    ];

    foreach (ports_form_get_input_fields('onboarding_form') as $field) {
        foreach (ports_form_field_meta_keys($field) as $key) {
            $keys[] = $key;
        }
        $keys[] = 'field_' . ($field['id'] ?? '');
        $keys[] = 'field_' . ($field['id'] ?? '') . '_label';
        $keys[] = 'field_' . ($field['id'] ?? '') . '_value';
        $keys[] = 'field_' . ($field['id'] ?? '') . '_attachments';
    }

    $keys = array_unique($keys);

    foreach ($keys as $metaKey) {
        if (! is_string($metaKey) || $metaKey === '') {
            continue;
        }

        $sanitize = $metaKey === PORTS_FORM_META_SNAPSHOT
            ? static function ($value): string {
                if (! is_string($value)) {
                    return '';
                }
                json_decode($value);
                return json_last_error() === JSON_ERROR_NONE ? $value : '';
            }
            : static function ($value) {
                if (is_array($value)) {
                    return wp_json_encode($value) ?: '';
                }

                return sanitize_text_field((string) $value);
            };

        register_post_meta('form_submission', $metaKey, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => static function (): bool {
                return current_user_can('edit_posts');
            },
            'sanitize_callback' => $sanitize,
        ]);
    }
}

/**
 * Create a form submission post shell (field data saved via ports_form_finalize_submission).
 *
 * @param array<string, mixed> $values
 * @return int|WP_Error Post ID.
 */
function ports_form_create_submission(string $slug, array $values)
{
    $email = ports_form_submitter_email($slug, $values);
    $timestamp = wp_date('Y-m-d H:i:s');
    $title = sprintf(
        'Submission – %s – %s',
        $timestamp,
        $email !== '' ? $email : __('no email', 'headless-core')
    );

    $postId = wp_insert_post([
        'post_type' => 'form_submission',
        'post_title' => $title,
        'post_content' => '',
        'post_status' => 'publish',
        'meta_input' => [
            'form_slug' => $slug,
            'submitter_email' => $email,
            'submitter_ip' => isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field((string) $_SERVER['REMOTE_ADDR']) : '',
            'submitter_user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field((string) $_SERVER['HTTP_USER_AGENT']) : '',
        ],
    ], true);

    if (is_wp_error($postId)) {
        return $postId;
    }

    return (int) $postId;
}

/**
 * Persist meta + structured snapshot after attachments are processed.
 *
 * @param array<string, mixed> $values
 * @param array<string, string> $meta
 */
function ports_form_finalize_submission(int $postId, string $slug, array $values, array $meta): void
{
    foreach ($meta as $key => $value) {
        update_post_meta($postId, $key, $value);
    }

    $snapshot = ports_form_build_structured_snapshot($slug, $values, $meta, $postId);
    ports_form_save_submission_snapshot($postId, $snapshot);

    $summaryLines = [];
    foreach ($snapshot['flat'] ?? [] as $row) {
        if (! is_array($row)) {
            continue;
        }
        $summaryLines[] = ($row['label'] ?? '') . ': ' . ($row['value'] ?? '');
    }

    wp_update_post([
        'ID' => $postId,
        'post_content' => implode("\n", $summaryLines),
    ]);

    ports_form_dispatch_submission_notifications($postId);
}
