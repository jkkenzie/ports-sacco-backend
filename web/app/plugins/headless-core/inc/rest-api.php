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
        if (headless_core_transients_enabled()) {
            $response->header('Cache-Control', 'public, max-age=' . (int) headless_core_cache_ttl());
        } else {
            $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        }
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

    register_rest_route('custom/v1', '/savings-products', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_savings_products',
        'permission_callback' => '__return_true',
        'args' => [
            'per_page' => [
                'required' => false,
                'type' => 'integer',
                'minimum' => 0,
                'maximum' => 100,
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/savings-products/(?P<slug>[a-z0-9\-_]+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_savings_product',
        'permission_callback' => '__return_true',
        'args' => [
            'slug' => [
                'required' => true,
                'type' => 'string',
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/loan-products', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_loan_products',
        'permission_callback' => '__return_true',
        'args' => [
            'category' => [
                'required' => false,
                'type' => 'integer',
            ],
            'per_page' => [
                'required' => false,
                'type' => 'integer',
                'minimum' => 0,
                'maximum' => 100,
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/loan-products/(?P<slug>[a-z0-9\-_]+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_loan_product',
        'permission_callback' => '__return_true',
        'args' => [
            'slug' => [
                'required' => true,
                'type' => 'string',
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/team-members', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_team_members',
        'permission_callback' => '__return_true',
        'args' => [
            'category' => [
                'required' => false,
                'type' => 'integer',
            ],
            'per_page' => [
                'required' => false,
                'type' => 'integer',
                'minimum' => 0,
                'maximum' => 100,
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/services', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_services',
        'permission_callback' => '__return_true',
        'args' => [
            'category' => [
                'required' => false,
                'type' => 'integer',
            ],
            'per_page' => [
                'required' => false,
                'type' => 'integer',
                'minimum' => 0,
                'maximum' => 100,
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/services/(?P<slug>[a-z0-9\-_]+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_service',
        'permission_callback' => '__return_true',
        'args' => [
            'slug' => [
                'required' => true,
                'type' => 'string',
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/events', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_events',
        'permission_callback' => '__return_true',
        'args' => [
            'category' => [
                'required' => false,
                'type' => 'integer',
            ],
            'per_page' => [
                'required' => false,
                'type' => 'integer',
                'minimum' => 0,
                'maximum' => 100,
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/events/(?P<slug>[a-z0-9\-_]+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_event',
        'permission_callback' => '__return_true',
        'args' => [
            'slug' => [
                'required' => true,
                'type' => 'string',
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/contact', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'headless_core_rest_contact_submit',
        'permission_callback' => '__return_true',
        'args' => [
            'name' => ['required' => true, 'type' => 'string'],
            'email' => ['required' => true, 'type' => 'string'],
            'phone' => ['required' => true, 'type' => 'string'],
            'amount' => ['required' => false, 'type' => 'string'],
            'message' => ['required' => false, 'type' => 'string'],
            'form' => ['required' => false, 'type' => 'string'],
            'company' => ['required' => false, 'type' => 'string'], // honeypot
            'recaptchaToken' => ['required' => true, 'type' => 'string'],
            'recaptchaAction' => ['required' => false, 'type' => 'string'],
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
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');

    return $served;
}, 10, 4);

// Handle CORS preflight for our custom routes when HEADLESS_CORS_ORIGIN is set.
add_action('rest_api_init', static function (): void {
    register_rest_route('custom/v1', '/(?P<any>.*)', [
        'methods' => 'OPTIONS',
        'callback' => static function (): WP_REST_Response {
            return new WP_REST_Response(null, 204);
        },
        'permission_callback' => '__return_true',
    ]);
}, 1);

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
 * @return array<string, mixed>
 */
function headless_core_about_us_stats_default_attrs(): array
{
    return [
        'items' => [
            ['number' => '15', 'title' => 'AWARDS IN 2025', 'subtitle' => 'We are leading by example', 'iconId' => 0],
            ['number' => '26', 'title' => 'PRODUCTS OFFERED', 'subtitle' => 'Products that fit your needs', 'iconId' => 0],
            ['number' => '10,000+', 'title' => 'REGISTERED MEMBERS', 'subtitle' => 'A growing membership base.', 'iconId' => 0],
        ],
        'iconWidth' => 107,
        'iconHeight' => 58,
        'iconColor' => '#40C9BF',
    ];
}

/**
 * @param array<string, mixed> $attrs
 * @return array<string, mixed>
 */
function headless_core_about_us_stats_merge_defaults(array $attrs): array
{
    $defaults = headless_core_about_us_stats_default_attrs();
    $saved = $attrs['items'] ?? null;
    if (! is_array($saved) || $saved === []) {
        $attrs['items'] = $defaults['items'];
    } else {
        $out = [];
        $defaultRows = is_array($defaults['items']) ? $defaults['items'] : [];
        $count = max(count($defaultRows), count($saved));
        for ($i = 0; $i < $count; $i++) {
            $d = isset($defaultRows[$i]) && is_array($defaultRows[$i]) ? $defaultRows[$i] : ['number' => '', 'title' => '', 'subtitle' => '', 'iconId' => 0];
            $s = isset($saved[$i]) && is_array($saved[$i]) ? $saved[$i] : [];
            $number = trim((string) ($s['number'] ?? ''));
            $title = trim((string) ($s['title'] ?? ''));
            $subtitle = trim((string) ($s['subtitle'] ?? ''));
            $iconId = isset($s['iconId']) ? (int) $s['iconId'] : (int) ($d['iconId'] ?? 0);
            $out[] = [
                'number' => $number !== '' ? $number : (string) ($d['number'] ?? ''),
                'title' => $title !== '' ? $title : (string) ($d['title'] ?? ''),
                'subtitle' => $subtitle !== '' ? $subtitle : (string) ($d['subtitle'] ?? ''),
                'iconId' => $iconId,
            ];
        }
        $attrs['items'] = $out;
    }

    $attrs['iconWidth'] = isset($attrs['iconWidth']) ? max(0, (int) $attrs['iconWidth']) : 107;
    $attrs['iconHeight'] = isset($attrs['iconHeight']) ? max(0, (int) $attrs['iconHeight']) : 58;
    $color = isset($attrs['iconColor']) ? sanitize_hex_color((string) $attrs['iconColor']) : '';
    $attrs['iconColor'] = is_string($color) && $color !== '' ? $color : '#40C9BF';

    return $attrs;
}

/**
 * @return array<string, mixed>
 */
function headless_core_about_us_awards_default_attrs(): array
{
    return [
        'title' => 'Awards',
        'items' => [
            [
                'heading' => 'ICD AWARDS 2025 - NATIONAL',
                'content' => '<ul><li>Best Managed Sacco countrywide (Employer based, Asset base over 10B) - <strong>Position 3</strong></li><li>Best in Technology Optimization Country wide (Employer based, Asset base above 10B) - <strong>Position 2</strong></li><li>Best in Capitalization country wide (Employer based, asset base above 10B) - <strong>Position 3</strong></li></ul>',
            ],
            [
                'heading' => 'ICD AWARDS 2025 - MOMBASA COUNTY',
                'content' => '<ul><li>Best Co-operative Society - <strong>Position 1</strong></li><li>Best Capitalized Co-operative Society - <strong>Position 1</strong></li><li>Highest Returns on Assets - <strong>Position 1</strong></li><li>1st to present Audited Accounts - <strong>Position 1</strong></li><li>Best in Education and Training - <strong>Position 2</strong></li><li>Best Insured Sacco Society - <strong>Position 2</strong></li><li>Most Innovative Sacco Society Position - <strong>Position 2</strong></li></ul>',
            ],
            [
                'heading' => 'ASK NAIROBI INTERNATIONAL SHOW - 2025',
                'content' => '<ul><li>Best Cooperative Movement stand - <strong>Position 1</strong></li></ul>',
            ],
        ],
    ];
}

/**
 * @param array<string, mixed> $attrs
 * @return array<string, mixed>
 */
function headless_core_about_us_awards_merge_defaults(array $attrs): array
{
    $defaults = headless_core_about_us_awards_default_attrs();
    $title = isset($attrs['title']) ? trim((string) $attrs['title']) : '';
    $attrs['title'] = $title !== '' ? $title : (string) $defaults['title'];

    $saved = $attrs['items'] ?? null;
    if (! is_array($saved) || $saved === []) {
        $attrs['items'] = $defaults['items'];

        return $attrs;
    }

    $out = [];
    $defaultRows = is_array($defaults['items']) ? $defaults['items'] : [];
    $count = max(count($defaultRows), count($saved));
    for ($i = 0; $i < $count; $i++) {
        $d = isset($defaultRows[$i]) && is_array($defaultRows[$i]) ? $defaultRows[$i] : ['heading' => '', 'content' => ''];
        $s = isset($saved[$i]) && is_array($saved[$i]) ? $saved[$i] : [];
        $heading = trim((string) ($s['heading'] ?? ''));
        $content = (string) ($s['content'] ?? '');
        if (trim(wp_strip_all_tags($content)) === '') {
            $content = (string) ($d['content'] ?? '');
        }
        $out[] = [
            'heading' => $heading !== '' ? $heading : (string) ($d['heading'] ?? ''),
            'content' => wp_kses_post($content),
        ];
    }
    $attrs['items'] = $out;

    return $attrs;
}

/**
 * @return array<string, mixed>
 */
function headless_core_about_us_help_default_attrs(): array
{
    return [
        'headerText' => 'WE ARE HERE TO HELP YOU',
        'ctaText' => 'TALK TO US!',
        'items' => [
            [
                'iconId' => 0,
                'title' => 'APPLY FOR A LOAN',
                'description' => 'Looking to buy a car, build a home, start a business, pay for education? Apply for a loan now!',
                'linkMode' => 'text',
                'linkText' => 'Get an Appointment',
                'linkUrl' => '',
                'linkSvgId' => 0,
            ],
            [
                'iconId' => 0,
                'title' => 'CALL US!',
                'description' => '+254 111 173 000 info@portsacco.co.ke',
                'linkMode' => 'text',
                'linkText' => 'Contact us',
                'linkUrl' => '',
                'linkSvgId' => 0,
            ],
            [
                'iconId' => 0,
                'title' => 'TALK TO AN ADVISOR',
                'description' => 'Do you need financial planning? Talk to our advisors.',
                'linkMode' => 'svg',
                'linkText' => '',
                'linkUrl' => '',
                'linkSvgId' => 0,
            ],
        ],
        'iconColor' => '#EE6E2A',
        'linkSvgColor' => '#22ACB6',
    ];
}

/**
 * @param array<string, mixed> $attrs
 * @return array<string, mixed>
 */
function headless_core_about_us_help_merge_defaults(array $attrs): array
{
    $defaults = headless_core_about_us_help_default_attrs();
    $headerText = isset($attrs['headerText']) ? trim((string) $attrs['headerText']) : '';
    $ctaText = isset($attrs['ctaText']) ? trim((string) $attrs['ctaText']) : '';
    $attrs['headerText'] = $headerText !== '' ? $headerText : (string) $defaults['headerText'];
    $attrs['ctaText'] = $ctaText !== '' ? $ctaText : (string) $defaults['ctaText'];
    $attrs['linkSvgColor'] = headless_core_sanitize_color_string(
        isset($attrs['linkSvgColor']) ? (string) $attrs['linkSvgColor'] : '',
        '#22ACB6'
    );
    $saved = $attrs['items'] ?? null;
    if (! is_array($saved) || $saved === []) {
        $attrs['items'] = $defaults['items'];
        $attrs['iconColor'] = headless_core_sanitize_color_string(
            isset($attrs['iconColor']) ? (string) $attrs['iconColor'] : '',
            '#EE6E2A'
        );

        return $attrs;
    }

    $out = [];
    $defaultRows = is_array($defaults['items']) ? $defaults['items'] : [];
    $count = max(count($defaultRows), count($saved));
    for ($i = 0; $i < $count; $i++) {
        $d = isset($defaultRows[$i]) && is_array($defaultRows[$i]) ? $defaultRows[$i] : [];
        $s = isset($saved[$i]) && is_array($saved[$i]) ? $saved[$i] : [];
        $title = trim((string) ($s['title'] ?? ''));
        $description = (string) ($s['description'] ?? '');
        $linkText = (string) ($s['linkText'] ?? '');
        $linkUrl = trim((string) ($s['linkUrl'] ?? ''));
        $linkMode = isset($s['linkMode']) ? strtolower(trim((string) $s['linkMode'])) : '';
        if ($linkMode !== 'svg') {
            $linkMode = 'text';
        }
        $out[] = [
            'iconId' => isset($s['iconId']) ? (int) $s['iconId'] : (int) ($d['iconId'] ?? 0),
            'title' => $title !== '' ? $title : (string) ($d['title'] ?? ''),
            'description' => trim(wp_strip_all_tags($description)) !== '' ? wp_kses_post($description) : (string) ($d['description'] ?? ''),
            'linkMode' => $linkMode,
            'linkText' => trim($linkText) !== '' ? $linkText : (string) ($d['linkText'] ?? ''),
            'linkUrl' => $linkUrl,
            'linkSvgId' => isset($s['linkSvgId']) ? (int) $s['linkSvgId'] : (int) ($d['linkSvgId'] ?? 0),
        ];
    }
    $attrs['items'] = $out;
    $attrs['iconColor'] = headless_core_sanitize_color_string(
        isset($attrs['iconColor']) ? (string) $attrs['iconColor'] : '',
        '#EE6E2A'
    );

    return $attrs;
}

/**
 * Accepts hex colors and rgb(r, g, b).
 */
function headless_core_sanitize_color_string(string $value, string $fallback): string
{
    $v = trim($value);
    $hex = sanitize_hex_color($v);
    if (is_string($hex) && $hex !== '') {
        return $hex;
    }
    if (preg_match('/^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/i', $v, $m)) {
        $r = min(255, max(0, (int) $m[1]));
        $g = min(255, max(0, (int) $m[2]));
        $b = min(255, max(0, (int) $m[3]));

        return sprintf('rgb(%d, %d, %d)', $r, $g, $b);
    }

    return $fallback;
}

/**
 * @return string SVG markup or empty string
 */
function headless_core_attachment_inline_svg_markup(int $attachmentId): string
{
    if ($attachmentId <= 0) {
        return '';
    }

    $mime = get_post_mime_type($attachmentId);
    if (! is_string($mime) || strtolower($mime) !== 'image/svg+xml') {
        return '';
    }

    $filePath = get_attached_file($attachmentId);
    if (! is_string($filePath) || $filePath === '' || ! is_readable($filePath)) {
        return '';
    }

    $svg = file_get_contents($filePath);
    if (! is_string($svg) || trim($svg) === '' || stripos($svg, '<svg') === false) {
        return '';
    }

    return $svg;
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
 * `parse_blocks()` often omits JSON keys that match block registration defaults. Merge missing keys
 * from {@see WP_Block_Type_Registry} so the headless app receives a complete attribute object.
 *
 * @param array<string, mixed> $attrs
 * @return array<string, mixed>
 */
function headless_core_apply_block_attribute_defaults(string $name, array $attrs): array
{
    if (! class_exists('WP_Block_Type_Registry')) {
        return $attrs;
    }

    $registry = WP_Block_Type_Registry::get_instance();
    if (! $registry->is_registered($name)) {
        return $attrs;
    }

    $type = $registry->get_registered($name);
    $schema = is_object($type) && isset($type->attributes) && is_array($type->attributes)
        ? $type->attributes
        : [];

    foreach ($schema as $key => $def) {
        if (! is_string($key) || $key === '') {
            continue;
        }
        if (array_key_exists($key, $attrs)) {
            continue;
        }
        if (! is_array($def) || ! array_key_exists('default', $def)) {
            continue;
        }
        $attrs[$key] = $def['default'];
    }

    return $attrs;
}

/**
 * @param array<string, mixed> $block
 * @param array<string, mixed> $attrs
 * @return array<string, mixed>
 */
function headless_core_block_attributes_for_api(string $name, array $block, array $attrs): array
{
    $attrs = headless_core_apply_block_attribute_defaults($name, $attrs);

    if ($name === 'custom/savings-archive-hero') {
        $attrs['title'] = isset($attrs['title']) && trim((string) $attrs['title']) !== ''
            ? (string) $attrs['title']
            : 'Savings Products';
        $attrs['intro'] = isset($attrs['intro']) ? (string) $attrs['intro'] : '';
        $attrs['backgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['backgroundColor']) ? (string) $attrs['backgroundColor'] : '',
            '#22ABB5'
        );
        $attrs['titleColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleColor']) ? (string) $attrs['titleColor'] : '',
            '#22ABB5'
        );
        $attrs['navBackgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['navBackgroundColor']) ? (string) $attrs['navBackgroundColor'] : '',
            '#eef2f8'
        );
        $attrs['navBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['navBorderColor']) ? (string) $attrs['navBorderColor'] : '',
            '#c8cee3'
        );
        $attrs['menuTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['menuTextColor']) ? (string) $attrs['menuTextColor'] : '',
            '#65605f'
        );
        $attrs['menuHoverTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['menuHoverTextColor']) ? (string) $attrs['menuHoverTextColor'] : '',
            '#ED6E2A'
        );
        $attrs['menuHoverBackgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['menuHoverBackgroundColor']) ? (string) $attrs['menuHoverBackgroundColor'] : '',
            '#eef2f8'
        );
        $bannerId = isset($attrs['bannerImageId']) ? (int) $attrs['bannerImageId'] : 0;
        $attrs['bannerImageId'] = $bannerId;
        if ($bannerId > 0) {
            $url = wp_get_attachment_image_url($bannerId, 'full');
            if (is_string($url) && $url !== '') {
                $attrs['bannerImageUrl'] = $url;
            }
        }

        if (! isset($attrs['buttons']) || ! is_array($attrs['buttons']) || $attrs['buttons'] === []) {
            $legacyButtons = [];
            $legacyPrimaryText = isset($attrs['primaryCtaText']) ? trim((string) $attrs['primaryCtaText']) : '';
            $legacyPrimaryUrl = isset($attrs['primaryCtaUrl']) ? trim((string) $attrs['primaryCtaUrl']) : '';
            $legacySecondaryText = isset($attrs['secondaryCtaText']) ? trim((string) $attrs['secondaryCtaText']) : '';
            $legacySecondaryUrl = isset($attrs['secondaryCtaUrl']) ? trim((string) $attrs['secondaryCtaUrl']) : '';
            if ($legacyPrimaryText !== '' || $legacyPrimaryUrl !== '') {
                $legacyButtons[] = [
                    'label' => $legacyPrimaryText !== '' ? $legacyPrimaryText : 'GET A CALL BACK',
                    'url' => $legacyPrimaryUrl !== '' ? $legacyPrimaryUrl : '#',
                    'textColor' => '#22abb5',
                    'borderColor' => '#22abb5',
                    'bgColor' => '#ffffff',
                    'hoverTextColor' => '#ffffff',
                    'hoverBgColor' => '#22abb5',
                    'hoverBorderColor' => '#22abb5',
                ];
            }
            if ($legacySecondaryText !== '' || $legacySecondaryUrl !== '') {
                $legacyButtons[] = [
                    'label' => $legacySecondaryText !== '' ? $legacySecondaryText : 'JOIN PORTS SACCO',
                    'url' => $legacySecondaryUrl !== '' ? $legacySecondaryUrl : '/contact-us',
                    'textColor' => '#ed6e2a',
                    'borderColor' => '#ed6e2a',
                    'bgColor' => '#ffffff',
                    'hoverTextColor' => '#ffffff',
                    'hoverBgColor' => '#ed6e2a',
                    'hoverBorderColor' => '#ed6e2a',
                ];
            }
            $attrs['buttons'] = $legacyButtons !== [] ? $legacyButtons : [
                ['label' => 'GET A CALL BACK', 'url' => '#', 'textColor' => '#22abb5', 'borderColor' => '#22abb5', 'bgColor' => '#ffffff', 'hoverTextColor' => '#ffffff', 'hoverBgColor' => '#22abb5', 'hoverBorderColor' => '#22abb5'],
                ['label' => 'JOIN PORTS SACCO', 'url' => '/contact-us', 'textColor' => '#ed6e2a', 'borderColor' => '#ed6e2a', 'bgColor' => '#ffffff', 'hoverTextColor' => '#ffffff', 'hoverBgColor' => '#ed6e2a', 'hoverBorderColor' => '#ed6e2a'],
            ];
        } else {
            $normalizedButtons = [];
            foreach ($attrs['buttons'] as $button) {
                if (! is_array($button)) {
                    continue;
                }
                $label = trim((string) ($button['label'] ?? ''));
                $url = trim((string) ($button['url'] ?? ''));
                if ($label === '' && $url === '') {
                    continue;
                }
                $normalizedButtons[] = [
                    'label' => $label !== '' ? $label : 'BUTTON',
                    'url' => $url !== '' ? $url : '#',
                    'textColor' => headless_core_sanitize_color_string((string) ($button['textColor'] ?? ''), '#22abb5'),
                    'borderColor' => headless_core_sanitize_color_string((string) ($button['borderColor'] ?? ''), '#22abb5'),
                    'bgColor' => headless_core_sanitize_color_string((string) ($button['bgColor'] ?? ''), '#ffffff'),
                    'hoverTextColor' => headless_core_sanitize_color_string((string) ($button['hoverTextColor'] ?? ''), '#ffffff'),
                    'hoverBgColor' => headless_core_sanitize_color_string((string) ($button['hoverBgColor'] ?? ''), '#22abb5'),
                    'hoverBorderColor' => headless_core_sanitize_color_string((string) ($button['hoverBorderColor'] ?? ''), '#22abb5'),
                ];
            }
            $attrs['buttons'] = $normalizedButtons;
        }

        if (! isset($attrs['menuItems']) || ! is_array($attrs['menuItems']) || $attrs['menuItems'] === []) {
            $attrs['menuItems'] = [
                ['label' => 'GROUP', 'href' => '#'],
                ['label' => 'BIASHARA', 'href' => '#'],
                ['label' => 'FIXED DEPOSIT', 'href' => '#'],
            ];
        } else {
            $normalizedMenuItems = [];
            foreach ($attrs['menuItems'] as $item) {
                if (! is_array($item)) {
                    continue;
                }
                $label = trim((string) ($item['label'] ?? ''));
                $href = trim((string) ($item['href'] ?? ''));
                if ($label === '' && $href === '') {
                    continue;
                }
                $normalizedMenuItems[] = [
                    'label' => $label !== '' ? $label : 'MENU ITEM',
                    'href' => $href !== '' ? $href : '#',
                ];
            }
            $attrs['menuItems'] = $normalizedMenuItems;
        }

        return $attrs;
    }

    if ($name === 'custom/savings-why-save') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }
        $attrs['heading'] = isset($attrs['heading']) && trim((string) $attrs['heading']) !== ''
            ? (string) $attrs['heading']
            : 'Why Save With Us';
        $attrs['description'] = isset($attrs['description']) ? trim((string) $attrs['description']) : '';
        $attrs['footerText'] = isset($attrs['footerText']) ? trim((string) $attrs['footerText']) : '';
        $attrs['backgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['backgroundColor']) ? (string) $attrs['backgroundColor'] : '',
            '#ffffff'
        );
        $attrs['headingColor'] = headless_core_sanitize_color_string(
            isset($attrs['headingColor']) ? (string) $attrs['headingColor'] : '',
            '#22ABB5'
        );
        $attrs['titleColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleColor']) ? (string) $attrs['titleColor'] : '',
            '#000000'
        );
        $attrs['textColor'] = headless_core_sanitize_color_string(
            isset($attrs['textColor']) ? (string) $attrs['textColor'] : '',
            '#000000'
        );
        $attrs['iconBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['iconBgColor']) ? (string) $attrs['iconBgColor'] : '',
            '#ED6E2A'
        );
        $iconId = isset($attrs['iconId']) ? (int) $attrs['iconId'] : 0;
        $attrs['iconId'] = $iconId;
        if ($iconId > 0) {
            $url = wp_get_attachment_image_url($iconId, 'medium');
            if (is_string($url) && $url !== '') {
                $attrs['iconUrl'] = $url;
            }
            $svgMarkup = headless_core_attachment_inline_svg_markup($iconId);
            if ($svgMarkup !== '') {
                $attrs['iconSvg'] = $svgMarkup;
            }
        }
        if (! isset($attrs['items']) || ! is_array($attrs['items']) || $attrs['items'] === []) {
            $attrs['items'] = [
                ['heading' => 'High Returns', 'paragraph' => 'Earn market competitive returns on your savings and share capital.', 'fullWidth' => false],
                ['heading' => 'Access to Credit', 'paragraph' => 'Saving with us makes it easy to access credit. The more you save, the more you can borrow.', 'fullWidth' => false],
                ['heading' => 'Fallback', 'paragraph' => 'You can always count on your savings with the SACCO for unforeseen occurrences.', 'fullWidth' => false],
                ['heading' => 'Retirement', 'paragraph' => 'Savings come in handy when you retire from formal employment.', 'fullWidth' => false],
            ];
        } else {
            $normalizedItems = [];
            foreach ($attrs['items'] as $item) {
                if (! is_array($item)) {
                    continue;
                }
                $heading = trim((string) ($item['heading'] ?? $item['label'] ?? ''));
                $paragraph = (string) ($item['paragraph'] ?? $item['text'] ?? '');
                $allowed = [
                    'strong' => [],
                    'b' => [],
                    'em' => [],
                    'i' => [],
                    'br' => [],
                    'span' => [
                        'style' => true,
                    ],
                ];
                $paragraph = trim((string) wp_kses($paragraph, $allowed));
                $fullWidth = (bool) ($item['fullWidth'] ?? false);
                if ($heading === '' && $paragraph === '') {
                    continue;
                }
                $normalizedItems[] = [
                    'heading' => $heading,
                    'paragraph' => $paragraph,
                    'fullWidth' => $fullWidth,
                ];
            }
            $attrs['items'] = $normalizedItems;
        }

        return $attrs;
    }

    if ($name === 'custom/membership-content') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }
        $attrs['heading'] = isset($attrs['heading']) && trim((string) $attrs['heading']) !== ''
            ? (string) $attrs['heading']
            : 'Individual Membership';
        $attrs['description'] = isset($attrs['description'])
            ? trim(wp_strip_all_tags((string) $attrs['description']))
            : '';
        $attrs['backgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['backgroundColor']) ? (string) $attrs['backgroundColor'] : '',
            '#ffffff'
        );
        $attrs['headingColor'] = headless_core_sanitize_color_string(
            isset($attrs['headingColor']) ? (string) $attrs['headingColor'] : '',
            '#22ABB5'
        );
        $attrs['descriptionColor'] = headless_core_sanitize_color_string(
            isset($attrs['descriptionColor']) ? (string) $attrs['descriptionColor'] : '',
            '#000000'
        );
        $attrs['titleColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleColor']) ? (string) $attrs['titleColor'] : '',
            '#000000'
        );
        $attrs['textColor'] = headless_core_sanitize_color_string(
            isset($attrs['textColor']) ? (string) $attrs['textColor'] : '',
            '#000000'
        );
        $attrs['iconBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['iconBgColor']) ? (string) $attrs['iconBgColor'] : '',
            '#ED6E2A'
        );
        $attrs['tableHeaderBg'] = headless_core_sanitize_color_string(
            isset($attrs['tableHeaderBg']) ? (string) $attrs['tableHeaderBg'] : '',
            '#e7f0f9'
        );
        $attrs['tableCellBg'] = headless_core_sanitize_color_string(
            isset($attrs['tableCellBg']) ? (string) $attrs['tableCellBg'] : '',
            '#f8f9fa'
        );
        $attrs['buttonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBgColor']) ? (string) $attrs['buttonBgColor'] : '',
            '#40C9BF'
        );
        $attrs['buttonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonTextColor']) ? (string) $attrs['buttonTextColor'] : '',
            '#ffffff'
        );
        $attrs['buttonHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonHoverBgColor']) ? (string) $attrs['buttonHoverBgColor'] : '',
            '#35b5ad'
        );
        $attrs['linkTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkTextColor']) ? (string) $attrs['linkTextColor'] : '',
            '#22ABB5'
        );
        $attrs['linkHoverTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkHoverTextColor']) ? (string) $attrs['linkHoverTextColor'] : '',
            '#ED6E2A'
        );
        $attrs['linkIconBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkIconBgColor']) ? (string) $attrs['linkIconBgColor'] : '',
            '#22ABB5'
        );
        $attrs['linkIconHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkIconHoverBgColor']) ? (string) $attrs['linkIconHoverBgColor'] : '',
            '#ED6E2A'
        );
        $buttonLabel = isset($attrs['buttonLabel']) ? trim((string) $attrs['buttonLabel']) : '';
        $attrs['buttonLabel'] = $buttonLabel !== '' ? $buttonLabel : 'JOIN US!';
        $buttonUrl = isset($attrs['buttonUrl']) ? trim((string) $attrs['buttonUrl']) : '';
        $attrs['buttonUrl'] = $buttonUrl !== '' ? $buttonUrl : '/contact-us';

        $iconId = isset($attrs['iconId']) ? (int) $attrs['iconId'] : 0;
        $attrs['iconId'] = $iconId;
        if ($iconId > 0) {
            $url = wp_get_attachment_image_url($iconId, 'medium');
            if (is_string($url) && $url !== '') {
                $attrs['iconUrl'] = $url;
            }
            $svgMarkup = headless_core_attachment_inline_svg_markup($iconId);
            if ($svgMarkup !== '') {
                $attrs['iconSvg'] = $svgMarkup;
            }
        }

        $defaultHeaders = [
            'Membership Category',
            'Registration (KSH)',
            'Minimum Monthly Deposits Contribution (KSH)',
            'Share Capital',
        ];
        $headers = [];
        if (isset($attrs['tableHeaders']) && is_array($attrs['tableHeaders'])) {
            for ($i = 0; $i < 4; $i++) {
                $headers[] = isset($attrs['tableHeaders'][$i])
                    ? sanitize_text_field((string) $attrs['tableHeaders'][$i])
                    : $defaultHeaders[$i];
            }
        } else {
            $headers = $defaultHeaders;
        }
        $attrs['tableHeaders'] = $headers;

        $normalizedRows = [];
        if (isset($attrs['tableRows']) && is_array($attrs['tableRows']) && $attrs['tableRows'] !== []) {
            foreach ($attrs['tableRows'] as $row) {
                $cells = [];
                if (is_array($row)) {
                    for ($i = 0; $i < 4; $i++) {
                        $cells[] = isset($row[$i]) ? sanitize_text_field((string) $row[$i]) : '';
                    }
                }
                if ($cells !== ['', '', '', '']) {
                    $normalizedRows[] = $cells;
                }
            }
        }
        if ($normalizedRows === []) {
            $normalizedRows = [['Individual', '500', '1,000', '40,000']];
        }
        $attrs['tableRows'] = $normalizedRows;

        if (! isset($attrs['items']) || ! is_array($attrs['items']) || $attrs['items'] === []) {
            $attrs['items'] = [
                ['heading' => 'Membership Form:', 'paragraph' => 'Complete and submit the membership application form.', 'hasLink' => true, 'linkText' => '(click here)', 'linkUrl' => '#'],
                ['heading' => 'ID or Passport:', 'paragraph' => 'Attach a copy of your Kenyan National Identity Card or a valid Kenyan Passport.'],
                ['heading' => 'Passport Photo:', 'paragraph' => 'Attach coloured passport size photograph.'],
                ['heading' => 'KRA PIN Certificate:', 'paragraph' => 'Attach a copy of your KRA PIN Certificate.'],
            ];
        } else {
            $normalizedItems = [];
            foreach ($attrs['items'] as $item) {
                if (! is_array($item)) {
                    continue;
                }
                $heading = trim((string) ($item['heading'] ?? $item['label'] ?? ''));
                $paragraph = trim((string) ($item['paragraph'] ?? $item['text'] ?? ''));
                $hasLink = (bool) ($item['hasLink'] ?? false);
                $linkText = trim((string) ($item['linkText'] ?? '(click here)'));
                $linkUrl = trim((string) ($item['linkUrl'] ?? ''));
                if ($heading === '' && $paragraph === '') {
                    continue;
                }
                $normalizedItems[] = [
                    'heading' => $heading,
                    'paragraph' => $paragraph,
                    'hasLink' => $hasLink,
                    'linkText' => $linkText !== '' ? $linkText : '(click here)',
                    'linkUrl' => $linkUrl,
                ];
            }
            $attrs['items'] = $normalizedItems;
        }

        return $attrs;
    }

    if ($name === 'custom/download-app') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['heading'] = isset($attrs['heading']) && trim((string) $attrs['heading']) !== ''
            ? (string) $attrs['heading']
            : 'Download the App';
        $attrs['backgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['backgroundColor']) ? (string) $attrs['backgroundColor'] : '',
            '#22ACB6'
        );
        $attrs['headingColor'] = headless_core_sanitize_color_string(
            isset($attrs['headingColor']) ? (string) $attrs['headingColor'] : '',
            '#ffffff'
        );

        $gpId = isset($attrs['googlePlayImageId']) ? (int) $attrs['googlePlayImageId'] : 0;
        $attrs['googlePlayImageId'] = $gpId;
        if ($gpId > 0) {
            $url = wp_get_attachment_image_url($gpId, 'large');
            if (is_string($url) && $url !== '') {
                $attrs['googlePlayImageUrl'] = $url;
            }
        }
        $attrs['googlePlayLinkUrl'] = isset($attrs['googlePlayLinkUrl']) && trim((string) $attrs['googlePlayLinkUrl']) !== ''
            ? trim((string) $attrs['googlePlayLinkUrl'])
            : '#';

        $asId = isset($attrs['appStoreImageId']) ? (int) $attrs['appStoreImageId'] : 0;
        $attrs['appStoreImageId'] = $asId;
        if ($asId > 0) {
            $url = wp_get_attachment_image_url($asId, 'large');
            if (is_string($url) && $url !== '') {
                $attrs['appStoreImageUrl'] = $url;
            }
        }
        $attrs['appStoreLinkUrl'] = isset($attrs['appStoreLinkUrl']) && trim((string) $attrs['appStoreLinkUrl']) !== ''
            ? trim((string) $attrs['appStoreLinkUrl'])
            : '#';

        return $attrs;
    }

    if ($name === 'custom/contact-form') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['title'] = isset($attrs['title']) && trim((string) $attrs['title']) !== ''
            ? (string) $attrs['title']
            : 'Get in touch.';
        $attrs['subtitle'] = isset($attrs['subtitle']) ? trim((string) $attrs['subtitle']) : '';
        $attrs['formName'] = isset($attrs['formName']) && trim((string) $attrs['formName']) !== ''
            ? trim((string) $attrs['formName'])
            : 'Contact Form';
        $attrs['buttonLabel'] = isset($attrs['buttonLabel']) && trim((string) $attrs['buttonLabel']) !== ''
            ? trim((string) $attrs['buttonLabel'])
            : 'SUBMIT';
        $attrs['successMessage'] = isset($attrs['successMessage']) && trim((string) $attrs['successMessage']) !== ''
            ? trim((string) $attrs['successMessage'])
            : 'Thanks — we have received your message.';

        $attrs['backgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['backgroundColor']) ? (string) $attrs['backgroundColor'] : '',
            '#ffffff'
        );
        $attrs['titleColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleColor']) ? (string) $attrs['titleColor'] : '',
            '#22ABB5'
        );
        $attrs['textColor'] = headless_core_sanitize_color_string(
            isset($attrs['textColor']) ? (string) $attrs['textColor'] : '',
            '#333333'
        );
        $attrs['labelColor'] = headless_core_sanitize_color_string(
            isset($attrs['labelColor']) ? (string) $attrs['labelColor'] : '',
            '#333333'
        );
        $attrs['inputBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['inputBorderColor']) ? (string) $attrs['inputBorderColor'] : '',
            '#e8e8e8'
        );
        $attrs['buttonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBgColor']) ? (string) $attrs['buttonBgColor'] : '',
            '#ED6E2A'
        );
        $attrs['buttonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonTextColor']) ? (string) $attrs['buttonTextColor'] : '',
            '#ffffff'
        );
        $attrs['buttonHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonHoverBgColor']) ? (string) $attrs['buttonHoverBgColor'] : '',
            '#22ACB6'
        );
        $attrs['buttonHoverTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonHoverTextColor']) ? (string) $attrs['buttonHoverTextColor'] : '',
            '#ffffff'
        );

        return $attrs;
    }

    if ($name === 'custom/contact-map') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['title'] = isset($attrs['title']) && trim((string) $attrs['title']) !== ''
            ? (string) $attrs['title']
            : 'Our Location';
        $attrs['address'] = isset($attrs['address']) ? trim((string) $attrs['address']) : '';
        $attrs['embedUrl'] = isset($attrs['embedUrl']) ? trim((string) $attrs['embedUrl']) : '';
        $attrs['directionsUrl'] = isset($attrs['directionsUrl']) ? trim((string) $attrs['directionsUrl']) : '';

        $attrs['backgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['backgroundColor']) ? (string) $attrs['backgroundColor'] : '',
            '#ffffff'
        );
        $attrs['titleColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleColor']) ? (string) $attrs['titleColor'] : '',
            '#22ACB6'
        );
        $attrs['textColor'] = headless_core_sanitize_color_string(
            isset($attrs['textColor']) ? (string) $attrs['textColor'] : '',
            '#000000'
        );
        $attrs['cardBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardBgColor']) ? (string) $attrs['cardBgColor'] : '',
            '#ffffff'
        );

        return $attrs;
    }

    if ($name === 'custom/asset-finance-whatever') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }
        $attrs['title'] = isset($attrs['title']) && trim((string) $attrs['title']) !== ''
            ? (string) $attrs['title']
            : 'Get financing for whatever you need now';
        $attrs['buttonLabel'] = isset($attrs['buttonLabel']) && trim((string) $attrs['buttonLabel']) !== ''
            ? (string) $attrs['buttonLabel']
            : 'ENQUIRE NOW';
        $attrs['buttonUrl'] = isset($attrs['buttonUrl']) && trim((string) $attrs['buttonUrl']) !== ''
            ? (string) $attrs['buttonUrl']
            : '#';

        $attrs['backgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['backgroundColor']) ? (string) $attrs['backgroundColor'] : '',
            '#22ACB6'
        );
        $attrs['titleColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleColor']) ? (string) $attrs['titleColor'] : '',
            '#ffffff'
        );
        $attrs['buttonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBgColor']) ? (string) $attrs['buttonBgColor'] : '',
            '#ed6e2a'
        );
        $attrs['buttonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonTextColor']) ? (string) $attrs['buttonTextColor'] : '',
            '#ffffff'
        );
        $attrs['buttonBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBorderColor']) ? (string) $attrs['buttonBorderColor'] : '',
            '#22ACB6'
        );
        $attrs['buttonHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonHoverBgColor']) ? (string) $attrs['buttonHoverBgColor'] : '',
            '#ffffff'
        );
        $attrs['buttonHoverTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonHoverTextColor']) ? (string) $attrs['buttonHoverTextColor'] : '',
            '#ed6e2a'
        );
        $attrs['buttonHoverBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonHoverBorderColor']) ? (string) $attrs['buttonHoverBorderColor'] : '',
            '#22ACB6'
        );

        return $attrs;
    }

    if ($name === 'custom/asset-finance-faq') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['title'] = isset($attrs['title']) && trim((string) $attrs['title']) !== ''
            ? (string) $attrs['title']
            : 'Frequently Asked Questions';
        $attrs['intro'] = isset($attrs['intro']) ? trim((string) $attrs['intro']) : '';

        $attrs['backgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['backgroundColor']) ? (string) $attrs['backgroundColor'] : '',
            '#eef0f3'
        );
        $attrs['titleColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleColor']) ? (string) $attrs['titleColor'] : '',
            '#22ACB6'
        );
        $attrs['textColor'] = headless_core_sanitize_color_string(
            isset($attrs['textColor']) ? (string) $attrs['textColor'] : '',
            '#000000'
        );
        $attrs['questionColor'] = headless_core_sanitize_color_string(
            isset($attrs['questionColor']) ? (string) $attrs['questionColor'] : '',
            '#000000'
        );
        $attrs['borderColor'] = headless_core_sanitize_color_string(
            isset($attrs['borderColor']) ? (string) $attrs['borderColor'] : '',
            '#e5e7eb'
        );
        $attrs['hoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['hoverBgColor']) ? (string) $attrs['hoverBgColor'] : '',
            '#f9fafb'
        );
        $attrs['iconColor'] = headless_core_sanitize_color_string(
            isset($attrs['iconColor']) ? (string) $attrs['iconColor'] : '',
            '#000000'
        );

        if (! isset($attrs['items']) || ! is_array($attrs['items']) || $attrs['items'] === []) {
            $attrs['items'] = [
                ['question' => 'Can I pay off my loan early?', 'answer' => 'Yes, you can pay off your loan early. Please contact us for details on early repayment options.'],
                ['question' => 'Can you offer refinancing?', 'answer' => 'Yes, we offer refinancing options. Contact our team to discuss your refinancing needs.'],
                ['question' => 'When should I apply?', 'answer' => 'You can apply at any time. Our application process is open throughout the year.'],
                ['question' => 'Where are you located?', 'answer' => 'We have multiple branches. Please visit our contact page for branch locations and contact information.'],
            ];
        } else {
            $normalizedItems = [];
            foreach ($attrs['items'] as $item) {
                if (! is_array($item)) {
                    continue;
                }
                $q = trim((string) ($item['question'] ?? ''));
                $a = trim((string) ($item['answer'] ?? ''));
                if ($q === '' && $a === '') {
                    continue;
                }
                $normalizedItems[] = [
                    'question' => $q,
                    'answer' => $a,
                ];
            }
            $attrs['items'] = $normalizedItems;
        }

        return $attrs;
    }

    if ($name === 'custom/asset-finance-apply') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['title'] = isset($attrs['title']) && trim((string) $attrs['title']) !== ''
            ? (string) $attrs['title']
            : 'Apply Now!';
        $attrs['buttonLabel'] = isset($attrs['buttonLabel']) && trim((string) $attrs['buttonLabel']) !== ''
            ? (string) $attrs['buttonLabel']
            : 'SUBMIT YOUR APPLICATION';
        $attrs['successMessage'] = isset($attrs['successMessage']) ? trim((string) $attrs['successMessage']) : '';

        $attrs['backgroundColor'] = headless_core_sanitize_color_string(
            isset($attrs['backgroundColor']) ? (string) $attrs['backgroundColor'] : '',
            '#eef0f3'
        );
        $attrs['titleColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleColor']) ? (string) $attrs['titleColor'] : '',
            '#ED6E2A'
        );
        $attrs['labelColor'] = headless_core_sanitize_color_string(
            isset($attrs['labelColor']) ? (string) $attrs['labelColor'] : '',
            '#000000'
        );
        $attrs['inputBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['inputBorderColor']) ? (string) $attrs['inputBorderColor'] : '',
            '#e8e8e8'
        );
        $attrs['buttonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBgColor']) ? (string) $attrs['buttonBgColor'] : '',
            '#ED6E2A'
        );
        $attrs['buttonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonTextColor']) ? (string) $attrs['buttonTextColor'] : '',
            '#ffffff'
        );
        $attrs['buttonHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonHoverBgColor']) ? (string) $attrs['buttonHoverBgColor'] : '',
            '#22ACB6'
        );
        $attrs['buttonHoverTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonHoverTextColor']) ? (string) $attrs['buttonHoverTextColor'] : '',
            '#ffffff'
        );

        return $attrs;
    }

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
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }
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

    if ($name === 'custom/about-us-stats') {
        $attrs = headless_core_about_us_stats_merge_defaults($attrs);
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
                    $svgMarkup = headless_core_attachment_inline_svg_markup($iconId);
                    if ($svgMarkup !== '') {
                        $attrs['items'][$idx]['iconSvg'] = $svgMarkup;
                    }
                }
            }
        }

        return $attrs;
    }

    if ($name === 'custom/home-stats') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) && trim((string) $attrs['sectionId']) !== ''
            ? trim((string) $attrs['sectionId'])
            : 'stats';

        $attrs['animationDurationSec'] = isset($attrs['animationDurationSec'])
            ? max(0.4, min(30.0, (float) $attrs['animationDurationSec']))
            : 2.5;

        $attrs['sectionBg'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBg']) ? (string) $attrs['sectionBg'] : '',
            '#22acb6'
        );
        $attrs['numberColor'] = headless_core_sanitize_color_string(
            isset($attrs['numberColor']) ? (string) $attrs['numberColor'] : '',
            '#ffffff'
        );
        $attrs['titleColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleColor']) ? (string) $attrs['titleColor'] : '',
            '#ffffff'
        );
        $attrs['subtitleColor'] = headless_core_sanitize_color_string(
            isset($attrs['subtitleColor']) ? (string) $attrs['subtitleColor'] : '',
            '#ffffff'
        );
        $attrs['iconColor'] = headless_core_sanitize_color_string(
            isset($attrs['iconColor']) ? (string) $attrs['iconColor'] : '',
            '#ffffff'
        );
        $attrs['iconWidth'] = isset($attrs['iconWidth']) ? max(0, (int) $attrs['iconWidth']) : 107;
        $attrs['iconHeight'] = isset($attrs['iconHeight']) ? max(0, (int) $attrs['iconHeight']) : 58;

        $items = isset($attrs['items']) && is_array($attrs['items']) ? $attrs['items'] : [];
        $out = [];
        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }
            $valueStart = isset($item['valueStart']) ? (int) $item['valueStart'] : 0;
            $valueEnd = isset($item['valueEnd']) ? (int) $item['valueEnd'] : 0;
            $showPlus = ! empty($item['showPlus']);
            $title = isset($item['title']) ? wp_kses_post((string) $item['title']) : '';
            $subtitle = isset($item['subtitle']) ? wp_kses_post((string) $item['subtitle']) : '';
            $iconId = isset($item['iconId']) ? (int) $item['iconId'] : 0;
            $iconUrl = isset($item['iconUrl']) ? trim((string) $item['iconUrl']) : '';
            $iconSvg = '';

            if ($iconId > 0) {
                $url = wp_get_attachment_image_url($iconId, 'medium');
                if (is_string($url) && $url !== '') {
                    $iconUrl = $url;
                }
                $svgMarkup = headless_core_attachment_inline_svg_markup($iconId);
                if ($svgMarkup !== '') {
                    $iconSvg = $svgMarkup;
                }
            }

            $out[] = [
                'valueStart' => $valueStart,
                'valueEnd' => $valueEnd,
                'showPlus' => $showPlus,
                'title' => $title,
                'subtitle' => $subtitle,
                'iconId' => $iconId,
                'iconUrl' => $iconUrl,
                'iconSvg' => $iconSvg,
            ];
        }
        $attrs['items'] = $out;

        return $attrs;
    }

    if ($name === 'custom/about-us-awards') {
        $attrs = headless_core_about_us_awards_merge_defaults($attrs);

        return $attrs;
    }

    if ($name === 'custom/about-us-help') {
        $attrs = headless_core_about_us_help_merge_defaults($attrs);
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
                    $svgMarkup = headless_core_attachment_inline_svg_markup($iconId);
                    if ($svgMarkup !== '') {
                        $attrs['items'][$idx]['iconSvg'] = $svgMarkup;
                    }
                }
                $linkSvgId = isset($item['linkSvgId']) ? (int) $item['linkSvgId'] : 0;
                if ($linkSvgId > 0) {
                    $linkUrl = wp_get_attachment_image_url($linkSvgId, 'medium');
                    if (is_string($linkUrl) && $linkUrl !== '') {
                        $attrs['items'][$idx]['linkSvgUrl'] = $linkUrl;
                    }
                    $linkSvg = headless_core_attachment_inline_svg_markup($linkSvgId);
                    if ($linkSvg !== '') {
                        $attrs['items'][$idx]['linkSvgMarkup'] = $linkSvg;
                    }
                }
            }
        }

        return $attrs;
    }

    if ($name === 'custom/home-about') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) && trim((string) $attrs['sectionId']) !== ''
            ? trim((string) $attrs['sectionId'])
            : 'about';
        $attrs['badgeText'] = isset($attrs['badgeText']) && trim((string) $attrs['badgeText']) !== ''
            ? trim((string) $attrs['badgeText'])
            : 'ABOUT US';
        $attrs['bodyText'] = isset($attrs['bodyText']) ? trim((string) $attrs['bodyText']) : '';
        $attrs['readMoreLabel'] = isset($attrs['readMoreLabel']) && trim((string) $attrs['readMoreLabel']) !== ''
            ? trim((string) $attrs['readMoreLabel'])
            : 'READ MORE';
        $attrs['readMoreUrl'] = isset($attrs['readMoreUrl']) && trim((string) $attrs['readMoreUrl']) !== ''
            ? trim((string) $attrs['readMoreUrl'])
            : '/about-us';

        $attrs['barBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['barBgColor']) ? (string) $attrs['barBgColor'] : '',
            '#22acb6'
        );
        $attrs['curvedRectColor'] = headless_core_sanitize_color_string(
            isset($attrs['curvedRectColor']) ? (string) $attrs['curvedRectColor'] : '',
            '#ffffff'
        );
        $attrs['scrollButtonBg'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonBg']) ? (string) $attrs['scrollButtonBg'] : '',
            '#22ACB6'
        );
        $attrs['scrollButtonArrow'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonArrow']) ? (string) $attrs['scrollButtonArrow'] : '',
            '#ffffff'
        );
        $attrs['buttonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBgColor']) ? (string) $attrs['buttonBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['buttonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonTextColor']) ? (string) $attrs['buttonTextColor'] : '',
            '#ffffff'
        );
        $attrs['bodyTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['bodyTextColor']) ? (string) $attrs['bodyTextColor'] : '',
            '#3b4e6b'
        );
        $attrs['readMoreTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['readMoreTextColor']) ? (string) $attrs['readMoreTextColor'] : '',
            '#3b4e6b'
        );
        $attrs['readMoreHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['readMoreHoverColor']) ? (string) $attrs['readMoreHoverColor'] : '',
            '#22ACB6'
        );
        $attrs['readMoreCircleColor'] = headless_core_sanitize_color_string(
            isset($attrs['readMoreCircleColor']) ? (string) $attrs['readMoreCircleColor'] : '',
            '#22ACB6'
        );

        return $attrs;
    }

    if ($name === 'custom/help-section') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) && trim((string) $attrs['sectionId']) !== ''
            ? trim((string) $attrs['sectionId'])
            : 'help';

        $attrs['kickerHtml'] = isset($attrs['kickerHtml']) ? wp_kses_post((string) $attrs['kickerHtml']) : '<p>WE ARE HERE TO HELP YOU</p>';
        $attrs['talkButtonHtml'] = isset($attrs['talkButtonHtml']) ? wp_kses_post((string) $attrs['talkButtonHtml']) : 'TALK TO US!';
        $attrs['kickerColor'] = headless_core_sanitize_color_string(
            isset($attrs['kickerColor']) ? (string) $attrs['kickerColor'] : '',
            '#ffffff'
        );

        $attrs['sectionBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBgColor']) ? (string) $attrs['sectionBgColor'] : '',
            '#00AFBB'
        );
        $attrs['showTopBar'] = isset($attrs['showTopBar']) ? (bool) $attrs['showTopBar'] : true;
        $attrs['topBarBg'] = headless_core_sanitize_color_string(
            isset($attrs['topBarBg']) ? (string) $attrs['topBarBg'] : '',
            '#FFFFFF'
        );
        $attrs['waveAccentColor'] = headless_core_sanitize_color_string(
            isset($attrs['waveAccentColor']) ? (string) $attrs['waveAccentColor'] : '',
            '#00AFBB'
        );
        $attrs['scrollOuterColor'] = headless_core_sanitize_color_string(
            isset($attrs['scrollOuterColor']) ? (string) $attrs['scrollOuterColor'] : '',
            '#ffffff'
        );
        $attrs['scrollInnerColor'] = headless_core_sanitize_color_string(
            isset($attrs['scrollInnerColor']) ? (string) $attrs['scrollInnerColor'] : '',
            '#22ACB6'
        );
        $attrs['talkButtonBg'] = headless_core_sanitize_color_string(
            isset($attrs['talkButtonBg']) ? (string) $attrs['talkButtonBg'] : '',
            '#EE6E2A'
        );
        $attrs['talkButtonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['talkButtonTextColor']) ? (string) $attrs['talkButtonTextColor'] : '',
            '#ffffff'
        );
        $attrs['cardIconColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardIconColor']) ? (string) $attrs['cardIconColor'] : '',
            '#22acb6'
        );
        $attrs['cardIconHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardIconHoverColor']) ? (string) $attrs['cardIconHoverColor'] : '',
            '#EE6E2A'
        );
        $attrs['cardBgHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardBgHoverColor']) ? (string) $attrs['cardBgHoverColor'] : '',
            '#f0fdfa'
        );
        $attrs['titleHeadingColor'] = headless_core_sanitize_color_string(
            isset($attrs['titleHeadingColor']) ? (string) $attrs['titleHeadingColor'] : '',
            '#808080'
        );
        $attrs['bodyTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['bodyTextColor']) ? (string) $attrs['bodyTextColor'] : '',
            '#000000'
        );
        $attrs['metaTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['metaTextColor']) ? (string) $attrs['metaTextColor'] : '',
            '#808080'
        );
        $attrs['ctaTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['ctaTextColor']) ? (string) $attrs['ctaTextColor'] : '',
            '#808080'
        );
        $attrs['cardChevronBg'] = headless_core_sanitize_color_string(
            isset($attrs['cardChevronBg']) ? (string) $attrs['cardChevronBg'] : '',
            '#ffffff'
        );
        $attrs['cardChevronBgHover'] = headless_core_sanitize_color_string(
            isset($attrs['cardChevronBgHover']) ? (string) $attrs['cardChevronBgHover'] : '',
            '#ffffff'
        );
        $attrs['cardChevronIconColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardChevronIconColor']) ? (string) $attrs['cardChevronIconColor'] : '',
            '#22acb6'
        );
        $attrs['cardChevronIconHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardChevronIconHoverColor']) ? (string) $attrs['cardChevronIconHoverColor'] : '',
            '#ee6e2a'
        );

        $default_cards = [
            [
                'iconKey' => 'apply',
                'titleHtml' => 'APPLY FOR A LOAN',
                'bodyHtml' => '<p>Looking to buy a car, build a home, start a business, pay for education? Apply for a loan now!</p>',
                'ctaMode' => 'link',
                'ctaLabelHtml' => 'Get an Appointment',
                'ctaUrl' => '',
                'whatsappUrl' => '',
                'phone' => '',
                'email' => '',
            ],
            [
                'iconKey' => 'call',
                'titleHtml' => 'CALL US!',
                'bodyHtml' => '',
                'ctaMode' => 'link',
                'ctaLabelHtml' => 'Contact us',
                'ctaUrl' => '',
                'whatsappUrl' => '',
                'phone' => '+254 111 173 000',
                'email' => 'info@portsacco.co.ke',
            ],
            [
                'iconKey' => 'advisor',
                'titleHtml' => 'TALK TO AN ADVISOR',
                'bodyHtml' => '<p>Do you need financial planning? Talk to our advisors.</p>',
                'ctaMode' => 'whatsapp',
                'ctaLabelHtml' => '',
                'ctaUrl' => '',
                'whatsappUrl' => '',
                'phone' => '',
                'email' => '',
            ],
        ];

        $cards_in = isset($attrs['cards']) && is_array($attrs['cards']) ? array_slice($attrs['cards'], 0, 3) : [];
        $cards_out = [];
        for ($i = 0; $i < 3; $i++) {
            $row = $cards_in[$i] ?? null;
            $d = $default_cards[$i];
            if (! is_array($row)) {
                $cards_out[] = $d;
                continue;
            }
            $icon_key = isset($row['iconKey']) ? (string) $row['iconKey'] : '';
            if (! in_array($icon_key, ['apply', 'call', 'advisor'], true)) {
                $icon_key = $d['iconKey'];
            }
            $cta_mode = isset($row['ctaMode']) ? (string) $row['ctaMode'] : '';
            if (! in_array($cta_mode, ['link', 'whatsapp', 'none'], true)) {
                $cta_mode = $d['ctaMode'];
            }
            $wa_raw = isset($row['whatsappUrl']) ? trim((string) $row['whatsappUrl']) : '';
            $wa_out = $wa_raw !== '' ? esc_url_raw($wa_raw) : '';

            $cards_out[] = [
                'iconKey' => $icon_key,
                'titleHtml' => isset($row['titleHtml']) ? wp_kses_post((string) $row['titleHtml']) : $d['titleHtml'],
                'bodyHtml' => isset($row['bodyHtml']) ? wp_kses_post((string) $row['bodyHtml']) : $d['bodyHtml'],
                'ctaMode' => $cta_mode,
                'ctaLabelHtml' => isset($row['ctaLabelHtml']) ? wp_kses_post((string) $row['ctaLabelHtml']) : $d['ctaLabelHtml'],
                'ctaUrl' => isset($row['ctaUrl']) ? trim((string) $row['ctaUrl']) : $d['ctaUrl'],
                'whatsappUrl' => $wa_out,
                'phone' => isset($row['phone']) ? sanitize_text_field((string) $row['phone']) : $d['phone'],
                'email' => isset($row['email']) ? sanitize_email((string) $row['email']) : $d['email'],
            ];
        }
        $attrs['cards'] = $cards_out;

        return $attrs;
    }

    if ($name === 'custom/home-product-cards') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) && trim((string) $attrs['sectionId']) !== ''
            ? trim((string) $attrs['sectionId'])
            : 'products';
        $attrs['badgeText'] = isset($attrs['badgeText']) && trim((string) $attrs['badgeText']) !== ''
            ? trim((string) $attrs['badgeText'])
            : 'EXPLORE';
        // parse_blocks() often omits keys equal to block registration defaults.
        $attrs['kickerText'] = isset($attrs['kickerText'])
            ? trim((string) $attrs['kickerText'])
            : 'EXPLORE OUR WIDE RANGE OF PRODUCTS AND SERVICES.';

        $attrs['sectionBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBgColor']) ? (string) $attrs['sectionBgColor'] : '',
            '#F5F4EE'
        );
        $attrs['topCurveBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['topCurveBgColor']) ? (string) $attrs['topCurveBgColor'] : '',
            '#ffffff'
        );
        $attrs['topCurveCutoutColor'] = headless_core_sanitize_color_string(
            isset($attrs['topCurveCutoutColor']) ? (string) $attrs['topCurveCutoutColor'] : '',
            '#F5F4EE'
        );
        $attrs['badgeBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['badgeBgColor']) ? (string) $attrs['badgeBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['badgeTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['badgeTextColor']) ? (string) $attrs['badgeTextColor'] : '',
            '#ffffff'
        );
        $attrs['kickerColor'] = headless_core_sanitize_color_string(
            isset($attrs['kickerColor']) ? (string) $attrs['kickerColor'] : '',
            '#22ACB6'
        );
        $attrs['cardTagBarColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardTagBarColor']) ? (string) $attrs['cardTagBarColor'] : '',
            '#F06E2A'
        );
        $attrs['cardTagTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardTagTextColor']) ? (string) $attrs['cardTagTextColor'] : '',
            '#3b4e6b'
        );
        $attrs['cardTitleColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardTitleColor']) ? (string) $attrs['cardTitleColor'] : '',
            '#22ACB6'
        );
        $attrs['cardTitleHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardTitleHoverColor']) ? (string) $attrs['cardTitleHoverColor'] : '',
            '#ee6e2a'
        );
        $attrs['cardTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardTextColor']) ? (string) $attrs['cardTextColor'] : '',
            '#3b4e6b'
        );
        $attrs['arrowBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['arrowBgColor']) ? (string) $attrs['arrowBgColor'] : '',
            '#82cdcb'
        );
        $attrs['arrowHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['arrowHoverBgColor']) ? (string) $attrs['arrowHoverBgColor'] : '',
            '#ee6e2a'
        );
        $attrs['arrowColor'] = headless_core_sanitize_color_string(
            isset($attrs['arrowColor']) ? (string) $attrs['arrowColor'] : '',
            '#ffffff'
        );
        $attrs['cardBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardBorderColor']) ? (string) $attrs['cardBorderColor'] : '',
            '#e8e8e8'
        );
        $attrs['cardHoverBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardHoverBorderColor']) ? (string) $attrs['cardHoverBorderColor'] : '',
            '#cfeeed'
        );
        $attrs['imageBgFrom'] = headless_core_sanitize_color_string(
            isset($attrs['imageBgFrom']) ? (string) $attrs['imageBgFrom'] : '',
            '#00B2E0'
        );
        $attrs['imageBgTo'] = headless_core_sanitize_color_string(
            isset($attrs['imageBgTo']) ? (string) $attrs['imageBgTo'] : '',
            '#00AB81'
        );

        $cards = isset($attrs['cards']) && is_array($attrs['cards']) ? $attrs['cards'] : [];
        $out = [];
        foreach ($cards as $card) {
            if (! is_array($card)) {
                continue;
            }
            $imageId = isset($card['imageId']) ? (int) $card['imageId'] : 0;
            $imageUrl = isset($card['imageUrl']) ? trim((string) $card['imageUrl']) : '';
            if ($imageId > 0) {
                $url = wp_get_attachment_image_url($imageId, 'large');
                if (is_string($url) && $url !== '') {
                    $imageUrl = $url;
                }
            }
            $title = isset($card['title']) ? trim((string) $card['title']) : '';
            $description = isset($card['description']) ? trim((string) $card['description']) : '';
            $tag = isset($card['tag']) ? trim((string) $card['tag']) : '';
            $href = isset($card['href']) ? trim((string) $card['href']) : '#';
            $cardImageBgFrom = headless_core_sanitize_color_string(
                isset($card['imageBgFrom']) ? (string) $card['imageBgFrom'] : '',
                ''
            );
            $cardImageBgTo = headless_core_sanitize_color_string(
                isset($card['imageBgTo']) ? (string) $card['imageBgTo'] : '',
                ''
            );
            if ($title === '' && $description === '' && $imageUrl === '') {
                continue;
            }
            $out[] = [
                'imageId' => $imageId,
                'imageUrl' => $imageUrl,
                'imageBgFrom' => $cardImageBgFrom,
                'imageBgTo' => $cardImageBgTo,
                'title' => $title,
                'description' => $description,
                'tag' => $tag,
                'href' => $href,
            ];
        }
        $attrs['cards'] = $out;

        return $attrs;
    }

    if ($name === 'custom/product-services') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) && trim((string) $attrs['sectionId']) !== ''
            ? trim((string) $attrs['sectionId'])
            : 'services';
        $attrs['gradientAngle'] = isset($attrs['gradientAngle'])
            ? max(0, min(360, (int) $attrs['gradientAngle']))
            : 90;

        $attrs['gradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['gradientFrom']) ? (string) $attrs['gradientFrom'] : '',
            '#00B2E0'
        );
        $attrs['gradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['gradientVia']) ? (string) $attrs['gradientVia'] : '',
            '#00AFBB'
        );
        $attrs['gradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['gradientTo']) ? (string) $attrs['gradientTo'] : '',
            '#00AB81'
        );
        $attrs['topBarBg'] = headless_core_sanitize_color_string(
            isset($attrs['topBarBg']) ? (string) $attrs['topBarBg'] : '',
            '#F5F4EE'
        );
        $attrs['topCurveRectFill'] = headless_core_sanitize_color_string(
            isset($attrs['topCurveRectFill']) ? (string) $attrs['topCurveRectFill'] : '',
            '#00AFBB'
        );
        $attrs['topCurvePathFill'] = headless_core_sanitize_color_string(
            isset($attrs['topCurvePathFill']) ? (string) $attrs['topCurvePathFill'] : '',
            '#F5F4EE'
        );
        $attrs['kickerText'] = isset($attrs['kickerText']) ? sanitize_text_field((string) $attrs['kickerText']) : 'YOUR JOURNEY OF PROSPERITY START HERE!';
        $attrs['kickerColor'] = headless_core_sanitize_color_string(
            isset($attrs['kickerColor']) ? (string) $attrs['kickerColor'] : '',
            '#ffffff'
        );
        $attrs['centerPillText'] = isset($attrs['centerPillText']) ? sanitize_text_field((string) $attrs['centerPillText']) : 'HOW CAN WE UPLIFT YOU TODAY?';
        $attrs['centerPillBg'] = headless_core_sanitize_color_string(
            isset($attrs['centerPillBg']) ? (string) $attrs['centerPillBg'] : '',
            '#EE6E2A'
        );
        $attrs['centerPillHoverBg'] = headless_core_sanitize_color_string(
            isset($attrs['centerPillHoverBg']) ? (string) $attrs['centerPillHoverBg'] : '',
            '#d96525'
        );
        $attrs['centerPillTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['centerPillTextColor']) ? (string) $attrs['centerPillTextColor'] : '',
            '#ffffff'
        );
        $attrs['scrollArrowOuterFill'] = headless_core_sanitize_color_string(
            isset($attrs['scrollArrowOuterFill']) ? (string) $attrs['scrollArrowOuterFill'] : '',
            '#ffffff'
        );
        $attrs['scrollArrowInnerFill'] = headless_core_sanitize_color_string(
            isset($attrs['scrollArrowInnerFill']) ? (string) $attrs['scrollArrowInnerFill'] : '',
            '#22ACB6'
        );
        $attrs['boxBg'] = headless_core_sanitize_color_string(
            isset($attrs['boxBg']) ? (string) $attrs['boxBg'] : '',
            '#ffffff'
        );
        $attrs['boxTitle'] = isset($attrs['boxTitle']) ? sanitize_text_field((string) $attrs['boxTitle']) : 'PRODUCTS & SERVICES THAT UPLIFT YOUR FINANCIAL SUCCESS!';
        $attrs['boxSubtitle'] = isset($attrs['boxSubtitle']) ? sanitize_text_field((string) $attrs['boxSubtitle']) : 'SELECT THE PRODUCT OR SERVICE YOU NEED';
        $attrs['boxTitleColor'] = headless_core_sanitize_color_string(
            isset($attrs['boxTitleColor']) ? (string) $attrs['boxTitleColor'] : '',
            '#3b4e6b'
        );
        $attrs['boxSubtitleColor'] = headless_core_sanitize_color_string(
            isset($attrs['boxSubtitleColor']) ? (string) $attrs['boxSubtitleColor'] : '',
            '#3b4e6b'
        );
        $attrs['dropdownPlaceholder'] = isset($attrs['dropdownPlaceholder']) ? sanitize_text_field((string) $attrs['dropdownPlaceholder']) : 'How can we uplift you today?';
        $attrs['dropdownBg'] = headless_core_sanitize_color_string(
            isset($attrs['dropdownBg']) ? (string) $attrs['dropdownBg'] : '',
            '#38f0ba'
        );
        $attrs['dropdownBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['dropdownBorderColor']) ? (string) $attrs['dropdownBorderColor'] : '',
            '#e8e8e8'
        );
        $attrs['dropdownTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['dropdownTextColor']) ? (string) $attrs['dropdownTextColor'] : '',
            '#3b4e6b'
        );
        $attrs['dropdownChevronColor'] = headless_core_sanitize_color_string(
            isset($attrs['dropdownChevronColor']) ? (string) $attrs['dropdownChevronColor'] : '',
            '#3b4e6b'
        );
        $attrs['goButtonBg'] = headless_core_sanitize_color_string(
            isset($attrs['goButtonBg']) ? (string) $attrs['goButtonBg'] : '',
            '#38f0ba'
        );
        $attrs['goButtonBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['goButtonBorderColor']) ? (string) $attrs['goButtonBorderColor'] : '',
            '#e8e8e8'
        );
        $attrs['goButtonIconColor'] = headless_core_sanitize_color_string(
            isset($attrs['goButtonIconColor']) ? (string) $attrs['goButtonIconColor'] : '',
            '#3b4e6b'
        );
        $attrs['goButtonHoverOpacity'] = isset($attrs['goButtonHoverOpacity'])
            ? max(0.2, min(1.0, (float) $attrs['goButtonHoverOpacity']))
            : 0.85;
        $attrs['dividerColor'] = headless_core_sanitize_color_string(
            isset($attrs['dividerColor']) ? (string) $attrs['dividerColor'] : '',
            '#e8e8e8'
        );
        $attrs['pillBg'] = headless_core_sanitize_color_string(
            isset($attrs['pillBg']) ? (string) $attrs['pillBg'] : '',
            '#00ada0'
        );
        $attrs['pillBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['pillBorderColor']) ? (string) $attrs['pillBorderColor'] : '',
            '#e8e8e8'
        );
        $attrs['pillTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['pillTextColor']) ? (string) $attrs['pillTextColor'] : '',
            '#ffffff'
        );
        $attrs['pillHoverBg'] = headless_core_sanitize_color_string(
            isset($attrs['pillHoverBg']) ? (string) $attrs['pillHoverBg'] : '',
            '#ee6e2a'
        );
        $attrs['pillHoverBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['pillHoverBorderColor']) ? (string) $attrs['pillHoverBorderColor'] : '',
            '#ee6e2a'
        );
        $attrs['pillHoverTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['pillHoverTextColor']) ? (string) $attrs['pillHoverTextColor'] : '',
            '#ffffff'
        );

        $dropdownItems = isset($attrs['dropdownItems']) && is_array($attrs['dropdownItems']) ? $attrs['dropdownItems'] : [];
        $ddOut = [];
        foreach ($dropdownItems as $row) {
            if (! is_array($row)) {
                continue;
            }
            $label = isset($row['label']) ? sanitize_text_field((string) $row['label']) : '';
            $url = isset($row['url']) ? trim((string) $row['url']) : '';
            if ($label === '') {
                continue;
            }
            $ddOut[] = [
                'label' => $label,
                'url' => $url !== '' ? $url : '#',
            ];
        }
        $attrs['dropdownItems'] = $ddOut;

        $productButtons = isset($attrs['productButtons']) && is_array($attrs['productButtons']) ? $attrs['productButtons'] : [];
        $pbOut = [];
        foreach ($productButtons as $row) {
            if (! is_array($row)) {
                continue;
            }
            $label = isset($row['label']) ? sanitize_text_field((string) $row['label']) : '';
            $url = isset($row['url']) ? trim((string) $row['url']) : '';
            if ($label === '') {
                continue;
            }
            $pbOut[] = [
                'label' => $label,
                'url' => $url !== '' ? $url : '#',
            ];
        }
        $attrs['productButtons'] = $pbOut;

        return $attrs;
    }

    if ($name === 'custom/home-banner-slider') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) && trim((string) $attrs['sectionId']) !== ''
            ? trim((string) $attrs['sectionId'])
            : 'hero';

        $attrs['heroBg'] = headless_core_sanitize_color_string(
            isset($attrs['heroBg']) ? (string) $attrs['heroBg'] : '',
            '#1BB5B5'
        );
        $attrs['dotBarBg'] = headless_core_sanitize_color_string(
            isset($attrs['dotBarBg']) ? (string) $attrs['dotBarBg'] : '',
            '#22acb6'
        );
        $attrs['arrowBg'] = headless_core_sanitize_color_string(
            isset($attrs['arrowBg']) ? (string) $attrs['arrowBg'] : '',
            'rgba(255,255,255,0.8)'
        );
        $attrs['arrowIconColor'] = headless_core_sanitize_color_string(
            isset($attrs['arrowIconColor']) ? (string) $attrs['arrowIconColor'] : '',
            '#1BB5B5'
        );
        $attrs['transitionMs'] = isset($attrs['transitionMs'])
            ? max(200, min(2000, (int) $attrs['transitionMs']))
            : 700;

        $slides = isset($attrs['slides']) && is_array($attrs['slides']) ? $attrs['slides'] : [];
        $slides_out = [];
        foreach ($slides as $row) {
            if (! is_array($row)) {
                continue;
            }
            $imageId = isset($row['imageId']) ? (int) $row['imageId'] : 0;
            $imageUrl = isset($row['imageUrl']) ? trim((string) $row['imageUrl']) : '';
            if ($imageId > 0) {
                $url = wp_get_attachment_image_url($imageId, 'full');
                if (is_string($url) && $url !== '') {
                    $imageUrl = $url;
                }
            }
            $alt = isset($row['alt']) ? sanitize_text_field((string) $row['alt']) : '';
            $embedHtml = isset($row['embedHtml']) ? wp_kses_post((string) $row['embedHtml']) : '';
            if ($imageUrl === '' && $imageId <= 0) {
                continue;
            }
            $slides_out[] = [
                'imageId' => $imageId,
                'imageUrl' => $imageUrl,
                'alt' => $alt,
                'embedHtml' => $embedHtml,
            ];
        }
        $attrs['slides'] = $slides_out;

        return $attrs;
    }

    if ($name === 'custom/loans-carousel') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['categoryId'] = isset($attrs['categoryId']) ? (int) $attrs['categoryId'] : 0;
        $attrs['sectionHeader'] = isset($attrs['sectionHeader']) && trim((string) $attrs['sectionHeader']) !== ''
            ? trim((string) $attrs['sectionHeader'])
            : 'ACHIEVE YOUR GOALS WITH OUR FLEXIBLE LENDING OPTIONS';
        $attrs['buttonText'] = isset($attrs['buttonText']) && trim((string) $attrs['buttonText']) !== ''
            ? trim((string) $attrs['buttonText'])
            : 'LOANS';
        $attrs['linkText'] = isset($attrs['linkText']) && trim((string) $attrs['linkText']) !== ''
            ? trim((string) $attrs['linkText'])
            : 'ALL LOAN PRODUCTS';
        $attrs['linkUrl'] = isset($attrs['linkUrl']) && trim((string) $attrs['linkUrl']) !== ''
            ? trim((string) $attrs['linkUrl'])
            : '/loan-products';
        $attrs['maxItems'] = isset($attrs['maxItems']) ? max(3, (int) $attrs['maxItems']) : 9;
        $attrs['autoplayDelayMs'] = isset($attrs['autoplayDelayMs'])
            ? max(800, (int) $attrs['autoplayDelayMs'])
            : 3500;
        $attrs['sectionBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBgColor']) ? (string) $attrs['sectionBgColor'] : '',
            '#F5F4EE'
        );
        $attrs['topBarColor'] = headless_core_sanitize_color_string(
            isset($attrs['topBarColor']) ? (string) $attrs['topBarColor'] : '',
            '#ffffff'
        );
        $attrs['topBarGradientAngle'] = isset($attrs['topBarGradientAngle'])
            ? max(0, min(360, (int) $attrs['topBarGradientAngle']))
            : 90;
        $attrs['topBarGradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientFrom']) ? (string) $attrs['topBarGradientFrom'] : '',
            '#ffffff'
        );
        $attrs['topBarGradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientVia']) ? (string) $attrs['topBarGradientVia'] : '',
            '#ffffff'
        );
        $attrs['topBarGradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientTo']) ? (string) $attrs['topBarGradientTo'] : '',
            '#ffffff'
        );
        $attrs['headerTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['headerTextColor']) ? (string) $attrs['headerTextColor'] : '',
            '#22ACB6'
        );
        $attrs['buttonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBgColor']) ? (string) $attrs['buttonBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['buttonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonTextColor']) ? (string) $attrs['buttonTextColor'] : '',
            '#ffffff'
        );
        $attrs['linkTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkTextColor']) ? (string) $attrs['linkTextColor'] : '',
            '#22ACB6'
        );
        $attrs['linkTextHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkTextHoverColor']) ? (string) $attrs['linkTextHoverColor'] : '',
            '#EE6E2A'
        );
        $attrs['linkBadgeBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkBadgeBgColor']) ? (string) $attrs['linkBadgeBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkBadgeHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkBadgeHoverBgColor']) ? (string) $attrs['linkBadgeHoverBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkArrowBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowBgColor']) ? (string) $attrs['linkArrowBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkArrowHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowHoverBgColor']) ? (string) $attrs['linkArrowHoverBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['linkArrowColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowColor']) ? (string) $attrs['linkArrowColor'] : '',
            '#22ACB6'
        );
        $attrs['linkArrowHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowHoverColor']) ? (string) $attrs['linkArrowHoverColor'] : '',
            '#ffffff'
        );
        $attrs['arrowButtonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['arrowButtonBgColor']) ? (string) $attrs['arrowButtonBgColor'] : '',
            '#00AFBB'
        );
        $attrs['arrowButtonIconColor'] = headless_core_sanitize_color_string(
            isset($attrs['arrowButtonIconColor']) ? (string) $attrs['arrowButtonIconColor'] : '',
            '#ffffff'
        );

        return $attrs;
    }

    if ($name === 'custom/team-display') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) && trim((string) $attrs['sectionId']) !== ''
            ? trim((string) $attrs['sectionId'])
            : 'team';
        $attrs['categoryId'] = isset($attrs['categoryId']) ? max(0, (int) $attrs['categoryId']) : 0;
        $attrs['heading'] = isset($attrs['heading']) && trim((string) $attrs['heading']) !== ''
            ? sanitize_text_field((string) $attrs['heading'])
            : 'The Board of Directors';
        $attrs['sectionBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBgColor']) ? (string) $attrs['sectionBgColor'] : '',
            '#ffffff'
        );
        $attrs['headingColor'] = headless_core_sanitize_color_string(
            isset($attrs['headingColor']) ? (string) $attrs['headingColor'] : '',
            '#40C9BF'
        );
        $attrs['nameColor'] = headless_core_sanitize_color_string(
            isset($attrs['nameColor']) ? (string) $attrs['nameColor'] : '',
            '#212529'
        );
        $attrs['positionColor'] = headless_core_sanitize_color_string(
            isset($attrs['positionColor']) ? (string) $attrs['positionColor'] : '',
            '#EE6E2A'
        );
        $attrs['heroImageId'] = isset($attrs['heroImageId']) ? (int) $attrs['heroImageId'] : 0;
        $attrs['heroImageUrl'] = isset($attrs['heroImageUrl']) ? trim((string) $attrs['heroImageUrl']) : '';
        if ($attrs['heroImageId'] > 0) {
            $url = wp_get_attachment_image_url((int) $attrs['heroImageId'], 'full');
            if (is_string($url) && $url !== '') {
                $attrs['heroImageUrl'] = $url;
            }
        }
        $attrs['heroHeight'] = isset($attrs['heroHeight']) ? max(120, (int) $attrs['heroHeight']) : 260;
        $attrs['maxItems'] = isset($attrs['maxItems']) ? max(0, (int) $attrs['maxItems']) : 0;

        return $attrs;
    }

    if ($name === 'custom/events-carousel') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['categoryId'] = isset($attrs['categoryId']) ? (int) $attrs['categoryId'] : 0;
        $attrs['sectionHeader'] = isset($attrs['sectionHeader']) && trim((string) $attrs['sectionHeader']) !== ''
            ? trim((string) $attrs['sectionHeader'])
            : 'CELEBRATE, EXPLORE AND SHARE OUR INCREDIBLE JOURNEYS OF PROSPERITY.';
        $attrs['buttonText'] = isset($attrs['buttonText']) && trim((string) $attrs['buttonText']) !== ''
            ? trim((string) $attrs['buttonText'])
            : 'LATEST EVENTS';
        $attrs['linkText'] = isset($attrs['linkText']) && trim((string) $attrs['linkText']) !== ''
            ? trim((string) $attrs['linkText'])
            : 'ALL EVENTS';
        $attrs['linkUrl'] = isset($attrs['linkUrl']) && trim((string) $attrs['linkUrl']) !== ''
            ? trim((string) $attrs['linkUrl'])
            : '/events';
        $attrs['readMoreLabel'] = isset($attrs['readMoreLabel']) && trim((string) $attrs['readMoreLabel']) !== ''
            ? trim((string) $attrs['readMoreLabel'])
            : 'READ MORE';
        $attrs['maxItems'] = isset($attrs['maxItems']) ? max(3, (int) $attrs['maxItems']) : 9;
        $attrs['autoplayDelayMs'] = isset($attrs['autoplayDelayMs'])
            ? max(800, (int) $attrs['autoplayDelayMs'])
            : 3500;
        $attrs['sectionBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBgColor']) ? (string) $attrs['sectionBgColor'] : '',
            '#F5F4EE'
        );
        $attrs['topBarColor'] = headless_core_sanitize_color_string(
            isset($attrs['topBarColor']) ? (string) $attrs['topBarColor'] : '',
            '#ffffff'
        );
        $attrs['headerTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['headerTextColor']) ? (string) $attrs['headerTextColor'] : '',
            '#22ACB6'
        );
        $attrs['buttonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBgColor']) ? (string) $attrs['buttonBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['buttonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonTextColor']) ? (string) $attrs['buttonTextColor'] : '',
            '#ffffff'
        );
        $attrs['linkTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkTextColor']) ? (string) $attrs['linkTextColor'] : '',
            '#22ACB6'
        );
        $attrs['linkTextHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkTextHoverColor']) ? (string) $attrs['linkTextHoverColor'] : '',
            '#EE6E2A'
        );
        $attrs['linkBadgeBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkBadgeBgColor']) ? (string) $attrs['linkBadgeBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkBadgeHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkBadgeHoverBgColor']) ? (string) $attrs['linkBadgeHoverBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkArrowBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowBgColor']) ? (string) $attrs['linkArrowBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkArrowHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowHoverBgColor']) ? (string) $attrs['linkArrowHoverBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['linkArrowColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowColor']) ? (string) $attrs['linkArrowColor'] : '',
            '#22ACB6'
        );
        $attrs['linkArrowHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowHoverColor']) ? (string) $attrs['linkArrowHoverColor'] : '',
            '#ffffff'
        );
        $attrs['arrowButtonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['arrowButtonBgColor']) ? (string) $attrs['arrowButtonBgColor'] : '',
            '#00AFBB'
        );
        $attrs['arrowButtonIconColor'] = headless_core_sanitize_color_string(
            isset($attrs['arrowButtonIconColor']) ? (string) $attrs['arrowButtonIconColor'] : '',
            '#ffffff'
        );
        $attrs['metaTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['metaTextColor']) ? (string) $attrs['metaTextColor'] : '',
            '#808080'
        );
        $attrs['cardTitleColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardTitleColor']) ? (string) $attrs['cardTitleColor'] : '',
            '#808080'
        );
        $attrs['cardTitleHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardTitleHoverColor']) ? (string) $attrs['cardTitleHoverColor'] : '',
            '#22ACB6'
        );
        $attrs['readMoreTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['readMoreTextColor']) ? (string) $attrs['readMoreTextColor'] : '',
            '#ee6e2a'
        );
        $attrs['readMoreHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['readMoreHoverColor']) ? (string) $attrs['readMoreHoverColor'] : '',
            '#22aab7'
        );
        $attrs['readMoreArrowBg'] = headless_core_sanitize_color_string(
            isset($attrs['readMoreArrowBg']) ? (string) $attrs['readMoreArrowBg'] : '',
            '#ee6e2a'
        );
        $attrs['readMoreArrowHoverBg'] = headless_core_sanitize_color_string(
            isset($attrs['readMoreArrowHoverBg']) ? (string) $attrs['readMoreArrowHoverBg'] : '',
            '#22aab7'
        );
        $attrs['carouselNavArrowColor'] = headless_core_sanitize_color_string(
            isset($attrs['carouselNavArrowColor']) ? (string) $attrs['carouselNavArrowColor'] : '',
            '#82cdcb'
        );
        $attrs['dotActiveColor'] = headless_core_sanitize_color_string(
            isset($attrs['dotActiveColor']) ? (string) $attrs['dotActiveColor'] : '',
            '#EE6E2A'
        );
        $attrs['dotInactiveColor'] = isset($attrs['dotInactiveColor']) && trim((string) $attrs['dotInactiveColor']) !== ''
            ? trim((string) $attrs['dotInactiveColor'])
            : 'rgba(255,255,255,0.6)';

        return $attrs;
    }

    if ($name === 'custom/savings-carousel') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionHeader'] = isset($attrs['sectionHeader']) && trim((string) $attrs['sectionHeader']) !== ''
            ? trim((string) $attrs['sectionHeader'])
            : 'DISCOVER OUR SAVINGS SOLUTIONS';
        $attrs['buttonText'] = isset($attrs['buttonText']) && trim((string) $attrs['buttonText']) !== ''
            ? trim((string) $attrs['buttonText'])
            : 'SAVINGS';
        $attrs['linkText'] = isset($attrs['linkText']) && trim((string) $attrs['linkText']) !== ''
            ? trim((string) $attrs['linkText'])
            : 'ALL SAVINGS PRODUCTS';
        $attrs['linkUrl'] = isset($attrs['linkUrl']) && trim((string) $attrs['linkUrl']) !== ''
            ? trim((string) $attrs['linkUrl'])
            : '/savings-products';
        $attrs['maxItems'] = isset($attrs['maxItems']) ? max(3, (int) $attrs['maxItems']) : 9;
        $attrs['autoplayDelayMs'] = isset($attrs['autoplayDelayMs'])
            ? max(800, (int) $attrs['autoplayDelayMs'])
            : 3500;
        $attrs['sectionBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBgColor']) ? (string) $attrs['sectionBgColor'] : '',
            '#F5F4EE'
        );
        $attrs['headerTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['headerTextColor']) ? (string) $attrs['headerTextColor'] : '',
            '#22ACB6'
        );
        $attrs['buttonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBgColor']) ? (string) $attrs['buttonBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['buttonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonTextColor']) ? (string) $attrs['buttonTextColor'] : '',
            '#ffffff'
        );
        $attrs['linkTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkTextColor']) ? (string) $attrs['linkTextColor'] : '',
            '#22ACB6'
        );
        $attrs['linkTextHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkTextHoverColor']) ? (string) $attrs['linkTextHoverColor'] : '',
            '#EE6E2A'
        );
        $attrs['linkBadgeBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkBadgeBgColor']) ? (string) $attrs['linkBadgeBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkBadgeHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkBadgeHoverBgColor']) ? (string) $attrs['linkBadgeHoverBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkArrowBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowBgColor']) ? (string) $attrs['linkArrowBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkArrowHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowHoverBgColor']) ? (string) $attrs['linkArrowHoverBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['linkArrowColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowColor']) ? (string) $attrs['linkArrowColor'] : '',
            '#22ACB6'
        );
        $attrs['linkArrowHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowHoverColor']) ? (string) $attrs['linkArrowHoverColor'] : '',
            '#ffffff'
        );

        return $attrs;
    }

    if ($name === 'custom/services-carousel') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['categoryId'] = isset($attrs['categoryId']) ? (int) $attrs['categoryId'] : 0;
        $attrs['sectionHeader'] = isset($attrs['sectionHeader']) && trim((string) $attrs['sectionHeader']) !== ''
            ? trim((string) $attrs['sectionHeader'])
            : 'EXPLORE OUR SERVICES';
        $attrs['buttonText'] = isset($attrs['buttonText']) && trim((string) $attrs['buttonText']) !== ''
            ? trim((string) $attrs['buttonText'])
            : 'SERVICES';
        $attrs['linkText'] = isset($attrs['linkText']) && trim((string) $attrs['linkText']) !== ''
            ? trim((string) $attrs['linkText'])
            : 'ALL SERVICES';
        $attrs['linkUrl'] = isset($attrs['linkUrl']) && trim((string) $attrs['linkUrl']) !== ''
            ? trim((string) $attrs['linkUrl'])
            : '/services';
        $attrs['maxItems'] = isset($attrs['maxItems']) ? max(3, (int) $attrs['maxItems']) : 9;
        $attrs['autoplayDelayMs'] = isset($attrs['autoplayDelayMs'])
            ? max(800, (int) $attrs['autoplayDelayMs'])
            : 3500;
        $attrs['sectionBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBgColor']) ? (string) $attrs['sectionBgColor'] : '',
            '#F5F4EE'
        );
        $attrs['headerTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['headerTextColor']) ? (string) $attrs['headerTextColor'] : '',
            '#22ACB6'
        );
        $attrs['buttonBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonBgColor']) ? (string) $attrs['buttonBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['buttonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['buttonTextColor']) ? (string) $attrs['buttonTextColor'] : '',
            '#ffffff'
        );
        $attrs['linkTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkTextColor']) ? (string) $attrs['linkTextColor'] : '',
            '#22ACB6'
        );
        $attrs['linkTextHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkTextHoverColor']) ? (string) $attrs['linkTextHoverColor'] : '',
            '#EE6E2A'
        );
        $attrs['linkBadgeBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkBadgeBgColor']) ? (string) $attrs['linkBadgeBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkBadgeHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkBadgeHoverBgColor']) ? (string) $attrs['linkBadgeHoverBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkArrowBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowBgColor']) ? (string) $attrs['linkArrowBgColor'] : '',
            '#ffffff'
        );
        $attrs['linkArrowHoverBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowHoverBgColor']) ? (string) $attrs['linkArrowHoverBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['linkArrowColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowColor']) ? (string) $attrs['linkArrowColor'] : '',
            '#22ACB6'
        );
        $attrs['linkArrowHoverColor'] = headless_core_sanitize_color_string(
            isset($attrs['linkArrowHoverColor']) ? (string) $attrs['linkArrowHoverColor'] : '',
            '#ffffff'
        );

        return $attrs;
    }

    if ($name === 'custom/mobile-app-section') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) ? trim((string) $attrs['sectionId']) : '';

        $attrs['gradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['gradientFrom']) ? (string) $attrs['gradientFrom'] : '',
            '#00B2E0'
        );
        $attrs['gradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['gradientVia']) ? (string) $attrs['gradientVia'] : '',
            '#00AFBB'
        );
        $attrs['gradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['gradientTo']) ? (string) $attrs['gradientTo'] : '',
            '#00AB81'
        );
        $attrs['topBarBg'] = headless_core_sanitize_color_string(
            isset($attrs['topBarBg']) ? (string) $attrs['topBarBg'] : '',
            '#F5F4EE'
        );
        $attrs['curveAccentColor'] = headless_core_sanitize_color_string(
            isset($attrs['curveAccentColor']) ? (string) $attrs['curveAccentColor'] : '',
            '#00AFBB'
        );
        $attrs['scrollButtonOuter'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonOuter']) ? (string) $attrs['scrollButtonOuter'] : '',
            '#ffffff'
        );
        $attrs['scrollButtonInner'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonInner']) ? (string) $attrs['scrollButtonInner'] : '',
            '#22ACB6'
        );

        $kickerRaw = isset($attrs['kickerText']) ? trim((string) $attrs['kickerText']) : '';
        $attrs['kickerText'] = $kickerRaw !== '' ? wp_kses_post($kickerRaw) : '';
        $titleRaw = isset($attrs['titleText']) ? trim((string) $attrs['titleText']) : '';
        $attrs['titleText'] = $titleRaw !== '' ? wp_kses_post($titleRaw) : '';
        $bodyRaw = isset($attrs['bodyHtml']) ? trim((string) $attrs['bodyHtml']) : '';
        $attrs['bodyHtml'] = $bodyRaw !== '' ? wp_kses_post($bodyRaw) : '';
        $downloadRaw = isset($attrs['downloadHeading']) ? trim((string) $attrs['downloadHeading']) : '';
        $attrs['downloadHeading'] = $downloadRaw !== '' ? wp_kses_post($downloadRaw) : '';
        $badgeRaw = isset($attrs['badgeText']) ? trim((string) $attrs['badgeText']) : '';
        $attrs['badgeText'] = $badgeRaw !== '' ? wp_kses_post($badgeRaw) : '';

        $gpId = isset($attrs['googlePlayImageId']) ? (int) $attrs['googlePlayImageId'] : 0;
        $attrs['googlePlayImageId'] = $gpId;
        $attrs['googlePlayImageUrl'] = '';
        if ($gpId > 0) {
            $url = wp_get_attachment_image_url($gpId, 'large');
            if (is_string($url) && $url !== '') {
                $attrs['googlePlayImageUrl'] = $url;
            }
        }
        $attrs['googlePlayLinkUrl'] = isset($attrs['googlePlayLinkUrl']) ? trim((string) $attrs['googlePlayLinkUrl']) : '';

        $asId = isset($attrs['appStoreImageId']) ? (int) $attrs['appStoreImageId'] : 0;
        $attrs['appStoreImageId'] = $asId;
        $attrs['appStoreImageUrl'] = '';
        if ($asId > 0) {
            $url = wp_get_attachment_image_url($asId, 'large');
            if (is_string($url) && $url !== '') {
                $attrs['appStoreImageUrl'] = $url;
            }
        }
        $attrs['appStoreLinkUrl'] = isset($attrs['appStoreLinkUrl']) ? trim((string) $attrs['appStoreLinkUrl']) : '';

        $ussdId = isset($attrs['ussdImageId']) ? (int) $attrs['ussdImageId'] : 0;
        $attrs['ussdImageId'] = $ussdId;
        $attrs['ussdImageUrl'] = '';
        if ($ussdId > 0) {
            $url = wp_get_attachment_image_url($ussdId, 'large');
            if (! is_string($url) || $url === '') {
                $url = wp_get_attachment_image_url($ussdId, 'full');
            }
            if (is_string($url) && $url !== '') {
                $attrs['ussdImageUrl'] = $url;
            }
        }

        return $attrs;
    }

    if ($name === 'custom/newsletter-section') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) ? trim((string) $attrs['sectionId']) : '';
        $attrs['gradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['gradientFrom']) ? (string) $attrs['gradientFrom'] : '',
            '#00B2E0'
        );
        $attrs['gradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['gradientVia']) ? (string) $attrs['gradientVia'] : '',
            '#00AFBB'
        );
        $attrs['gradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['gradientTo']) ? (string) $attrs['gradientTo'] : '',
            '#00AB81'
        );
        $attrs['topBarBg'] = headless_core_sanitize_color_string(
            isset($attrs['topBarBg']) ? (string) $attrs['topBarBg'] : '',
            '#F5F4EE'
        );
        $attrs['curveAccentColor'] = headless_core_sanitize_color_string(
            isset($attrs['curveAccentColor']) ? (string) $attrs['curveAccentColor'] : '',
            '#00AFBB'
        );
        $attrs['scrollButtonOuter'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonOuter']) ? (string) $attrs['scrollButtonOuter'] : '',
            '#ffffff'
        );
        $attrs['scrollButtonInner'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonInner']) ? (string) $attrs['scrollButtonInner'] : '',
            '#22ACB6'
        );
        $attrs['headlineColor'] = headless_core_sanitize_color_string(
            isset($attrs['headlineColor']) ? (string) $attrs['headlineColor'] : '',
            '#000000'
        );
        $attrs['kickerColor'] = headless_core_sanitize_color_string(
            isset($attrs['kickerColor']) ? (string) $attrs['kickerColor'] : '',
            '#ffffff'
        );
        $attrs['inputBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['inputBgColor']) ? (string) $attrs['inputBgColor'] : '',
            '#38f0ba'
        );
        $attrs['inputTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['inputTextColor']) ? (string) $attrs['inputTextColor'] : '',
            '#3b4e6b'
        );
        $attrs['inputPlaceholderColor'] = headless_core_sanitize_color_string(
            isset($attrs['inputPlaceholderColor']) ? (string) $attrs['inputPlaceholderColor'] : '',
            '#3b4e6b'
        );
        $attrs['submitBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['submitBgColor']) ? (string) $attrs['submitBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['submitTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['submitTextColor']) ? (string) $attrs['submitTextColor'] : '',
            '#ffffff'
        );
        $attrs['submitArrowColor'] = headless_core_sanitize_color_string(
            isset($attrs['submitArrowColor']) ? (string) $attrs['submitArrowColor'] : '',
            '#ffffff'
        );
        $attrs['badgeBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['badgeBgColor']) ? (string) $attrs['badgeBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['badgeTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['badgeTextColor']) ? (string) $attrs['badgeTextColor'] : '',
            '#ffffff'
        );

        $kickerRaw = isset($attrs['kickerText']) ? trim((string) $attrs['kickerText']) : '';
        $attrs['kickerText'] = $kickerRaw !== '' ? wp_kses_post($kickerRaw) : '';
        $titleRaw = isset($attrs['titleText']) ? trim((string) $attrs['titleText']) : '';
        $attrs['titleText'] = $titleRaw !== '' ? wp_kses_post($titleRaw) : '';
        $badgeRaw = isset($attrs['badgeText']) ? trim((string) $attrs['badgeText']) : '';
        $attrs['badgeText'] = $badgeRaw !== '' ? wp_kses_post($badgeRaw) : '';

        $attrs['emailPlaceholder'] = isset($attrs['emailPlaceholder']) ? sanitize_text_field((string) $attrs['emailPlaceholder']) : '';
        $attrs['submitButtonText'] = isset($attrs['submitButtonText']) ? sanitize_text_field((string) $attrs['submitButtonText']) : '';
        $attrs['submitButtonWidth'] = isset($attrs['submitButtonWidth']) ? trim((string) $attrs['submitButtonWidth']) : '';
        $attrs['imageAlt'] = isset($attrs['imageAlt']) ? sanitize_text_field((string) $attrs['imageAlt']) : '';

        $imgId = isset($attrs['imageId']) ? (int) $attrs['imageId'] : 0;
        $attrs['imageId'] = $imgId;
        $attrs['imageUrl'] = '';
        if ($imgId > 0) {
            $url = wp_get_attachment_image_url($imgId, 'large');
            if (! is_string($url) || $url === '') {
                $url = wp_get_attachment_image_url($imgId, 'full');
            }
            if (is_string($url) && $url !== '') {
                $attrs['imageUrl'] = $url;
            }
        }

        $action = isset($attrs['mailchimpFormActionUrl']) ? trim((string) $attrs['mailchimpFormActionUrl']) : '';
        $attrs['mailchimpFormActionUrl'] = $action !== '' ? esc_url_raw($action) : '';
        $attrs['mailchimpEmailFieldName'] = isset($attrs['mailchimpEmailFieldName']) ? sanitize_key((string) $attrs['mailchimpEmailFieldName']) : 'EMAIL';
        if ($attrs['mailchimpEmailFieldName'] === '') {
            $attrs['mailchimpEmailFieldName'] = 'EMAIL';
        }
        $attrs['mailchimpBotFieldName'] = isset($attrs['mailchimpBotFieldName']) ? sanitize_key((string) $attrs['mailchimpBotFieldName']) : '';
        $target = isset($attrs['mailchimpFormTarget']) ? trim((string) $attrs['mailchimpFormTarget']) : '_self';
        $attrs['mailchimpFormTarget'] = in_array($target, ['_self', '_blank'], true) ? $target : '_self';

        $hiddenJson = isset($attrs['mailchimpHiddenFieldsJson']) ? (string) $attrs['mailchimpHiddenFieldsJson'] : '[]';
        $decoded = json_decode($hiddenJson, true);
        $attrs['mailchimpHiddenFieldsJson'] = is_array($decoded) ? wp_json_encode($decoded) : '[]';

        return $attrs;
    }

    if ($name === 'custom/partners-carousel') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) ? trim((string) $attrs['sectionId']) : '';
        $attrs['useGradient'] = isset($attrs['useGradient']) ? (bool) $attrs['useGradient'] : true;
        $attrs['gradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['gradientFrom']) ? (string) $attrs['gradientFrom'] : '',
            '#00B2E0'
        );
        $attrs['gradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['gradientVia']) ? (string) $attrs['gradientVia'] : '',
            '#00AFBB'
        );
        $attrs['gradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['gradientTo']) ? (string) $attrs['gradientTo'] : '',
            '#00AB81'
        );
        $attrs['sectionBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBgColor']) ? (string) $attrs['sectionBgColor'] : '',
            '#ffffff'
        );
        $attrs['topBarBg'] = headless_core_sanitize_color_string(
            isset($attrs['topBarBg']) ? (string) $attrs['topBarBg'] : '',
            '#F5F4EE'
        );
        $attrs['topBarUseGradient'] = isset($attrs['topBarUseGradient']) ? (bool) $attrs['topBarUseGradient'] : false;
        $attrs['topBarGradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientFrom']) ? (string) $attrs['topBarGradientFrom'] : '',
            '#F5F4EE'
        );
        $attrs['topBarGradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientVia']) ? (string) $attrs['topBarGradientVia'] : '',
            '#E8E6E0'
        );
        $attrs['topBarGradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientTo']) ? (string) $attrs['topBarGradientTo'] : '',
            '#F5F4EE'
        );
        $tbScrollOuter = isset($attrs['topBarScrollIconOuterColor']) ? trim((string) $attrs['topBarScrollIconOuterColor']) : '';
        $attrs['topBarScrollIconOuterColor'] = $tbScrollOuter === ''
            ? ''
            : headless_core_sanitize_color_string($tbScrollOuter, '#ffffff');
        $attrs['curveAccentColor'] = headless_core_sanitize_color_string(
            isset($attrs['curveAccentColor']) ? (string) $attrs['curveAccentColor'] : '',
            '#00AFBB'
        );
        $attrs['scrollButtonOuter'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonOuter']) ? (string) $attrs['scrollButtonOuter'] : '',
            '#ffffff'
        );
        $attrs['scrollButtonInner'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonInner']) ? (string) $attrs['scrollButtonInner'] : '',
            '#22ACB6'
        );
        $attrs['kickerColor'] = headless_core_sanitize_color_string(
            isset($attrs['kickerColor']) ? (string) $attrs['kickerColor'] : '',
            '#22ACB6'
        );
        $attrs['badgeBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['badgeBgColor']) ? (string) $attrs['badgeBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['badgeTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['badgeTextColor']) ? (string) $attrs['badgeTextColor'] : '',
            '#ffffff'
        );
        $attrs['carouselArrowBg'] = headless_core_sanitize_color_string(
            isset($attrs['carouselArrowBg']) ? (string) $attrs['carouselArrowBg'] : '',
            '#00AFBB'
        );
        $attrs['carouselArrowIconColor'] = headless_core_sanitize_color_string(
            isset($attrs['carouselArrowIconColor']) ? (string) $attrs['carouselArrowIconColor'] : '',
            '#ffffff'
        );
        $attrs['dotActiveColor'] = headless_core_sanitize_color_string(
            isset($attrs['dotActiveColor']) ? (string) $attrs['dotActiveColor'] : '',
            '#EE6E2A'
        );
        $attrs['dotInactiveColor'] = headless_core_sanitize_color_string(
            isset($attrs['dotInactiveColor']) ? (string) $attrs['dotInactiveColor'] : '',
            '#d1d5db'
        );

        $attrs['kickerText'] = isset($attrs['kickerText']) ? sanitize_text_field((string) $attrs['kickerText']) : '';
        $attrs['badgeText'] = isset($attrs['badgeText']) ? sanitize_text_field((string) $attrs['badgeText']) : '';
        $attrs['partnerCountSuffix'] = isset($attrs['partnerCountSuffix']) ? sanitize_text_field((string) $attrs['partnerCountSuffix']) : '';
        $attrs['maxItems'] = isset($attrs['maxItems']) ? max(0, (int) $attrs['maxItems']) : 0;
        $attrs['slidesToScroll'] = isset($attrs['slidesToScroll']) ? max(1, (int) $attrs['slidesToScroll']) : 1;
        $attrs['visibleMobile'] = isset($attrs['visibleMobile']) ? max(1, (int) $attrs['visibleMobile']) : 1;
        $attrs['visibleTablet'] = isset($attrs['visibleTablet']) ? max(1, (int) $attrs['visibleTablet']) : 2;
        $attrs['visibleDesktop'] = isset($attrs['visibleDesktop']) ? max(1, (int) $attrs['visibleDesktop']) : 4;
        $attrs['carouselLoop'] = isset($attrs['carouselLoop']) ? (bool) $attrs['carouselLoop'] : true;
        $attrs['showPartnerCount'] = isset($attrs['showPartnerCount']) ? (bool) $attrs['showPartnerCount'] : true;

        $partnersIn = isset($attrs['partners']) && is_array($attrs['partners']) ? $attrs['partners'] : [];
        $partnersOut = [];
        foreach ($partnersIn as $p) {
            if (! is_array($p)) {
                continue;
            }
            $pid = isset($p['imageId']) ? (int) $p['imageId'] : 0;
            $alt = isset($p['alt']) ? sanitize_text_field((string) $p['alt']) : '';
            $imageUrl = isset($p['imageUrl']) ? trim((string) $p['imageUrl']) : '';
            if ($pid > 0) {
                $u = wp_get_attachment_image_url($pid, 'large');
                if (! is_string($u) || $u === '') {
                    $u = wp_get_attachment_image_url($pid, 'full');
                }
                if (is_string($u) && $u !== '') {
                    $imageUrl = $u;
                }
            }
            if ($pid <= 0 && $imageUrl === '') {
                continue;
            }
            $partnersOut[] = [
                'imageId' => $pid,
                'imageUrl' => $imageUrl,
                'alt' => $alt,
            ];
        }
        $attrs['partners'] = $partnersOut;

        return $attrs;
    }

    if ($name === 'custom/events-section') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) ? trim((string) $attrs['sectionId']) : '';

        $attrs['gradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['gradientFrom']) ? (string) $attrs['gradientFrom'] : '',
            ''
        );
        $attrs['gradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['gradientVia']) ? (string) $attrs['gradientVia'] : '',
            ''
        );
        $attrs['gradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['gradientTo']) ? (string) $attrs['gradientTo'] : '',
            ''
        );
        $attrs['topCurveFillColor'] = headless_core_sanitize_color_string(
            isset($attrs['topCurveFillColor']) ? (string) $attrs['topCurveFillColor'] : '',
            ''
        );
        $attrs['topBarBg'] = headless_core_sanitize_color_string(
            isset($attrs['topBarBg']) ? (string) $attrs['topBarBg'] : '',
            '#ff6346'
        );
        $attrs['topBarUseGradient'] = isset($attrs['topBarUseGradient']) ? (bool) $attrs['topBarUseGradient'] : false;
        $attrs['topBarGradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientFrom']) ? (string) $attrs['topBarGradientFrom'] : '',
            '#ff6346'
        );
        $attrs['topBarGradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientVia']) ? (string) $attrs['topBarGradientVia'] : '',
            '#FF6347'
        );
        $attrs['topBarGradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientTo']) ? (string) $attrs['topBarGradientTo'] : '',
            '#ff6346'
        );
        $tbEvScroll = isset($attrs['topBarScrollIconOuterColor']) ? trim((string) $attrs['topBarScrollIconOuterColor']) : '';
        $attrs['topBarScrollIconOuterColor'] = $tbEvScroll === ''
            ? ''
            : headless_core_sanitize_color_string($tbEvScroll, '#ffffff');
        $attrs['scrollButtonOuter'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonOuter']) ? (string) $attrs['scrollButtonOuter'] : '',
            '#ffffff'
        );
        $innerScroll = isset($attrs['scrollButtonInner']) ? trim((string) $attrs['scrollButtonInner']) : '';
        $attrs['scrollButtonInner'] = $innerScroll;

        $attrs['orchidTintColor'] = headless_core_sanitize_color_string(
            isset($attrs['orchidTintColor']) ? (string) $attrs['orchidTintColor'] : '',
            '#ff7bac'
        );
        $attrs['bannerTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['bannerTextColor']) ? (string) $attrs['bannerTextColor'] : '',
            '#ffffff'
        );

        $po = isset($attrs['patternOpacity']) ? (float) $attrs['patternOpacity'] : 0.3;
        if ($po < 0.0) {
            $po = 0.0;
        }
        if ($po > 1.0) {
            $po = 1.0;
        }
        $attrs['patternOpacity'] = $po;

        $attrs['eventTitle'] = isset($attrs['eventTitle']) ? sanitize_text_field((string) $attrs['eventTitle']) : '';
        $attrs['eventSubtitle'] = isset($attrs['eventSubtitle']) ? sanitize_text_field((string) $attrs['eventSubtitle']) : '';
        $attrs['dayName'] = isset($attrs['dayName']) ? sanitize_text_field((string) $attrs['dayName']) : '';
        $attrs['dayNumber'] = isset($attrs['dayNumber']) ? sanitize_text_field((string) $attrs['dayNumber']) : '';
        $attrs['monthName'] = isset($attrs['monthName']) ? sanitize_text_field((string) $attrs['monthName']) : '';
        $attrs['year'] = isset($attrs['year']) ? sanitize_text_field((string) $attrs['year']) : '';
        $attrs['venueTitle'] = isset($attrs['venueTitle']) ? sanitize_text_field((string) $attrs['venueTitle']) : '';
        $attrs['timeLine'] = isset($attrs['timeLine']) ? sanitize_text_field((string) $attrs['timeLine']) : '';
        $attrs['logoAlt'] = isset($attrs['logoAlt']) ? sanitize_text_field((string) $attrs['logoAlt']) : '';

        $patternId = isset($attrs['patternImageId']) ? (int) $attrs['patternImageId'] : 0;
        $attrs['patternImageId'] = $patternId;
        $attrs['patternImageUrl'] = '';
        if ($patternId > 0) {
            $purl = wp_get_attachment_image_url($patternId, 'full');
            if (! is_string($purl) || $purl === '') {
                $purl = wp_get_attachment_image_url($patternId, 'large');
            }
            if (is_string($purl) && $purl !== '') {
                $attrs['patternImageUrl'] = $purl;
            }
        }

        $logoId = isset($attrs['logoImageId']) ? (int) $attrs['logoImageId'] : 0;
        $attrs['logoImageId'] = $logoId;
        $attrs['logoImageUrl'] = '';
        if ($logoId > 0) {
            $lurl = wp_get_attachment_image_url($logoId, 'full');
            if (! is_string($lurl) || $lurl === '') {
                $lurl = wp_get_attachment_image_url($logoId, 'large');
            }
            if (is_string($lurl) && $lurl !== '') {
                $attrs['logoImageUrl'] = $lurl;
            }
        }

        return $attrs;
    }

    if ($name === 'custom/member-reviews') {
        if (isset($attrs['anchor'])) {
            $anchor = sanitize_title((string) $attrs['anchor']);
            if ($anchor !== '') {
                $attrs['anchor'] = $anchor;
            } else {
                unset($attrs['anchor']);
            }
        }

        $attrs['sectionId'] = isset($attrs['sectionId']) ? trim((string) $attrs['sectionId']) : 'member-reviews';
        $attrs['useGradient'] = isset($attrs['useGradient']) ? (bool) $attrs['useGradient'] : false;
        $attrs['gradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['gradientFrom']) ? (string) $attrs['gradientFrom'] : '',
            '#FF8C00'
        );
        $attrs['gradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['gradientVia']) ? (string) $attrs['gradientVia'] : '',
            '#FF6347'
        );
        $attrs['gradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['gradientTo']) ? (string) $attrs['gradientTo'] : '',
            '#800080'
        );
        $attrs['sectionBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['sectionBgColor']) ? (string) $attrs['sectionBgColor'] : '',
            '#ffffff'
        );
        $attrs['topCurveFillColor'] = headless_core_sanitize_color_string(
            isset($attrs['topCurveFillColor']) ? (string) $attrs['topCurveFillColor'] : '',
            ''
        );
        $attrs['wavePathFill'] = headless_core_sanitize_color_string(
            isset($attrs['wavePathFill']) ? (string) $attrs['wavePathFill'] : '',
            '#ff6346'
        );
        $attrs['topBarBg'] = headless_core_sanitize_color_string(
            isset($attrs['topBarBg']) ? (string) $attrs['topBarBg'] : '',
            '#ff6346'
        );
        $attrs['topBarUseGradient'] = isset($attrs['topBarUseGradient']) ? (bool) $attrs['topBarUseGradient'] : false;
        $attrs['topBarGradientFrom'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientFrom']) ? (string) $attrs['topBarGradientFrom'] : '',
            '#ff6346'
        );
        $attrs['topBarGradientVia'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientVia']) ? (string) $attrs['topBarGradientVia'] : '',
            '#FF6347'
        );
        $attrs['topBarGradientTo'] = headless_core_sanitize_color_string(
            isset($attrs['topBarGradientTo']) ? (string) $attrs['topBarGradientTo'] : '',
            '#ff6346'
        );
        $attrs['orchidTintColor'] = headless_core_sanitize_color_string(
            isset($attrs['orchidTintColor']) ? (string) $attrs['orchidTintColor'] : '',
            '#ff7bac'
        );

        $mrPo = isset($attrs['patternOpacity']) ? (float) $attrs['patternOpacity'] : 0.3;
        if ($mrPo < 0.0) {
            $mrPo = 0.0;
        }
        if ($mrPo > 1.0) {
            $mrPo = 1.0;
        }
        $attrs['patternOpacity'] = $mrPo;

        $mrPatternId = isset($attrs['patternImageId']) ? (int) $attrs['patternImageId'] : 0;
        $attrs['patternImageId'] = $mrPatternId;
        $attrs['patternImageUrl'] = '';
        if ($mrPatternId > 0) {
            $mrPurl = wp_get_attachment_image_url($mrPatternId, 'full');
            if (! is_string($mrPurl) || $mrPurl === '') {
                $mrPurl = wp_get_attachment_image_url($mrPatternId, 'large');
            }
            if (is_string($mrPurl) && $mrPurl !== '') {
                $attrs['patternImageUrl'] = $mrPurl;
            }
        }
        $mrScrollOuter = isset($attrs['topBarScrollIconOuterColor']) ? trim((string) $attrs['topBarScrollIconOuterColor']) : '';
        $attrs['topBarScrollIconOuterColor'] = $mrScrollOuter === ''
            ? ''
            : headless_core_sanitize_color_string($mrScrollOuter, '#ffffff');
        $attrs['scrollButtonOuter'] = headless_core_sanitize_color_string(
            isset($attrs['scrollButtonOuter']) ? (string) $attrs['scrollButtonOuter'] : '',
            '#ffffff'
        );
        $attrs['scrollArrowBg'] = headless_core_sanitize_color_string(
            isset($attrs['scrollArrowBg']) ? (string) $attrs['scrollArrowBg'] : '',
            '#ffffff'
        );
        $attrs['scrollIconColor'] = headless_core_sanitize_color_string(
            isset($attrs['scrollIconColor']) ? (string) $attrs['scrollIconColor'] : '',
            ''
        );
        $innerMrScroll = isset($attrs['scrollButtonInner']) ? trim((string) $attrs['scrollButtonInner']) : '';
        $attrs['scrollButtonInner'] = $innerMrScroll;

        $attrs['badgeBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['badgeBgColor']) ? (string) $attrs['badgeBgColor'] : '',
            '#EE6E2A'
        );
        $attrs['badgeTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['badgeTextColor']) ? (string) $attrs['badgeTextColor'] : '',
            '#ffffff'
        );
        $attrs['subtitleColor'] = headless_core_sanitize_color_string(
            isset($attrs['subtitleColor']) ? (string) $attrs['subtitleColor'] : '',
            '#22ACB6'
        );
        $attrs['secondaryButtonBorderColor'] = headless_core_sanitize_color_string(
            isset($attrs['secondaryButtonBorderColor']) ? (string) $attrs['secondaryButtonBorderColor'] : '',
            '#d1d5db'
        );
        $attrs['secondaryButtonTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['secondaryButtonTextColor']) ? (string) $attrs['secondaryButtonTextColor'] : '',
            '#22ACB6'
        );
        $attrs['quoteTextColor'] = headless_core_sanitize_color_string(
            isset($attrs['quoteTextColor']) ? (string) $attrs['quoteTextColor'] : '',
            '#6b7280'
        );
        $attrs['nameColor'] = headless_core_sanitize_color_string(
            isset($attrs['nameColor']) ? (string) $attrs['nameColor'] : '',
            '#22ACB6'
        );
        $attrs['cardBgColor'] = headless_core_sanitize_color_string(
            isset($attrs['cardBgColor']) ? (string) $attrs['cardBgColor'] : '',
            '#ffffff'
        );
        $attrs['starFilledColor'] = headless_core_sanitize_color_string(
            isset($attrs['starFilledColor']) ? (string) $attrs['starFilledColor'] : '',
            '#EAB308'
        );
        $attrs['starEmptyColor'] = headless_core_sanitize_color_string(
            isset($attrs['starEmptyColor']) ? (string) $attrs['starEmptyColor'] : '',
            '#D1D5DB'
        );
        $attrs['carouselArrowBg'] = headless_core_sanitize_color_string(
            isset($attrs['carouselArrowBg']) ? (string) $attrs['carouselArrowBg'] : '',
            '#22ACB6'
        );
        $attrs['carouselArrowIconColor'] = headless_core_sanitize_color_string(
            isset($attrs['carouselArrowIconColor']) ? (string) $attrs['carouselArrowIconColor'] : '',
            '#ffffff'
        );
        $attrs['dotActiveColor'] = headless_core_sanitize_color_string(
            isset($attrs['dotActiveColor']) ? (string) $attrs['dotActiveColor'] : '',
            '#EE6E2A'
        );
        $attrs['dotInactiveColor'] = headless_core_sanitize_color_string(
            isset($attrs['dotInactiveColor']) ? (string) $attrs['dotInactiveColor'] : '',
            '#d1d5db'
        );

        $attrs['badgeLabelHtml'] = isset($attrs['badgeLabelHtml']) ? wp_kses_post((string) $attrs['badgeLabelHtml']) : '';
        $attrs['subtitleHtml'] = isset($attrs['subtitleHtml']) ? wp_kses_post((string) $attrs['subtitleHtml']) : '';
        $attrs['allReviewsLabel'] = isset($attrs['allReviewsLabel']) ? sanitize_text_field((string) $attrs['allReviewsLabel']) : '';
        $allUrl = isset($attrs['allReviewsUrl']) ? trim((string) $attrs['allReviewsUrl']) : '';
        $attrs['allReviewsUrl'] = $allUrl !== '' ? esc_url_raw($allUrl) : '';
        $attrs['showAllReviewsRow'] = isset($attrs['showAllReviewsRow']) ? (bool) $attrs['showAllReviewsRow'] : true;
        $attrs['maxItems'] = isset($attrs['maxItems']) ? max(0, (int) $attrs['maxItems']) : 0;
        $attrs['slidesToScroll'] = isset($attrs['slidesToScroll']) ? max(1, (int) $attrs['slidesToScroll']) : 1;
        $attrs['visibleMobile'] = isset($attrs['visibleMobile']) ? max(1, (int) $attrs['visibleMobile']) : 1;
        $attrs['visibleTablet'] = isset($attrs['visibleTablet']) ? max(1, (int) $attrs['visibleTablet']) : 2;
        $attrs['visibleDesktop'] = isset($attrs['visibleDesktop']) ? max(1, (int) $attrs['visibleDesktop']) : 3;
        $attrs['carouselLoop'] = isset($attrs['carouselLoop']) ? (bool) $attrs['carouselLoop'] : false;

        $reviewsIn = isset($attrs['reviews']) && is_array($attrs['reviews']) ? $attrs['reviews'] : [];
        $reviewsOut = [];
        foreach ($reviewsIn as $r) {
            if (! is_array($r)) {
                continue;
            }
            $quote = isset($r['quote']) ? sanitize_textarea_field((string) $r['quote']) : '';
            $rating = isset($r['rating']) ? (float) $r['rating'] : 0.0;
            if ($rating < 0.0) {
                $rating = 0.0;
            }
            if ($rating > 5.0) {
                $rating = 5.0;
            }
            $revName = isset($r['name']) ? sanitize_text_field((string) $r['name']) : '';
            $revTitle = isset($r['title']) ? sanitize_text_field((string) $r['title']) : '';
            if ($quote === '' && $revName === '') {
                continue;
            }
            $reviewsOut[] = [
                'quote' => $quote,
                'rating' => $rating,
                'name' => $revName,
                'title' => $revTitle,
            ];
        }
        $attrs['reviews'] = $reviewsOut;

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
 * @return WP_REST_Response
 */
function headless_core_rest_savings_products(WP_REST_Request $request): WP_REST_Response
{
    $perPage = (int) $request->get_param('per_page');
    $perPage = max(0, min(100, $perPage));
    $cacheVersion = (string) get_option('headless_savings_products_cache_ver', '1');
    $limitKey = $perPage > 0 ? (string) $perPage : 'all';
    $cacheKey = 'list_' . $cacheVersion . '_pp_' . $limitKey;
    $cached = headless_core_cache_get('savings_products', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $posts = get_posts([
        'post_type' => 'savings_product',
        'post_status' => 'publish',
        'orderby' => [
            'menu_order' => 'ASC',
            'date' => 'ASC',
        ],
        'numberposts' => $perPage > 0 ? $perPage : -1,
    ]);

    $payload = [];
    foreach ($posts as $post) {
        if (! $post instanceof WP_Post) {
            continue;
        }

        $imageUrl = '';
        $thumbId = (int) get_post_thumbnail_id($post);
        if ($thumbId > 0) {
            $url = wp_get_attachment_image_url($thumbId, 'large');
            if (is_string($url) && $url !== '') {
                $imageUrl = $url;
            }
        }

        $excerpt = trim((string) $post->post_excerpt);
        if ($excerpt === '') {
            $excerpt = wp_trim_words(wp_strip_all_tags((string) $post->post_content), 28);
        }

        $payload[] = [
            'id' => (int) $post->ID,
            'slug' => (string) $post->post_name,
            'title' => get_the_title($post),
            'description' => $excerpt,
            'imageUrl' => $imageUrl,
            'link' => '/savings-products/' . (string) $post->post_name,
        ];
    }

    headless_core_cache_set('savings_products', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_savings_product(WP_REST_Request $request)
{
    $slug = sanitize_title((string) $request->get_param('slug'));
    if ($slug === '') {
        return new WP_Error('headless_savings_product_invalid', __('Savings product slug is required.', 'headless-core'), ['status' => 400]);
    }

    $cacheVersion = (string) get_option('headless_savings_products_cache_ver', '1');
    $cacheKey = 'single_' . $slug . '_' . $cacheVersion;
    $cached = headless_core_cache_get('savings_products', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $post = get_page_by_path($slug, OBJECT, 'savings_product');
    if (! $post instanceof WP_Post || $post->post_status !== 'publish') {
        return new WP_Error('headless_not_found', __('Savings product not found.', 'headless-core'), ['status' => 404]);
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

    $imageUrl = '';
    $thumbId = (int) get_post_thumbnail_id($post);
    if ($thumbId > 0) {
        $url = wp_get_attachment_image_url($thumbId, 'large');
        if (is_string($url) && $url !== '') {
            $imageUrl = $url;
        }
    }

    $payload = [
        'id' => (int) $post->ID,
        'slug' => (string) $post->post_name,
        'title' => get_the_title($post),
        'imageUrl' => $imageUrl,
        'blocks' => $blocks,
    ];

    headless_core_cache_set('savings_products', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * @return WP_REST_Response
 */
function headless_core_rest_loan_products(WP_REST_Request $request): WP_REST_Response
{
    $categoryId = (int) $request->get_param('category');
    $categoryId = max(0, $categoryId);
    $perPage = (int) $request->get_param('per_page');
    $perPage = max(0, min(100, $perPage));
    $cacheVersion = (string) get_option('headless_loan_products_cache_ver', '1');
    $limitKey = $perPage > 0 ? (string) $perPage : 'all';
    $cacheKey = 'list_' . $cacheVersion . '_cat_' . $categoryId . '_pp_' . $limitKey;
    $cached = headless_core_cache_get('loan_products', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $queryArgs = [
        'post_type' => 'loan_product',
        'post_status' => 'publish',
        'orderby' => [
            'menu_order' => 'ASC',
            'date' => 'DESC',
        ],
        'numberposts' => $perPage > 0 ? $perPage : -1,
    ];
    if ($categoryId > 0) {
        $queryArgs['category'] = $categoryId;
    }
    $posts = get_posts($queryArgs);

    $payload = [];
    foreach ($posts as $post) {
        if (! $post instanceof WP_Post) {
            continue;
        }

        $imageUrl = '';
        $thumbId = (int) get_post_thumbnail_id($post);
        if ($thumbId > 0) {
            $url = wp_get_attachment_image_url($thumbId, 'large');
            if (is_string($url) && $url !== '') {
                $imageUrl = $url;
            }
        }

        $excerpt = trim((string) $post->post_excerpt);
        if ($excerpt === '') {
            $excerpt = wp_trim_words(wp_strip_all_tags((string) $post->post_content), 28);
        }

        $payload[] = [
            'id' => (int) $post->ID,
            'slug' => (string) $post->post_name,
            'title' => get_the_title($post),
            'description' => $excerpt,
            'imageUrl' => $imageUrl,
            'link' => '/loan-products/' . (string) $post->post_name,
        ];
    }

    headless_core_cache_set('loan_products', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_loan_product(WP_REST_Request $request)
{
    $slug = sanitize_title((string) $request->get_param('slug'));
    if ($slug === '') {
        return new WP_Error('headless_loan_product_invalid', __('Loan product slug is required.', 'headless-core'), ['status' => 400]);
    }

    $cacheVersion = (string) get_option('headless_loan_products_cache_ver', '1');
    $cacheKey = 'single_' . $slug . '_' . $cacheVersion;
    $cached = headless_core_cache_get('loan_products', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $post = get_page_by_path($slug, OBJECT, 'loan_product');
    if (! $post instanceof WP_Post || $post->post_status !== 'publish') {
        return new WP_Error('headless_not_found', __('Loan product not found.', 'headless-core'), ['status' => 404]);
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

    $imageUrl = '';
    $thumbId = (int) get_post_thumbnail_id($post);
    if ($thumbId > 0) {
        $url = wp_get_attachment_image_url($thumbId, 'large');
        if (is_string($url) && $url !== '') {
            $imageUrl = $url;
        }
    }

    $payload = [
        'id' => (int) $post->ID,
        'slug' => (string) $post->post_name,
        'title' => get_the_title($post),
        'imageUrl' => $imageUrl,
        'blocks' => $blocks,
    ];

    headless_core_cache_set('loan_products', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * @return WP_REST_Response
 */
function headless_core_rest_team_members(WP_REST_Request $request): WP_REST_Response
{
    $categoryId = (int) $request->get_param('category');
    $categoryId = max(0, $categoryId);
    $perPage = (int) $request->get_param('per_page');
    $perPage = max(0, min(100, $perPage));
    $cacheVersion = (string) get_option('headless_team_members_cache_ver', '1');
    $limitKey = $perPage > 0 ? (string) $perPage : 'all';
    $cacheKey = 'list_' . $cacheVersion . '_cat_' . $categoryId . '_pp_' . $limitKey;
    $cached = headless_core_cache_get('team_members', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $queryArgs = [
        'post_type' => 'team_member',
        'post_status' => 'publish',
        'orderby' => [
            'menu_order' => 'ASC',
            'date' => 'DESC',
        ],
        'numberposts' => $perPage > 0 ? $perPage : -1,
    ];
    if ($categoryId > 0) {
        $queryArgs['category'] = $categoryId;
    }
    $posts = get_posts($queryArgs);

    $payload = [];
    foreach ($posts as $post) {
        if (! $post instanceof WP_Post) {
            continue;
        }

        $imageUrl = '';
        $thumbId = (int) get_post_thumbnail_id($post);
        if ($thumbId > 0) {
            $url = wp_get_attachment_image_url($thumbId, 'large');
            if (is_string($url) && $url !== '') {
                $imageUrl = $url;
            }
        }

        $excerpt = trim((string) $post->post_excerpt);
        if ($excerpt === '') {
            $excerpt = wp_trim_words(wp_strip_all_tags((string) $post->post_content), 45);
        }

        $position = sanitize_text_field((string) get_post_meta((int) $post->ID, 'position', true));
        $standAlone = (bool) get_post_meta((int) $post->ID, 'standAlone', true);

        $payload[] = [
            'id' => (int) $post->ID,
            'slug' => (string) $post->post_name,
            'name' => get_the_title($post),
            'position' => $position,
            'standAlone' => $standAlone,
            'excerpt' => $excerpt,
            'bio' => wp_strip_all_tags((string) $post->post_content),
            'imageUrl' => $imageUrl,
        ];
    }

    // Ensure standalone members appear first (layout parity: first centered card).
    usort($payload, static function (array $a, array $b): int {
        $sa = ! empty($a['standAlone']);
        $sb = ! empty($b['standAlone']);
        if ($sa === $sb) {
            return 0;
        }
        return $sa ? -1 : 1;
    });

    headless_core_cache_set('team_members', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * @return WP_REST_Response
 */
function headless_core_rest_services(WP_REST_Request $request): WP_REST_Response
{
    $categoryId = (int) $request->get_param('category');
    $categoryId = max(0, $categoryId);
    $perPage = (int) $request->get_param('per_page');
    $perPage = max(0, min(100, $perPage));
    $cacheVersion = (string) get_option('headless_services_cache_ver', '1');
    $limitKey = $perPage > 0 ? (string) $perPage : 'all';
    $cacheKey = 'list_' . $cacheVersion . '_cat_' . $categoryId . '_pp_' . $limitKey;
    $cached = headless_core_cache_get('services', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $queryArgs = [
        'post_type' => 'service',
        'post_status' => 'publish',
        'orderby' => [
            'menu_order' => 'ASC',
            'date' => 'DESC',
        ],
        'numberposts' => $perPage > 0 ? $perPage : -1,
    ];
    if ($categoryId > 0) {
        $queryArgs['category'] = $categoryId;
    }
    $posts = get_posts($queryArgs);

    $payload = [];
    foreach ($posts as $post) {
        if (! $post instanceof WP_Post) {
            continue;
        }

        $imageUrl = '';
        $thumbId = (int) get_post_thumbnail_id($post);
        if ($thumbId > 0) {
            $url = wp_get_attachment_image_url($thumbId, 'large');
            if (is_string($url) && $url !== '') {
                $imageUrl = $url;
            }
        }

        $excerpt = trim((string) $post->post_excerpt);
        if ($excerpt === '') {
            $excerpt = wp_trim_words(wp_strip_all_tags((string) $post->post_content), 28);
        }

        $payload[] = [
            'id' => (int) $post->ID,
            'slug' => (string) $post->post_name,
            'title' => get_the_title($post),
            'description' => $excerpt,
            'imageUrl' => $imageUrl,
            'link' => '/services/' . (string) $post->post_name,
        ];
    }

    headless_core_cache_set('services', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_service(WP_REST_Request $request)
{
    $slug = sanitize_title((string) $request->get_param('slug'));
    if ($slug === '') {
        return new WP_Error('headless_service_invalid', __('Service slug is required.', 'headless-core'), ['status' => 400]);
    }

    $cacheVersion = (string) get_option('headless_services_cache_ver', '1');
    $cacheKey = 'single_' . $slug . '_' . $cacheVersion;
    $cached = headless_core_cache_get('services', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $post = get_page_by_path($slug, OBJECT, 'service');
    if (! $post instanceof WP_Post || $post->post_status !== 'publish') {
        return new WP_Error('headless_not_found', __('Service not found.', 'headless-core'), ['status' => 404]);
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

    $imageUrl = '';
    $thumbId = (int) get_post_thumbnail_id($post);
    if ($thumbId > 0) {
        $url = wp_get_attachment_image_url($thumbId, 'large');
        if (is_string($url) && $url !== '') {
            $imageUrl = $url;
        }
    }

    $payload = [
        'id' => (int) $post->ID,
        'slug' => (string) $post->post_name,
        'title' => get_the_title($post),
        'imageUrl' => $imageUrl,
        'blocks' => $blocks,
    ];

    headless_core_cache_set('services', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * @return WP_REST_Response
 */
function headless_core_rest_events(WP_REST_Request $request): WP_REST_Response
{
    $categoryId = (int) $request->get_param('category');
    $categoryId = max(0, $categoryId);
    $perPage = (int) $request->get_param('per_page');
    $perPage = max(0, min(100, $perPage));
    $cacheVersion = (string) get_option('headless_events_cache_ver', '1');
    $limitKey = $perPage > 0 ? (string) $perPage : 'all';
    $cacheKey = 'list_' . $cacheVersion . '_cat_' . $categoryId . '_pp_' . $limitKey . '_v2';
    $cached = headless_core_cache_get('events', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $queryArgs = [
        'post_type' => 'event',
        'post_status' => 'publish',
        'orderby' => [
            'menu_order' => 'ASC',
            'date' => 'DESC',
        ],
        'numberposts' => $perPage > 0 ? $perPage : -1,
    ];
    if ($categoryId > 0) {
        $queryArgs['category'] = $categoryId;
    }
    $posts = get_posts($queryArgs);

    $payload = [];
    foreach ($posts as $post) {
        if (! $post instanceof WP_Post) {
            continue;
        }

        $imageUrl = '';
        $thumbId = (int) get_post_thumbnail_id($post);
        if ($thumbId > 0) {
            $url = wp_get_attachment_image_url($thumbId, 'large');
            if (is_string($url) && $url !== '') {
                $imageUrl = $url;
            }
        }

        $excerpt = trim((string) $post->post_excerpt);
        if ($excerpt === '') {
            $excerpt = wp_trim_words(wp_strip_all_tags((string) $post->post_content), 28);
        }

        $authorId = (int) $post->post_author;
        $authorName = (string) get_the_author_meta('display_name', $authorId);
        if ($authorName === '') {
            $nick = get_the_author_meta('nickname', $authorId);
            $authorName = is_string($nick) && $nick !== '' ? $nick : '';
        }
        if (! is_string($authorName) || $authorName === '') {
            $authorName = __('Admin', 'headless-core');
        }

        $dateFormatted = get_the_date((string) get_option('date_format'), $post);

        $payload[] = [
            'id' => (int) $post->ID,
            'slug' => (string) $post->post_name,
            'title' => get_the_title($post),
            'description' => $excerpt,
            'imageUrl' => $imageUrl,
            'link' => '/events/' . (string) $post->post_name,
            'date' => $dateFormatted,
            'author' => $authorName,
        ];
    }

    headless_core_cache_set('events', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_event(WP_REST_Request $request)
{
    $slug = sanitize_title((string) $request->get_param('slug'));
    if ($slug === '') {
        return new WP_Error('headless_event_invalid', __('Event slug is required.', 'headless-core'), ['status' => 400]);
    }

    $cacheVersion = (string) get_option('headless_events_cache_ver', '1');
    $cacheKey = 'single_' . $slug . '_' . $cacheVersion;
    $cached = headless_core_cache_get('events', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $post = get_page_by_path($slug, OBJECT, 'event');
    if (! $post instanceof WP_Post || $post->post_status !== 'publish') {
        return new WP_Error('headless_not_found', __('Event not found.', 'headless-core'), ['status' => 404]);
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

    $imageUrl = '';
    $thumbId = (int) get_post_thumbnail_id($post);
    if ($thumbId > 0) {
        $url = wp_get_attachment_image_url($thumbId, 'large');
        if (is_string($url) && $url !== '') {
            $imageUrl = $url;
        }
    }

    $payload = [
        'id' => (int) $post->ID,
        'slug' => (string) $post->post_name,
        'title' => get_the_title($post),
        'imageUrl' => $imageUrl,
        'blocks' => $blocks,
    ];

    headless_core_cache_set('events', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
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

/**
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_contact_submit(WP_REST_Request $request)
{
    // Basic rate limit (per IP) to reduce abuse on public endpoint.
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    $ipKey = $ip !== '' ? preg_replace('/[^a-z0-9\.\:]/i', '_', $ip) : 'unknown';
    $rateKey = 'headless_contact_rl_' . $ipKey;
    $count = (int) get_transient($rateKey);
    if ($count >= 10) {
        return new WP_Error('headless_rate_limited', __('Too many requests. Please try again later.', 'headless-core'), ['status' => 429]);
    }
    set_transient($rateKey, $count + 1, HOUR_IN_SECONDS);

    $name = trim((string) $request->get_param('name'));
    $email = trim((string) $request->get_param('email'));
    $phone = trim((string) $request->get_param('phone'));
    $amount = trim((string) $request->get_param('amount'));
    $message = trim((string) $request->get_param('message'));
    $form = trim((string) $request->get_param('form'));
    $recaptchaToken = trim((string) $request->get_param('recaptchaToken'));
    $recaptchaAction = trim((string) $request->get_param('recaptchaAction'));

    // Honeypot: bots fill hidden fields.
    $company = trim((string) $request->get_param('company'));
    if ($company !== '') {
        return new WP_REST_Response(['ok' => true], 200);
    }

    if ($recaptchaToken === '') {
        return new WP_Error('headless_recaptcha_required', __('Verification failed. Please try again.', 'headless-core'), ['status' => 403]);
    }

    $recaptchaSecret = getenv('HEADLESS_RECAPTCHA_SECRET');
    if (! is_string($recaptchaSecret) || trim($recaptchaSecret) === '') {
        $recaptchaSecret = (string) get_option('headless_core_recaptcha_secret', '');
    }
    if (trim((string) $recaptchaSecret) === '') {
        return new WP_Error('headless_recaptcha_misconfigured', __('Verification is not configured.', 'headless-core'), ['status' => 500]);
    }

    $expectedAction = $recaptchaAction !== '' ? $recaptchaAction : 'contact_submit';
    $minScoreRaw = getenv('HEADLESS_RECAPTCHA_MIN_SCORE');
    if (! is_string($minScoreRaw) || $minScoreRaw === '') {
        $minScoreRaw = (string) get_option('headless_core_recaptcha_min_score', '');
    }
    $minScore = is_string($minScoreRaw) && $minScoreRaw !== '' ? (float) $minScoreRaw : 0.5;
    if ($minScore <= 0 || $minScore > 1) {
        $minScore = 0.5;
    }

    $verify = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', [
        'timeout' => 8,
        'headers' => ['Content-Type' => 'application/x-www-form-urlencoded'],
        'body' => [
            'secret' => trim($recaptchaSecret),
            'response' => $recaptchaToken,
            'remoteip' => $ip,
        ],
    ]);
    if (is_wp_error($verify)) {
        return new WP_Error('headless_recaptcha_unavailable', __('Verification failed. Please try again.', 'headless-core'), ['status' => 503]);
    }
    $body = wp_remote_retrieve_body($verify);
    $payload = is_string($body) && $body !== '' ? json_decode($body, true) : null;
    if (! is_array($payload) || empty($payload['success'])) {
        return new WP_Error('headless_recaptcha_failed', __('Verification failed. Please try again.', 'headless-core'), ['status' => 403]);
    }
    $action = isset($payload['action']) ? (string) $payload['action'] : '';
    if ($expectedAction !== '' && $action !== '' && $action !== $expectedAction) {
        return new WP_Error('headless_recaptcha_failed', __('Verification failed. Please try again.', 'headless-core'), ['status' => 403]);
    }
    $score = isset($payload['score']) ? (float) $payload['score'] : 0.0;
    if ($score < $minScore) {
        return new WP_Error('headless_recaptcha_failed', __('Verification failed. Please try again.', 'headless-core'), ['status' => 403]);
    }

    if ($name === '' || $email === '' || $phone === '') {
        return new WP_Error('headless_invalid', __('Missing required fields.', 'headless-core'), ['status' => 400]);
    }
    if (! is_email($email)) {
        return new WP_Error('headless_invalid_email', __('Invalid email.', 'headless-core'), ['status' => 400]);
    }

    if (strlen($name) > 200 || strlen($email) > 254 || strlen($phone) > 60 || strlen($form) > 200 || strlen($amount) > 60 || strlen($message) > 5000) {
        return new WP_Error('headless_invalid', __('Invalid input.', 'headless-core'), ['status' => 400]);
    }

    $name = sanitize_text_field($name);
    $phone = sanitize_text_field($phone);
    $amount = sanitize_text_field($amount);
    $message = sanitize_textarea_field($message);
    $form = sanitize_text_field($form);

    $to = (string) get_option('admin_email');
    $site = wp_parse_url(home_url(), PHP_URL_HOST);
    if (! is_string($site) || $site === '') {
        $site = 'website';
    }

    $subject = '[' . $site . '] ' . ($form !== '' ? $form : 'Contact form submission');
    $bodyLines = [
        'Name: ' . $name,
        'Email: ' . $email,
        'Phone: ' . $phone,
    ];
    if ($amount !== '' && $amount !== '0.00' && $amount !== '0') {
        $bodyLines[] = 'Amount: ' . $amount;
    }
    if ($message !== '') {
        $bodyLines[] = '';
        $bodyLines[] = 'Message:';
        $bodyLines[] = $message;
    }
    $body = implode("\n", $bodyLines);

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $name . ' <' . $email . '>',
    ];

    $sent = wp_mail($to, $subject, $body, $headers);
    if (! $sent) {
        return new WP_Error('headless_mail_failed', __('Failed to send message.', 'headless-core'), ['status' => 500]);
    }

    return new WP_REST_Response(['ok' => true], 200);
}
