<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

require_once HEADLESS_CORE_PATH . 'inc/form/form-spec.php';
require_once HEADLESS_CORE_PATH . 'inc/form/submission-storage.php';

const PORTS_FORM_OPTION_ADMIN_EMAIL_TEMPLATE = 'ports_form_admin_email_template';
const PORTS_FORM_OPTION_CLIENT_EMAIL_TEMPLATE = 'ports_form_client_email_template';

/**
 * @return array<string, bool|string>
 */
function ports_form_email_template_allowed_html(): array
{
    $style = ['style' => true];
    $common = array_merge($style, ['class' => true, 'id' => true, 'align' => true, 'valign' => true, 'colspan' => true, 'rowspan' => true, 'width' => true, 'height' => true, 'role' => true]);

    return [
        'html' => [],
        'head' => [],
        'body' => $style,
        'meta' => ['charset' => true, 'name' => true, 'content' => true],
        'title' => [],
        'table' => array_merge($common, ['cellspacing' => true, 'cellpadding' => true, 'border' => true]),
        'tr' => $common,
        'td' => $common,
        'th' => $common,
        'tbody' => $style,
        'thead' => $style,
        'a' => array_merge($style, ['href' => true, 'target' => true, 'rel' => true, 'title' => true]),
        'img' => array_merge($style, ['src' => true, 'alt' => true]),
        'h1' => $style,
        'h2' => $style,
        'h3' => $style,
        'p' => $style,
        'div' => $style,
        'span' => $style,
        'br' => [],
        'strong' => $style,
        'em' => $style,
        'ul' => $style,
        'ol' => $style,
        'li' => $style,
    ];
}

function ports_form_sanitize_email_template($value): string
{
    return wp_kses((string) wp_unslash($value), ports_form_email_template_allowed_html());
}

function ports_form_get_email_logo_url(): string
{
    if (function_exists('headless_core_get_or_create_header_post_id')) {
        $postId = headless_core_get_or_create_header_post_id();
        if ($postId > 0) {
            $post = get_post($postId);
            if ($post instanceof WP_Post) {
                $parsed = parse_blocks((string) $post->post_content);
                foreach ($parsed as $block) {
                    if (($block['blockName'] ?? '') !== 'custom/header-main') {
                        continue;
                    }
                    $attrs = is_array($block['attrs'] ?? null) ? $block['attrs'] : [];
                    $logoId = (int) ($attrs['logoId'] ?? 0);
                    if ($logoId > 0 && function_exists('headless_core_header_icon_asset')) {
                        $asset = headless_core_header_icon_asset($logoId);
                        $url = (string) ($asset['url'] ?? '');
                        if ($url !== '') {
                            return esc_url_raw($url);
                        }
                    }
                }
            }
        }
    }

    $themeLogoId = (int) get_theme_mod('custom_logo', 0);
    if ($themeLogoId > 0) {
        $url = wp_get_attachment_image_url($themeLogoId, 'medium');
        if (is_string($url) && $url !== '') {
            return esc_url_raw($url);
        }
    }

    return '';
}

function ports_form_get_default_admin_email_template(): string
{
    return <<<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{heading}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F4EE;font-family:Arial,Helvetica,sans-serif;color:#333333;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F5F4EE;">
  <tr>
    <td align="center" style="padding:28px 16px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e2da;">
        <tr>
          <td style="background:linear-gradient(135deg,#22ACB6 0%,#1BB5B5 100%);padding:28px 32px;text-align:center;">
            <img src="{logo_url}" alt="{site_name}" width="180" style="display:block;margin:0 auto;max-width:180px;height:auto;border:0;" />
            <h1 style="margin:18px 0 0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">{heading}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 8px;font-size:15px;line-height:1.65;color:#444444;">
            {intro_message}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 24px;">
            {submission_table}
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 24px;">
            {meta_info}
          </td>
        </tr>
        <tr>
          <td style="background-color:#22ACB6;padding:22px 32px;text-align:center;color:#ffffff;font-size:12px;line-height:1.6;">
            <p style="margin:0 0 6px;">&copy; {year} {site_name}. All rights reserved.</p>
            <p style="margin:0;"><a href="{site_url}" style="color:#ffffff;text-decoration:underline;">{site_url}</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
}

function ports_form_get_default_client_email_template(): string
{
    return <<<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{heading}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F4EE;font-family:Arial,Helvetica,sans-serif;color:#333333;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F5F4EE;">
  <tr>
    <td align="center" style="padding:28px 16px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e2da;">
        <tr>
          <td style="background:linear-gradient(135deg,#22ACB6 0%,#1BB5B5 100%);padding:28px 32px;text-align:center;">
            <img src="{logo_url}" alt="{site_name}" width="180" style="display:block;margin:0 auto;max-width:180px;height:auto;border:0;" />
            <h1 style="margin:18px 0 0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">{heading}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 32px;font-size:15px;line-height:1.65;color:#444444;">
            {intro_message}
          </td>
        </tr>
        <tr>
          <td style="background-color:#22ACB6;padding:22px 32px;text-align:center;color:#ffffff;font-size:12px;line-height:1.6;">
            <p style="margin:0 0 6px;">&copy; {year} {site_name}. All rights reserved.</p>
            <p style="margin:0;"><a href="{site_url}" style="color:#ffffff;text-decoration:underline;">{site_url}</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
}

function ports_form_get_admin_email_template(): string
{
    $saved = (string) get_option(PORTS_FORM_OPTION_ADMIN_EMAIL_TEMPLATE, '');
    if (trim($saved) !== '') {
        return $saved;
    }

    return ports_form_get_default_admin_email_template();
}

function ports_form_get_client_email_template(): string
{
    $saved = (string) get_option(PORTS_FORM_OPTION_CLIENT_EMAIL_TEMPLATE, '');
    if (trim($saved) !== '') {
        return $saved;
    }

    return ports_form_get_default_client_email_template();
}

/**
 * @param array<string, string> $vars
 */
function ports_form_render_email_template(string $template, array $vars): string
{
    $html = $template;
    foreach ($vars as $key => $value) {
        $html = str_replace('{' . $key . '}', $value, $html);
    }

    return $html;
}

/**
 * @param array<string, string> $context
 */
function ports_form_build_admin_email_html(int $postId, string $slug, array $context, string $heading, string $introMessage): string
{
    $logoUrl = ports_form_get_email_logo_url();
    if ($logoUrl === '') {
        $logoUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }

    $vars = [
        'logo_url' => esc_url($logoUrl),
        'site_name' => esc_html((string) get_bloginfo('name')),
        'site_url' => esc_url(home_url('/')),
        'year' => esc_html((string) gmdate('Y')),
        'heading' => esc_html($heading),
        'intro_message' => $introMessage,
        'submission_table' => ports_form_build_submission_email_table($postId, $slug),
        'meta_info' => ports_form_build_submission_email_meta_block($context),
        'date' => esc_html($context['date'] ?? ''),
        'ip_address' => esc_html($context['ip_address'] ?? ''),
        'user_agent' => esc_html($context['user_agent'] ?? ''),
    ];

    return ports_form_render_email_template(ports_form_get_admin_email_template(), $vars);
}

/**
 * @param array<string, string> $context
 */
function ports_form_build_client_email_html(string $heading, string $introMessage): string
{
    $logoUrl = ports_form_get_email_logo_url();
    if ($logoUrl === '') {
        $logoUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }

    $vars = [
        'logo_url' => esc_url($logoUrl),
        'site_name' => esc_html((string) get_bloginfo('name')),
        'site_url' => esc_url(home_url('/')),
        'year' => esc_html((string) gmdate('Y')),
        'heading' => esc_html($heading),
        'intro_message' => $introMessage,
        'submission_table' => '',
        'meta_info' => '',
    ];

    return ports_form_render_email_template(ports_form_get_client_email_template(), $vars);
}

/**
 * @param array<string, string> $context
 */
function ports_form_build_submission_email_meta_block(array $context): string
{
    $date = trim((string) ($context['date'] ?? ''));
    $ip = trim((string) ($context['ip_address'] ?? ''));
    $ua = trim((string) ($context['user_agent'] ?? ''));

    if ($date === '' && $ip === '' && $ua === '') {
        return '';
    }

    $rows = '';
    if ($date !== '') {
        $rows .= ports_form_email_table_row(__('Submitted', 'headless-core'), esc_html($date));
    }
    if ($ip !== '') {
        $rows .= ports_form_email_table_row(__('IP address', 'headless-core'), esc_html($ip));
    }
    if ($ua !== '') {
        $rows .= ports_form_email_table_row(__('User agent', 'headless-core'), esc_html($ua));
    }

    return ports_form_email_section_table(__('Submission details', 'headless-core'), $rows);
}

function ports_form_build_submission_email_table(int $postId, string $slug): string
{
    $snapshot = ports_form_get_submission_snapshot($postId);
    $meta = ports_form_get_submission_meta_map($postId);
    $sections = [];

    if ($snapshot !== null && isset($snapshot['sections']) && is_array($snapshot['sections'])) {
        $sections = $snapshot['sections'];
    }

    $html = ports_form_render_submission_email_sections($slug, $sections, $meta);

    if ($html === '' && $meta !== []) {
        $values = ports_form_meta_as_submission_values($meta);
        $rebuilt = ports_form_build_structured_snapshot($slug, $values, $meta, $postId);
        $sections = is_array($rebuilt['sections'] ?? null) ? $rebuilt['sections'] : [];
        $html = ports_form_render_submission_email_sections($slug, $sections, $meta);
    }

    if ($html === '') {
        $fields = ports_form_build_email_fields_from_meta($slug, $meta);
        $html = ports_form_render_submission_email_sections($slug, [
            [
                'label' => __('Submission', 'headless-core'),
                'fields' => $fields,
            ],
        ], $meta);
    }

    if ($html === '') {
        return '<p style="margin:0;color:#666666;font-size:14px;">' . esc_html__('No field data available.', 'headless-core') . '</p>';
    }

    return $html;
}

/**
 * @param array<string, string> $meta
 * @return array<string, string>
 */
function ports_form_meta_as_submission_values(array $meta): array
{
    $values = [];
    foreach ($meta as $key => $value) {
        if (is_string($key) && str_starts_with($key, 'field_')) {
            $values[$key] = $value;
        }
    }

    return $values;
}

/**
 * @param list<array<string, mixed>> $sections
 * @param array<string, string> $meta
 */
function ports_form_render_submission_email_sections(string $slug, array $sections, array $meta): string
{
    $html = '';
    foreach ($sections as $section) {
        if (! is_array($section)) {
            continue;
        }

        $rows = '';
        foreach ($section['fields'] ?? [] as $field) {
            if (! is_array($field)) {
                continue;
            }

            $type = (string) ($field['type'] ?? '');
            if ($type === 'file-upload') {
                continue;
            }

            $fieldId = (string) ($field['field_id'] ?? '');
            $label = (string) ($field['label'] ?? '');
            $value = (string) ($field['value'] ?? '');

            if ($fieldId !== '') {
                $fieldDef = ports_form_get_field_definition($slug, $fieldId);
                if ($fieldDef !== null) {
                    if ($label === '') {
                        $label = ports_form_field_label($fieldDef);
                    }
                    $resolved = ports_form_resolve_meta_display_value($fieldDef, $meta);
                    if ($resolved !== '') {
                        $value = $resolved;
                    } elseif (in_array($type, ['select', 'radio'], true) && $value !== '') {
                        $choiceLabel = ports_form_choice_label_for_value($fieldDef, $value);
                        if ($choiceLabel !== '') {
                            $value = $choiceLabel;
                        }
                    }
                }
            }

            $value = trim($value);
            if ($value === '') {
                continue;
            }

            $rows .= ports_form_email_table_row(esc_html($label), nl2br(esc_html($value)));
        }

        if ($rows === '') {
            continue;
        }

        $sectionLabel = esc_html((string) ($section['label'] ?? __('Section', 'headless-core')));
        $html .= ports_form_email_section_table($sectionLabel, $rows);
    }

    return $html;
}

/**
 * @return list<array<string, mixed>>
 */
function ports_form_build_email_fields_from_meta(string $slug, array $meta): array
{
    $fields = [];
    foreach (ports_form_get_ordered_fields($slug) as $field) {
        $type = (string) ($field['type'] ?? '');
        if ($type === 'divider' || $type === 'file-upload') {
            continue;
        }

        $fields[] = [
            'field_id' => (string) ($field['id'] ?? ''),
            'type' => $type,
            'label' => ports_form_field_label($field),
            'value' => ports_form_resolve_meta_display_value($field, $meta),
        ];
    }

    return $fields;
}

function ports_form_email_section_table(string $sectionLabel, string $rows): string
{
    return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;border:1px solid #e8e6de;border-radius:8px;overflow:hidden;border-collapse:separate;">'
        . '<tr><td colspan="2" style="background:#EE6E2A;color:#ffffff;padding:12px 16px;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.4px;">'
        . $sectionLabel
        . '</td></tr>'
        . $rows
        . '</table>';
}

function ports_form_email_table_row(string $label, string $valueHtml): string
{
    return '<tr>'
        . '<td style="padding:11px 16px;border-bottom:1px solid #efede6;font-weight:600;color:#22ACB6;width:38%;vertical-align:top;font-size:14px;">'
        . $label
        . '</td>'
        . '<td style="padding:11px 16px;border-bottom:1px solid #efede6;color:#333333;vertical-align:top;font-size:14px;line-height:1.5;">'
        . $valueHtml
        . '</td>'
        . '</tr>';
}

function ports_form_format_email_intro_message(string $message, string $allFieldsPlain = ''): string
{
    $message = trim(preg_replace('/\{all_fields\}/', '', $message) ?? '');
    if ($message === '') {
        return '';
    }

    if ($allFieldsPlain !== '') {
        $message = str_replace($allFieldsPlain, '', $message);
        $message = trim($message);
    }

    if ($message === '') {
        return '';
    }

    $paragraphs = preg_split("/\r\n|\r|\n/", $message) ?: [];
    $html = '';
    foreach ($paragraphs as $paragraph) {
        $paragraph = trim($paragraph);
        if ($paragraph === '') {
            continue;
        }
        $html .= '<p style="margin:0 0 12px;">' . esc_html($paragraph) . '</p>';
    }

    return $html;
}

/**
 * @return list<string>
 */
function ports_form_get_submission_email_attachment_paths(int $postId): array
{
    $slug = (string) get_post_meta($postId, 'form_slug', true);
    if ($slug === '') {
        $slug = 'onboarding_form';
    }

    $paths = [];
    $seen = [];
    $snapshot = ports_form_get_submission_snapshot($postId);

    if ($snapshot !== null && isset($snapshot['sections']) && is_array($snapshot['sections'])) {
        foreach ($snapshot['sections'] as $section) {
            if (! is_array($section)) {
                continue;
            }
            foreach ($section['fields'] ?? [] as $field) {
                if (! is_array($field) || ($field['type'] ?? '') !== 'file-upload') {
                    continue;
                }
                foreach ($field['files'] ?? [] as $file) {
                    if (! is_array($file)) {
                        continue;
                    }
                    $path = ports_form_resolve_email_attachment_path($file);
                    if ($path !== null && ! isset($seen[$path])) {
                        $seen[$path] = true;
                        $paths[] = $path;
                    }
                }
            }
        }
    }

    if ($paths !== []) {
        return $paths;
    }

    foreach (ports_form_get_ordered_fields($slug) as $field) {
        if (($field['type'] ?? '') !== 'file-upload') {
            continue;
        }
        $fieldId = (string) ($field['id'] ?? '');
        if ($fieldId === '') {
            continue;
        }
        foreach (ports_form_collect_submission_files($postId, $fieldId) as $file) {
            $path = ports_form_resolve_email_attachment_path($file);
            if ($path !== null && ! isset($seen[$path])) {
                $seen[$path] = true;
                $paths[] = $path;
            }
        }
    }

    return $paths;
}

/**
 * @param array<string, mixed> $file
 */
function ports_form_resolve_email_attachment_path(array $file): ?string
{
    $attachId = (int) ($file['id'] ?? 0);
    if ($attachId > 0) {
        $path = get_attached_file($attachId);
        if (is_string($path) && $path !== '' && is_readable($path)) {
            return $path;
        }
    }

    return null;
}
