<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Display titles and descriptions for headless Gutenberg blocks.
 * Block slugs (custom/*) are unchanged — only editor/inserter labels are generalized.
 *
 * @return array<string, array{title: string, description?: string, keywords?: list<string>}>
 */
function headless_core_block_labels(): array
{
    return [
        'custom/hero' => [
            'title' => 'Simple hero',
            'description' => 'Title and subtitle hero for any page.',
            'keywords' => ['hero', 'banner', 'title', 'intro'],
        ],
        'custom/home-banner-slider' => [
            'title' => 'Hero slider',
            'description' => 'Full-width image slider with dots and arrows.',
            'keywords' => ['banner', 'hero', 'slider', 'carousel', 'image'],
        ],
        'custom/mission-vision' => [
            'title' => 'Mission & values',
            'description' => 'Mission, vision, purpose, and core values cards.',
            'keywords' => ['mission', 'vision', 'values', 'about'],
        ],
        'custom/about-us-stats' => [
            'title' => 'Stats grid',
            'description' => 'Animated statistics with icons.',
            'keywords' => ['stats', 'numbers', 'metrics', 'grid'],
        ],
        'custom/home-stats' => [
            'title' => 'Stats section',
            'description' => 'Statistics row with icons and labels.',
            'keywords' => ['stats', 'numbers', 'metrics', 'section'],
        ],
        'custom/about-us-awards' => [
            'title' => 'Awards section',
            'description' => 'Awards and recognition display.',
            'keywords' => ['awards', 'recognition', 'achievements'],
        ],
        'custom/about-us-help' => [
            'title' => 'Help CTA cards',
            'description' => 'Help cards with links and contact actions.',
            'keywords' => ['help', 'cta', 'cards', 'contact'],
        ],
        'custom/home-about' => [
            'title' => 'Intro section',
            'description' => 'Badge, body text, and read-more link.',
            'keywords' => ['intro', 'about', 'badge', 'read more'],
        ],
        'custom/help-section' => [
            'title' => 'Help section',
            'description' => 'Help cards with optional scroll CTA.',
            'keywords' => ['help', 'cards', 'support', 'cta'],
        ],
        'custom/home-product-cards' => [
            'title' => 'Product cards',
            'description' => 'Product card grid with images and links.',
            'keywords' => ['products', 'cards', 'grid', 'links'],
        ],
        'custom/product-services' => [
            'title' => 'Products & services',
            'description' => 'Tabbed products and services section.',
            'keywords' => ['products', 'services', 'tabs', 'dropdown'],
        ],
        'custom/savings-archive-hero' => [
            'title' => 'Page hero',
            'description' => 'Hero with menu, buttons, and background.',
            'keywords' => ['hero', 'banner', 'menu', 'buttons', 'page'],
        ],
        'custom/savings-why-save' => [
            'title' => 'Feature points',
            'description' => 'Section heading with icon feature points.',
            'keywords' => ['features', 'points', 'benefits', 'why'],
        ],
        'custom/membership-content' => [
            'title' => 'Content section',
            'description' => 'Points, paragraphs, and comparison table.',
            'keywords' => ['content', 'table', 'points', 'membership'],
        ],
        'custom/registration-links' => [
            'title' => 'Registration links',
            'description' => 'Registration link cards for members.',
            'keywords' => ['registration', 'links', 'members', 'signup'],
        ],
        'custom/download-app' => [
            'title' => 'App download',
            'description' => 'App store download buttons.',
            'keywords' => ['app', 'download', 'mobile', 'store'],
        ],
        'custom/mobile-app-section' => [
            'title' => 'Mobile app section',
            'description' => 'Mobile app promo with gradient and CTA.',
            'keywords' => ['mobile', 'app', 'promo', 'section'],
        ],
        'custom/newsletter-section' => [
            'title' => 'Newsletter',
            'description' => 'Newsletter signup section.',
            'keywords' => ['newsletter', 'subscribe', 'email'],
        ],
        'custom/partners-carousel' => [
            'title' => 'Partners carousel',
            'description' => 'Partner logos carousel.',
            'keywords' => ['partners', 'logos', 'carousel', 'sponsors'],
        ],
        'custom/events-section' => [
            'title' => 'Events banner',
            'description' => 'Events section banner with gradient and scroll CTA.',
            'keywords' => ['events', 'banner', 'section'],
        ],
        'custom/member-reviews' => [
            'title' => 'Reviews section',
            'description' => 'Member reviews carousel with banner.',
            'keywords' => ['reviews', 'testimonials', 'carousel', 'members'],
        ],
        'custom/savings-products-grid' => [
            'title' => 'Savings products grid',
            'description' => 'Grid of savings products from the catalog.',
            'keywords' => ['savings', 'products', 'grid'],
        ],
        'custom/asset-finance-whatever' => [
            'title' => 'CTA banner',
            'description' => 'Call-to-action banner with button.',
            'keywords' => ['cta', 'banner', 'button', 'promo'],
        ],
        'custom/asset-finance-faq' => [
            'title' => 'FAQ accordion',
            'description' => 'Expandable FAQ accordion section.',
            'keywords' => ['faq', 'questions', 'accordion'],
        ],
        'custom/asset-finance-apply' => [
            'title' => 'Application form',
            'description' => 'Loan or product application form.',
            'keywords' => ['form', 'apply', 'application'],
        ],
        'custom/contact-form' => [
            'title' => 'Contact form',
            'description' => 'Contact form with spam protection.',
            'keywords' => ['contact', 'form', 'message'],
        ],
        'custom/new-member-registration' => [
            'title' => 'Registration form',
            'description' => 'New member registration form.',
            'keywords' => ['registration', 'form', 'members', 'signup'],
        ],
        'custom/contact-map' => [
            'title' => 'Contact map',
            'description' => 'Map with location and contact details.',
            'keywords' => ['map', 'location', 'contact'],
        ],
        'custom/loan-products-grid' => [
            'title' => 'Loan products grid',
            'description' => 'Grid of loan products from the catalog.',
            'keywords' => ['loans', 'products', 'grid'],
        ],
        'custom/services-grid' => [
            'title' => 'Services grid',
            'description' => 'Grid of services from the catalog.',
            'keywords' => ['services', 'grid'],
        ],
        'custom/events-grid' => [
            'title' => 'Events grid',
            'description' => 'Grid of upcoming events.',
            'keywords' => ['events', 'grid'],
        ],
        'custom/events-archive' => [
            'title' => 'Events archive',
            'description' => 'Paginated events listing.',
            'keywords' => ['events', 'archive', 'list'],
        ],
        'custom/news-grid' => [
            'title' => 'News grid',
            'description' => 'Grid of news posts.',
            'keywords' => ['news', 'grid', 'posts'],
        ],
        'custom/youtube-grid' => [
            'title' => 'YouTube grid',
            'description' => 'YouTube videos grid from a channel.',
            'keywords' => ['youtube', 'videos', 'grid'],
        ],
        'custom/downloads-grid' => [
            'title' => 'Downloads grid',
            'description' => 'Downloadable files grid.',
            'keywords' => ['downloads', 'files', 'grid'],
        ],
        'custom/faq-section' => [
            'title' => 'FAQ section',
            'description' => 'FAQ section with categories.',
            'keywords' => ['faq', 'questions', 'section'],
        ],
        'custom/privacy-policy' => [
            'title' => 'Privacy policy',
            'description' => 'Privacy policy content builder.',
            'keywords' => ['privacy', 'policy', 'legal'],
        ],
        'custom/cookie-policy' => [
            'title' => 'Cookie policy',
            'description' => 'Cookie policy content builder.',
            'keywords' => ['cookie', 'policy', 'legal'],
        ],
        'custom/loans-carousel' => [
            'title' => 'Loans carousel',
            'description' => 'Carousel of loan products.',
            'keywords' => ['loans', 'carousel', 'products'],
        ],
        'custom/events-carousel' => [
            'title' => 'Events carousel',
            'description' => 'Carousel of events.',
            'keywords' => ['events', 'carousel'],
        ],
        'custom/savings-carousel' => [
            'title' => 'Savings carousel',
            'description' => 'Carousel of savings products.',
            'keywords' => ['savings', 'carousel', 'products'],
        ],
        'custom/services-carousel' => [
            'title' => 'Services carousel',
            'description' => 'Carousel of services.',
            'keywords' => ['services', 'carousel'],
        ],
        'custom/footer-contact' => [
            'title' => 'Footer contact',
            'description' => 'Footer contact details block.',
            'keywords' => ['footer', 'contact'],
        ],
        'custom/footer-branches' => [
            'title' => 'Footer branches',
            'description' => 'Footer branch network list.',
            'keywords' => ['footer', 'branches', 'locations'],
        ],
        'custom/footer-app-links' => [
            'title' => 'Footer app links',
            'description' => 'Footer mobile app download links.',
            'keywords' => ['footer', 'app', 'download'],
        ],
        'custom/footer-socials' => [
            'title' => 'Footer social links',
            'description' => 'Footer social media links.',
            'keywords' => ['footer', 'social', 'links'],
        ],
        'custom/footer-hours' => [
            'title' => 'Footer hours',
            'description' => 'Footer opening hours.',
            'keywords' => ['footer', 'hours', 'schedule'],
        ],
        'custom/footer-bottom' => [
            'title' => 'Footer bottom',
            'description' => 'Footer copyright and bottom links.',
            'keywords' => ['footer', 'copyright', 'bottom'],
        ],
        'custom/header-topbar' => [
            'title' => 'Header top bar',
            'description' => 'Top bar with contact info and links.',
            'keywords' => ['header', 'top bar', 'contact'],
        ],
        'custom/header-main' => [
            'title' => 'Header main',
            'description' => 'Main header with logo and navigation.',
            'keywords' => ['header', 'logo', 'navigation'],
        ],
        'custom/team-display' => [
            'title' => 'Team display',
            'description' => 'Team members grid by category.',
            'keywords' => ['team', 'staff', 'people', 'grid'],
        ],
    ];
}

/**
 * @return array<string, array{title: string, description?: string, keywords?: list<string>}>
 */
function headless_core_block_labels_for_js(): array
{
    $out = [];

    foreach (headless_core_block_labels() as $name => $entry) {
        $row = [
            'title' => __($entry['title'], 'headless-core'),
        ];
        if (! empty($entry['description'])) {
            $row['description'] = __($entry['description'], 'headless-core');
        }
        if (! empty($entry['keywords'])) {
            $row['keywords'] = $entry['keywords'];
        }
        $out[$name] = $row;
    }

    return $out;
}

add_filter('register_block_type_args', static function (array $args, string $block_name): array {
    $labels = headless_core_block_labels();
    if (! isset($labels[$block_name])) {
        return $args;
    }

    $entry = $labels[$block_name];
    $args['title'] = __($entry['title'], 'headless-core');

    if (! empty($entry['description'])) {
        $args['description'] = __($entry['description'], 'headless-core');
    }
    if (! empty($entry['keywords'])) {
        $args['keywords'] = $entry['keywords'];
    }

    return $args;
}, 10, 2);
