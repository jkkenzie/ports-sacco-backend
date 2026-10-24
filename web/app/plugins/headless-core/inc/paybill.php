<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const HEADLESS_CORE_PAYBILL_PAGE_SLUG = 'portsacco-paybill';
const HEADLESS_CORE_PAYBILL_NUMBER = '854845';

/**
 * @return array<string, mixed>
 */
function headless_core_paybill_defaults(): array
{
    return [
        'paybillShow' => true,
        'paybillLabel' => 'Official M-PESA Paybill',
        'paybillNumber' => HEADLESS_CORE_PAYBILL_NUMBER,
        'paybillHeadline' => 'Ports DT Sacco official M-PESA Paybill',
        'paybillAccountHint' => 'Account number: your Ports SACCO membership number',
        'paybillWarning' => 'Ports DT Sacco will never ask you to pay a different paybill. Ignore anyone who sends another number — they are not us.',
        'paybillPageUrl' => '/' . HEADLESS_CORE_PAYBILL_PAGE_SLUG,
        'kickerText' => 'Verify before you pay',
        'howToHeading' => 'How to pay',
        'howToHtml' => '<ol><li>Go to M-PESA</li><li>Select Lipa na M-PESA, then Pay Bill</li><li>Enter business number <strong>' . HEADLESS_CORE_PAYBILL_NUMBER . '</strong></li><li>Enter your Ports SACCO membership number as the account</li><li>Enter the amount and your M-PESA PIN</li></ol>',
        'sectionBgColor' => '#F5F4EE',
        'cardBgColor' => '#ffffff',
        'accentColor' => '#EE6E2A',
        'numberColor' => '#1f0026',
    ];
}

/**
 * Shared paybill fields used by the mobile-app section, footer app links, and paybill page.
 *
 * @param array<string, mixed> $attrs
 * @return array<string, mixed>
 */
function headless_core_sanitize_paybill_fields(array $attrs): array
{
    $defaults = headless_core_paybill_defaults();

    $number = preg_replace('/\s+/', '', (string) ($attrs['paybillNumber'] ?? ''));
    $number = preg_replace('/[^0-9]/', '', (string) $number);
    if (! is_string($number) || $number === '') {
        $number = (string) $defaults['paybillNumber'];
    }

    $pageUrl = trim((string) ($attrs['paybillPageUrl'] ?? ''));
    if ($pageUrl === '') {
        $pageUrl = (string) $defaults['paybillPageUrl'];
    } elseif (function_exists('headless_core_menu_url_to_path')) {
        $pageUrl = headless_core_menu_url_to_path($pageUrl);
    }

    $howTo = isset($attrs['howToHtml']) ? trim((string) $attrs['howToHtml']) : '';

    return [
        'paybillShow' => array_key_exists('paybillShow', $attrs)
            ? ! empty($attrs['paybillShow'])
            : (bool) $defaults['paybillShow'],
        'paybillLabel' => sanitize_text_field((string) ($attrs['paybillLabel'] ?? $defaults['paybillLabel'])),
        'paybillNumber' => $number,
        'paybillHeadline' => sanitize_text_field((string) ($attrs['paybillHeadline'] ?? $defaults['paybillHeadline'])),
        'paybillAccountHint' => sanitize_text_field((string) ($attrs['paybillAccountHint'] ?? $defaults['paybillAccountHint'])),
        'paybillWarning' => sanitize_textarea_field((string) ($attrs['paybillWarning'] ?? $defaults['paybillWarning'])),
        'paybillPageUrl' => $pageUrl,
        'kickerText' => sanitize_text_field((string) ($attrs['kickerText'] ?? $defaults['kickerText'])),
        'howToHeading' => sanitize_text_field((string) ($attrs['howToHeading'] ?? $defaults['howToHeading'])),
        'howToHtml' => $howTo !== '' ? wp_kses_post($howTo) : (string) $defaults['howToHtml'],
        'sectionBgColor' => function_exists('headless_core_sanitize_color_string')
            ? headless_core_sanitize_color_string((string) ($attrs['sectionBgColor'] ?? ''), (string) $defaults['sectionBgColor'])
            : (string) $defaults['sectionBgColor'],
        'cardBgColor' => function_exists('headless_core_sanitize_color_string')
            ? headless_core_sanitize_color_string((string) ($attrs['cardBgColor'] ?? ''), (string) $defaults['cardBgColor'])
            : (string) $defaults['cardBgColor'],
        'accentColor' => function_exists('headless_core_sanitize_color_string')
            ? headless_core_sanitize_color_string((string) ($attrs['accentColor'] ?? ''), (string) $defaults['accentColor'])
            : (string) $defaults['accentColor'],
        'numberColor' => function_exists('headless_core_sanitize_color_string')
            ? headless_core_sanitize_color_string((string) ($attrs['numberColor'] ?? ''), (string) $defaults['numberColor'])
            : (string) $defaults['numberColor'],
    ];
}

/**
 * Crawlable H1 inside #root so Google can see the paybill number without executing React.
 */
function headless_core_paybill_crawler_inner_html(): string
{
    $d = headless_core_paybill_defaults();
    $number = esc_html((string) $d['paybillNumber']);
    $headline = esc_html((string) $d['paybillHeadline']);
    $hint = esc_html((string) $d['paybillAccountHint']);
    $warning = esc_html((string) $d['paybillWarning']);

    return '<section class="portsacco-paybill-crawler" style="max-width:960px;margin:2rem auto;padding:1.5rem;font-family:sans-serif;color:#1f0026">'
        . '<p>' . esc_html((string) $d['kickerText']) . '</p>'
        . '<h1 style="font-size:3rem;letter-spacing:0.12em">' . $number . '</h1>'
        . '<p>' . $headline . '</p>'
        . '<p>' . $hint . '</p>'
        . '<p><strong>' . $warning . '</strong></p>'
        . '</section>';
}

function headless_core_paybill_inject_crawler_html(string $html, string $path): string
{
    $normalized = '/' . strtolower(trim($path, '/'));
    if ($normalized !== '/' . HEADLESS_CORE_PAYBILL_PAGE_SLUG) {
        return $html;
    }

    if (! preg_match('/<div([^>]*\bid=["\']root["\'][^>]*)>/i', $html, $match, PREG_OFFSET_CAPTURE)) {
        return $html;
    }

    $pos = (int) $match[0][1] + strlen($match[0][0]);

    return substr($html, 0, $pos) . headless_core_paybill_crawler_inner_html() . substr($html, $pos);
}
