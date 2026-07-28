<?php

/**
 * Server-side SEO head injection for the React SPA shell.
 *
 * The frontend is a client-rendered SPA, so crawlers that do not execute
 * JavaScript (Facebook, WhatsApp, LinkedIn, X, and — less reliably — Google)
 * only ever see the static index.html <head>. This module resolves the SEO
 * object for the requested route (reusing headless_core_build_seo()) and
 * injects <title>, meta, canonical, Open Graph, Twitter, and JSON-LD into the
 * shell's <head> *before* it is sent.
 *
 * It is consumed by the physical entry point web/app.php, which the SPA
 * catch-all in .htaccess routes page requests through. The tags use the same
 * identifiers the client-side usePageSeo hook targets, so React updates them
 * in place on hydration (no duplicates).
 *
 * Everything here is best-effort: callers must fall back to the raw shell on
 * any failure so SEO can never take the site down.
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Public frontend path for the current request.
 *
 * After Apache internally rewrites /about-us → /app.php, REQUEST_URI is often
 * /app.php on cPanel/shared hosts. REDIRECT_URL / REDIRECT_HC_ROUTE hold the
 * original path — use those first so SEO resolves the correct page.
 */
function headless_core_seo_request_path(): string
{
    $candidates = [];

    foreach (['REDIRECT_HC_ROUTE', 'HC_ROUTE', 'REDIRECT_URL', 'REQUEST_URI'] as $key) {
        if (! empty($_SERVER[$key]) && is_string($_SERVER[$key])) {
            $candidates[] = $_SERVER[$key];
        }
    }

    foreach ($candidates as $uri) {
        $path = (string) parse_url($uri, PHP_URL_PATH);
        $path = '/' . trim($path, '/');
        if ($path === '/app.php' || $path === '') {
            continue;
        }

        return $path === '' ? '/' : $path;
    }

    return '/';
}

/**
 * Map a public frontend route to the WordPress post that backs it.
 */
function headless_core_seo_resolve_post_by_route(string $path): ?WP_Post
{
    $path = (string) parse_url($path, PHP_URL_PATH);
    $path = '/' . trim($path, '/');

    if ($path === '/') {
        $home = headless_core_resolve_page('');

        return $home instanceof WP_Post ? $home : null;
    }

    $segments = array_values(array_filter(explode('/', $path), static function ($s): bool {
        return $s !== '';
    }));

    if ($segments === []) {
        return null;
    }

    $cptMap = [
        'savings-products' => 'savings_product',
        'loan-products' => 'loan_product',
        'services' => 'service',
        'events' => 'event',
        'news' => 'post',
        'team' => 'team_member',
    ];

    // Detail routes: /<prefix>/<slug> → CPT single.
    if (count($segments) >= 2 && isset($cptMap[$segments[0]])) {
        $slug = $segments[count($segments) - 1];
        $post = get_page_by_path($slug, OBJECT, $cptMap[$segments[0]]);
        if ($post instanceof WP_Post && $post->post_status === 'publish') {
            return $post;
        }
        // Fall through: some nested pages live under these prefixes too.
    }

    // Anything else is treated as a page (supports nested URIs).
    $page = headless_core_resolve_page(ltrim($path, '/'));
    if ($page instanceof WP_Post && $page->post_status === 'publish') {
        return $page;
    }

    return null;
}

/**
 * Render the SEO object as a block of <head> HTML.
 *
 * @param array<string, mixed> $seo
 */
function headless_core_seo_head_html(array $seo): string
{
    $og = is_array($seo['og'] ?? null) ? $seo['og'] : [];
    $twitter = is_array($seo['twitter'] ?? null) ? $seo['twitter'] : [];
    $robots = is_array($seo['robots'] ?? null) ? $seo['robots'] : [];

    $lines = [];

    if (! empty($seo['title'])) {
        $lines[] = '<title>' . esc_html((string) $seo['title']) . '</title>';
    }
    if (! empty($seo['description'])) {
        $lines[] = '<meta name="description" content="' . esc_attr((string) $seo['description']) . '" />';
    }
    if (! empty($robots['raw'])) {
        $lines[] = '<meta name="robots" content="' . esc_attr((string) $robots['raw']) . '" />';
    }
    if (! empty($seo['canonical'])) {
        $lines[] = '<link rel="canonical" href="' . esc_url((string) $seo['canonical']) . '" />';
    }

    $ogPairs = [
        'og:type' => $og['type'] ?? '',
        'og:title' => $og['title'] ?? ($seo['title'] ?? ''),
        'og:description' => $og['description'] ?? ($seo['description'] ?? ''),
        'og:image' => $og['image'] ?? '',
        'og:url' => $og['url'] ?? ($seo['canonical'] ?? ''),
        'og:site_name' => $og['siteName'] ?? '',
        'og:locale' => $og['locale'] ?? '',
    ];
    foreach ($ogPairs as $property => $value) {
        $value = (string) $value;
        if ($value === '') {
            continue;
        }
        $content = $property === 'og:image' || $property === 'og:url'
            ? esc_url($value)
            : esc_attr($value);
        $lines[] = '<meta property="' . $property . '" content="' . $content . '" />';
    }

    $twitterPairs = [
        'twitter:card' => $twitter['card'] ?? '',
        'twitter:title' => $twitter['title'] ?? '',
        'twitter:description' => $twitter['description'] ?? '',
        'twitter:image' => $twitter['image'] ?? '',
        'twitter:site' => $twitter['site'] ?? '',
    ];
    foreach ($twitterPairs as $name => $value) {
        $value = (string) $value;
        if ($value === '') {
            continue;
        }
        $content = $name === 'twitter:image' ? esc_url($value) : esc_attr($value);
        $lines[] = '<meta name="' . $name . '" content="' . $content . '" />';
    }

    if (! empty($seo['schema']) && is_array($seo['schema'])) {
        $json = wp_json_encode($seo['schema'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (is_string($json) && $json !== '') {
            // Prevent a stray </script> inside the JSON from closing the tag.
            $json = str_replace('</', '<\/', $json);
            $lines[] = '<script type="application/ld+json" id="hc-seo-jsonld">' . $json . '</script>';
        }
    }

    return implode("\n    ", $lines);
}

/**
 * Build (and cache) the <head> HTML for a given frontend route.
 */
function headless_core_seo_head_for_path(string $path): string
{
    $post = headless_core_seo_resolve_post_by_route($path);
    if (! $post instanceof WP_Post) {
        return '';
    }

    $optsSignature = md5(serialize([
        get_option(HEADLESS_CORE_SEO_OPT_SITE_NAME, ''),
        get_option(HEADLESS_CORE_SEO_OPT_TITLE_TEMPLATE, ''),
        get_option(HEADLESS_CORE_SEO_OPT_SEPARATOR, ''),
        get_option(HEADLESS_CORE_SEO_OPT_DEFAULT_DESCRIPTION, ''),
        get_option(HEADLESS_CORE_SEO_OPT_DEFAULT_OG_IMAGE, 0),
        get_option(HEADLESS_CORE_SEO_OPT_TWITTER_SITE, ''),
        get_option(HEADLESS_CORE_SEO_OPT_FRONTEND_URL, ''),
        get_option(HEADLESS_CORE_SEO_OPT_ORG_NAME, ''),
        get_option(HEADLESS_CORE_SEO_OPT_ORG_LOGO, 0),
        get_option(HEADLESS_CORE_SEO_OPT_ORG_SAME_AS, ''),
    ]));

    $cacheKey = 'hc_seo_head_' . md5($post->ID . '|' . (string) $post->post_modified_gmt . '|' . $optsSignature);
    $cached = get_transient($cacheKey);
    if (is_string($cached)) {
        return $cached;
    }

    $blocks = [];
    if (function_exists('headless_core_normalize_blocks')) {
        $parsed = parse_blocks((string) $post->post_content);
        $blocks = headless_core_normalize_blocks($parsed);
    }

    $seo = headless_core_build_seo($post, $blocks);
    $head = headless_core_seo_head_html($seo);

    set_transient($cacheKey, $head, DAY_IN_SECONDS);

    return $head;
}

/**
 * Inject a block of <head> HTML into the SPA shell just before </head>,
 * removing the shell's placeholder <title> so it is not duplicated.
 */
function headless_core_seo_inject_head(string $html, string $headHtml): string
{
    if ($headHtml === '') {
        return $html;
    }

    $pos = stripos($html, '</head>');
    if ($pos === false) {
        return $html;
    }

    // Drop the static placeholder title (only within the head).
    $head = substr($html, 0, $pos);
    $rest = substr($html, $pos);
    $head = preg_replace('#<title>.*?</title>#is', '', $head, 1) ?? $head;

    $marker = "\n    <!-- headless-core SEO -->\n    " . $headHtml . "\n    <!-- /headless-core SEO -->\n  ";

    return $head . $marker . $rest;
}

/**
 * Public entry used by web/app.php: return the shell with SEO tags injected
 * for the given route. Always returns a usable HTML string.
 */
function headless_core_seo_render_shell(string $path, string $shell): string
{
    try {
        $head = headless_core_seo_head_for_path($path);

        return headless_core_seo_inject_head($shell, $head);
    } catch (\Throwable $e) {
        return $shell;
    }
}
