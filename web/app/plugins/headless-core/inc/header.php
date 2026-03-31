<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const HEADLESS_CORE_HEADER_CACHE_KEY = 'header_data';
const HEADLESS_CORE_HEADER_TRANSIENT_TTL = 12 * HOUR_IN_SECONDS;

/**
 * Register header CPT.
 */
add_action('init', static function (): void {
    register_post_type('header', [
        'labels' => [
            'name' => __('Header', 'headless-core'),
            'singular_name' => __('Header', 'headless-core'),
            'menu_name' => __('Header', 'headless-core'),
            'add_new_item' => __('Add Header', 'headless-core'),
            'edit_item' => __('Edit Header', 'headless-core'),
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
 * Ensure single header entry exists.
 */
add_action('admin_init', static function (): void {
    if (! current_user_can('edit_posts')) {
        return;
    }

    $headerId = headless_core_get_or_create_header_post_id();
    if ($headerId <= 0) {
        return;
    }

    if (! isset($_GET['post_type']) || (string) $_GET['post_type'] !== 'header') {
        return;
    }

    if (isset($_GET['action']) && (string) $_GET['action'] === 'edit') {
        return;
    }

    if (isset($_GET['post']) && (int) $_GET['post'] === $headerId) {
        return;
    }

    $editUrl = admin_url('post.php?post=' . $headerId . '&action=edit');
    wp_safe_redirect($editUrl);
    exit;
});

/**
 * Hide "Add New" from submenu and list UI.
 */
add_action('admin_menu', static function (): void {
    remove_submenu_page('edit.php?post_type=header', 'post-new.php?post_type=header');
}, 999);

add_action('admin_head', static function (): void {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (! $screen || $screen->post_type !== 'header') {
        return;
    }

    echo '<style>
        .post-type-header .page-title-action,
        .post-type-header a[href*="post-new.php?post_type=header"] { display: none !important; }
    </style>';
});

/**
 * Create default header post if absent.
 */
function headless_core_get_or_create_header_post_id(): int
{
    $posts = get_posts([
        'post_type' => 'header',
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
            headless_core_seed_header_post_content($existingId);
        }

        return $existingId;
    }

    $postId = wp_insert_post([
        'post_type' => 'header',
        'post_title' => 'Main Header',
        'post_status' => 'publish',
        'post_content' => '',
    ], true);

    if (is_wp_error($postId)) {
        return 0;
    }

    $postId = (int) $postId;
    headless_core_seed_header_post_content($postId);

    return $postId;
}

/**
 * Seed default structured Gutenberg blocks to a header post.
 */
function headless_core_seed_header_post_content(int $postId): void
{
    if ($postId <= 0) {
        return;
    }

    $defaults = headless_core_header_defaults();
    $blocks = [
        ['name' => 'custom/header-topbar', 'attrs' => $defaults['topbar']],
        ['name' => 'custom/header-main', 'attrs' => $defaults['main']],
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

    remove_action('save_post_header', 'headless_core_on_header_save_invalidate_and_enforce', 20);
    wp_update_post([
        'ID' => $postId,
        'post_content' => trim($content),
    ]);
    add_action('save_post_header', 'headless_core_on_header_save_invalidate_and_enforce', 20, 1);
}

add_action('save_post_header', 'headless_core_on_header_save_invalidate_and_enforce', 20, 1);

/**
 * Handle cache invalidation and single-entry enforcement on header saves.
 */
function headless_core_on_header_save_invalidate_and_enforce(int $postId): void
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

    headless_core_transient_delete_raw(HEADLESS_CORE_HEADER_CACHE_KEY);

    $allIds = get_posts([
        'post_type' => 'header',
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
 * Register header endpoint.
 */
add_action('rest_api_init', static function (): void {
    register_rest_route('custom/v1', '/header', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_header',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_header()
{
    $cached = headless_core_transient_get_raw(HEADLESS_CORE_HEADER_CACHE_KEY);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $postId = headless_core_get_or_create_header_post_id();
    if ($postId <= 0) {
        return new WP_Error('header_missing', __('Header entry not found.', 'headless-core'), ['status' => 404]);
    }

    $post = get_post($postId);
    if (! $post instanceof WP_Post || $post->post_type !== 'header') {
        return new WP_Error('header_invalid', __('Invalid header entry.', 'headless-core'), ['status' => 404]);
    }

    $parsed = parse_blocks((string) $post->post_content);
    $data = headless_core_header_extract_data($parsed);
    $data = headless_core_header_merge_defaults($data);

    headless_core_transient_set_raw(HEADLESS_CORE_HEADER_CACHE_KEY, $data, HEADLESS_CORE_HEADER_TRANSIENT_TTL);

    return new WP_REST_Response($data, 200);
}

/**
 * @param array<int, array<string, mixed>> $blocks
 * @return array<string, mixed>
 */
function headless_core_header_extract_data(array $blocks): array
{
    $data = [
        'topbar' => [],
        'main' => [],
    ];

    foreach ($blocks as $block) {
        $name = (string) ($block['blockName'] ?? '');
        $attrs = is_array($block['attrs'] ?? null) ? $block['attrs'] : [];

        if ($name === 'custom/header-topbar') {
            $data['topbar'] = headless_core_header_sanitize_topbar($attrs);
        }
        if ($name === 'custom/header-main') {
            $data['main'] = headless_core_header_sanitize_main($attrs);
            $data['main']['logo'] = headless_core_header_icon_asset((int) ($data['main']['logoId'] ?? 0));
        }
    }

    return $data;
}

function headless_core_header_icon_asset(int $attachmentId): array
{
    if ($attachmentId <= 0) {
        return ['id' => 0, 'url' => '', 'svg' => ''];
    }

    $url = wp_get_attachment_url($attachmentId);
    if (! is_string($url) || $url === '') {
        $url = '';
    }

    $svg = '';
    $path = get_attached_file($attachmentId);
    if (is_string($path) && $path !== '' && file_exists($path)) {
        $ext = strtolower((string) pathinfo($path, PATHINFO_EXTENSION));
        if ($ext === 'svg') {
            $raw = (string) file_get_contents($path);
            $svg = wp_kses_post($raw);
        }
    }

    return [
        'id' => $attachmentId,
        'url' => $url,
        'svg' => $svg,
    ];
}

function headless_core_header_defaults(): array
{
    return [
        'topbar' => [
            'bgColor' => '#1BB5B5',
            'textColor' => '#ffffff',
            'hoverColor' => '#ee6e2a',
            'links' => [
                ['label' => 'NEWS & EVENTS', 'url' => '#'],
                ['label' => 'CAREERS', 'url' => '#'],
                ['label' => 'TENDERS', 'url' => '#'],
            ],
            'locationItems' => [
                ['label' => 'MOMBASA', 'url' => '#'],
                ['label' => 'VOI', 'url' => '#'],
                ['label' => 'NAIROBI', 'url' => '#'],
                ['label' => 'KILUMU', 'url' => '#'],
            ],
            'phoneText' => 'CALL US: +254 111 173 000',
            'phoneUrl' => '',
            'loginLabel' => 'MEMBER LOGIN',
            'loginUrl' => '',
        ],
        'main' => [
            'bgColor' => '#ffffff',
            'logoId' => 0,
        ],
    ];
}

function headless_core_header_merge_defaults(array $data): array
{
    $defaults = headless_core_header_defaults();
    return headless_core_header_merge_non_empty($defaults, $data);
}

function headless_core_header_merge_non_empty(array $defaults, array $data): array
{
    $out = $defaults;
    foreach ($data as $key => $val) {
        if (! array_key_exists($key, $defaults)) {
            continue;
        }
        if (is_array($defaults[$key]) && is_array($val)) {
            $out[$key] = headless_core_header_merge_non_empty($defaults[$key], $val);
            continue;
        }
        if ($val !== null && $val !== '' && $val !== [] && $val !== false) {
            $out[$key] = $val;
        }
    }
    return $out;
}

function headless_core_header_sanitize_topbar(array $attrs): array
{
    $out = [];
    $out['bgColor'] = headless_core_sanitize_color_string((string) ($attrs['bgColor'] ?? ''), '#1BB5B5');
    $out['textColor'] = headless_core_sanitize_color_string((string) ($attrs['textColor'] ?? ''), '#ffffff');
    $out['hoverColor'] = headless_core_sanitize_color_string((string) ($attrs['hoverColor'] ?? ''), '#ee6e2a');
    $out['phoneText'] = sanitize_text_field((string) ($attrs['phoneText'] ?? ''));
    $out['phoneUrl'] = esc_url_raw((string) ($attrs['phoneUrl'] ?? ''));
    $out['loginLabel'] = sanitize_text_field((string) ($attrs['loginLabel'] ?? ''));
    $out['loginUrl'] = esc_url_raw((string) ($attrs['loginUrl'] ?? ''));

    $linksIn = $attrs['links'] ?? [];
    $linksOut = [];
    if (is_array($linksIn)) {
        foreach ($linksIn as $row) {
            if (! is_array($row)) {
                continue;
            }
            $label = sanitize_text_field((string) ($row['label'] ?? ''));
            $url = esc_url_raw((string) ($row['url'] ?? ''));
            if ($label === '') {
                continue;
            }
            $linksOut[] = ['label' => $label, 'url' => $url !== '' ? $url : '#'];
        }
    }
    $out['links'] = $linksOut;

    $locationsIn = $attrs['locationItems'] ?? [];
    $locationsOut = [];
    if (is_array($locationsIn)) {
        foreach ($locationsIn as $row) {
            if (! is_array($row)) {
                continue;
            }
            $label = sanitize_text_field((string) ($row['label'] ?? ''));
            $url = esc_url_raw((string) ($row['url'] ?? ''));
            if ($label === '') {
                continue;
            }
            $locationsOut[] = ['label' => $label, 'url' => $url !== '' ? $url : '#'];
        }
    }

    // Back-compat: if old locationText exists and no locationItems, convert.
    if (! $locationsOut && isset($attrs['locationText'])) {
        $txt = trim((string) $attrs['locationText']);
        if ($txt !== '') {
            $locationsOut[] = ['label' => $txt, 'url' => '#'];
        }
    }
    $out['locationItems'] = $locationsOut;

    return $out;
}

function headless_core_header_sanitize_main(array $attrs): array
{
    $out = [];
    $out['bgColor'] = headless_core_sanitize_color_string((string) ($attrs['bgColor'] ?? ''), '#ffffff');
    $out['logoId'] = isset($attrs['logoId']) ? (int) $attrs['logoId'] : 0;
    return $out;
}

