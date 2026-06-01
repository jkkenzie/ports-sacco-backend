<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

require_once HEADLESS_CORE_PATH . 'inc/form/form-spec.php';
require_once HEADLESS_CORE_PATH . 'inc/form/settings.php';
require_once HEADLESS_CORE_PATH . 'inc/form/submission-storage.php';
require_once HEADLESS_CORE_PATH . 'inc/form/email-template.php';

add_action('phpmailer_init', 'ports_form_phpmailer_apply_from', 999);

/**
 * Ensure form submission emails use the configured From address (overrides SMTP plugins / defaults).
 *
 * @param PHPMailer\PHPMailer\PHPMailer $phpmailer
 */
function ports_form_phpmailer_apply_from(PHPMailer\PHPMailer\PHPMailer $phpmailer): void
{
    $formFrom = $GLOBALS['ports_form_mail_from'] ?? null;
    if (! is_array($formFrom)) {
        return;
    }

    $fromEmail = sanitize_email((string) ($formFrom['email'] ?? ''));
    $fromName = sanitize_text_field((string) ($formFrom['name'] ?? ''));
    if ($fromEmail === '' || ! is_email($fromEmail)) {
        return;
    }

    $phpmailer->setFrom($fromEmail, $fromName !== '' ? $fromName : $fromEmail, false);
}

/**
 * Send notification emails after submission meta and snapshot are persisted.
 */
function ports_form_dispatch_submission_notifications(int $postId): void
{
    $post = get_post($postId);
    if (! $post instanceof WP_Post || $post->post_type !== 'form_submission') {
        return;
    }

    if (get_post_meta($postId, '_ports_form_mail_sent', true)) {
        return;
    }

    $snapshot = get_post_meta($postId, PORTS_FORM_META_SNAPSHOT, true);
    if (! is_string($snapshot) || $snapshot === '') {
        return;
    }

    ports_form_send_submission_notifications($postId, $post);
}

/**
 * @param WP_Post $post
 */
function ports_form_send_submission_notifications(int $postId, WP_Post $post): void
{
    if (wp_is_post_revision($postId) || wp_is_post_autosave($postId)) {
        return;
    }

    if (get_post_meta($postId, '_ports_form_mail_sent', true)) {
        return;
    }

    $slug = (string) get_post_meta($postId, 'form_slug', true);
    if ($slug === '') {
        $slug = 'onboarding_form';
    }

    $export = ports_form_get_export($slug);
    if ($export === null) {
        return;
    }

    $meta = ports_form_get_submission_meta_map($postId); // submission-storage.php
    $context = ports_form_build_email_context($slug, $meta, $postId);
    $context['submitter_email'] = (string) get_post_meta($postId, 'submitter_email', true);

    $notifications = $export['settings']['notifications'] ?? [];
    if (! is_array($notifications)) {
        $notifications = [];
    }

    if ($notifications === []) {
        $adminSender = ports_form_get_registration_sender();
        $adminTo = ports_form_get_admin_notification_recipients();
        if ($adminTo === '') {
            $adminTo = (string) get_option('admin_email');
        }
        $notifications[] = [
            'email' => $adminTo,
            'subject' => sprintf(__('New form submission (%s)', 'headless-core'), $slug),
            'message' => '',
            'sender_name' => $adminSender['name'],
            'sender_address' => $adminSender['email'],
            'replyto' => '{submitter_email}',
        ];
    }

    $sentAny = false;
    $attachments = ports_form_get_submission_email_attachment_paths($postId);

    foreach ($notifications as $notification) {
        if (! is_array($notification)) {
            continue;
        }

        $to = ports_form_replace_email_placeholders((string) ($notification['email'] ?? ''), $context);
        $to = ports_form_sanitize_email_list($to);
        $isClientNotification = ports_form_notification_is_client($notification);

        if (! $isClientNotification) {
            $adminTo = ports_form_get_admin_notification_recipients();
            if ($adminTo !== '') {
                $to = $adminTo;
            }
        }

        if ($to === '' && $isClientNotification) {
            $to = ports_form_sanitize_email_list((string) get_post_meta($postId, 'submitter_email', true));
        }

        if ($to === '') {
            error_log('[FORM_MAILER_ERROR] Skipping notification with empty recipient for submission #' . $postId);
            continue;
        }

        $subject = ports_form_replace_template_placeholders((string) ($notification['subject'] ?? ''), $context);

        if ($isClientNotification) {
            $rawMessage = ports_form_replace_template_placeholders((string) ($notification['message'] ?? ''), $context);
            $introMessage = ports_form_format_email_intro_message($rawMessage);
        } else {
            $messageTemplate = ports_form_strip_admin_email_message_template((string) ($notification['message'] ?? ''));
            $rawMessage = ports_form_replace_template_placeholders($messageTemplate, $context);
            $introMessage = ports_form_format_email_intro_message(
                $rawMessage,
                (string) ($context['all_fields'] ?? '')
            );
        }

        $sender = $isClientNotification
            ? ports_form_get_client_sender()
            : ports_form_get_registration_sender();

        $fromName = $sender['name'];
        $fromEmail = $sender['email'];
        $replyTo = ports_form_sanitize_email_list(
            ports_form_replace_email_placeholders((string) ($notification['replyto'] ?? ''), $context)
        );

        if ($fromEmail === '' || ! is_email($fromEmail)) {
            $fromEmail = sanitize_email((string) get_option('admin_email'));
        }
        if ($fromName === '') {
            $fromName = (string) get_bloginfo('name');
        }

        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            sprintf('From: %s <%s>', $fromName, $fromEmail),
        ];

        if ($replyTo !== '') {
            $headers[] = 'Reply-To: ' . $replyTo;
        }

        $subject = wp_strip_all_tags($subject);
        if ($subject === '') {
            $subject = sprintf(__('New form submission (%s)', 'headless-core'), $slug);
        }

        $heading = wp_strip_all_tags($subject);
        if ($introMessage === '' && ! $isClientNotification) {
            $introMessage = '<p style="margin:0 0 12px;">'
                . esc_html__('A new member registration has been submitted. Field data is grouped below. Uploaded files are attached to this email.', 'headless-core')
                . '</p>';
        }

        if ($isClientNotification) {
            $body = ports_form_build_client_email_html($heading, $introMessage);
        } else {
            $body = ports_form_build_admin_email_html($postId, $slug, $context, $heading, $introMessage);
        }

        $GLOBALS['ports_form_mail_from'] = [
            'email' => $fromEmail,
            'name' => $fromName,
        ];

        $ok = wp_mail($to, $subject, $body, $headers, $attachments);

        unset($GLOBALS['ports_form_mail_from']);
        if (! $ok) {
            error_log('[FORM_MAILER_ERROR] Failed to send notification to ' . $to . ' for submission #' . $postId);
        } else {
            $sentAny = true;
        }
    }

    if ($sentAny) {
        update_post_meta($postId, '_ports_form_mail_sent', '1');
    }
}

/**
 * @param array<string, string> $meta
 * @return array<string, string>
 */
function ports_form_build_email_context(string $slug, array $meta, int $postId): array
{
    $ip = (string) get_post_meta($postId, 'submitter_ip', true);
    $ua = (string) get_post_meta($postId, 'submitter_user_agent', true);

    $flatRows = ports_form_snapshot_flat_rows($postId);
    $allFields = '';
    if ($flatRows !== []) {
        $lines = [];
        foreach ($flatRows as $row) {
            $lines[] = ($row['label'] ?? '') . ': ' . ($row['value'] ?? '');
        }
        $allFields = implode("\n", $lines);
    } else {
        $allFields = ports_form_format_all_fields($slug, $meta);
    }

    $context = [
        'date' => get_the_date('Y-m-d H:i:s', $postId),
        'ip_address' => $ip,
        'user_agent' => $ua,
        'all_fields' => $allFields,
    ];

    foreach (ports_form_get_ordered_fields($slug) as $field) {
        if (($field['type'] ?? '') === 'divider') {
            continue;
        }
        $id = (string) $field['id'];
        $label = ports_form_field_label($field);
        $value = ports_form_resolve_meta_display_value($field, $meta);
        $context[$label] = $value;
        $context["field_{$id}"] = $value;
        $context['field_id="' . $id . '"'] = $value;
    }

    return $context;
}

/**
 * @param array<string, string> $context
 */
function ports_form_replace_template_placeholders(string $template, array $context): string
{
    if ($template === '') {
        return '';
    }

    $out = preg_replace_callback(
        '/\{field_id="(\d+)"\}/',
        static function (array $m) use ($context): string {
            $key = 'field_id="' . $m[1] . '"';
            return $context[$key] ?? ($context['field_' . $m[1]] ?? '');
        },
        $template
    );

    if (! is_string($out)) {
        $out = $template;
    }

    foreach ($context as $key => $value) {
        $out = str_replace('{' . $key . '}', $value, $out);
    }

    return $out;
}

/**
 * @param array<string, string> $context
 */
function ports_form_replace_email_placeholders(string $template, array $context): string
{
    $resolved = ports_form_replace_template_placeholders($template, $context);
    $resolved = preg_replace('/\{[^}]+\}/', '', $resolved);

    return is_string($resolved) ? trim($resolved) : '';
}

/**
 * Client confirmation emails use field placeholders in the "email" setting.
 *
 * @param array<string, mixed> $notification
 */
function ports_form_notification_is_client(array $notification): bool
{
    $email = (string) ($notification['email'] ?? '');

    return str_contains($email, '{field_id');
}

/**
 * Remove plain-text field dump and meta lines from admin message templates.
 * Submission data is rendered in the HTML {submission_table} instead.
 */
function ports_form_strip_admin_email_message_template(string $template): string
{
    if ($template === '') {
        return '';
    }

    $out = preg_replace('/\{all_fields\}/', '', $template);
    $out = is_string($out) ? $out : $template;

    $patterns = [
        '/^\s*Date:\s*\{date\}\s*$/im',
        '/^\s*IP:\s*\{ip_address\}\s*$/im',
        '/^\s*IP address:\s*\{ip_address\}\s*$/im',
        '/^\s*User Agent:\s*\{user_agent\}\s*$/im',
        '/^\s*User agent:\s*\{user_agent\}\s*$/im',
    ];

    foreach ($patterns as $pattern) {
        $replaced = preg_replace($pattern, '', $out);
        if (is_string($replaced)) {
            $out = $replaced;
        }
    }

    return trim(preg_replace("/\n{3,}/", "\n\n", $out) ?? $out);
}

function ports_form_sanitize_email_list(string $emails): string
{
    $parts = preg_split('/[\s,;]+/', $emails) ?: [];
    $valid = [];
    foreach ($parts as $part) {
        $part = sanitize_email(trim($part));
        if ($part !== '' && is_email($part)) {
            $valid[] = $part;
        }
    }

    return implode(', ', array_unique($valid));
}
