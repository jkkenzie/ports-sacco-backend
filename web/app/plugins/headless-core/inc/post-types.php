<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('init', static function (): void {
    register_post_type('savings_product', [
        'labels' => [
            'name' => __('Savings Products', 'headless-core'),
            'singular_name' => __('Savings Product', 'headless-core'),
            'add_new_item' => __('Add New Savings Product', 'headless-core'),
            'edit_item' => __('Edit Savings Product', 'headless-core'),
            'new_item' => __('New Savings Product', 'headless-core'),
            'view_item' => __('View Savings Product', 'headless-core'),
            'search_items' => __('Search Savings Products', 'headless-core'),
            'not_found' => __('No savings products found.', 'headless-core'),
            'not_found_in_trash' => __('No savings products found in Trash.', 'headless-core'),
            'menu_name' => __('Savings Products', 'headless-core'),
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'savings-products',
        'menu_icon' => 'dashicons-piggy-bank',
        'has_archive' => false,
        'rewrite' => ['slug' => 'savings-products'],
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
    ]);
});

add_filter('use_block_editor_for_post_type', static function (bool $useBlockEditor, string $postType): bool {
    if ($postType === 'savings_product') {
        return true;
    }

    return $useBlockEditor;
}, 10, 2);
