<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

require_once HEADLESS_CORE_PATH . 'inc/form/form-spec.php';
require_once HEADLESS_CORE_PATH . 'inc/form/register-cpt.php';
require_once HEADLESS_CORE_PATH . 'inc/form/submission-storage.php';

add_action('rest_api_init', static function (): void {
    register_rest_route('custom/v1', '/nonce', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'ports_form_rest_nonce',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('custom/v1', '/submit-form', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'ports_form_rest_submit',
        'permission_callback' => 'ports_form_rest_submit_permission',
    ]);
});

// CORS for form routes is handled by headless_core_maybe_send_cors_headers in inc/cors.php.

/**
 * @return WP_REST_Response
 */
function ports_form_rest_nonce(): WP_REST_Response
{
    return new WP_REST_Response([
        'nonce' => wp_create_nonce('wp_rest'),
    ], 200);
}

/**
 * @return true|WP_Error
 */
function ports_form_rest_submit_permission(WP_REST_Request $request)
{
    $nonce = $request->get_header('X-WP-Nonce');
    if (! is_string($nonce) || $nonce === '') {
        $nonce = (string) $request->get_param('_wpnonce');
    }

    if ($nonce === '' || ! wp_verify_nonce($nonce, 'wp_rest')) {
        return new WP_Error(
            'rest_cookie_invalid_nonce',
            __('Invalid or missing nonce.', 'headless-core'),
            ['status' => 403]
        );
    }

    return true;
}

/**
 * @return WP_REST_Response|WP_Error
 */
function ports_form_rest_submit(WP_REST_Request $request)
{
    $slug = sanitize_key((string) ($request->get_param('form_slug') ?? 'onboarding_form'));
    if ($slug === '') {
        $slug = 'onboarding_form';
    }

    $export = ports_form_get_export($slug);
    if ($export === null) {
        return new WP_Error('form_not_found', __('Form not found.', 'headless-core'), ['status' => 404]);
    }

    $gotcha = trim((string) ($request->get_param('_gotcha') ?? ''));
    if ($gotcha !== '') {
        return new WP_Error('form_spam', __('Submission rejected.', 'headless-core'), ['status' => 400]);
    }

    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    $rateKey = 'form_rate_' . md5($ip) . '_' . $slug;
    $count = (int) get_transient($rateKey);
    if ($count >= 5) {
        return new WP_REST_Response([
            'success' => false,
            'message' => __('Too many attempts, please wait.', 'headless-core'),
        ], 429);
    }
    set_transient($rateKey, $count + 1, 10 * MINUTE_IN_SECONDS);

    $body = $request->get_json_params();
    if (! is_array($body)) {
        $body = $request->get_body_params();
    }
    if (! is_array($body)) {
        $body = [];
    }

    $values = ports_form_normalize_request_values($body);

    $errors = ports_form_validate_submission($slug, $values);
    if ($errors !== []) {
        return new WP_REST_Response([
            'success' => false,
            'errors' => $errors,
        ], 422);
    }

    $postId = ports_form_create_submission($slug, $values);

    if (is_wp_error($postId)) {
        error_log('[FORM_MAILER_ERROR] Failed to create submission: ' . $postId->get_error_message());

        return new WP_Error('form_save_failed', __('Could not save your submission.', 'headless-core'), ['status' => 500]);
    }

    $postId = (int) $postId;
    $values = ports_form_process_file_fields_for_post($slug, $values, $postId);
    $meta = ports_form_flatten_meta($slug, $values);
    ports_form_finalize_submission($postId, $slug, $values, $meta);

    $confirmation = (string) ($export['settings']['confirmation']['message'] ?? '');
    if ($confirmation === '') {
        $confirmation = __('Thank you for your submission.', 'headless-core');
    }

    return new WP_REST_Response([
        'success' => true,
        'message' => $confirmation,
    ], 200);
}

/**
 * @param array<string, mixed> $body
 * @return array<string, mixed>
 */
function ports_form_normalize_request_values(array $body): array
{
    $values = [];
    foreach ($body as $key => $value) {
        if (! is_string($key) || in_array($key, ['_gotcha', 'form_slug', '_wpnonce'], true)) {
            continue;
        }
        $values[$key] = $value;
    }

    return $values;
}

