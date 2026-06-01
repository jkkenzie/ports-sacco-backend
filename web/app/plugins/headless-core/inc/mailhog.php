<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Resolve env value from common PHP env sources.
 */
function ports_form_env(string $key, ?string $default = null): ?string
{
    $value = getenv($key);
    if ($value === false && isset($_ENV[$key])) {
        $value = $_ENV[$key];
    }
    if ($value === false && isset($_SERVER[$key])) {
        $value = $_SERVER[$key];
    }

    if ($value === false || $value === null) {
        return $default;
    }

    $trimmed = trim((string) $value);
    return $trimmed === '' ? $default : $trimmed;
}

/**
 * Enable MailHog SMTP transport in non-production envs.
 *
 * Defaults:
 * - host: localhost
 * - port: 1025
 * - auth: disabled
 */
add_action('phpmailer_init', static function (PHPMailer\PHPMailer\PHPMailer $phpmailer): void {
    $explicit = strtolower((string) ports_form_env('HEADLESS_MAILHOG_ENABLED', ''));
    $isEnabled = in_array($explicit, ['1', 'true', 'yes', 'on'], true);

    if (! $isEnabled) {
        $wpEnv = defined('WP_ENV') ? strtolower((string) WP_ENV) : strtolower((string) ports_form_env('WP_ENV', ''));
        $isEnabled = in_array($wpEnv, ['development', 'staging', 'local'], true);
    }

    if (! $isEnabled) {
        return;
    }

    $host = ports_form_env('HEADLESS_MAILHOG_HOST', '127.0.0.1');
    $port = (int) ports_form_env('HEADLESS_MAILHOG_PORT', '1025');

    $phpmailer->isSMTP();
    $phpmailer->Host = $host ?: '127.0.0.1';
    $phpmailer->Port = $port > 0 ? $port : 1025;
    $phpmailer->SMTPAuth = false;
    $phpmailer->SMTPSecure = '';
    $phpmailer->SMTPAutoTLS = false;

    $formFrom = $GLOBALS['ports_form_mail_from'] ?? null;
    if (is_array($formFrom)) {
        $fromEmail = sanitize_email((string) ($formFrom['email'] ?? ''));
        $fromName = sanitize_text_field((string) ($formFrom['name'] ?? ''));
        if ($fromEmail !== '' && is_email($fromEmail)) {
            $phpmailer->setFrom($fromEmail, $fromName !== '' ? $fromName : $fromEmail, false);
        }

        return;
    }

    $fromEmail = sanitize_email((string) ports_form_env('HEADLESS_FORM_FROM_EMAIL', ''));
    if ($fromEmail === '') {
        $fromEmail = sanitize_email((string) get_option('admin_email'));
    }
    $fromName = (string) ports_form_env('HEADLESS_FORM_FROM_NAME', (string) get_bloginfo('name'));
    if ($fromEmail !== '' && $fromName !== '') {
        $phpmailer->setFrom($fromEmail, $fromName, false);
    }
});

