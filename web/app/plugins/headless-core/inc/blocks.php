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
});
