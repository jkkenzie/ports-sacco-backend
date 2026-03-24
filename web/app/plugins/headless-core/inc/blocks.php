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
});
