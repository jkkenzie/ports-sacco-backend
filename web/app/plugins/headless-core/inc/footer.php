<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const HEADLESS_CORE_FOOTER_CACHE_KEY = 'footer_data';
const HEADLESS_CORE_FOOTER_TRANSIENT_TTL = 12 * HOUR_IN_SECONDS;

/**
 * Register footer CPT.
 */
add_action('init', static function (): void {
    register_post_type('footer', [
        'labels' => [
            'name' => __('Footer', 'headless-core'),
            'singular_name' => __('Footer', 'headless-core'),
            'menu_name' => __('Footer', 'headless-core'),
            'add_new_item' => __('Add Footer', 'headless-core'),
            'edit_item' => __('Edit Footer', 'headless-core'),
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-editor-kitchensink',
        'supports' => ['title', 'editor'],
        'rewrite' => false,
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ]);
});

/**
 * Ensure single footer entry exists.
 */
add_action('admin_init', static function (): void {
    if (! current_user_can('edit_posts')) {
        return;
    }

    $footerId = headless_core_get_or_create_footer_post_id();
    if ($footerId <= 0) {
        return;
    }

    if (! isset($_GET['post_type']) || (string) $_GET['post_type'] !== 'footer') {
        return;
    }

    if (isset($_GET['action']) && (string) $_GET['action'] === 'edit') {
        return;
    }

    if (isset($_GET['post']) && (int) $_GET['post'] === $footerId) {
        return;
    }

    $editUrl = admin_url('post.php?post=' . $footerId . '&action=edit');
    wp_safe_redirect($editUrl);
    exit;
});

/**
 * Hide "Add New" from submenu and list UI.
 */
add_action('admin_menu', static function (): void {
    remove_submenu_page('edit.php?post_type=footer', 'post-new.php?post_type=footer');
}, 999);

add_action('admin_head', static function (): void {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (! $screen || $screen->post_type !== 'footer') {
        return;
    }

    echo '<style>
        .post-type-footer .page-title-action,
        .post-type-footer a[href*="post-new.php?post_type=footer"] { display: none !important; }
    </style>';
});

/**
 * Create default footer post if absent.
 */
function headless_core_get_or_create_footer_post_id(): int
{
    $posts = get_posts([
        'post_type' => 'footer',
        'post_status' => ['publish', 'draft', 'pending', 'private', 'future'],
        'posts_per_page' => 1,
        'orderby' => 'ID',
        'order' => 'ASC',
        'fields' => 'ids',
        'suppress_filters' => true,
    ]);

    if (is_array($posts) && isset($posts[0])) {
        $existingId = (int) $posts[0];
        $existingPost = get_post($existingId);
        if ($existingPost instanceof WP_Post && trim((string) $existingPost->post_content) === '') {
            headless_core_seed_footer_post_content($existingId);
        }

        return $existingId;
    }

    $postId = wp_insert_post([
        'post_type' => 'footer',
        'post_title' => 'Main Footer',
        'post_status' => 'publish',
        'post_content' => '',
    ], true);

    if (is_wp_error($postId)) {
        return 0;
    }

    $postId = (int) $postId;
    headless_core_seed_footer_post_content($postId);

    return $postId;
}

/**
 * Seed default structured Gutenberg blocks to a footer post.
 */
function headless_core_seed_footer_post_content(int $postId): void
{
    if ($postId <= 0) {
        return;
    }

    $defaults = headless_core_footer_defaults();
    $blocks = [
        ['name' => 'custom/footer-contact', 'attrs' => $defaults['contact']],
        ['name' => 'custom/footer-branches', 'attrs' => ['branches' => $defaults['branches']]],
        ['name' => 'custom/footer-app-links', 'attrs' => $defaults['appLinks']],
        ['name' => 'custom/footer-socials', 'attrs' => $defaults['socials']],
        ['name' => 'custom/footer-hours', 'attrs' => $defaults['hours']],
        ['name' => 'custom/footer-bottom', 'attrs' => $defaults['bottom']],
    ];

    $content = '';
    foreach ($blocks as $block) {
        $name = (string) $block['name'];
        $attrs = is_array($block['attrs']) ? $block['attrs'] : [];
        $content .= sprintf(
            '<!-- wp:%s %s /-->' . "\n\n",
            $name,
            wp_json_encode($attrs, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        );
    }

    remove_action('save_post_footer', 'headless_core_on_footer_save_invalidate_and_enforce', 20);
    wp_update_post([
        'ID' => $postId,
        'post_content' => trim($content),
    ]);
    add_action('save_post_footer', 'headless_core_on_footer_save_invalidate_and_enforce', 20, 1);
}

/**
 * Remove extra footer posts; keep the oldest one.
 */
add_action('save_post_footer', 'headless_core_on_footer_save_invalidate_and_enforce', 20, 1);

/**
 * Handle cache invalidation and single-entry enforcement on footer saves.
 */
function headless_core_on_footer_save_invalidate_and_enforce(int $postId): void
{
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (wp_is_post_revision($postId) || wp_is_post_autosave($postId)) {
        return;
    }
    if (! current_user_can('edit_post', $postId)) {
        return;
    }

    headless_core_transient_delete_raw(HEADLESS_CORE_FOOTER_CACHE_KEY);

    $allIds = get_posts([
        'post_type' => 'footer',
        'post_status' => ['publish', 'draft', 'pending', 'private', 'future'],
        'posts_per_page' => -1,
        'orderby' => 'ID',
        'order' => 'ASC',
        'fields' => 'ids',
        'suppress_filters' => true,
    ]);

    if (! is_array($allIds) || count($allIds) <= 1) {
        return;
    }

    $keepId = (int) $allIds[0];
    foreach ($allIds as $id) {
        $id = (int) $id;
        if ($id === $keepId) {
            continue;
        }
        wp_delete_post($id, true);
    }
}

/**
 * Register footer endpoint.
 */
add_action('rest_api_init', static function (): void {
    register_rest_route('custom/v1', '/footer', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_footer',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_footer()
{
    $cached = headless_core_transient_get_raw(HEADLESS_CORE_FOOTER_CACHE_KEY);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $postId = headless_core_get_or_create_footer_post_id();
    if ($postId <= 0) {
        return new WP_Error('footer_missing', __('Footer entry not found.', 'headless-core'), ['status' => 404]);
    }

    $post = get_post($postId);
    if (! $post instanceof WP_Post || $post->post_type !== 'footer') {
        return new WP_Error('footer_invalid', __('Invalid footer entry.', 'headless-core'), ['status' => 404]);
    }

    $parsed = parse_blocks((string) $post->post_content);
    $data = headless_core_footer_extract_data($parsed);
    $data = headless_core_footer_merge_defaults($data);

    headless_core_transient_set_raw(HEADLESS_CORE_FOOTER_CACHE_KEY, $data, HEADLESS_CORE_FOOTER_TRANSIENT_TTL);

    return new WP_REST_Response($data, 200);
}

/**
 * @param array<int, array<string, mixed>> $blocks
 * @return array<string, mixed>
 */
function headless_core_footer_extract_data(array $blocks): array
{
    $data = [
        'contact' => [],
        'branches' => [],
        'socials' => [],
        'appLinks' => [],
        'hours' => [],
        'bottom' => [],
    ];

    foreach ($blocks as $block) {
        if (! is_array($block)) {
            continue;
        }
        $name = (string) ($block['blockName'] ?? '');
        if (strpos($name, 'custom/footer-') !== 0) {
            continue;
        }
        $attrs = $block['attrs'] ?? [];
        if (! is_array($attrs)) {
            $attrs = [];
        }

        switch ($name) {
            case 'custom/footer-contact':
                $data['contact'] = headless_core_footer_sanitize_contact($attrs);
                $data['contact']['logo'] = headless_core_footer_icon_asset((int) ($data['contact']['logoId'] ?? 0));
                $data['contact']['addressIcon'] = headless_core_footer_icon_asset((int) ($data['contact']['addressIconId'] ?? 0));
                $data['contact']['phoneIcon'] = headless_core_footer_icon_asset((int) ($data['contact']['phoneIconId'] ?? 0));
                $data['contact']['poBoxIcon'] = headless_core_footer_icon_asset((int) ($data['contact']['poBoxIconId'] ?? 0));
                $data['contact']['emailIcon'] = headless_core_footer_icon_asset((int) ($data['contact']['emailIconId'] ?? 0));
                break;
            case 'custom/footer-branches':
                $data['branches'] = headless_core_footer_sanitize_branches($attrs['branches'] ?? []);
                break;
            case 'custom/footer-socials':
                $data['socials'] = headless_core_footer_sanitize_socials($attrs);
                $data['socials']['facebookIcon'] = headless_core_footer_icon_asset((int) ($data['socials']['facebookIconId'] ?? 0));
                $data['socials']['twitterIcon'] = headless_core_footer_icon_asset((int) ($data['socials']['twitterIconId'] ?? 0));
                $data['socials']['instagramIcon'] = headless_core_footer_icon_asset((int) ($data['socials']['instagramIconId'] ?? 0));
                $data['socials']['linkedinIcon'] = headless_core_footer_icon_asset((int) ($data['socials']['linkedinIconId'] ?? 0));
                $data['socials']['youtubeIcon'] = headless_core_footer_icon_asset((int) ($data['socials']['youtubeIconId'] ?? 0));
                break;
            case 'custom/footer-app-links':
                $data['appLinks'] = headless_core_footer_sanitize_app_links($attrs);
                $data['appLinks']['googlePlayIcon'] = headless_core_footer_icon_asset((int) ($data['appLinks']['googlePlayIconId'] ?? 0));
                $data['appLinks']['appStoreIcon'] = headless_core_footer_icon_asset((int) ($data['appLinks']['appStoreIconId'] ?? 0));
                break;
            case 'custom/footer-hours':
                $data['hours'] = headless_core_footer_sanitize_hours($attrs);
                break;
            case 'custom/footer-bottom':
                $data['bottom'] = headless_core_footer_sanitize_bottom($attrs);
                break;
        }
    }

    return $data;
}

/**
 * @return array<string, mixed>
 */
function headless_core_footer_icon_asset(int $attachmentId): array
{
    if ($attachmentId <= 0) {
        return ['id' => 0, 'url' => '', 'svg' => ''];
    }

    $url = wp_get_attachment_url($attachmentId);
    if (! is_string($url)) {
        $url = '';
    }

    $svg = '';
    if (function_exists('headless_core_attachment_inline_svg_markup')) {
        $svg = headless_core_attachment_inline_svg_markup($attachmentId);
        if (! is_string($svg)) {
            $svg = '';
        }
    }

    return [
        'id' => $attachmentId,
        'url' => $url,
        'svg' => $svg,
    ];
}

/**
 * @return array<string, mixed>
 */
function headless_core_footer_defaults(): array
{
    return [
        'contact' => [
            'title' => 'Branch Network',
            'officeName' => 'Mombasa - Head Office',
            'officeAddress' => 'Ports Sacco Plaza, Mwakilingo Road, off Moi Avenue, Mombasa',
            'phone' => 'Tel: 0111 173 000',
            'poBox' => 'P.O Box 95372 - 80100, Mombasa',
            'email' => 'info@portsacco.co.ke',
            'tagline' => 'UPLIFTING PEOPLE',
            'logoId' => 0,
            'addressIconId' => 0,
            'phoneIconId' => 0,
            'poBoxIconId' => 0,
            'emailIconId' => 0,
            'iconColor' => '#FFFFFF',
        ],
        'branches' => [
            ['name' => 'Nairobi CBD Office', 'address' => 'KCS House, 7th Floor, Mama Ngina Street', 'phone' => 'Tel: 0111 173 138'],
            ['name' => 'Nairobi Branch', 'address' => 'KPA-ICD Road, Off Mombasa Road', 'phone' => 'Tel: 0111 173 138'],
            ['name' => 'Kisumu Office', 'address' => "Tuff Foam Mall Ground Floor, Achieng' Oneko Road Opp. Reinsurance Plaza", 'phone' => 'Tel: 0111 173 142'],
            ['name' => 'Voi Office', 'address' => 'KPLC Street, Opposite Post Bank', 'phone' => 'Tel: 0111 173 143'],
        ],
        'socials' => [
            'facebook' => '',
            'twitter' => '',
            'instagram' => '',
            'linkedin' => '',
            'youtube' => '',
            'facebookIconId' => 0,
            'twitterIconId' => 0,
            'instagramIconId' => 0,
            'linkedinIconId' => 0,
            'youtubeIconId' => 0,
            'iconColor' => '#FFFFFF',
            'iconHoverColor' => '#22ACB6',
            'youtubeInternalColor' => '#FFFFFF',
        ],
        'appLinks' => [
            'title' => 'Download Mobile App',
            'googlePlayUrl' => '',
            'appStoreUrl' => '',
            'googlePlayIconId' => 0,
            'appStoreIconId' => 0,
            'iconColor' => '#FFFFFF',
            'iconHoverColor' => '#22ACB6',
            'iconWidth' => 144,
            'iconHeight' => 48,
        ],
        'hours' => [
            'title' => 'Banking Hours',
            'weekdaysLabel' => 'Monday - Friday:',
            'weekdaysTime' => '08:30 AM - 04:00 PM',
            'saturdayLabel' => 'Saturday:',
            'saturdayTime' => '09:00 AM - 12:00 PM',
            'sundayLabel' => 'Sunday:',
            'sundayTime' => 'Closed',
        ],
        'bottom' => [
            'copyright' => '© 2026 PORTS SACCO',
            'rights' => '- ALL RIGHTS RESERVED',
            'privacyLabel' => 'PRIVACY POLICY',
            'privacyUrl' => '#',
            'termsLabel' => 'TERMS AND CONDITIONS',
            'termsUrl' => '#',
            'credit' => 'A SMITH CREATIVE DESIGN',
            'creditUrl' => '',
            'linkColor' => '#22ACB6',
            'linkHoverColor' => '#FFFFFF',
        ],
    ];
}

/**
 * @param array<string, mixed> $data
 * @return array<string, mixed>
 */
function headless_core_footer_merge_defaults(array $data): array
{
    $defaults = headless_core_footer_defaults();
    return headless_core_footer_merge_non_empty($defaults, $data);
}

/**
 * Merge defaults with payload while ignoring empty string/null values.
 *
 * @param array<string, mixed> $defaults
 * @param array<string, mixed> $data
 * @return array<string, mixed>
 */
function headless_core_footer_merge_non_empty(array $defaults, array $data): array
{
    $out = $defaults;
    foreach ($defaults as $key => $defaultValue) {
        if (! array_key_exists($key, $data)) {
            continue;
        }
        $incoming = $data[$key];
        if (is_array($defaultValue)) {
            if (headless_core_is_list_array($defaultValue)) {
                if (is_array($incoming) && $incoming !== []) {
                    $out[$key] = $incoming;
                }
                continue;
            }
            if (is_array($incoming)) {
                $out[$key] = headless_core_footer_merge_non_empty($defaultValue, $incoming);
            }
            continue;
        }
        if (is_string($defaultValue)) {
            $value = is_scalar($incoming) ? trim((string) $incoming) : '';
            if ($value !== '') {
                $out[$key] = $value;
            }
            continue;
        }
        if ($incoming !== null && $incoming !== '') {
            $out[$key] = $incoming;
        }
    }
    foreach ($data as $key => $incoming) {
        if (array_key_exists($key, $out)) {
            continue;
        }
        if ($incoming === '' || $incoming === null) {
            continue;
        }
        $out[$key] = $incoming;
    }

    return $out;
}

/**
 * @param array<mixed> $value
 */
function headless_core_is_list_array(array $value): bool
{
    if (function_exists('array_is_list')) {
        return array_is_list($value);
    }

    return array_keys($value) === range(0, count($value) - 1);
}

/**
 * @param mixed $rows
 * @return array<int, array<string, string>>
 */
function headless_core_footer_sanitize_branches($rows): array
{
    if (! is_array($rows)) {
        return [];
    }

    $out = [];
    foreach ($rows as $row) {
        if (! is_array($row)) {
            continue;
        }
        $name = sanitize_text_field((string) ($row['name'] ?? ''));
        $address = sanitize_text_field((string) ($row['address'] ?? ''));
        $phone = sanitize_text_field((string) ($row['phone'] ?? ''));
        if ($name === '' && $address === '' && $phone === '') {
            continue;
        }
        $out[] = ['name' => $name, 'address' => $address, 'phone' => $phone];
    }

    return $out;
}

/**
 * @param array<string, mixed> $attrs
 * @return array<string, string>
 */
function headless_core_footer_sanitize_contact(array $attrs): array
{
    $iconColor = sanitize_hex_color((string) ($attrs['iconColor'] ?? ''));
    return [
        'title' => sanitize_text_field((string) ($attrs['title'] ?? '')),
        'officeName' => sanitize_text_field((string) ($attrs['officeName'] ?? '')),
        'officeAddress' => sanitize_text_field((string) ($attrs['officeAddress'] ?? '')),
        'phone' => sanitize_text_field((string) ($attrs['phone'] ?? '')),
        'poBox' => sanitize_text_field((string) ($attrs['poBox'] ?? '')),
        'email' => sanitize_email((string) ($attrs['email'] ?? '')),
        'tagline' => sanitize_text_field((string) ($attrs['tagline'] ?? '')),
        'logoId' => (int) ($attrs['logoId'] ?? 0),
        'addressIconId' => (int) ($attrs['addressIconId'] ?? 0),
        'phoneIconId' => (int) ($attrs['phoneIconId'] ?? 0),
        'poBoxIconId' => (int) ($attrs['poBoxIconId'] ?? 0),
        'emailIconId' => (int) ($attrs['emailIconId'] ?? 0),
        'iconColor' => is_string($iconColor) && $iconColor !== '' ? $iconColor : '#FFFFFF',
    ];
}

/**
 * @param array<string, mixed> $attrs
 * @return array<string, string>
 */
function headless_core_footer_sanitize_socials(array $attrs): array
{
    $iconColor = sanitize_hex_color((string) ($attrs['iconColor'] ?? ''));
    $iconHoverColor = sanitize_hex_color((string) ($attrs['iconHoverColor'] ?? ''));
    $youtubeInternalColor = sanitize_hex_color((string) ($attrs['youtubeInternalColor'] ?? ''));
    return [
        'facebook' => esc_url_raw((string) ($attrs['facebook'] ?? '')),
        'twitter' => esc_url_raw((string) ($attrs['twitter'] ?? '')),
        'instagram' => esc_url_raw((string) ($attrs['instagram'] ?? '')),
        'linkedin' => esc_url_raw((string) ($attrs['linkedin'] ?? '')),
        'youtube' => esc_url_raw((string) ($attrs['youtube'] ?? '')),
        'facebookIconId' => (int) ($attrs['facebookIconId'] ?? 0),
        'twitterIconId' => (int) ($attrs['twitterIconId'] ?? 0),
        'instagramIconId' => (int) ($attrs['instagramIconId'] ?? 0),
        'linkedinIconId' => (int) ($attrs['linkedinIconId'] ?? 0),
        'youtubeIconId' => (int) ($attrs['youtubeIconId'] ?? 0),
        'iconColor' => is_string($iconColor) && $iconColor !== '' ? $iconColor : '#FFFFFF',
        'iconHoverColor' => is_string($iconHoverColor) && $iconHoverColor !== '' ? $iconHoverColor : '#22ACB6',
        'youtubeInternalColor' => is_string($youtubeInternalColor) && $youtubeInternalColor !== '' ? $youtubeInternalColor : '#FFFFFF',
    ];
}

/**
 * @param array<string, mixed> $attrs
 * @return array<string, string>
 */
function headless_core_footer_sanitize_app_links(array $attrs): array
{
    $iconColor = sanitize_hex_color((string) ($attrs['iconColor'] ?? ''));
    $iconHoverColor = sanitize_hex_color((string) ($attrs['iconHoverColor'] ?? ''));
    $iconWidth = isset($attrs['iconWidth']) ? (int) $attrs['iconWidth'] : 144;
    $iconHeight = isset($attrs['iconHeight']) ? (int) $attrs['iconHeight'] : 48;
    return [
        'title' => sanitize_text_field((string) ($attrs['title'] ?? '')),
        'googlePlayUrl' => esc_url_raw((string) ($attrs['googlePlayUrl'] ?? '')),
        'appStoreUrl' => esc_url_raw((string) ($attrs['appStoreUrl'] ?? '')),
        'googlePlayIconId' => (int) ($attrs['googlePlayIconId'] ?? 0),
        'appStoreIconId' => (int) ($attrs['appStoreIconId'] ?? 0),
        'iconColor' => is_string($iconColor) && $iconColor !== '' ? $iconColor : '#FFFFFF',
        'iconHoverColor' => is_string($iconHoverColor) && $iconHoverColor !== '' ? $iconHoverColor : '#22ACB6',
        'iconWidth' => $iconWidth > 0 ? $iconWidth : 144,
        'iconHeight' => $iconHeight > 0 ? $iconHeight : 48,
    ];
}

/**
 * @param array<string, mixed> $attrs
 * @return array<string, string>
 */
function headless_core_footer_sanitize_hours(array $attrs): array
{
    return [
        'title' => sanitize_text_field((string) ($attrs['title'] ?? '')),
        'weekdaysLabel' => sanitize_text_field((string) ($attrs['weekdaysLabel'] ?? '')),
        'weekdaysTime' => sanitize_text_field((string) ($attrs['weekdaysTime'] ?? '')),
        'saturdayLabel' => sanitize_text_field((string) ($attrs['saturdayLabel'] ?? '')),
        'saturdayTime' => sanitize_text_field((string) ($attrs['saturdayTime'] ?? '')),
        'sundayLabel' => sanitize_text_field((string) ($attrs['sundayLabel'] ?? '')),
        'sundayTime' => sanitize_text_field((string) ($attrs['sundayTime'] ?? '')),
    ];
}

/**
 * @param array<string, mixed> $attrs
 * @return array<string, string>
 */
function headless_core_footer_sanitize_bottom(array $attrs): array
{
    $privacyRaw = esc_url_raw((string) ($attrs['privacyUrl'] ?? ''));
    $termsRaw = esc_url_raw((string) ($attrs['termsUrl'] ?? ''));
    $privacyUrl = function_exists('headless_core_menu_url_to_path')
        ? headless_core_menu_url_to_path($privacyRaw)
        : $privacyRaw;
    $termsUrl = function_exists('headless_core_menu_url_to_path')
        ? headless_core_menu_url_to_path($termsRaw)
        : $termsRaw;
    $creditUrlInput = trim((string) ($attrs['creditUrl'] ?? ''));
    if ($creditUrlInput !== '' && strpos($creditUrlInput, 'www.') === 0) {
        $creditUrlInput = 'https://' . $creditUrlInput;
    }
    $creditUrl = esc_url_raw($creditUrlInput);
    $linkColor = sanitize_hex_color((string) ($attrs['linkColor'] ?? ''));
    $linkHoverColor = sanitize_hex_color((string) ($attrs['linkHoverColor'] ?? ''));

    return [
        'copyright' => sanitize_text_field((string) ($attrs['copyright'] ?? '')),
        'rights' => sanitize_text_field((string) ($attrs['rights'] ?? '')),
        'privacyLabel' => sanitize_text_field((string) ($attrs['privacyLabel'] ?? '')),
        'privacyUrl' => $privacyUrl,
        'termsLabel' => sanitize_text_field((string) ($attrs['termsLabel'] ?? '')),
        'termsUrl' => $termsUrl,
        'credit' => sanitize_text_field((string) ($attrs['credit'] ?? '')),
        'creditUrl' => $creditUrl,
        'linkColor' => is_string($linkColor) && $linkColor !== '' ? $linkColor : '#22ACB6',
        'linkHoverColor' => is_string($linkHoverColor) && $linkHoverColor !== '' ? $linkHoverColor : '#FFFFFF',
    ];
}
