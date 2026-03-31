<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('init', static function (): void {
    wp_register_script(
        'headless-custom-hero-editor',
        HEADLESS_CORE_URL . 'blocks/hero/hero-editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );

    wp_register_script(
        'headless-custom-home-banner-slider-editor',
        HEADLESS_CORE_URL . 'blocks/home-banner-slider/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );

    wp_register_script(
        'headless-custom-mission-vision-editor',
        HEADLESS_CORE_URL . 'blocks/mission-vision/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-about-us-stats-editor',
        HEADLESS_CORE_URL . 'blocks/about-us-stats/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-home-stats-editor',
        HEADLESS_CORE_URL . 'blocks/home-stats/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-about-us-awards-editor',
        HEADLESS_CORE_URL . 'blocks/about-us-awards/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-about-us-help-editor',
        HEADLESS_CORE_URL . 'blocks/about-us-help/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-home-about-editor',
        HEADLESS_CORE_URL . 'blocks/home-about/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-help-section-editor',
        HEADLESS_CORE_URL . 'blocks/help-section/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-home-product-cards-editor',
        HEADLESS_CORE_URL . 'blocks/home-product-cards/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-product-services-editor',
        HEADLESS_CORE_URL . 'blocks/product-services/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );

    wp_register_script(
        'headless-custom-header-topbar-editor',
        HEADLESS_CORE_URL . 'blocks/header-topbar/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );

    wp_register_script(
        'headless-custom-header-main-editor',
        HEADLESS_CORE_URL . 'blocks/header-main/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-savings-archive-hero-editor',
        HEADLESS_CORE_URL . 'blocks/savings-archive-hero/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-savings-why-save-editor',
        HEADLESS_CORE_URL . 'blocks/savings-why-save/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-membership-content-editor',
        HEADLESS_CORE_URL . 'blocks/membership-content/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-download-app-editor',
        HEADLESS_CORE_URL . 'blocks/download-app/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-mobile-app-section-editor',
        HEADLESS_CORE_URL . 'blocks/mobile-app-section/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-newsletter-section-editor',
        HEADLESS_CORE_URL . 'blocks/newsletter-section/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-partners-carousel-editor',
        HEADLESS_CORE_URL . 'blocks/partners-carousel/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-events-section-editor',
        HEADLESS_CORE_URL . 'blocks/events-section/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-member-reviews-editor',
        HEADLESS_CORE_URL . 'blocks/member-reviews/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-savings-products-grid-editor',
        HEADLESS_CORE_URL . 'blocks/savings-products-grid/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-asset-finance-whatever-editor',
        HEADLESS_CORE_URL . 'blocks/asset-finance-whatever/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-asset-finance-faq-editor',
        HEADLESS_CORE_URL . 'blocks/asset-finance-faq/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-asset-finance-apply-editor',
        HEADLESS_CORE_URL . 'blocks/asset-finance-apply/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-contact-form-editor',
        HEADLESS_CORE_URL . 'blocks/contact-form/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-contact-map-editor',
        HEADLESS_CORE_URL . 'blocks/contact-map/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-loan-products-grid-editor',
        HEADLESS_CORE_URL . 'blocks/loan-products-grid/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n', 'wp-components', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-loans-carousel-editor',
        HEADLESS_CORE_URL . 'blocks/loans-carousel/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n', 'wp-components', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-events-carousel-editor',
        HEADLESS_CORE_URL . 'blocks/events-carousel/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n', 'wp-components', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-savings-carousel-editor',
        HEADLESS_CORE_URL . 'blocks/savings-carousel/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n', 'wp-components', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-services-carousel-editor',
        HEADLESS_CORE_URL . 'blocks/services-carousel/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n', 'wp-components', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-services-grid-editor',
        HEADLESS_CORE_URL . 'blocks/services-grid/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n', 'wp-components', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-events-grid-editor',
        HEADLESS_CORE_URL . 'blocks/events-grid/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n', 'wp-components', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-footer-contact-editor',
        HEADLESS_CORE_URL . 'blocks/footer-contact/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-footer-branches-editor',
        HEADLESS_CORE_URL . 'blocks/footer-branches/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-footer-app-links-editor',
        HEADLESS_CORE_URL . 'blocks/footer-app-links/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-footer-socials-editor',
        HEADLESS_CORE_URL . 'blocks/footer-socials/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-footer-hours-editor',
        HEADLESS_CORE_URL . 'blocks/footer-hours/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n'],
        HEADLESS_CORE_VERSION,
        true
    );
    wp_register_script(
        'headless-custom-footer-bottom-editor',
        HEADLESS_CORE_URL . 'blocks/footer-bottom/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n', 'wp-data', 'wp-core-data'],
        HEADLESS_CORE_VERSION,
        true
    );

    register_block_type('custom/hero', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-hero-editor',
        'attributes' => [
            'title' => [
                'type' => 'string',
                'default' => '',
            ],
            'subtitle' => [
                'type' => 'string',
                'default' => '',
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/home-banner-slider', [
        'api_version' => 3,
        'title' => __('Home banner slider', 'headless-core'),
        'category' => 'widgets',
        'icon' => 'slides',
        'description' => __('Full-width image hero with slides, dots, and arrows.', 'headless-core'),
        'keywords' => ['banner', 'hero', 'slider', 'carousel', 'home', 'image'],
        'editor_script' => 'headless-custom-home-banner-slider-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'hero'],
            'heroBg' => ['type' => 'string', 'default' => '#1BB5B5'],
            'dotBarBg' => ['type' => 'string', 'default' => '#22acb6'],
            'arrowBg' => ['type' => 'string', 'default' => 'rgba(255,255,255,0.8)'],
            'arrowIconColor' => ['type' => 'string', 'default' => '#1BB5B5'],
            'transitionMs' => ['type' => 'number', 'default' => 700],
            'slides' => [
                'type' => 'array',
                'default' => [
                    [
                        'imageId' => 0,
                        'imageUrl' => '',
                        'alt' => '',
                        'embedHtml' => '',
                    ],
                ],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/mission-vision', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-mission-vision-editor',
        'attributes' => [
            'items' => [
                'type' => 'array',
                'default' => [
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
                        'values' => [
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
                        ],
                    ],
                ],
            ],
            // Legacy shape kept for backward compatibility and migration.
            'values' => ['type' => 'array', 'default' => []],
            'coreValuesTitle' => ['type' => 'string', 'default' => 'Our Core Values'],
            'coreValuesImageId' => ['type' => 'number', 'default' => 0],
            // Legacy attributes (kept for backward compatibility with existing serialized blocks).
            'visionTitle' => ['type' => 'string', 'default' => 'Our Vision'],
            'visionText' => ['type' => 'string', 'default' => ''],
            'visionImageId' => ['type' => 'number', 'default' => 0],
            'missionTitle' => ['type' => 'string', 'default' => 'Our Mission'],
            'missionText' => ['type' => 'string', 'default' => ''],
            'missionImageId' => ['type' => 'number', 'default' => 0],
            'purposeTitle' => ['type' => 'string', 'default' => 'Our Purpose'],
            'purposeText' => ['type' => 'string', 'default' => ''],
            'purposeImageId' => ['type' => 'number', 'default' => 0],
            'coreValues' => [
                'type' => 'array',
                'default' => [],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/about-us-stats', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-about-us-stats-editor',
        'attributes' => [
            'items' => [
                'type' => 'array',
                'default' => [
                    ['number' => '15', 'title' => 'AWARDS IN 2025', 'subtitle' => 'We are leading by example', 'iconId' => 0],
                    ['number' => '26', 'title' => 'PRODUCTS OFFERED', 'subtitle' => 'Products that fit your needs', 'iconId' => 0],
                    ['number' => '10,000+', 'title' => 'REGISTERED MEMBERS', 'subtitle' => 'A growing membership base.', 'iconId' => 0],
                ],
            ],
            'iconWidth' => ['type' => 'number', 'default' => 107],
            'iconHeight' => ['type' => 'number', 'default' => 58],
            'iconColor' => ['type' => 'string', 'default' => '#40C9BF'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/home-stats', [
        'api_version' => 3,
        'title' => __('Home stats', 'headless-core'),
        'category' => 'widgets',
        'icon' => 'chart-area',
        'description' => __('Animated stat counters with optional icons (runs when visible).', 'headless-core'),
        'keywords' => ['stats', 'counter', 'numbers', 'home', 'metrics'],
        'editor_script' => 'headless-custom-home-stats-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'stats'],
            'animationDurationSec' => ['type' => 'number', 'default' => 2.5],
            'sectionBg' => ['type' => 'string', 'default' => '#22acb6'],
            'numberColor' => ['type' => 'string', 'default' => '#ffffff'],
            'titleColor' => ['type' => 'string', 'default' => '#ffffff'],
            'subtitleColor' => ['type' => 'string', 'default' => '#ffffff'],
            'iconColor' => ['type' => 'string', 'default' => '#ffffff'],
            'iconWidth' => ['type' => 'number', 'default' => 107],
            'iconHeight' => ['type' => 'number', 'default' => 58],
            'items' => [
                'type' => 'array',
                'default' => [
                    [
                        'valueStart' => 0,
                        'valueEnd' => 15,
                        'showPlus' => false,
                        'title' => 'AWARDS IN 2025',
                        'subtitle' => 'We are leading by example',
                        'iconId' => 0,
                    ],
                    [
                        'valueStart' => 0,
                        'valueEnd' => 26,
                        'showPlus' => false,
                        'title' => 'PRODUCTS OFFERED',
                        'subtitle' => 'Products that fit your needs',
                        'iconId' => 0,
                    ],
                    [
                        'valueStart' => 0,
                        'valueEnd' => 10000,
                        'showPlus' => true,
                        'title' => 'REGISTERED MEMBERS',
                        'subtitle' => 'A growing membership base.',
                        'iconId' => 0,
                    ],
                ],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/about-us-awards', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-about-us-awards-editor',
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Awards'],
            'items' => [
                'type' => 'array',
                'default' => [
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
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/about-us-help', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-about-us-help-editor',
        'attributes' => [
            'headerText' => ['type' => 'string', 'default' => 'WE ARE HERE TO HELP YOU'],
            'ctaText' => ['type' => 'string', 'default' => 'TALK TO US!'],
            'items' => [
                'type' => 'array',
                'default' => [
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
            ],
            'iconColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'linkSvgColor' => ['type' => 'string', 'default' => '#22ACB6'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/home-about', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-home-about-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'about'],
            'barBgColor' => ['type' => 'string', 'default' => '#22acb6'],
            'buttonBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'buttonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'badgeText' => ['type' => 'string', 'default' => 'ABOUT US'],
            'bodyText' => ['type' => 'string', 'default' => 'Ports DT Sacco, your trusted financial partner since 1966, is a Tier 1 licensed deposit-taking Sacco regulated by the Sacco Society Regulatory Authority (SASRA)...'],
            'bodyTextColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'readMoreLabel' => ['type' => 'string', 'default' => 'READ MORE'],
            'readMoreUrl' => ['type' => 'string', 'default' => '/about-us'],
            'readMoreTextColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'readMoreHoverColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'readMoreCircleColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'scrollButtonBg' => ['type' => 'string', 'default' => '#22ACB6'],
            'scrollButtonArrow' => ['type' => 'string', 'default' => '#ffffff'],
            'curvedRectColor' => ['type' => 'string', 'default' => '#ffffff'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/help-section', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-help-section-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'help'],
            'sectionBgColor' => ['type' => 'string', 'default' => '#00AFBB'],
            'topBarBg' => ['type' => 'string', 'default' => '#FFFFFF'],
            'waveAccentColor' => ['type' => 'string', 'default' => '#00AFBB'],
            'scrollOuterColor' => ['type' => 'string', 'default' => '#ffffff'],
            'scrollInnerColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'kickerHtml' => ['type' => 'string', 'default' => '<p>WE ARE HERE TO HELP YOU</p>'],
            'kickerColor' => ['type' => 'string', 'default' => '#ffffff'],
            'talkButtonHtml' => ['type' => 'string', 'default' => 'TALK TO US!'],
            'talkButtonBg' => ['type' => 'string', 'default' => '#EE6E2A'],
            'talkButtonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'cardIconColor' => ['type' => 'string', 'default' => '#22acb6'],
            'cardIconHoverColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'cardBgHoverColor' => ['type' => 'string', 'default' => '#f0fdfa'],
            'titleHeadingColor' => ['type' => 'string', 'default' => '#808080'],
            'bodyTextColor' => ['type' => 'string', 'default' => '#000000'],
            'metaTextColor' => ['type' => 'string', 'default' => '#808080'],
            'ctaTextColor' => ['type' => 'string', 'default' => '#808080'],
            'cardChevronBg' => ['type' => 'string', 'default' => '#ffffff'],
            'cardChevronBgHover' => ['type' => 'string', 'default' => '#ffffff'],
            'cardChevronIconColor' => ['type' => 'string', 'default' => '#22acb6'],
            'cardChevronIconHoverColor' => ['type' => 'string', 'default' => '#ee6e2a'],
            'cards' => [
                'type' => 'array',
                'default' => [
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
                ],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/home-product-cards', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-home-product-cards-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'products'],
            'sectionBgColor' => ['type' => 'string', 'default' => '#F5F4EE'],
            'topCurveBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'topCurveCutoutColor' => ['type' => 'string', 'default' => '#F5F4EE'],
            'badgeText' => ['type' => 'string', 'default' => 'EXPLORE'],
            'badgeBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'badgeTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'kickerText' => ['type' => 'string', 'default' => 'EXPLORE OUR WIDE RANGE OF PRODUCTS AND SERVICES.'],
            'kickerColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'cardTagBarColor' => ['type' => 'string', 'default' => '#F06E2A'],
            'cardTagTextColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'cardTitleColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'cardTitleHoverColor' => ['type' => 'string', 'default' => '#ee6e2a'],
            'cardTextColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'arrowBgColor' => ['type' => 'string', 'default' => '#82cdcb'],
            'arrowHoverBgColor' => ['type' => 'string', 'default' => '#ee6e2a'],
            'arrowColor' => ['type' => 'string', 'default' => '#ffffff'],
            'cardBorderColor' => ['type' => 'string', 'default' => '#e8e8e8'],
            'cardHoverBorderColor' => ['type' => 'string', 'default' => '#cfeeed'],
            'imageBgFrom' => ['type' => 'string', 'default' => '#00B2E0'],
            'imageBgTo' => ['type' => 'string', 'default' => '#00AB81'],
            'cards' => [
                'type' => 'array',
                'default' => [
                    [
                        'imageId' => 0,
                        'imageUrl' => '',
                        'imageBgFrom' => '',
                        'imageBgTo' => '',
                        'title' => 'Join Us',
                        'description' => 'Join Ports Sacco today and get all your financial needs under one roof!',
                        'tag' => 'BECOME A MEMBER TODAY',
                        'href' => '#',
                    ],
                    [
                        'imageId' => 0,
                        'imageUrl' => '',
                        'imageBgFrom' => '',
                        'imageBgTo' => '',
                        'title' => 'SecureYour Future',
                        'description' => 'Maximize your savings with attractive interest rates and peace of mind.',
                        'tag' => 'SAVE & INVEST WITH US',
                        'href' => '#',
                    ],
                    [
                        'imageId' => 0,
                        'imageUrl' => '',
                        'imageBgFrom' => '',
                        'imageBgTo' => '',
                        'title' => 'Flexible Loan Options',
                        'description' => 'Get flexible loan options tailored to your needs and goals.',
                        'tag' => 'GET A LOAN FROM US',
                        'href' => '#',
                    ],
                ],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/product-services', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-product-services-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'services'],
            'gradientAngle' => ['type' => 'number', 'default' => 90],
            'gradientFrom' => ['type' => 'string', 'default' => '#00B2E0'],
            'gradientVia' => ['type' => 'string', 'default' => '#00AFBB'],
            'gradientTo' => ['type' => 'string', 'default' => '#00AB81'],
            'topBarBg' => ['type' => 'string', 'default' => '#F5F4EE'],
            'topCurveRectFill' => ['type' => 'string', 'default' => '#00AFBB'],
            'topCurvePathFill' => ['type' => 'string', 'default' => '#F5F4EE'],
            'kickerText' => ['type' => 'string', 'default' => 'YOUR JOURNEY OF PROSPERITY START HERE!'],
            'kickerColor' => ['type' => 'string', 'default' => '#ffffff'],
            'centerPillText' => ['type' => 'string', 'default' => 'HOW CAN WE UPLIFT YOU TODAY?'],
            'centerPillBg' => ['type' => 'string', 'default' => '#EE6E2A'],
            'centerPillHoverBg' => ['type' => 'string', 'default' => '#d96525'],
            'centerPillTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'scrollArrowOuterFill' => ['type' => 'string', 'default' => '#ffffff'],
            'scrollArrowInnerFill' => ['type' => 'string', 'default' => '#22ACB6'],
            'boxBg' => ['type' => 'string', 'default' => '#ffffff'],
            'boxTitle' => ['type' => 'string', 'default' => 'PRODUCTS & SERVICES THAT UPLIFT YOUR FINANCIAL SUCCESS!'],
            'boxSubtitle' => ['type' => 'string', 'default' => 'SELECT THE PRODUCT OR SERVICE YOU NEED'],
            'boxTitleColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'boxSubtitleColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'dropdownPlaceholder' => ['type' => 'string', 'default' => 'How can we uplift you today?'],
            'dropdownItems' => ['type' => 'array', 'default' => []],
            'dropdownBg' => ['type' => 'string', 'default' => '#38f0ba'],
            'dropdownBorderColor' => ['type' => 'string', 'default' => '#e8e8e8'],
            'dropdownTextColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'dropdownChevronColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'goButtonBg' => ['type' => 'string', 'default' => '#38f0ba'],
            'goButtonBorderColor' => ['type' => 'string', 'default' => '#e8e8e8'],
            'goButtonIconColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'goButtonHoverOpacity' => ['type' => 'number', 'default' => 0.85],
            'dividerColor' => ['type' => 'string', 'default' => '#e8e8e8'],
            'productButtons' => ['type' => 'array', 'default' => []],
            'pillBg' => ['type' => 'string', 'default' => '#00ada0'],
            'pillBorderColor' => ['type' => 'string', 'default' => '#e8e8e8'],
            'pillTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'pillHoverBg' => ['type' => 'string', 'default' => '#ee6e2a'],
            'pillHoverBorderColor' => ['type' => 'string', 'default' => '#ee6e2a'],
            'pillHoverTextColor' => ['type' => 'string', 'default' => '#ffffff'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/savings-archive-hero', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-savings-archive-hero-editor',
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Savings Products'],
            'intro' => ['type' => 'string', 'default' => ''],
            'bannerImageId' => ['type' => 'number', 'default' => 0],
            'bannerImageUrl' => ['type' => 'string', 'default' => ''],
            'titleColor' => ['type' => 'string', 'default' => '#22ABB5'],
            'navBackgroundColor' => ['type' => 'string', 'default' => '#eef2f8'],
            'navBorderColor' => ['type' => 'string', 'default' => '#c8cee3'],
            'menuTextColor' => ['type' => 'string', 'default' => '#65605f'],
            'menuHoverTextColor' => ['type' => 'string', 'default' => '#ED6E2A'],
            'menuHoverBackgroundColor' => ['type' => 'string', 'default' => '#eef2f8'],
            'buttons' => [
                'type' => 'array',
                'default' => [
                    ['label' => 'GET A CALL BACK', 'url' => '#', 'textColor' => '#22abb5', 'borderColor' => '#22abb5', 'bgColor' => '#ffffff', 'hoverTextColor' => '#ffffff', 'hoverBgColor' => '#22abb5', 'hoverBorderColor' => '#22abb5'],
                    ['label' => 'JOIN PORTS SACCO', 'url' => '/contact-us', 'textColor' => '#ed6e2a', 'borderColor' => '#ed6e2a', 'bgColor' => '#ffffff', 'hoverTextColor' => '#ffffff', 'hoverBgColor' => '#ed6e2a', 'hoverBorderColor' => '#ed6e2a'],
                ],
            ],
            'menuItems' => [
                'type' => 'array',
                'default' => [
                    ['label' => 'GROUP', 'href' => '#'],
                    ['label' => 'BIASHARA', 'href' => '#'],
                    ['label' => 'FIXED DEPOSIT', 'href' => '#'],
                ],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/savings-why-save', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-savings-why-save-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'heading' => ['type' => 'string', 'default' => 'Why Save With Us'],
            'description' => ['type' => 'string', 'default' => ''],
            'footerText' => ['type' => 'string', 'default' => ''],
            'iconId' => ['type' => 'number', 'default' => 0],
            'iconUrl' => ['type' => 'string', 'default' => ''],
            'headingColor' => ['type' => 'string', 'default' => '#22ABB5'],
            'titleColor' => ['type' => 'string', 'default' => '#000000'],
            'textColor' => ['type' => 'string', 'default' => '#000000'],
            'iconBgColor' => ['type' => 'string', 'default' => '#ED6E2A'],
            'backgroundColor' => ['type' => 'string', 'default' => '#ffffff'],
            'items' => [
                'type' => 'array',
                'default' => [
                    ['heading' => 'High Returns', 'paragraph' => 'Earn market competitive returns on your savings and share capital.', 'fullWidth' => false],
                    ['heading' => 'Access to Credit', 'paragraph' => 'Saving with us makes it easy to access credit. The more you save, the more you can borrow.', 'fullWidth' => false],
                    ['heading' => 'Fallback', 'paragraph' => 'You can always count on your savings with the SACCO for unforeseen occurrences.', 'fullWidth' => false],
                    ['heading' => 'Retirement', 'paragraph' => 'Savings come in handy when you retire from formal employment.', 'fullWidth' => false],
                ],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/membership-content', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-membership-content-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'heading' => ['type' => 'string', 'default' => 'Individual Membership'],
            'description' => ['type' => 'string', 'default' => 'To join the SACCO as an individual, one needs to:'],
            'iconId' => ['type' => 'number', 'default' => 0],
            'iconUrl' => ['type' => 'string', 'default' => ''],
            'headingColor' => ['type' => 'string', 'default' => '#22ABB5'],
            'descriptionColor' => ['type' => 'string', 'default' => '#000000'],
            'titleColor' => ['type' => 'string', 'default' => '#000000'],
            'textColor' => ['type' => 'string', 'default' => '#000000'],
            'iconBgColor' => ['type' => 'string', 'default' => '#ED6E2A'],
            'backgroundColor' => ['type' => 'string', 'default' => '#ffffff'],
            'tableHeaderBg' => ['type' => 'string', 'default' => '#e7f0f9'],
            'tableCellBg' => ['type' => 'string', 'default' => '#f8f9fa'],
            'tableHeaders' => [
                'type' => 'array',
                'default' => [
                    'Membership Category',
                    'Registration (KSH)',
                    'Minimum Monthly Deposits Contribution (KSH)',
                    'Share Capital',
                ],
            ],
            'tableRows' => [
                'type' => 'array',
                'default' => [
                    ['Individual', '500', '1,000', '40,000'],
                ],
            ],
            'buttonLabel' => ['type' => 'string', 'default' => 'JOIN US!'],
            'buttonUrl' => ['type' => 'string', 'default' => '/contact-us'],
            'buttonBgColor' => ['type' => 'string', 'default' => '#40C9BF'],
            'buttonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'buttonHoverBgColor' => ['type' => 'string', 'default' => '#35b5ad'],
            'linkTextColor' => ['type' => 'string', 'default' => '#22ABB5'],
            'linkHoverTextColor' => ['type' => 'string', 'default' => '#ED6E2A'],
            'linkIconBgColor' => ['type' => 'string', 'default' => '#22ABB5'],
            'linkIconHoverBgColor' => ['type' => 'string', 'default' => '#ED6E2A'],
            'items' => [
                'type' => 'array',
                'default' => [
                    ['heading' => 'Membership Form:', 'paragraph' => 'Complete and submit the membership application form.', 'hasLink' => true, 'linkText' => '(click here)', 'linkUrl' => '#'],
                    ['heading' => 'ID or Passport:', 'paragraph' => 'Attach a copy of your Kenyan National Identity Card or a valid Kenyan Passport.'],
                    ['heading' => 'Passport Photo:', 'paragraph' => 'Attach coloured passport size photograph.'],
                    ['heading' => 'KRA PIN Certificate:', 'paragraph' => 'Attach a copy of your KRA PIN Certificate.'],
                ],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/download-app', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-download-app-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'heading' => ['type' => 'string', 'default' => 'Download the App'],
            'backgroundColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'headingColor' => ['type' => 'string', 'default' => '#ffffff'],
            'googlePlayImageId' => ['type' => 'number', 'default' => 0],
            'googlePlayImageUrl' => ['type' => 'string', 'default' => ''],
            'googlePlayLinkUrl' => ['type' => 'string', 'default' => '#'],
            'appStoreImageId' => ['type' => 'number', 'default' => 0],
            'appStoreImageUrl' => ['type' => 'string', 'default' => ''],
            'appStoreLinkUrl' => ['type' => 'string', 'default' => '#'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/mobile-app-section', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-mobile-app-section-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'mobile-app'],
            'gradientFrom' => ['type' => 'string', 'default' => '#00B2E0'],
            'gradientVia' => ['type' => 'string', 'default' => '#00AFBB'],
            'gradientTo' => ['type' => 'string', 'default' => '#00AB81'],
            'topBarBg' => ['type' => 'string', 'default' => '#F5F4EE'],
            'curveAccentColor' => ['type' => 'string', 'default' => '#00AFBB'],
            'scrollButtonOuter' => ['type' => 'string', 'default' => '#ffffff'],
            'scrollButtonInner' => ['type' => 'string', 'default' => '#22ACB6'],
            'kickerText' => ['type' => 'string', 'default' => ''],
            'titleText' => ['type' => 'string', 'default' => ''],
            'bodyHtml' => ['type' => 'string', 'default' => ''],
            'downloadHeading' => ['type' => 'string', 'default' => ''],
            'badgeText' => ['type' => 'string', 'default' => ''],
            'googlePlayImageId' => ['type' => 'number', 'default' => 0],
            'googlePlayImageUrl' => ['type' => 'string', 'default' => ''],
            'googlePlayLinkUrl' => ['type' => 'string', 'default' => ''],
            'appStoreImageId' => ['type' => 'number', 'default' => 0],
            'appStoreImageUrl' => ['type' => 'string', 'default' => ''],
            'appStoreLinkUrl' => ['type' => 'string', 'default' => ''],
            'ussdImageId' => ['type' => 'number', 'default' => 0],
            'ussdImageUrl' => ['type' => 'string', 'default' => ''],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/newsletter-section', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-newsletter-section-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'newsletter'],
            'gradientFrom' => ['type' => 'string', 'default' => '#00B2E0'],
            'gradientVia' => ['type' => 'string', 'default' => '#00AFBB'],
            'gradientTo' => ['type' => 'string', 'default' => '#00AB81'],
            'topBarBg' => ['type' => 'string', 'default' => '#F5F4EE'],
            'curveAccentColor' => ['type' => 'string', 'default' => '#00AFBB'],
            'scrollButtonOuter' => ['type' => 'string', 'default' => '#ffffff'],
            'scrollButtonInner' => ['type' => 'string', 'default' => '#22ACB6'],
            'kickerText' => ['type' => 'string', 'default' => ''],
            'badgeText' => ['type' => 'string', 'default' => ''],
            'titleText' => ['type' => 'string', 'default' => ''],
            'headlineColor' => ['type' => 'string', 'default' => '#000000'],
            'kickerColor' => ['type' => 'string', 'default' => '#ffffff'],
            'imageId' => ['type' => 'number', 'default' => 0],
            'imageUrl' => ['type' => 'string', 'default' => ''],
            'imageAlt' => ['type' => 'string', 'default' => ''],
            'emailPlaceholder' => ['type' => 'string', 'default' => 'Enter Your Email Address'],
            'submitButtonText' => ['type' => 'string', 'default' => 'SUBSCRIBE'],
            'submitButtonWidth' => ['type' => 'string', 'default' => '300px'],
            'inputBgColor' => ['type' => 'string', 'default' => '#38f0ba'],
            'inputTextColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'inputPlaceholderColor' => ['type' => 'string', 'default' => '#3b4e6b'],
            'submitBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'submitTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'submitArrowColor' => ['type' => 'string', 'default' => '#ffffff'],
            'badgeBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'badgeTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'mailchimpFormActionUrl' => ['type' => 'string', 'default' => ''],
            'mailchimpEmailFieldName' => ['type' => 'string', 'default' => 'EMAIL'],
            'mailchimpBotFieldName' => ['type' => 'string', 'default' => ''],
            'mailchimpFormTarget' => ['type' => 'string', 'default' => '_self'],
            'mailchimpHiddenFieldsJson' => ['type' => 'string', 'default' => '[]'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/partners-carousel', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-partners-carousel-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'partners'],
            'useGradient' => ['type' => 'boolean', 'default' => true],
            'gradientFrom' => ['type' => 'string', 'default' => '#00B2E0'],
            'gradientVia' => ['type' => 'string', 'default' => '#00AFBB'],
            'gradientTo' => ['type' => 'string', 'default' => '#00AB81'],
            'sectionBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'topBarBg' => ['type' => 'string', 'default' => '#F5F4EE'],
            'topBarUseGradient' => ['type' => 'boolean', 'default' => false],
            'topBarGradientFrom' => ['type' => 'string', 'default' => '#F5F4EE'],
            'topBarGradientVia' => ['type' => 'string', 'default' => '#E8E6E0'],
            'topBarGradientTo' => ['type' => 'string', 'default' => '#F5F4EE'],
            'topBarScrollIconOuterColor' => ['type' => 'string', 'default' => ''],
            'curveAccentColor' => ['type' => 'string', 'default' => '#00AFBB'],
            'scrollButtonOuter' => ['type' => 'string', 'default' => '#ffffff'],
            'scrollButtonInner' => ['type' => 'string', 'default' => '#22ACB6'],
            'kickerText' => ['type' => 'string', 'default' => ''],
            'badgeText' => ['type' => 'string', 'default' => ''],
            'kickerColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'badgeBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'badgeTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'carouselArrowBg' => ['type' => 'string', 'default' => '#00AFBB'],
            'carouselArrowIconColor' => ['type' => 'string', 'default' => '#ffffff'],
            'dotActiveColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'dotInactiveColor' => ['type' => 'string', 'default' => '#d1d5db'],
            'maxItems' => ['type' => 'number', 'default' => 0],
            'slidesToScroll' => ['type' => 'number', 'default' => 1],
            'visibleMobile' => ['type' => 'number', 'default' => 1],
            'visibleTablet' => ['type' => 'number', 'default' => 2],
            'visibleDesktop' => ['type' => 'number', 'default' => 4],
            'carouselLoop' => ['type' => 'boolean', 'default' => true],
            'showPartnerCount' => ['type' => 'boolean', 'default' => true],
            'partnerCountSuffix' => ['type' => 'string', 'default' => 'partners'],
            'partners' => ['type' => 'array', 'default' => []],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/events-section', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-events-section-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'events'],
            'gradientFrom' => ['type' => 'string', 'default' => '#FF8C00'],
            'gradientVia' => ['type' => 'string', 'default' => '#FF6347'],
            'gradientTo' => ['type' => 'string', 'default' => '#800080'],
            'topCurveFillColor' => ['type' => 'string', 'default' => ''],
            'topBarBg' => ['type' => 'string', 'default' => '#ff6346'],
            'topBarUseGradient' => ['type' => 'boolean', 'default' => false],
            'topBarGradientFrom' => ['type' => 'string', 'default' => '#ff6346'],
            'topBarGradientVia' => ['type' => 'string', 'default' => '#FF6347'],
            'topBarGradientTo' => ['type' => 'string', 'default' => '#ff6346'],
            'topBarScrollIconOuterColor' => ['type' => 'string', 'default' => ''],
            'scrollButtonOuter' => ['type' => 'string', 'default' => '#ffffff'],
            'scrollButtonInner' => ['type' => 'string', 'default' => ''],
            'patternImageId' => ['type' => 'number', 'default' => 0],
            'patternImageUrl' => ['type' => 'string', 'default' => ''],
            'patternOpacity' => ['type' => 'number', 'default' => 0.3],
            'orchidTintColor' => ['type' => 'string', 'default' => '#ff7bac'],
            'logoImageId' => ['type' => 'number', 'default' => 0],
            'logoImageUrl' => ['type' => 'string', 'default' => ''],
            'logoAlt' => ['type' => 'string', 'default' => 'Ports Sacco'],
            'eventTitle' => ['type' => 'string', 'default' => 'ADM'],
            'eventSubtitle' => ['type' => 'string', 'default' => 'Annual Delegate Meeting'],
            'dayName' => ['type' => 'string', 'default' => 'FRIDAY'],
            'dayNumber' => ['type' => 'string', 'default' => '30'],
            'monthName' => ['type' => 'string', 'default' => 'JAN'],
            'year' => ['type' => 'string', 'default' => '2026'],
            'venueTitle' => ['type' => 'string', 'default' => 'Venue'],
            'timeLine' => ['type' => 'string', 'default' => '09.00 HOURS'],
            'bannerTextColor' => ['type' => 'string', 'default' => '#ffffff'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/member-reviews', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-member-reviews-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionId' => ['type' => 'string', 'default' => 'member-reviews'],
            'useGradient' => ['type' => 'boolean', 'default' => false],
            'gradientFrom' => ['type' => 'string', 'default' => '#FF8C00'],
            'gradientVia' => ['type' => 'string', 'default' => '#FF6347'],
            'gradientTo' => ['type' => 'string', 'default' => '#800080'],
            'sectionBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'topCurveFillColor' => ['type' => 'string', 'default' => ''],
            'wavePathFill' => ['type' => 'string', 'default' => '#ff6346'],
            'topBarBg' => ['type' => 'string', 'default' => '#ff6346'],
            'topBarUseGradient' => ['type' => 'boolean', 'default' => false],
            'topBarGradientFrom' => ['type' => 'string', 'default' => '#ff6346'],
            'topBarGradientVia' => ['type' => 'string', 'default' => '#FF6347'],
            'topBarGradientTo' => ['type' => 'string', 'default' => '#ff6346'],
            'patternImageId' => ['type' => 'number', 'default' => 0],
            'patternImageUrl' => ['type' => 'string', 'default' => ''],
            'patternOpacity' => ['type' => 'number', 'default' => 0.3],
            'orchidTintColor' => ['type' => 'string', 'default' => '#ff7bac'],
            'topBarScrollIconOuterColor' => ['type' => 'string', 'default' => ''],
            'scrollArrowBg' => ['type' => 'string', 'default' => '#ffffff'],
            'scrollIconColor' => ['type' => 'string', 'default' => ''],
            'scrollButtonOuter' => ['type' => 'string', 'default' => '#ffffff'],
            'scrollButtonInner' => ['type' => 'string', 'default' => ''],
            'badgeLabelHtml' => ['type' => 'string', 'default' => 'MEMBER REVIEWS'],
            'subtitleHtml' => ['type' => 'string', 'default' => 'WHAT OUR MEMBERS SAY!'],
            'badgeBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'badgeTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'subtitleColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'showAllReviewsRow' => ['type' => 'boolean', 'default' => true],
            'allReviewsLabel' => ['type' => 'string', 'default' => 'ALL REVIEWS'],
            'allReviewsUrl' => ['type' => 'string', 'default' => ''],
            'secondaryButtonBorderColor' => ['type' => 'string', 'default' => '#d1d5db'],
            'secondaryButtonTextColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'quoteTextColor' => ['type' => 'string', 'default' => '#6b7280'],
            'nameColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'cardBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'starFilledColor' => ['type' => 'string', 'default' => '#EAB308'],
            'starEmptyColor' => ['type' => 'string', 'default' => '#D1D5DB'],
            'carouselArrowBg' => ['type' => 'string', 'default' => '#22ACB6'],
            'carouselArrowIconColor' => ['type' => 'string', 'default' => '#ffffff'],
            'dotActiveColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'dotInactiveColor' => ['type' => 'string', 'default' => '#d1d5db'],
            'maxItems' => ['type' => 'number', 'default' => 0],
            'slidesToScroll' => ['type' => 'number', 'default' => 1],
            'visibleMobile' => ['type' => 'number', 'default' => 1],
            'visibleTablet' => ['type' => 'number', 'default' => 2],
            'visibleDesktop' => ['type' => 'number', 'default' => 3],
            'carouselLoop' => ['type' => 'boolean', 'default' => false],
            'reviews' => ['type' => 'array', 'default' => []],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/savings-products-grid', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-savings-products-grid-editor',
        'attributes' => [],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/asset-finance-whatever', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-asset-finance-whatever-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Get financing for whatever you need now'],
            'backgroundColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'titleColor' => ['type' => 'string', 'default' => '#ffffff'],
            'buttonLabel' => ['type' => 'string', 'default' => 'ENQUIRE NOW'],
            'buttonUrl' => ['type' => 'string', 'default' => '#'],
            'buttonBgColor' => ['type' => 'string', 'default' => '#ed6e2a'],
            'buttonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'buttonBorderColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'buttonHoverBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'buttonHoverTextColor' => ['type' => 'string', 'default' => '#ed6e2a'],
            'buttonHoverBorderColor' => ['type' => 'string', 'default' => '#22ACB6'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/asset-finance-faq', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-asset-finance-faq-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Frequently Asked Questions'],
            'intro' => ['type' => 'string', 'default' => "For each loan product or service offered by Ports DT Sacco, we will need an FAQ's page."],
            'backgroundColor' => ['type' => 'string', 'default' => '#eef0f3'],
            'titleColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'textColor' => ['type' => 'string', 'default' => '#000000'],
            'questionColor' => ['type' => 'string', 'default' => '#000000'],
            'borderColor' => ['type' => 'string', 'default' => '#e5e7eb'],
            'hoverBgColor' => ['type' => 'string', 'default' => '#f9fafb'],
            'iconColor' => ['type' => 'string', 'default' => '#000000'],
            'items' => [
                'type' => 'array',
                'default' => [
                    ['question' => 'Can I pay off my loan early?', 'answer' => 'Yes, you can pay off your loan early. Please contact us for details on early repayment options.'],
                    ['question' => 'Can you offer refinancing?', 'answer' => 'Yes, we offer refinancing options. Contact our team to discuss your refinancing needs.'],
                    ['question' => 'When should I apply?', 'answer' => 'You can apply at any time. Our application process is open throughout the year.'],
                    ['question' => 'Where are you located?', 'answer' => 'We have multiple branches. Please visit our contact page for branch locations and contact information.'],
                ],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/asset-finance-apply', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-asset-finance-apply-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Apply Now!'],
            'backgroundColor' => ['type' => 'string', 'default' => '#eef0f3'],
            'titleColor' => ['type' => 'string', 'default' => '#ED6E2A'],
            'labelColor' => ['type' => 'string', 'default' => '#000000'],
            'inputBorderColor' => ['type' => 'string', 'default' => '#e8e8e8'],
            'buttonLabel' => ['type' => 'string', 'default' => 'SUBMIT YOUR APPLICATION'],
            'buttonBgColor' => ['type' => 'string', 'default' => '#ED6E2A'],
            'buttonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'buttonHoverBgColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'buttonHoverTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'successMessage' => ['type' => 'string', 'default' => 'Thanks — we received your application.'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/contact-form', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-contact-form-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Get in touch.'],
            'subtitle' => ['type' => 'string', 'default' => 'Reach out to us and we will respond as soon as we can.'],
            'formName' => ['type' => 'string', 'default' => 'Contact Form'],
            'backgroundColor' => ['type' => 'string', 'default' => '#ffffff'],
            'titleColor' => ['type' => 'string', 'default' => '#22ABB5'],
            'textColor' => ['type' => 'string', 'default' => '#333333'],
            'labelColor' => ['type' => 'string', 'default' => '#333333'],
            'inputBorderColor' => ['type' => 'string', 'default' => '#e8e8e8'],
            'buttonLabel' => ['type' => 'string', 'default' => 'SUBMIT'],
            'buttonBgColor' => ['type' => 'string', 'default' => '#ED6E2A'],
            'buttonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'buttonHoverBgColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'buttonHoverTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'successMessage' => ['type' => 'string', 'default' => 'Thanks — we have received your message.'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/contact-map', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-contact-map-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Our Location'],
            'address' => ['type' => 'string', 'default' => 'Mombasa, Kenya'],
            'embedUrl' => ['type' => 'string', 'default' => ''],
            'directionsUrl' => ['type' => 'string', 'default' => ''],
            'backgroundColor' => ['type' => 'string', 'default' => '#ffffff'],
            'titleColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'textColor' => ['type' => 'string', 'default' => '#000000'],
            'cardBgColor' => ['type' => 'string', 'default' => '#ffffff'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/loan-products-grid', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-loan-products-grid-editor',
        'attributes' => [
            'categoryId' => ['type' => 'number', 'default' => 0],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/services-grid', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-services-grid-editor',
        'attributes' => [
            'categoryId' => ['type' => 'number', 'default' => 0],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/events-grid', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-events-grid-editor',
        'attributes' => [
            'categoryId' => ['type' => 'number', 'default' => 0],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/loans-carousel', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-loans-carousel-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'categoryId' => ['type' => 'number', 'default' => 0],
            'sectionHeader' => ['type' => 'string', 'default' => 'ACHIEVE YOUR GOALS WITH OUR FLEXIBLE LENDING OPTIONS'],
            'buttonText' => ['type' => 'string', 'default' => 'LOANS'],
            'linkText' => ['type' => 'string', 'default' => 'ALL LOAN PRODUCTS'],
            'linkUrl' => ['type' => 'string', 'default' => '/loan-products'],
            'maxItems' => ['type' => 'number', 'default' => 9],
            'autoplayDelayMs' => ['type' => 'number', 'default' => 3500],
            'sectionBgColor' => ['type' => 'string', 'default' => '#F5F4EE'],
            'topBarColor' => ['type' => 'string', 'default' => '#ffffff'],
            'topBarGradientAngle' => ['type' => 'number', 'default' => 90],
            'topBarGradientFrom' => ['type' => 'string', 'default' => '#ffffff'],
            'topBarGradientVia' => ['type' => 'string', 'default' => '#ffffff'],
            'topBarGradientTo' => ['type' => 'string', 'default' => '#ffffff'],
            'headerTextColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'buttonBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'buttonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkTextColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'linkTextHoverColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'linkBadgeBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkBadgeHoverBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkArrowBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkArrowHoverBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'linkArrowColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'linkArrowHoverColor' => ['type' => 'string', 'default' => '#ffffff'],
            'arrowButtonBgColor' => ['type' => 'string', 'default' => '#00AFBB'],
            'arrowButtonIconColor' => ['type' => 'string', 'default' => '#ffffff'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/events-carousel', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-events-carousel-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'categoryId' => ['type' => 'number', 'default' => 0],
            'sectionHeader' => ['type' => 'string', 'default' => 'CELEBRATE, EXPLORE AND SHARE OUR INCREDIBLE JOURNEYS OF PROSPERITY.'],
            'buttonText' => ['type' => 'string', 'default' => 'LATEST EVENTS'],
            'linkText' => ['type' => 'string', 'default' => 'ALL EVENTS'],
            'linkUrl' => ['type' => 'string', 'default' => '/events'],
            'readMoreLabel' => ['type' => 'string', 'default' => 'READ MORE'],
            'maxItems' => ['type' => 'number', 'default' => 9],
            'autoplayDelayMs' => ['type' => 'number', 'default' => 3500],
            'sectionBgColor' => ['type' => 'string', 'default' => '#F5F4EE'],
            'topBarColor' => ['type' => 'string', 'default' => '#ffffff'],
            'headerTextColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'buttonBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'buttonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkTextColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'linkTextHoverColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'linkBadgeBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkBadgeHoverBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkArrowBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkArrowHoverBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'linkArrowColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'linkArrowHoverColor' => ['type' => 'string', 'default' => '#ffffff'],
            'arrowButtonBgColor' => ['type' => 'string', 'default' => '#00AFBB'],
            'arrowButtonIconColor' => ['type' => 'string', 'default' => '#ffffff'],
            'metaTextColor' => ['type' => 'string', 'default' => '#808080'],
            'cardTitleColor' => ['type' => 'string', 'default' => '#808080'],
            'cardTitleHoverColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'readMoreTextColor' => ['type' => 'string', 'default' => '#ee6e2a'],
            'readMoreHoverColor' => ['type' => 'string', 'default' => '#22aab7'],
            'readMoreArrowBg' => ['type' => 'string', 'default' => '#ee6e2a'],
            'readMoreArrowHoverBg' => ['type' => 'string', 'default' => '#22aab7'],
            'carouselNavArrowColor' => ['type' => 'string', 'default' => '#82cdcb'],
            'dotActiveColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'dotInactiveColor' => ['type' => 'string', 'default' => 'rgba(255,255,255,0.6)'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/savings-carousel', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-savings-carousel-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'sectionHeader' => ['type' => 'string', 'default' => 'DISCOVER OUR SAVINGS SOLUTIONS'],
            'buttonText' => ['type' => 'string', 'default' => 'SAVINGS'],
            'linkText' => ['type' => 'string', 'default' => 'ALL SAVINGS PRODUCTS'],
            'linkUrl' => ['type' => 'string', 'default' => '/savings-products'],
            'maxItems' => ['type' => 'number', 'default' => 9],
            'autoplayDelayMs' => ['type' => 'number', 'default' => 3500],
            'sectionBgColor' => ['type' => 'string', 'default' => '#F5F4EE'],
            'headerTextColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'buttonBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'buttonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkTextColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'linkTextHoverColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'linkBadgeBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkBadgeHoverBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkArrowBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkArrowHoverBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'linkArrowColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'linkArrowHoverColor' => ['type' => 'string', 'default' => '#ffffff'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/services-carousel', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-services-carousel-editor',
        'supports' => [
            'anchor' => true,
        ],
        'attributes' => [
            'categoryId' => ['type' => 'number', 'default' => 0],
            'sectionHeader' => ['type' => 'string', 'default' => 'EXPLORE OUR SERVICES'],
            'buttonText' => ['type' => 'string', 'default' => 'SERVICES'],
            'linkText' => ['type' => 'string', 'default' => 'ALL SERVICES'],
            'linkUrl' => ['type' => 'string', 'default' => '/services'],
            'maxItems' => ['type' => 'number', 'default' => 9],
            'autoplayDelayMs' => ['type' => 'number', 'default' => 3500],
            'sectionBgColor' => ['type' => 'string', 'default' => '#F5F4EE'],
            'headerTextColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'buttonBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'buttonTextColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkTextColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'linkTextHoverColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'linkBadgeBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkBadgeHoverBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkArrowBgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'linkArrowHoverBgColor' => ['type' => 'string', 'default' => '#EE6E2A'],
            'linkArrowColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'linkArrowHoverColor' => ['type' => 'string', 'default' => '#ffffff'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/footer-contact', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-footer-contact-editor',
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Branch Network'],
            'officeName' => ['type' => 'string', 'default' => 'Mombasa - Head Office'],
            'officeAddress' => ['type' => 'string', 'default' => ''],
            'phone' => ['type' => 'string', 'default' => ''],
            'poBox' => ['type' => 'string', 'default' => ''],
            'email' => ['type' => 'string', 'default' => ''],
            'tagline' => ['type' => 'string', 'default' => 'UPLIFTING PEOPLE'],
            'logoId' => ['type' => 'number', 'default' => 0],
            'addressIconId' => ['type' => 'number', 'default' => 0],
            'phoneIconId' => ['type' => 'number', 'default' => 0],
            'poBoxIconId' => ['type' => 'number', 'default' => 0],
            'emailIconId' => ['type' => 'number', 'default' => 0],
            'iconColor' => ['type' => 'string', 'default' => '#FFFFFF'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/footer-branches', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-footer-branches-editor',
        'attributes' => [
            'branches' => [
                'type' => 'array',
                'default' => [],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/footer-app-links', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-footer-app-links-editor',
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Download Mobile App'],
            'googlePlayUrl' => ['type' => 'string', 'default' => ''],
            'appStoreUrl' => ['type' => 'string', 'default' => ''],
            'googlePlayIconId' => ['type' => 'number', 'default' => 0],
            'appStoreIconId' => ['type' => 'number', 'default' => 0],
            'iconColor' => ['type' => 'string', 'default' => '#FFFFFF'],
            'iconHoverColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'iconWidth' => ['type' => 'number', 'default' => 144],
            'iconHeight' => ['type' => 'number', 'default' => 48],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/footer-socials', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-footer-socials-editor',
        'attributes' => [
            'facebook' => ['type' => 'string', 'default' => ''],
            'twitter' => ['type' => 'string', 'default' => ''],
            'instagram' => ['type' => 'string', 'default' => ''],
            'linkedin' => ['type' => 'string', 'default' => ''],
            'youtube' => ['type' => 'string', 'default' => ''],
            'facebookIconId' => ['type' => 'number', 'default' => 0],
            'twitterIconId' => ['type' => 'number', 'default' => 0],
            'instagramIconId' => ['type' => 'number', 'default' => 0],
            'linkedinIconId' => ['type' => 'number', 'default' => 0],
            'youtubeIconId' => ['type' => 'number', 'default' => 0],
            'iconColor' => ['type' => 'string', 'default' => '#FFFFFF'],
            'iconHoverColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'youtubeInternalColor' => ['type' => 'string', 'default' => '#FFFFFF'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/footer-hours', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-footer-hours-editor',
        'attributes' => [
            'title' => ['type' => 'string', 'default' => 'Banking Hours'],
            'weekdaysLabel' => ['type' => 'string', 'default' => 'Monday - Friday:'],
            'weekdaysTime' => ['type' => 'string', 'default' => '08:30 AM - 04:00 PM'],
            'saturdayLabel' => ['type' => 'string', 'default' => 'Saturday:'],
            'saturdayTime' => ['type' => 'string', 'default' => '09:00 AM - 12:00 PM'],
            'sundayLabel' => ['type' => 'string', 'default' => 'Sunday:'],
            'sundayTime' => ['type' => 'string', 'default' => 'Closed'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/footer-bottom', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-footer-bottom-editor',
        'attributes' => [
            'copyright' => ['type' => 'string', 'default' => '© 2026 PORTS SACCO'],
            'rights' => ['type' => 'string', 'default' => '- ALL RIGHTS RESERVED'],
            'privacyLabel' => ['type' => 'string', 'default' => 'PRIVACY POLICY'],
            'privacyUrl' => ['type' => 'string', 'default' => '#'],
            'termsLabel' => ['type' => 'string', 'default' => 'TERMS AND CONDITIONS'],
            'termsUrl' => ['type' => 'string', 'default' => '#'],
            'credit' => ['type' => 'string', 'default' => 'A SMITH CREATIVE DESIGN'],
            'creditUrl' => ['type' => 'string', 'default' => ''],
            'linkColor' => ['type' => 'string', 'default' => '#22ACB6'],
            'linkHoverColor' => ['type' => 'string', 'default' => '#FFFFFF'],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/header-topbar', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-header-topbar-editor',
        'attributes' => [
            'bgColor' => ['type' => 'string', 'default' => '#1BB5B5'],
            'textColor' => ['type' => 'string', 'default' => '#ffffff'],
            'hoverColor' => ['type' => 'string', 'default' => '#ee6e2a'],
            'links' => ['type' => 'array', 'default' => []],
            'locationItems' => ['type' => 'array', 'default' => []],
            'phoneText' => ['type' => 'string', 'default' => 'CALL US: +254 111 173 000'],
            'phoneUrl' => ['type' => 'string', 'default' => ''],
            'loginLabel' => ['type' => 'string', 'default' => 'MEMBER LOGIN'],
            'loginUrl' => ['type' => 'string', 'default' => ''],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);

    register_block_type('custom/header-main', [
        'api_version' => 3,
        'editor_script' => 'headless-custom-header-main-editor',
        'attributes' => [
            'bgColor' => ['type' => 'string', 'default' => '#ffffff'],
            'logoId' => ['type' => 'number', 'default' => 0],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);
});
