<?php

/**
 * Headless SEO.
 *
 * A self-contained SEO layer that understands the headless/Gutenberg setup:
 * - Per-content SEO meta (title, description, canonical, robots, Open Graph,
 *   Twitter, schema type, focus keyphrase) on pages and all CPTs.
 * - Global SEO defaults (site name, title template, share image, Organization).
 * - A resolver that fills empty fields by scanning the page's Gutenberg blocks
 *   (first hero/banner/content image and first body text) plus WP fallbacks.
 * - A JSON-LD structured-data graph.
 * - A Gutenberg document sidebar panel for editors.
 *
 * The resolved `seo` object is attached to the REST responses consumed by the
 * React frontend (see rest-api.php).
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Post types that get SEO meta + the editor panel.
 *
 * @return array<int, string>
 */
function headless_core_seo_post_types(): array
{
    return [
        'page',
        'post',
        'savings_product',
        'loan_product',
        'service',
        'event',
        'team_member',
    ];
}

/**
 * SEO meta keys (stored on each post). Values are the register_post_meta config.
 *
 * @return array<string, array{type: string, default: mixed}>
 */
function headless_core_seo_meta_fields(): array
{
    return [
        '_hc_seo_title' => ['type' => 'string', 'default' => ''],
        '_hc_seo_description' => ['type' => 'string', 'default' => ''],
        '_hc_seo_canonical' => ['type' => 'string', 'default' => ''],
        '_hc_seo_keyphrase' => ['type' => 'string', 'default' => ''],
        '_hc_seo_noindex' => ['type' => 'boolean', 'default' => false],
        '_hc_seo_nofollow' => ['type' => 'boolean', 'default' => false],
        '_hc_seo_og_title' => ['type' => 'string', 'default' => ''],
        '_hc_seo_og_description' => ['type' => 'string', 'default' => ''],
        '_hc_seo_og_image' => ['type' => 'integer', 'default' => 0],
        '_hc_seo_twitter_card' => ['type' => 'string', 'default' => ''],
        '_hc_seo_schema_type' => ['type' => 'string', 'default' => ''],
    ];
}

/**
 * Global SEO option names.
 */
const HEADLESS_CORE_SEO_OPT_SITE_NAME = 'headless_core_seo_site_name';
const HEADLESS_CORE_SEO_OPT_TITLE_TEMPLATE = 'headless_core_seo_title_template';
const HEADLESS_CORE_SEO_OPT_SEPARATOR = 'headless_core_seo_separator';
const HEADLESS_CORE_SEO_OPT_DEFAULT_DESCRIPTION = 'headless_core_seo_default_description';
const HEADLESS_CORE_SEO_OPT_DEFAULT_OG_IMAGE = 'headless_core_seo_default_og_image';
const HEADLESS_CORE_SEO_OPT_TWITTER_SITE = 'headless_core_seo_twitter_site';
const HEADLESS_CORE_SEO_OPT_FRONTEND_URL = 'headless_core_seo_frontend_url';
const HEADLESS_CORE_SEO_OPT_ORG_NAME = 'headless_core_seo_org_name';
const HEADLESS_CORE_SEO_OPT_ORG_LOGO = 'headless_core_seo_org_logo';
const HEADLESS_CORE_SEO_OPT_ORG_SAME_AS = 'headless_core_seo_org_same_as';

/**
 * Schema.org types offered per post type. First entry is the default.
 *
 * @return array<int, string>
 */
function headless_core_seo_schema_choices(string $postType): array
{
    switch ($postType) {
        case 'savings_product':
        case 'loan_product':
            return ['FinancialProduct', 'Product', 'Service', 'WebPage'];
        case 'service':
            return ['Service', 'FinancialProduct', 'WebPage'];
        case 'event':
            return ['Event', 'Article', 'WebPage'];
        case 'post':
            return ['NewsArticle', 'Article', 'BlogPosting', 'WebPage'];
        case 'team_member':
            return ['Person', 'ProfilePage', 'WebPage'];
        case 'page':
        default:
            return ['WebPage', 'AboutPage', 'ContactPage', 'CollectionPage', 'FAQPage', 'Article', 'Organization'];
    }
}

function headless_core_seo_default_schema_type(string $postType): string
{
    $choices = headless_core_seo_schema_choices($postType);

    return $choices[0] ?? 'WebPage';
}

/* -------------------------------------------------------------------------
 * Registration
 * ---------------------------------------------------------------------- */

add_action('init', static function (): void {
    $fields = headless_core_seo_meta_fields();

    foreach (headless_core_seo_post_types() as $postType) {
        foreach ($fields as $key => $config) {
            register_post_meta($postType, $key, [
                'type' => $config['type'],
                'single' => true,
                'show_in_rest' => true,
                'default' => $config['default'],
                'sanitize_callback' => headless_core_seo_sanitizer_for($config['type'], $key),
                'auth_callback' => static function (): bool {
                    return current_user_can('edit_posts');
                },
            ]);
        }
    }
}, 11);

/**
 * @return callable
 */
function headless_core_seo_sanitizer_for(string $type, string $key): callable
{
    if ($type === 'boolean') {
        return static function ($value): bool {
            return (bool) $value;
        };
    }

    if ($type === 'integer') {
        return static function ($value): int {
            return max(0, (int) $value);
        };
    }

    if ($key === '_hc_seo_canonical') {
        return static function ($value): string {
            $value = trim((string) $value);

            return $value === '' ? '' : esc_url_raw($value);
        };
    }

    if (in_array($key, ['_hc_seo_description', '_hc_seo_og_description'], true)) {
        return static function ($value): string {
            return trim(wp_strip_all_tags((string) $value));
        };
    }

    return static function ($value): string {
        return sanitize_text_field((string) $value);
    };
}

add_action('admin_init', static function (): void {
    $stringOpts = [
        HEADLESS_CORE_SEO_OPT_SITE_NAME,
        HEADLESS_CORE_SEO_OPT_TITLE_TEMPLATE,
        HEADLESS_CORE_SEO_OPT_SEPARATOR,
        HEADLESS_CORE_SEO_OPT_TWITTER_SITE,
        HEADLESS_CORE_SEO_OPT_ORG_NAME,
    ];
    foreach ($stringOpts as $opt) {
        register_setting('headless_core_settings_group', $opt, [
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '',
        ]);
    }

    register_setting('headless_core_settings_group', HEADLESS_CORE_SEO_OPT_DEFAULT_DESCRIPTION, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return trim(wp_strip_all_tags((string) $value));
        },
        'default' => '',
    ]);

    register_setting('headless_core_settings_group', HEADLESS_CORE_SEO_OPT_FRONTEND_URL, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            $value = trim((string) $value);

            return $value === '' ? '' : esc_url_raw($value);
        },
        'default' => '',
    ]);

    register_setting('headless_core_settings_group', HEADLESS_CORE_SEO_OPT_ORG_SAME_AS, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            $lines = preg_split('/\r\n|\r|\n/', (string) $value) ?: [];
            $clean = [];
            foreach ($lines as $line) {
                $line = trim((string) $line);
                if ($line !== '') {
                    $clean[] = esc_url_raw($line);
                }
            }

            return implode("\n", array_filter($clean));
        },
        'default' => '',
    ]);

    foreach ([HEADLESS_CORE_SEO_OPT_DEFAULT_OG_IMAGE, HEADLESS_CORE_SEO_OPT_ORG_LOGO] as $opt) {
        register_setting('headless_core_settings_group', $opt, [
            'type' => 'integer',
            'sanitize_callback' => static function ($value): int {
                return max(0, (int) $value);
            },
            'default' => 0,
        ]);
    }
});

/* -------------------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------------- */

/**
 * @return mixed
 */
function headless_core_seo_option(string $name, $default = '')
{
    $value = get_option($name, $default);

    return $value === false ? $default : $value;
}

/**
 * Base URL of the public React site (no trailing slash).
 */
function headless_core_seo_frontend_base(): string
{
    $base = (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_FRONTEND_URL, '');
    if ($base === '') {
        $base = home_url('/');
    }

    return untrailingslashit($base);
}

function headless_core_seo_site_name(): string
{
    $name = (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_SITE_NAME, '');

    return $name !== '' ? $name : (string) get_bloginfo('name');
}

function headless_core_seo_separator(): string
{
    $sep = (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_SEPARATOR, '');

    return $sep !== '' ? $sep : '|';
}

/**
 * Public SPA route path for a post (leading slash), used for canonical/og:url.
 */
function headless_core_seo_route_for_post(WP_Post $post): string
{
    switch ($post->post_type) {
        case 'page':
            if (function_exists('headless_core_page_route_slug')) {
                $slug = headless_core_page_route_slug($post);
            } else {
                $slug = (string) $post->post_name;
            }
            $slug = trim((string) $slug, '/');
            if ($slug === '' || $slug === 'home') {
                return '/';
            }

            return '/' . $slug;
        case 'savings_product':
            return '/savings-products/' . $post->post_name;
        case 'loan_product':
            return '/loan-products/' . $post->post_name;
        case 'service':
            return '/services/' . $post->post_name;
        case 'event':
            return '/events/' . $post->post_name;
        case 'post':
            return '/news/' . $post->post_name;
        case 'team_member':
            return '/team/' . $post->post_name;
        default:
            return '/' . $post->post_name;
    }
}

/**
 * Resolve an attachment id to a URL (large size), or '' when missing.
 */
function headless_core_seo_attachment_url(int $attachmentId): string
{
    if ($attachmentId <= 0) {
        return '';
    }

    $url = wp_get_attachment_image_url($attachmentId, 'large');

    return is_string($url) && $url !== '' ? $url : '';
}

/**
 * Truncate a plain-text string to a sensible meta-description length.
 */
function headless_core_seo_truncate(string $text, int $limit = 160): string
{
    $text = trim(preg_replace('/\s+/', ' ', wp_strip_all_tags($text)) ?? '');
    if ($text === '') {
        return '';
    }

    if (function_exists('mb_strlen') && function_exists('mb_substr')) {
        if (mb_strlen($text) <= $limit) {
            return $text;
        }
        $cut = mb_substr($text, 0, $limit);
        $lastSpace = mb_strrpos($cut, ' ');
        if ($lastSpace !== false && $lastSpace > 40) {
            $cut = mb_substr($cut, 0, $lastSpace);
        }

        return rtrim($cut, " ,.;:-") . '…';
    }

    if (strlen($text) <= $limit) {
        return $text;
    }

    return rtrim(substr($text, 0, $limit)) . '…';
}

/**
 * Normalize a block entry (attributes may be stdClass) to an attribute array.
 *
 * @param mixed $block
 * @return array{name: string, attributes: array<string, mixed>, innerBlocks: array<int, mixed>}
 */
function headless_core_seo_block_parts($block): array
{
    if (is_object($block)) {
        $block = (array) $block;
    }
    if (! is_array($block)) {
        return ['name' => '', 'attributes' => [], 'innerBlocks' => []];
    }

    $attrs = $block['attributes'] ?? [];
    if (is_object($attrs)) {
        $attrs = (array) $attrs;
    }
    if (! is_array($attrs)) {
        $attrs = [];
    }

    $inner = $block['innerBlocks'] ?? [];
    if (! is_array($inner)) {
        $inner = [];
    }

    return [
        'name' => (string) ($block['name'] ?? ''),
        'attributes' => $attrs,
        'innerBlocks' => $inner,
    ];
}

/**
 * Find the first usable image URL inside normalized blocks.
 *
 * Prefers hero/banner/featured-style keys; falls back to any *image*url value.
 *
 * @param array<int, mixed> $blocks
 */
function headless_core_seo_scan_blocks_for_image(array $blocks): string
{
    $priority = ['bannerimageurl', 'imageurl', 'heroimageurl', 'logoimageurl', 'patternimageurl'];

    // Pass 1: priority keys.
    $found = headless_core_seo_walk_for_image($blocks, $priority, true);
    if ($found !== '') {
        return $found;
    }

    // Pass 2: any key that looks like an image URL.
    return headless_core_seo_walk_for_image($blocks, $priority, false);
}

/**
 * @param array<int, mixed> $blocks
 * @param array<int, string> $priorityKeys lowercased
 */
function headless_core_seo_walk_for_image(array $blocks, array $priorityKeys, bool $priorityOnly): string
{
    foreach ($blocks as $block) {
        $parts = headless_core_seo_block_parts($block);

        foreach ($parts['attributes'] as $key => $value) {
            $lowerKey = strtolower((string) $key);

            if (is_string($value) && strpos($value, 'http') === 0) {
                $isImageKey = strpos($lowerKey, 'image') !== false && strpos($lowerKey, 'url') !== false;
                $isPriority = in_array($lowerKey, $priorityKeys, true);
                if (($priorityOnly && $isPriority) || (! $priorityOnly && $isImageKey)) {
                    return $value;
                }
            }

            // Repeater arrays (slides, cards, partners…) that hold imageUrl entries.
            if (is_array($value)) {
                $nested = headless_core_seo_walk_array_for_image($value, $priorityKeys, $priorityOnly);
                if ($nested !== '') {
                    return $nested;
                }
            }
        }

        if (! empty($parts['innerBlocks'])) {
            $deep = headless_core_seo_walk_for_image($parts['innerBlocks'], $priorityKeys, $priorityOnly);
            if ($deep !== '') {
                return $deep;
            }
        }
    }

    return '';
}

/**
 * @param array<int|string, mixed> $arr
 * @param array<int, string> $priorityKeys
 */
function headless_core_seo_walk_array_for_image(array $arr, array $priorityKeys, bool $priorityOnly): string
{
    foreach ($arr as $key => $value) {
        $lowerKey = strtolower((string) $key);

        if (is_string($value) && strpos($value, 'http') === 0) {
            $isImageKey = strpos($lowerKey, 'image') !== false && strpos($lowerKey, 'url') !== false;
            $isPriority = in_array($lowerKey, $priorityKeys, true);
            if (($priorityOnly && $isPriority) || (! $priorityOnly && $isImageKey)) {
                return $value;
            }
        }

        if (is_array($value)) {
            $nested = headless_core_seo_walk_array_for_image($value, $priorityKeys, $priorityOnly);
            if ($nested !== '') {
                return $nested;
            }
        }
    }

    return '';
}

/**
 * Find the first meaningful body text inside normalized blocks.
 *
 * @param array<int, mixed> $blocks
 */
function headless_core_seo_scan_blocks_for_text(array $blocks): string
{
    $textKeys = ['content', 'bodyhtml', 'bodytext', 'intro', 'description', 'paragraph', 'subtitle', 'answer'];

    foreach ($blocks as $block) {
        $parts = headless_core_seo_block_parts($block);

        foreach ($textKeys as $key) {
            foreach ($parts['attributes'] as $attrKey => $value) {
                if (strtolower((string) $attrKey) !== $key) {
                    continue;
                }
                if (! is_string($value)) {
                    continue;
                }
                $plain = trim(preg_replace('/\s+/', ' ', wp_strip_all_tags($value)) ?? '');
                if (mb_strlen($plain) >= 40) {
                    return $plain;
                }
            }
        }

        if (! empty($parts['innerBlocks'])) {
            $deep = headless_core_seo_scan_blocks_for_text($parts['innerBlocks']);
            if ($deep !== '') {
                return $deep;
            }
        }
    }

    return '';
}

/* -------------------------------------------------------------------------
 * Resolver
 * ---------------------------------------------------------------------- */

/**
 * Build the normalized SEO object for a post.
 *
 * @param array<int, mixed> $blocks Normalized blocks (from headless_core_normalize_blocks()).
 * @return array<string, mixed>
 */
function headless_core_build_seo(WP_Post $post, array $blocks = []): array
{
    $meta = [];
    foreach (array_keys(headless_core_seo_meta_fields()) as $key) {
        $meta[$key] = get_post_meta($post->ID, $key, true);
    }

    $siteName = headless_core_seo_site_name();
    $separator = headless_core_seo_separator();
    $route = headless_core_seo_route_for_post($post);
    $base = headless_core_seo_frontend_base();
    $postTitle = get_the_title($post);

    // --- Title -----------------------------------------------------------
    $manualTitle = trim((string) ($meta['_hc_seo_title'] ?? ''));
    if ($manualTitle !== '') {
        $title = $manualTitle;
    } else {
        $template = (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_TITLE_TEMPLATE, '');
        if ($template === '') {
            $template = '%title% %sep% %sitename%';
        }
        $title = strtr($template, [
            '%title%' => $postTitle,
            '%sitename%' => $siteName,
            '%sep%' => $separator,
        ]);
        $title = trim(preg_replace('/\s+/', ' ', $title) ?? '');
    }

    // --- Description -----------------------------------------------------
    $description = trim((string) ($meta['_hc_seo_description'] ?? ''));
    if ($description === '') {
        $excerpt = trim((string) $post->post_excerpt);
        if ($excerpt !== '') {
            $description = $excerpt;
        }
    }
    if ($description === '') {
        $description = headless_core_seo_scan_blocks_for_text($blocks);
    }
    if ($description === '') {
        $description = trim((string) $post->post_content) !== ''
            ? wp_strip_all_tags((string) $post->post_content)
            : '';
    }
    if ($description === '') {
        $description = (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_DEFAULT_DESCRIPTION, '');
    }
    $description = headless_core_seo_truncate($description, 160);

    // --- Image -----------------------------------------------------------
    $image = headless_core_seo_attachment_url((int) ($meta['_hc_seo_og_image'] ?? 0));
    if ($image === '') {
        $image = headless_core_seo_attachment_url((int) get_post_thumbnail_id($post));
    }
    if ($image === '') {
        $image = headless_core_seo_scan_blocks_for_image($blocks);
    }
    if ($image === '') {
        $image = headless_core_seo_attachment_url((int) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_DEFAULT_OG_IMAGE, 0));
    }

    // --- Canonical / URL -------------------------------------------------
    $canonical = trim((string) ($meta['_hc_seo_canonical'] ?? ''));
    if ($canonical === '') {
        $canonical = $route === '/' ? $base . '/' : $base . $route;
    }

    // --- Robots ----------------------------------------------------------
    $noindex = (bool) ($meta['_hc_seo_noindex'] ?? false);
    $nofollow = (bool) ($meta['_hc_seo_nofollow'] ?? false);
    $robotsParts = [
        $noindex ? 'noindex' : 'index',
        $nofollow ? 'nofollow' : 'follow',
    ];
    if (! $noindex) {
        $robotsParts[] = 'max-image-preview:large';
        $robotsParts[] = 'max-snippet:-1';
        $robotsParts[] = 'max-video-preview:-1';
    }

    // --- Open Graph ------------------------------------------------------
    $ogTitle = trim((string) ($meta['_hc_seo_og_title'] ?? ''));
    if ($ogTitle === '') {
        $ogTitle = $title;
    }
    $ogDescription = trim((string) ($meta['_hc_seo_og_description'] ?? ''));
    if ($ogDescription === '') {
        $ogDescription = $description;
    }
    $ogType = in_array($post->post_type, ['post', 'event'], true) ? 'article' : 'website';

    // --- Twitter ---------------------------------------------------------
    $twitterCard = trim((string) ($meta['_hc_seo_twitter_card'] ?? ''));
    if ($twitterCard === '') {
        $twitterCard = $image !== '' ? 'summary_large_image' : 'summary';
    }
    $twitterSite = (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_TWITTER_SITE, '');

    // --- Schema ----------------------------------------------------------
    $schemaType = trim((string) ($meta['_hc_seo_schema_type'] ?? ''));
    if ($schemaType === '') {
        $schemaType = headless_core_seo_default_schema_type($post->post_type);
    }

    $seo = [
        'title' => $title,
        'description' => $description,
        'canonical' => $canonical,
        'keyphrase' => trim((string) ($meta['_hc_seo_keyphrase'] ?? '')),
        'robots' => [
            'index' => ! $noindex,
            'follow' => ! $nofollow,
            'raw' => implode(', ', $robotsParts),
        ],
        'og' => [
            'title' => $ogTitle,
            'description' => $ogDescription,
            'image' => $image,
            'type' => $ogType,
            'url' => $canonical,
            'siteName' => $siteName,
            'locale' => str_replace('-', '_', (string) get_bloginfo('language')),
        ],
        'twitter' => [
            'card' => $twitterCard,
            'title' => $ogTitle,
            'description' => $ogDescription,
            'image' => $image,
            'site' => $twitterSite,
        ],
        'schema' => headless_core_seo_build_jsonld($post, [
            'schemaType' => $schemaType,
            'title' => $title,
            'description' => $description,
            'image' => $image,
            'canonical' => $canonical,
            'siteName' => $siteName,
            'base' => $base,
        ]),
    ];

    /**
     * Filter the resolved SEO object before it is returned to the frontend.
     *
     * @param array<string, mixed> $seo
     * @param WP_Post $post
     */
    return apply_filters('headless_core_seo', $seo, $post);
}

/**
 * Build a JSON-LD @graph for the post.
 *
 * @param array<string, mixed> $ctx
 * @return array<string, mixed>
 */
function headless_core_seo_build_jsonld(WP_Post $post, array $ctx): array
{
    $base = (string) $ctx['base'];
    $siteName = (string) $ctx['siteName'];
    $canonical = (string) $ctx['canonical'];
    $image = (string) $ctx['image'];
    $schemaType = (string) $ctx['schemaType'];

    $orgId = $base . '/#organization';
    $siteId = $base . '/#website';
    $pageId = $canonical . '#webpage';

    $graph = [];

    // Organization.
    $orgName = (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_ORG_NAME, '');
    if ($orgName === '') {
        $orgName = $siteName;
    }
    $organization = [
        '@type' => 'Organization',
        '@id' => $orgId,
        'name' => $orgName,
        'url' => $base . '/',
    ];
    $logoUrl = headless_core_seo_attachment_url((int) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_ORG_LOGO, 0));
    if ($logoUrl !== '') {
        $organization['logo'] = [
            '@type' => 'ImageObject',
            'url' => $logoUrl,
        ];
        $organization['image'] = $logoUrl;
    }
    $sameAsRaw = (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_ORG_SAME_AS, '');
    if ($sameAsRaw !== '') {
        $sameAs = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $sameAsRaw) ?: [])));
        if ($sameAs !== []) {
            $organization['sameAs'] = $sameAs;
        }
    }
    $graph[] = $organization;

    // WebSite.
    $graph[] = [
        '@type' => 'WebSite',
        '@id' => $siteId,
        'url' => $base . '/',
        'name' => $siteName,
        'publisher' => ['@id' => $orgId],
        'inLanguage' => (string) get_bloginfo('language'),
    ];

    // WebPage.
    $webPage = [
        '@type' => 'WebPage',
        '@id' => $pageId,
        'url' => $canonical,
        'name' => (string) $ctx['title'],
        'description' => (string) $ctx['description'],
        'isPartOf' => ['@id' => $siteId],
        'inLanguage' => (string) get_bloginfo('language'),
        'datePublished' => get_post_time('c', true, $post) ?: null,
        'dateModified' => get_post_modified_time('c', true, $post) ?: null,
    ];
    if ($image !== '') {
        $webPage['primaryImageOfPage'] = ['@type' => 'ImageObject', 'url' => $image];
    }
    $graph[] = array_filter($webPage, static function ($v) {
        return $v !== null;
    });

    // Primary entity (only when it adds beyond WebPage).
    $primary = headless_core_seo_primary_entity($post, $schemaType, $ctx, $orgId, $pageId);
    if ($primary !== []) {
        $graph[] = $primary;
    }

    return [
        '@context' => 'https://schema.org',
        '@graph' => $graph,
    ];
}

/**
 * @param array<string, mixed> $ctx
 * @return array<string, mixed>
 */
function headless_core_seo_primary_entity(WP_Post $post, string $schemaType, array $ctx, string $orgId, string $pageId): array
{
    $canonical = (string) $ctx['canonical'];
    $image = (string) $ctx['image'];
    $title = (string) $ctx['title'];
    $description = (string) $ctx['description'];

    if (in_array($schemaType, ['Article', 'NewsArticle', 'BlogPosting'], true)) {
        $entity = [
            '@type' => $schemaType,
            '@id' => $canonical . '#article',
            'headline' => get_the_title($post),
            'description' => $description,
            'mainEntityOfPage' => ['@id' => $pageId],
            'author' => ['@type' => 'Person', 'name' => get_the_author_meta('display_name', (int) $post->post_author)],
            'publisher' => ['@id' => $orgId],
            'datePublished' => get_post_time('c', true, $post) ?: null,
            'dateModified' => get_post_modified_time('c', true, $post) ?: null,
        ];
        if ($image !== '') {
            $entity['image'] = $image;
        }

        return array_filter($entity, static function ($v) {
            return $v !== null;
        });
    }

    if (in_array($schemaType, ['Product', 'FinancialProduct'], true)) {
        $entity = [
            '@type' => $schemaType,
            'name' => get_the_title($post),
            'description' => $description,
            'url' => $canonical,
            'brand' => ['@id' => $orgId],
        ];
        if ($image !== '') {
            $entity['image'] = $image;
        }

        return $entity;
    }

    if ($schemaType === 'Service') {
        $entity = [
            '@type' => 'Service',
            'name' => get_the_title($post),
            'description' => $description,
            'url' => $canonical,
            'provider' => ['@id' => $orgId],
        ];
        if ($image !== '') {
            $entity['image'] = $image;
        }

        return $entity;
    }

    if ($schemaType === 'Event') {
        $entity = [
            '@type' => 'Event',
            'name' => get_the_title($post),
            'description' => $description,
            'url' => $canonical,
            'organizer' => ['@id' => $orgId],
            'startDate' => get_post_time('c', true, $post) ?: null,
        ];
        if ($image !== '') {
            $entity['image'] = $image;
        }

        return array_filter($entity, static function ($v) {
            return $v !== null;
        });
    }

    if (in_array($schemaType, ['Person', 'ProfilePage'], true)) {
        $positionMeta = (string) get_post_meta($post->ID, 'position', true);
        $entity = [
            '@type' => 'Person',
            'name' => get_the_title($post),
            'url' => $canonical,
            'worksFor' => ['@id' => $orgId],
        ];
        if ($positionMeta !== '') {
            $entity['jobTitle'] = $positionMeta;
        }
        if ($image !== '') {
            $entity['image'] = $image;
        }

        return $entity;
    }

    if ($schemaType === 'Organization') {
        // Already emitted as the site Organization node.
        return [];
    }

    // WebPage-family types (AboutPage, ContactPage, FAQPage, etc.) — refine the
    // existing WebPage node type instead of adding a duplicate entity.
    return [];
}

/* -------------------------------------------------------------------------
 * Gutenberg editor panel
 * ---------------------------------------------------------------------- */

add_action('enqueue_block_editor_assets', static function (): void {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    $postType = $screen && isset($screen->post_type) ? (string) $screen->post_type : '';
    if ($postType === '' || ! in_array($postType, headless_core_seo_post_types(), true)) {
        return;
    }

    wp_enqueue_script(
        'headless-core-seo-panel',
        HEADLESS_CORE_URL . 'blocks/seo-panel/editor.js',
        ['wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-core-data', 'wp-block-editor', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );

    $schemaChoices = [];
    foreach (headless_core_seo_post_types() as $type) {
        $schemaChoices[$type] = headless_core_seo_schema_choices($type);
    }

    wp_localize_script('headless-core-seo-panel', 'HeadlessCoreSeo', [
        'metaKeys' => array_keys(headless_core_seo_meta_fields()),
        'schemaChoices' => $schemaChoices,
        'frontendBase' => headless_core_seo_frontend_base(),
        'siteName' => headless_core_seo_site_name(),
        'separator' => headless_core_seo_separator(),
        'titleTemplate' => (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_TITLE_TEMPLATE, '%title% %sep% %sitename%'),
        'defaultDescription' => (string) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_DEFAULT_DESCRIPTION, ''),
        'defaultImage' => headless_core_seo_attachment_url((int) headless_core_seo_option(HEADLESS_CORE_SEO_OPT_DEFAULT_OG_IMAGE, 0)),
    ]);
});
