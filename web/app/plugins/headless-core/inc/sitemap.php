<?php

/**
 * Headless sitemap + robots.txt.
 *
 * Generates a dynamic XML sitemap (index + per-type) and a robots.txt that
 * point at the public React frontend routes (not the WordPress URLs) and that
 * respect the per-page `noindex` flag set in the SEO sidebar.
 *
 * Served through WordPress at:
 *   /sitemap.xml            → sitemap index
 *   /sitemap-<type>.xml     → per content-type sitemap
 *   /robots.txt             → robots file (virtual, via robots_txt filter)
 *
 * The site's root .htaccess excludes these paths from the SPA fallback so the
 * requests reach WordPress.
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Sub-sitemap slug => post type. Order controls the index order.
 *
 * @return array<string, string>
 */
function headless_core_sitemap_types(): array
{
    return [
        'page' => 'page',
        'savings-products' => 'savings_product',
        'loan-products' => 'loan_product',
        'services' => 'service',
        'events' => 'event',
        'news' => 'post',
    ];
}

/**
 * Extra static frontend routes (React-only pages) added to the pages sitemap.
 *
 * @return array<int, string>
 */
function headless_core_sitemap_static_routes(): array
{
    return [
        '/',
        '/savings-products',
        '/loan-products',
        '/services',
        '/events',
    ];
}

/* -------------------------------------------------------------------------
 * Rewrite rules
 * ---------------------------------------------------------------------- */

add_action('init', static function (): void {
    headless_core_sitemap_add_rewrite_rules();

    if (get_option('headless_core_sitemap_rewrite_v') !== '2') {
        flush_rewrite_rules(false);
        update_option('headless_core_sitemap_rewrite_v', '2', false);
    }
});

function headless_core_sitemap_add_rewrite_rules(): void
{
    add_rewrite_rule('^sitemap\.xml$', 'index.php?hc_sitemap=index', 'top');
    add_rewrite_rule('^sitemap-([a-z0-9_-]+)\.xml$', 'index.php?hc_sitemap=$matches[1]', 'top');
}

add_filter('query_vars', static function (array $vars): array {
    $vars[] = 'hc_sitemap';

    return $vars;
});

// Prevent WordPress from canonical-redirecting /sitemap.xml to /sitemap.xml/.
add_filter('redirect_canonical', static function ($redirect) {
    $type = get_query_var('hc_sitemap');
    if ($type !== '' && $type !== null) {
        return false;
    }

    return $redirect;
});

add_action('template_redirect', static function (): void {
    $type = get_query_var('hc_sitemap');
    if ($type === '' || $type === null) {
        return;
    }

    headless_core_sitemap_render((string) $type);
    exit;
}, 0);

/* -------------------------------------------------------------------------
 * Rendering
 * ---------------------------------------------------------------------- */

/**
 * Combined cache signature — changes whenever any content type is saved.
 */
function headless_core_sitemap_cache_signature(): string
{
    return implode('_', [
        (string) get_option('headless_page_cache_ver', '1'),
        (string) get_option('headless_savings_products_cache_ver', '1'),
        (string) get_option('headless_loan_products_cache_ver', '1'),
        (string) get_option('headless_services_cache_ver', '1'),
        (string) get_option('headless_events_cache_ver', '1'),
        (string) get_option('headless_news_cache_ver', '1'),
        defined('HEADLESS_CORE_VERSION') ? HEADLESS_CORE_VERSION : '0',
    ]);
}

/**
 * Output the requested sitemap and terminate.
 */
function headless_core_sitemap_render(string $type): void
{
    $cacheKey = 'hc_sitemap_' . sanitize_key($type) . '_' . md5(headless_core_sitemap_cache_signature());
    $xml = headless_core_transient_get_raw($cacheKey);

    if (! is_string($xml) || $xml === '') {
        $xml = $type === 'index'
            ? headless_core_sitemap_build_index()
            : headless_core_sitemap_build_type($type);

        if ($xml === '') {
            status_header(404);
            header('Content-Type: text/plain; charset=UTF-8');
            echo 'Sitemap not found.';

            return;
        }

        headless_core_transient_set_raw($cacheKey, $xml, HOUR_IN_SECONDS);
    }

    status_header(200);
    header('Content-Type: application/xml; charset=UTF-8');
    header('X-Robots-Tag: noindex, follow', true);
    echo $xml;
}

/**
 * Build the sitemap index referencing each non-empty per-type sitemap.
 */
function headless_core_sitemap_build_index(): string
{
    $base = headless_core_seo_frontend_base();

    $entries = [];
    foreach (headless_core_sitemap_types() as $slug => $postType) {
        $rows = headless_core_sitemap_rows_for_type($slug, $postType);
        if ($rows === []) {
            continue;
        }

        $lastmod = '';
        foreach ($rows as $row) {
            if (! empty($row['lastmod']) && $row['lastmod'] > $lastmod) {
                $lastmod = $row['lastmod'];
            }
        }

        $entries[] = [
            'loc' => $base . '/sitemap-' . $slug . '.xml',
            'lastmod' => $lastmod,
        ];
    }

    if ($entries === []) {
        return '';
    }

    $out = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $out .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($entries as $entry) {
        $out .= "  <sitemap>\n";
        $out .= '    <loc>' . esc_url($entry['loc']) . "</loc>\n";
        if ($entry['lastmod'] !== '') {
            $out .= '    <lastmod>' . esc_html($entry['lastmod']) . "</lastmod>\n";
        }
        $out .= "  </sitemap>\n";
    }
    $out .= '</sitemapindex>' . "\n";

    return $out;
}

/**
 * Build a single per-type urlset.
 */
function headless_core_sitemap_build_type(string $slug): string
{
    $types = headless_core_sitemap_types();
    if (! isset($types[$slug])) {
        return '';
    }

    $rows = headless_core_sitemap_rows_for_type($slug, $types[$slug]);
    if ($rows === []) {
        return '';
    }

    $out = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $out .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($rows as $row) {
        $out .= "  <url>\n";
        $out .= '    <loc>' . esc_url($row['loc']) . "</loc>\n";
        if (! empty($row['lastmod'])) {
            $out .= '    <lastmod>' . esc_html($row['lastmod']) . "</lastmod>\n";
        }
        $out .= "  </url>\n";
    }
    $out .= '</urlset>' . "\n";

    return $out;
}

/**
 * Collect indexable URL rows for a content type.
 *
 * @return array<int, array{loc: string, lastmod: string}>
 */
function headless_core_sitemap_rows_for_type(string $slug, string $postType): array
{
    $base = headless_core_seo_frontend_base();
    $rows = [];
    $seen = [];

    // Detail-only content types require rendered blocks to have a real page.
    $requiresBlocks = in_array($postType, ['savings_product', 'loan_product', 'service'], true);

    $posts = get_posts([
        'post_type' => $postType,
        'post_status' => 'publish',
        'numberposts' => -1,
        'orderby' => 'modified',
        'order' => 'DESC',
        'suppress_filters' => false,
    ]);

    foreach ($posts as $post) {
        if (! $post instanceof WP_Post) {
            continue;
        }
        if (! headless_core_sitemap_is_indexable((int) $post->ID)) {
            continue;
        }
        if ($requiresBlocks && function_exists('headless_core_post_has_blocks') && ! headless_core_post_has_blocks($post)) {
            continue;
        }

        $route = headless_core_seo_route_for_post($post);
        $loc = $route === '/' ? $base . '/' : $base . $route;
        if (isset($seen[$loc])) {
            continue;
        }
        $seen[$loc] = true;

        $rows[] = [
            'loc' => $loc,
            'lastmod' => (string) get_post_modified_time('c', true, $post),
        ];
    }

    // Add static React-only routes to the pages sitemap.
    if ($slug === 'page') {
        foreach (headless_core_sitemap_static_routes() as $route) {
            $loc = $route === '/' ? $base . '/' : $base . $route;
            if (isset($seen[$loc])) {
                continue;
            }
            $seen[$loc] = true;
            $rows[] = ['loc' => $loc, 'lastmod' => ''];
        }
    }

    return $rows;
}

/**
 * Whether a post should appear in the sitemap (respects the SEO noindex flag).
 */
function headless_core_sitemap_is_indexable(int $postId): bool
{
    return ! (bool) get_post_meta($postId, '_hc_seo_noindex', true);
}

/* -------------------------------------------------------------------------
 * robots.txt
 * ---------------------------------------------------------------------- */

add_filter('robots_txt', static function ($output, $public): string {
    $base = headless_core_seo_frontend_base();

    $isProduction = ! defined('WP_ENV') || WP_ENV === 'production';

    if (! $public || ! $isProduction) {
        // Staging / non-public: keep everything out of the index.
        return "User-agent: *\nDisallow: /\n";
    }

    $lines = [
        'User-agent: *',
        'Disallow: /wp-admin/',
        'Allow: /wp-admin/admin-ajax.php',
        'Disallow: /wp-json/',
        'Disallow: /wp/wp-admin/',
        '',
        'Sitemap: ' . $base . '/sitemap.xml',
        '',
    ];

    return implode("\n", $lines);
}, 10, 2);

// Note: sitemap transients are keyed by a combined cache signature built from
// the per-type cache version options, which are bumped on every content save
// (see cache.php). Saving content therefore invalidates the cached sitemap
// automatically; no extra busting hook is required.
