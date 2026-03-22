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
            'visionTitle' => ['type' => 'string', 'default' => 'Our Vision'],
            'visionText' => [
                'type' => 'string',
                'default' => 'To be a formidable financial institution by providing competitive financial solutions to a happy, healthy and prosperous people.',
            ],
            'visionImageId' => ['type' => 'number', 'default' => 0],
            'missionTitle' => ['type' => 'string', 'default' => 'Our Mission'],
            'missionText' => [
                'type' => 'string',
                'default' => 'To strengthen the socio-economic well-being of our customers through prudent management and innovative products and services.',
            ],
            'missionImageId' => ['type' => 'number', 'default' => 0],
            'purposeTitle' => ['type' => 'string', 'default' => 'Our Purpose'],
            'purposeText' => [
                'type' => 'string',
                'default' => 'Uplifting People. Inspiring happiness, optimism and hope.',
            ],
            'purposeImageId' => ['type' => 'number', 'default' => 0],
            'coreValuesTitle' => ['type' => 'string', 'default' => 'Our Core Values'],
            'coreValuesImageId' => ['type' => 'number', 'default' => 0],
            'coreValues' => [
                'type' => 'array',
                'default' => [
                    [
                        'label' => 'Caring',
                        'text' => 'We are truthful, we listen and go extra mile-above and beyond.',
                    ],
                    [
                        'label' => 'Equity',
                        'text' => 'We are committed to inclusivity, equality, fairness, public good and social justice.',
                    ],
                    [
                        'label' => 'Consistency',
                        'text' => 'We are predictable, dependable, and reliable.',
                    ],
                ],
            ],
        ],
        'render_callback' => static function (): string {
            return '';
        },
    ]);
});
