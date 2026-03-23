<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_filter('rest_post_dispatch', static function ($response, $server, $request) {
    if (! $request instanceof WP_REST_Request || ! $response instanceof WP_REST_Response) {
        return $response;
    }

    $route = (string) $request->get_route();
    if (strpos($route, '/custom/v1/') !== false) {
        $response->header('Cache-Control', 'public, max-age=' . (int) headless_core_cache_ttl());
    }

    return $response;
}, 10, 3);

add_action('rest_api_init', static function (): void {
    register_rest_route('custom/v1', '/page/(?P<slug>.+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_page',
        'permission_callback' => '__return_true',
        'args' => [
            'slug' => [
                'required' => true,
                'type' => 'string',
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/page', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_page_home',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('custom/v1', '/menu/(?P<location>[a-z0-9\-_]+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_menu',
        'permission_callback' => '__return_true',
        'args' => [
            'location' => [
                'required' => true,
                'type' => 'string',
            ],
        ],
    ]);
});

add_filter('rest_pre_serve_request', static function ($served, $result, $request, $server) {
    $origin = getenv('HEADLESS_CORS_ORIGIN');
    if (! is_string($origin) || $origin === '') {
        return $served;
    }

    if (! $request instanceof WP_REST_Request) {
        return $served;
    }

    $route = (string) $request->get_route();
    if (strpos($route, '/custom/v1/') === false) {
        return $served;
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');

    return $served;
}, 10, 4);

/**
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_page_home()
{
    return headless_core_build_page_response('home');
}

/**
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_page(WP_REST_Request $request)
{
    $slug = (string) $request->get_param('slug');
    $slug = rawurldecode($slug);
    $slug = trim($slug, '/');

    return headless_core_build_page_response($slug);
}

/**
 * @param string $slug
 * @return WP_REST_Response|WP_Error
 */
function headless_core_build_page_response(string $slug)
{
    $cacheKey = $slug === '' ? 'home' : $slug;
    $cached = headless_core_cache_get('page', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $post = headless_core_resolve_page($slug);

    if (! $post instanceof WP_Post || $post->post_type !== 'page' || $post->post_status !== 'publish') {
        return new WP_Error('headless_not_found', __('Page not found.', 'headless-core'), ['status' => 404]);
    }

    $hadGlobalPost = array_key_exists('post', $GLOBALS);
    $previousGlobalPost = $hadGlobalPost ? $GLOBALS['post'] : null;
    $GLOBALS['post'] = $post;

    try {
        $parsed = parse_blocks((string) $post->post_content);
        $blocks = headless_core_normalize_blocks($parsed);
    } finally {
        if ($hadGlobalPost) {
            $GLOBALS['post'] = $previousGlobalPost;
        } else {
            unset($GLOBALS['post']);
        }
    }

    $payload = [
        'slug' => headless_core_page_route_slug($post),
        'title' => get_the_title($post),
        'blocks' => $blocks,
    ];

    headless_core_cache_set('page', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * Resolve a page for the headless route slug (matches React paths, e.g. loan-products/asset-finance).
 *
 * @param string $slug
 * @return WP_Post|null
 */
function headless_core_resolve_page(string $slug): ?WP_Post
{
    if ($slug === '' || $slug === 'home') {
        if (get_option('show_on_front') === 'page') {
            $frontId = (int) get_option('page_on_front');
            if ($frontId > 0) {
                $front = get_post($frontId);
                if ($front instanceof WP_Post) {
                    return $front;
                }
            }
        }

        $byHome = get_page_by_path('home', OBJECT, 'page');
        if ($byHome instanceof WP_Post) {
            return $byHome;
        }

        return null;
    }

    $page = get_page_by_path($slug, OBJECT, 'page');

    return $page instanceof WP_Post ? $page : null;
}

/**
 * Public route slug for the SPA (no leading slash).
 */
function headless_core_page_route_slug(WP_Post $post): string
{
    $uri = get_page_uri($post);
    if (is_string($uri) && $uri !== '') {
        return $uri;
    }

    return $post->post_name;
}

/**
 * Defaults for custom/mission-vision — parse_blocks() often omits keys equal to block registration defaults.
 *
 * @return array<string, mixed>
 */
function headless_core_mission_vision_default_attrs(): array
{
    $defaultValues = [
        [
            'title' => 'Caring',
            'description' => 'We are truthful, we listen and go extra mile-above and beyond.',
        ],
        [
            'title' => 'Equity',
            'description' => 'We are committed to inclusivity, equality, fairness, public good and social justice.',
        ],
        [
            'title' => 'Consistency',
            'description' => 'We are predictable, dependable, and reliable.',
        ],
    ];

    return [
        'items' => [
            [
                'title' => 'Our Vision',
                'description' => 'To be a formidable financial institution by providing competitive financial solutions to a happy, healthy and prosperous people.',
                'iconId' => 0,
                'values' => [],
            ],
            [
                'title' => 'Our Mission',
                'description' => 'To strengthen the socio-economic well-being of our customers through prudent management and innovative products and services.',
                'iconId' => 0,
                'values' => [],
            ],
            [
                'title' => 'Our Purpose',
                'description' => 'Uplifting People. Inspiring happiness, optimism and hope.',
                'iconId' => 0,
                'values' => [],
            ],
            [
                'title' => 'Our Core Values',
                'description' => '',
                'iconId' => 0,
                'values' => $defaultValues,
            ],
        ],
        // Legacy keys retained for migration/backward compatibility only.
        'coreValuesTitle' => 'Our Core Values',
        'coreValuesImageId' => 0,
        'values' => $defaultValues,
    ];
}

/**
 * @param array<string, mixed> $attrs
 * @return array<string, mixed>
 */
function headless_core_mission_vision_merge_defaults(array $attrs): array
{
    $defaults = headless_core_mission_vision_default_attrs();

    if ((! isset($attrs['items']) || ! is_array($attrs['items']) || $attrs['items'] === [])
        && isset($attrs['visionTitle'], $attrs['missionTitle'], $attrs['purposeTitle'])) {
        $attrs['items'] = [
            [
                'title' => (string) ($attrs['visionTitle'] ?? ''),
                'description' => (string) ($attrs['visionText'] ?? ''),
                'iconId' => (int) ($attrs['visionImageId'] ?? 0),
            ],
            [
                'title' => (string) ($attrs['missionTitle'] ?? ''),
                'description' => (string) ($attrs['missionText'] ?? ''),
                'iconId' => (int) ($attrs['missionImageId'] ?? 0),
            ],
            [
                'title' => (string) ($attrs['purposeTitle'] ?? ''),
                'description' => (string) ($attrs['purposeText'] ?? ''),
                'iconId' => (int) ($attrs['purposeImageId'] ?? 0),
            ],
            [
                'title' => 'Our Core Values',
                'description' => '',
                'iconId' => (int) ($attrs['coreValuesImageId'] ?? 0),
            ],
        ];
    }
    if ((! isset($attrs['values']) || ! is_array($attrs['values']) || $attrs['values'] === [])
        && isset($attrs['coreValues']) && is_array($attrs['coreValues'])) {
        $legacyVals = [];
        foreach ($attrs['coreValues'] as $row) {
            if (! is_array($row)) {
                continue;
            }
            $legacyVals[] = [
                'title' => (string) ($row['label'] ?? ''),
                'description' => (string) ($row['text'] ?? ''),
            ];
        }
        if ($legacyVals !== []) {
            $attrs['values'] = $legacyVals;
        }
    }

    // If legacy top-level values exist, copy to all items (user preference).
    if (isset($attrs['values']) && is_array($attrs['values']) && $attrs['values'] !== []
        && isset($attrs['items']) && is_array($attrs['items']) && $attrs['items'] !== []) {
        foreach ($attrs['items'] as $idx => $item) {
            if (! is_array($item)) {
                continue;
            }
            if (! isset($item['values']) || ! is_array($item['values']) || $item['values'] === []) {
                $attrs['items'][$idx]['values'] = $attrs['values'];
            }
        }
    }

    foreach ($defaults as $key => $defaultVal) {
        if ($key === 'items') {
            $saved = $attrs['items'] ?? null;
            if (! is_array($saved) || $saved === []) {
                $attrs['items'] = $defaultVal;

                continue;
            }
            $attrs['items'] = headless_core_merge_mission_items(
                is_array($defaultVal) ? $defaultVal : [],
                $saved
            );

            continue;
        }
        if ($key === 'values') {
            $saved = $attrs['values'] ?? null;
            if (! is_array($saved) || $saved === []) {
                $attrs['values'] = $defaultVal;

                continue;
            }
            $attrs['values'] = headless_core_merge_core_value_rows(
                is_array($defaultVal) ? $defaultVal : [],
                $saved
            );

            continue;
        }

        if (is_string($defaultVal)) {
            $cur = $attrs[$key] ?? null;
            $str = is_scalar($cur) || $cur === null ? trim((string) $cur) : '';
            if ($str === '') {
                $attrs[$key] = $defaultVal;
            }

            continue;
        }

        if (! array_key_exists($key, $attrs) || $attrs[$key] === '' || $attrs[$key] === null) {
            $attrs[$key] = $defaultVal;
        }
    }

    return $attrs;
}

/**
 * @param array<int, array<string, string>> $defaultRows
 * @param array<int, mixed>                $savedRows
 * @return array<int, array<string, string>>
 */
function headless_core_merge_core_value_rows(array $defaultRows, array $savedRows): array
{
    $out = [];
    $count = max(count($defaultRows), count($savedRows));

    for ($i = 0; $i < $count; $i++) {
        $d = $defaultRows[$i] ?? ['title' => '', 'description' => ''];
        $s = isset($savedRows[$i]) && is_array($savedRows[$i]) ? $savedRows[$i] : [];
        $label = isset($s['title']) ? trim((string) $s['title']) : '';
        $text = isset($s['description']) ? trim((string) $s['description']) : '';
        $out[] = [
            'title' => $label !== '' ? $label : (string) ($d['title'] ?? ''),
            'description' => $text !== '' ? $text : (string) ($d['description'] ?? ''),
        ];
    }

    return $out;
}

/**
 * @param array<int, array<string, mixed>> $defaultRows
 * @param array<int, mixed>                $savedRows
 * @return array<int, array<string, mixed>>
 */
function headless_core_merge_mission_items(array $defaultRows, array $savedRows): array
{
    $out = [];
    $count = max(count($defaultRows), count($savedRows));

    for ($i = 0; $i < $count; $i++) {
        $d = $defaultRows[$i] ?? ['title' => '', 'description' => '', 'iconId' => 0, 'values' => []];
        $s = isset($savedRows[$i]) && is_array($savedRows[$i]) ? $savedRows[$i] : [];
        $title = isset($s['title']) ? trim((string) $s['title']) : '';
        $description = isset($s['description']) ? trim((string) $s['description']) : '';
        $savedValues = isset($s['values']) && is_array($s['values']) ? $s['values'] : [];
        $defaultValues = isset($d['values']) && is_array($d['values']) ? $d['values'] : [];
        $out[] = [
            'title' => $title !== '' ? $title : (string) ($d['title'] ?? ''),
            'description' => $description !== '' ? $description : (string) ($d['description'] ?? ''),
            'iconId' => isset($s['iconId']) ? (int) $s['iconId'] : (int) ($d['iconId'] ?? 0),
            'values' => $savedValues !== []
                ? headless_core_merge_core_value_rows($defaultValues, $savedValues)
                : headless_core_merge_core_value_rows($defaultValues, []),
        ];
    }

    return $out;
}

/**
 * Plain text for core text blocks (no HTML in the API). Uses innerHTML, innerContent, attrs, then render_block.
 *
 * @param array<string, mixed> $block Parsed block from parse_blocks()
 * @param array<string, mixed> $attrs
 */
function headless_core_plain_text_from_parsed_block(array $block, array $attrs): string
{
    $decode_strip = static function (string $s): string {
        $s = preg_replace('#<br\s*/?>#i', "\n", $s);

        return trim(html_entity_decode(wp_strip_all_tags($s), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    };

    $rawContent = '';
    if (array_key_exists('content', $attrs) && is_scalar($attrs['content'])) {
        $rawContent = (string) $attrs['content'];
    }
    if ($rawContent !== '') {
        $plain = $decode_strip($rawContent);
        if ($plain !== '') {
            return $plain;
        }
    }

    $innerHtml = isset($block['innerHTML']) ? (string) $block['innerHTML'] : '';
    if ($innerHtml !== '') {
        $plain = $decode_strip($innerHtml);
        if ($plain !== '') {
            return $plain;
        }
    }

    $innerContent = $block['innerContent'] ?? null;
    if (is_array($innerContent) && $innerContent !== []) {
        $fragments = array_filter(
            $innerContent,
            static function ($x): bool {
                return is_string($x) && $x !== '';
            }
        );
        $joined = implode('', $fragments);
        if ($joined !== '') {
            $plain = $decode_strip($joined);
            if ($plain !== '') {
                return $plain;
            }
        }
    }

    if (function_exists('render_block')) {
        $rendered = render_block($block);
        if (is_string($rendered) && $rendered !== '') {
            $plain = $decode_strip($rendered);
            if ($plain !== '') {
                return $plain;
            }
        }
    }

    return '';
}

/**
 * @param array<string, mixed> $block
 * @param array<string, mixed> $attrs
 * @return array<string, mixed>
 */
function headless_core_block_attributes_for_api(string $name, array $block, array $attrs): array
{
    if ($name === 'core/paragraph') {
        $attrs['content'] = headless_core_plain_text_from_parsed_block($block, $attrs);

        return $attrs;
    }

    if ($name === 'core/freeform' || $name === 'core/html') {
        $attrs['content'] = headless_core_plain_text_from_parsed_block($block, $attrs);

        return $attrs;
    }

    if ($name === 'core/heading') {
        $attrs['content'] = headless_core_plain_text_from_parsed_block($block, $attrs);
        if (isset($attrs['level'])) {
            $attrs['level'] = (int) $attrs['level'];
        } else {
            $attrs['level'] = 2;
            $innerHtml = isset($block['innerHTML']) ? (string) $block['innerHTML'] : '';
            if (preg_match('/<h([1-6])\b/i', $innerHtml, $m)) {
                $attrs['level'] = (int) $m[1];
            }
        }

        return $attrs;
    }

    if ($name === 'core/list-item') {
        $attrs['content'] = headless_core_plain_text_from_parsed_block($block, $attrs);

        return $attrs;
    }

    if ($name === 'custom/mission-vision') {
        $attrs = headless_core_mission_vision_merge_defaults($attrs);

        if (isset($attrs['items']) && is_array($attrs['items'])) {
            foreach ($attrs['items'] as $idx => $item) {
                if (! is_array($item)) {
                    continue;
                }
                $iconId = isset($item['iconId']) ? (int) $item['iconId'] : 0;
                if ($iconId > 0) {
                    $url = wp_get_attachment_image_url($iconId, 'medium');
                    if (is_string($url) && $url !== '') {
                        $attrs['items'][$idx]['iconUrl'] = $url;
                    }
                }
            }
        }

        $coreImageId = isset($attrs['coreValuesImageId']) ? (int) $attrs['coreValuesImageId'] : 0;
        if ($coreImageId > 0) {
            $url = wp_get_attachment_image_url($coreImageId, 'medium');
            if (is_string($url) && $url !== '') {
                $attrs['coreValuesImageUrl'] = $url;
            }
        }

        return $attrs;
    }

    return $attrs;
}

/**
 * @param array<int, array<string, mixed>> $parsed
 * @return array<int, array<string, mixed>>
 */
function headless_core_normalize_blocks(array $parsed): array
{
    $out = [];
    $parsed = array_values($parsed);
    $count = count($parsed);

    for ($i = 0; $i < $count; $i++) {
        $block = $parsed[$i];
        if (! is_array($block)) {
            continue;
        }

        $blockName = $block['blockName'] ?? null;
        if ($blockName === null || $blockName === '') {
            $uAttrs = $block['attrs'] ?? [];
            if (! is_array($uAttrs)) {
                $uAttrs = [];
            }
            $plain = headless_core_plain_text_from_parsed_block($block, $uAttrs);
            if ($plain !== '') {
                $out[] = [
                    'name' => 'core/paragraph',
                    'attributes' => (object) [
                        'content' => $plain,
                    ],
                    'innerBlocks' => [],
                ];
            }

            continue;
        }

        $name = (string) $blockName;

        $attrs = $block['attrs'] ?? [];
        if (! is_array($attrs)) {
            $attrs = [];
        }

        $attrs = headless_core_block_attributes_for_api($name, $block, $attrs);

        if ($name === 'core/paragraph' && ($attrs['content'] ?? '') === '' && $i + 1 < $count) {
            $next = $parsed[$i + 1];
            if (is_array($next)) {
                $nextBn = $next['blockName'] ?? null;
                if ($nextBn === null || $nextBn === '') {
                    $nAttrs = $next['attrs'] ?? [];
                    if (! is_array($nAttrs)) {
                        $nAttrs = [];
                    }
                    $merged = headless_core_plain_text_from_parsed_block($next, $nAttrs);
                    if ($merged !== '') {
                        $attrs['content'] = $merged;
                        $i++;
                    }
                }
            }
        }

        $inner = $block['innerBlocks'] ?? [];

        if ($name === 'core/list') {
            $items = [];
            if (is_array($inner)) {
                foreach ($inner as $liBlock) {
                    if (! is_array($liBlock) || ($liBlock['blockName'] ?? '') !== 'core/list-item') {
                        continue;
                    }
                    $liAttrs = $liBlock['attrs'] ?? [];
                    if (! is_array($liAttrs)) {
                        $liAttrs = [];
                    }
                    $liAttrs = headless_core_block_attributes_for_api('core/list-item', $liBlock, $liAttrs);
                    $text = trim((string) ($liAttrs['content'] ?? ''));
                    if ($text !== '') {
                        $items[] = $text;
                    }
                }
            }
            $attrs['items'] = $items;
            if (! array_key_exists('ordered', $attrs)) {
                $attrs['ordered'] = false;
            } else {
                $attrs['ordered'] = (bool) $attrs['ordered'];
            }
            $innerNorm = [];
        } else {
            $innerNorm = is_array($inner) ? headless_core_normalize_blocks($inner) : [];
        }

        $out[] = [
            'name' => $name,
            'attributes' => (object) $attrs,
            'innerBlocks' => $innerNorm,
        ];
    }

    return $out;
}

/**
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_menu(WP_REST_Request $request)
{
    $location = (string) $request->get_param('location');
    $ver = (string) get_option('headless_menu_cache_ver', '1');
    $cacheKey = $location . '_' . $ver;
    $cached = headless_core_cache_get('menu', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $locations = get_nav_menu_locations();
    if (! isset($locations[$location])) {
        return new WP_Error('headless_menu_location', __('Menu location not assigned.', 'headless-core'), ['status' => 404]);
    }

    $menuId = (int) $locations[$location];
    if ($menuId <= 0) {
        return new WP_Error('headless_menu_missing', __('No menu for this location.', 'headless-core'), ['status' => 404]);
    }

    $items = wp_get_nav_menu_items($menuId);
    if (! is_array($items)) {
        $items = [];
    }

    $tree = headless_core_menu_build_tree($items);
    headless_core_cache_set('menu', $cacheKey, $tree);

    return new WP_REST_Response($tree, 200);
}

/**
 * @param array<int, WP_Post> $items
 * @return array<int, array<string, mixed>>
 */
function headless_core_menu_build_tree(array $items): array
{
    $byParent = [];
    foreach ($items as $item) {
        if (! $item instanceof WP_Post) {
            continue;
        }
        $parentId = (int) $item->menu_item_parent;
        if (! isset($byParent[$parentId])) {
            $byParent[$parentId] = [];
        }
        $byParent[$parentId][] = $item;
    }

    if (! isset($byParent[0])) {
        return [];
    }

    return headless_core_menu_branch($byParent, 0);
}

/**
 * @param array<int, WP_Post[]> $byParent
 * @return array<int, array<string, mixed>>
 */
function headless_core_menu_branch(array $byParent, int $parentId): array
{
    if (! isset($byParent[$parentId])) {
        return [];
    }

    $out = [];
    foreach ($byParent[$parentId] as $item) {
        $out[] = [
            'label' => (string) $item->title,
            'url' => headless_core_menu_url_to_path((string) $item->url),
            'children' => headless_core_menu_branch($byParent, (int) $item->ID),
        ];
    }

    return $out;
}

/**
 * Turn full URLs into site-relative paths for the SPA.
 */
function headless_core_menu_url_to_path(string $url): string
{
    if ($url === '' || $url === '#') {
        return '#';
    }

    $home = home_url('/');
    if (strpos($url, $home) === 0) {
        $path = (string) substr($url, strlen($home) - 1);

        return $path === '' ? '/' : $path;
    }

    $parts = wp_parse_url($url);
    if (is_array($parts) && isset($parts['path'])) {
        $path = (string) $parts['path'];
        if (isset($parts['query']) && $parts['query'] !== '') {
            $path .= '?' . $parts['query'];
        }
        if (isset($parts['fragment']) && $parts['fragment'] !== '') {
            $path .= '#' . $parts['fragment'];
        }

        return $path;
    }

    return $url;
}
