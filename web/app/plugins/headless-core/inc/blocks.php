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
        'headless-custom-savings-products-grid-editor',
        HEADLESS_CORE_URL . 'blocks/savings-products-grid/editor.js',
        ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n'],
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
        'attributes' => [
            'heading' => ['type' => 'string', 'default' => 'Why Save With Us'],
            'iconId' => ['type' => 'number', 'default' => 0],
            'iconUrl' => ['type' => 'string', 'default' => ''],
            'headingColor' => ['type' => 'string', 'default' => '#22ABB5'],
            'titleColor' => ['type' => 'string', 'default' => '#000000'],
            'textColor' => ['type' => 'string', 'default' => '#000000'],
            'iconBgColor' => ['type' => 'string', 'default' => '#ED6E2A'],
            'items' => [
                'type' => 'array',
                'default' => [
                    ['heading' => 'High Returns', 'paragraph' => 'Earn market competitive returns on your savings and share capital.'],
                    ['heading' => 'Access to Credit', 'paragraph' => 'Saving with us makes it easy to access credit. The more you save, the more you can borrow.'],
                    ['heading' => 'Fallback', 'paragraph' => 'You can always count on your savings with the SACCO for unforeseen occurrences.'],
                    ['heading' => 'Retirement', 'paragraph' => 'Savings come in handy when you retire from formal employment.'],
                ],
            ],
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
});
