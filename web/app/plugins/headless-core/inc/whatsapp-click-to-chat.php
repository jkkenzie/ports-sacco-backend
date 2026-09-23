<?php

declare(strict_types=1);

/**
 * Expose HoliThemes "Click to Chat for WhatsApp" settings to the React SPA.
 *
 * The plugin normally renders on wp_footer; the headless front uses app.php + Vite,
 * so the SPA loads this config and renders its own floating button.
 */

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Whether the Click to Chat plugin is active and usable.
 */
function headless_core_whatsapp_ctc_plugin_active(): bool
{
    return defined('HT_CTC_PLUGIN_FILE') || class_exists('HT_CTC', false);
}

/**
 * @return array<string, mixed>
 */
function headless_core_whatsapp_ctc_chat_options(): array
{
    if (class_exists('HT_CTC_Utils') && method_exists('HT_CTC_Utils', 'get_option')) {
        $opts = HT_CTC_Utils::get_option('ht_ctc_chat_options');
        return is_array($opts) ? $opts : [];
    }

    $opts = get_option('ht_ctc_chat_options', []);

    return is_array($opts) ? $opts : [];
}

/**
 * @param array<string, mixed> $options
 * @return array{bottom?: string, top?: string, left?: string, right?: string}
 */
function headless_core_whatsapp_ctc_position_box(array $options, bool $mobile): array
{
    $same = isset($options['same_settings']);

    if ($mobile && ! $same) {
        $a = isset($options['mobile_side_1']) ? (string) $options['mobile_side_1'] : (string) ($options['side_1'] ?? 'bottom');
        $av = isset($options['mobile_side_1_value']) ? (string) $options['mobile_side_1_value'] : (string) ($options['side_1_value'] ?? '15px');
        $b = isset($options['mobile_side_2']) ? (string) $options['mobile_side_2'] : (string) ($options['side_2'] ?? 'right');
        $bv = isset($options['mobile_side_2_value']) ? (string) $options['mobile_side_2_value'] : (string) ($options['side_2_value'] ?? '15px');
    } else {
        $a = (string) ($options['side_1'] ?? 'bottom');
        $av = (string) ($options['side_1_value'] ?? '15px');
        $b = (string) ($options['side_2'] ?? 'right');
        $bv = (string) ($options['side_2_value'] ?? '15px');
    }

    $out = [];
    foreach ([$a => $av, $b => $bv] as $key => $val) {
        $k = strtolower(trim($key));
        if (in_array($k, ['top', 'bottom', 'left', 'right'], true)) {
            $out[$k] = $val;
        }
    }

    return $out;
}

/**
 * @param array<string, mixed> $options
 */
function headless_core_whatsapp_ctc_resolve_number(array $options): string
{
    $number = isset($options['number']) ? trim((string) $options['number']) : '';
    if ($number !== '') {
        return preg_replace('/[^0-9+]/', '', $number) ?? '';
    }

    $cc = isset($options['cc']) ? trim((string) $options['cc']) : '';
    $num = isset($options['num']) ? trim((string) $options['num']) : '';
    if ($cc !== '' && $num !== '') {
        return preg_replace('/[^0-9+]/', '', $cc . $num) ?? '';
    }

    return '';
}

/**
 * @param array<string, mixed> $options
 */
function headless_core_whatsapp_ctc_global_hidden(array $options): bool
{
    $display = isset($options['display']) && is_array($options['display']) ? $options['display'] : [];
    $global = isset($display['global_display']) ? (string) $display['global_display'] : 'show';

    return $global === 'hide';
}

/**
 * Replace plugin placeholders in pre-filled message.
 */
function headless_core_whatsapp_ctc_prefill(string $template, string $pageUrl, string $pageTitle): string
{
    $site = function_exists('get_bloginfo') ? (string) get_bloginfo('name') : '';

    return str_replace(
        ['{{url}}', '{url}', '{{title}}', '{title}', '{{site}}', '{site}', '[url]'],
        [$pageUrl, $pageUrl, $pageTitle, $pageTitle, $site, $site, $pageUrl],
        $template
    );
}

/**
 * Build wa.me / web.whatsapp.com link (mirrors plugin app.js behaviour).
 *
 * @param array<string, mixed> $options
 */
function headless_core_whatsapp_ctc_build_link(
    string $digits,
    string $prefilled,
    bool $isMobile,
    array $options
): string {
    $encoded = rawurlencode($prefilled);

    $structureD = isset($options['url_structure_d']) ? (string) $options['url_structure_d'] : '';
    $structureM = isset($options['url_structure_m']) ? (string) $options['url_structure_m'] : '';

    if ($isMobile && $structureM === 'custom_url') {
        $custom = isset($options['custom_url_m']) ? trim((string) $options['custom_url_m']) : '';
        if ($custom !== '' && filter_var($custom, FILTER_VALIDATE_URL)) {
            return $custom;
        }
    }
    if (! $isMobile && $structureD === 'custom_url') {
        $custom = isset($options['custom_url_d']) ? trim((string) $options['custom_url_d']) : '';
        if ($custom !== '' && filter_var($custom, FILTER_VALIDATE_URL)) {
            return $custom;
        }
    }

    if ($isMobile && $structureM === 'wa_colon') {
        return 'whatsapp://send?phone=' . rawurlencode($digits) . '&text=' . $encoded;
    }

    if (! $isMobile && $structureD === 'web') {
        return 'https://web.whatsapp.com/send?phone=' . rawurlencode($digits) . '&text=' . $encoded;
    }

    return 'https://wa.me/' . $digits . '?text=' . $encoded;
}

/**
 * @return array<string, mixed>|null
 */
function headless_core_whatsapp_ctc_style_options(string $style): ?array
{
    $style = sanitize_file_name($style);
    if ($style === '') {
        return null;
    }

    $key = 'ht_ctc_s' . $style;
    if (class_exists('HT_CTC_Utils') && method_exists('HT_CTC_Utils', 'get_option')) {
        $opts = HT_CTC_Utils::get_option($key);
    } else {
        $opts = get_option($key, []);
    }

    return is_array($opts) ? $opts : null;
}

/**
 * @return array<string, mixed>
 */
function headless_core_whatsapp_ctc_payload(string $spaPath): array
{
    if (! headless_core_whatsapp_ctc_plugin_active()) {
        return ['enabled' => false, 'reason' => 'plugin_inactive'];
    }

    $options = headless_core_whatsapp_ctc_chat_options();
    if ($options === []) {
        return ['enabled' => false, 'reason' => 'no_options'];
    }

    if (headless_core_whatsapp_ctc_global_hidden($options)) {
        return ['enabled' => false, 'reason' => 'hidden_globally'];
    }

    $digits = headless_core_whatsapp_ctc_resolve_number($options);
    $digits = preg_replace('/[^0-9]/', '', $digits) ?? '';
    if ($digits === '') {
        return ['enabled' => false, 'reason' => 'no_number'];
    }

    $others = get_option('ht_ctc_othersettings', []);
    $others = is_array($others) ? $others : [];

    $zindexRaw = isset($others['zindex']) ? $others['zindex'] : '99999999';
    $zindex = is_scalar($zindexRaw) && is_numeric(trim((string) $zindexRaw))
        ? (int) trim((string) $zindexRaw)
        : 99999999;

    $sameSettings = isset($options['same_settings']);
    $styleDesktop = (string) ($options['style_desktop'] ?? '2');
    $styleMobile = $sameSettings ? $styleDesktop : (string) ($options['style_mobile'] ?? $styleDesktop);

    $home = function_exists('home_url') ? (string) home_url('/') : '';
    $path = $spaPath !== '' ? $spaPath : '/';
    if ($path[0] !== '/') {
        $path = '/' . $path;
    }
    $pageUrl = $home !== '' ? rtrim($home, '/') . $path : $path;
    $pageTitle = function_exists('wp_strip_all_tags') ? wp_strip_all_tags((string) get_bloginfo('name')) : 'Ports Sacco';

    $prefilledRaw = isset($options['pre_filled']) ? (string) $options['pre_filled'] : '';
    $prefilled = headless_core_whatsapp_ctc_prefill($prefilledRaw, $pageUrl, $pageTitle);

    $callToAction = isset($options['call_to_action']) ? trim((string) $options['call_to_action']) : '';
    if ($callToAction === '' && in_array($styleDesktop, ['1', '4', '6', '8'], true)) {
        $callToAction = 'WhatsApp us';
    }

    $displayMobile = (string) ($options['display_mobile'] ?? 'show');
    $displayDesktop = (string) ($options['display_desktop'] ?? 'show');

    $urlTarget = (string) ($options['url_target_d'] ?? '_blank');

    return [
        'enabled' => true,
        'number' => $digits,
        'callToAction' => $callToAction,
        'preFilled' => $prefilled,
        'displayMobile' => $displayMobile,
        'displayDesktop' => $displayDesktop,
        'zIndex' => $zindex,
        'urlTarget' => $urlTarget,
        'styleDesktop' => $styleDesktop,
        'styleMobile' => $styleMobile,
        'positionDesktop' => headless_core_whatsapp_ctc_position_box($options, false),
        'positionMobile' => headless_core_whatsapp_ctc_position_box($options, true),
        'styleOptionsDesktop' => headless_core_whatsapp_ctc_style_options($styleDesktop),
        'styleOptionsMobile' => headless_core_whatsapp_ctc_style_options($styleMobile),
        'whatsappUrlDesktop' => headless_core_whatsapp_ctc_build_link($digits, $prefilled, false, $options),
        'whatsappUrlMobile' => headless_core_whatsapp_ctc_build_link($digits, $prefilled, true, $options),
    ];
}

add_action('rest_api_init', static function (): void {
    headless_core_register_rest_route('/whatsapp-click-to-chat', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_whatsapp_click_to_chat',
        'permission_callback' => '__return_true',
        'args' => [
            'path' => [
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => static function ($value) {
                    $path = trim((string) $value);
                    if ($path === '') {
                        return '';
                    }
                    if ($path[0] !== '/') {
                        $path = '/' . $path;
                    }

                    return $path;
                },
            ],
        ],
    ]);
});

/**
 * @return WP_REST_Response
 */
function headless_core_rest_whatsapp_click_to_chat(WP_REST_Request $request)
{
    $path = (string) $request->get_param('path');
    $payload = headless_core_whatsapp_ctc_payload($path);

    $response = new WP_REST_Response($payload, 200);
    headless_core_rest_nocache_headers($response);

    return $response;
}
