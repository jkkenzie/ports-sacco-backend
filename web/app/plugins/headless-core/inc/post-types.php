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
        'menu_icon' => 'dashicons-money-alt',
        'has_archive' => false,
        'rewrite' => ['slug' => 'savings-products'],
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
    ]);

    register_post_type('loan_product', [
        'labels' => [
            'name' => __('Loan Products', 'headless-core'),
            'singular_name' => __('Loan Product', 'headless-core'),
            'add_new_item' => __('Add New Loan Product', 'headless-core'),
            'edit_item' => __('Edit Loan Product', 'headless-core'),
            'new_item' => __('New Loan Product', 'headless-core'),
            'view_item' => __('View Loan Product', 'headless-core'),
            'search_items' => __('Search Loan Products', 'headless-core'),
            'not_found' => __('No loan products found.', 'headless-core'),
            'not_found_in_trash' => __('No loan products found in Trash.', 'headless-core'),
            'menu_name' => __('Loan Products', 'headless-core'),
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'loan-products',
        'menu_icon' => 'dashicons-bank',
        'has_archive' => false,
        'rewrite' => ['slug' => 'loan-products'],
        'taxonomies' => ['category'],
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
    ]);

    register_post_type('service', [
        'labels' => [
            'name' => __('Services', 'headless-core'),
            'singular_name' => __('Service', 'headless-core'),
            'add_new_item' => __('Add New Service', 'headless-core'),
            'edit_item' => __('Edit Service', 'headless-core'),
            'new_item' => __('New Service', 'headless-core'),
            'view_item' => __('View Service', 'headless-core'),
            'search_items' => __('Search Services', 'headless-core'),
            'not_found' => __('No services found.', 'headless-core'),
            'not_found_in_trash' => __('No services found in Trash.', 'headless-core'),
            'menu_name' => __('Services', 'headless-core'),
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'services',
        'menu_icon' => 'dashicons-admin-tools',
        'has_archive' => false,
        'rewrite' => ['slug' => 'services'],
        'taxonomies' => ['category'],
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
    ]);

    register_post_type('event', [
        'labels' => [
            'name' => __('Events', 'headless-core'),
            'singular_name' => __('Event', 'headless-core'),
            'add_new_item' => __('Add New Event', 'headless-core'),
            'edit_item' => __('Edit Event', 'headless-core'),
            'new_item' => __('New Event', 'headless-core'),
            'view_item' => __('View Event', 'headless-core'),
            'search_items' => __('Search Events', 'headless-core'),
            'not_found' => __('No events found.', 'headless-core'),
            'not_found_in_trash' => __('No events found in Trash.', 'headless-core'),
            'menu_name' => __('Events', 'headless-core'),
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'events',
        'menu_icon' => 'dashicons-calendar-alt',
        'has_archive' => false,
        'rewrite' => ['slug' => 'events'],
        'taxonomies' => ['category'],
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
    ]);

    register_post_type('team_member', [
        'labels' => [
            'name' => __('Team', 'headless-core'),
            'singular_name' => __('Team Member', 'headless-core'),
            'add_new_item' => __('Add New Team Member', 'headless-core'),
            'edit_item' => __('Edit Team Member', 'headless-core'),
            'new_item' => __('New Team Member', 'headless-core'),
            'view_item' => __('View Team Member', 'headless-core'),
            'search_items' => __('Search Team Members', 'headless-core'),
            'not_found' => __('No team members found.', 'headless-core'),
            'not_found_in_trash' => __('No team members found in Trash.', 'headless-core'),
            'menu_name' => __('Team', 'headless-core'),
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'team-members',
        'menu_icon' => 'dashicons-groups',
        'has_archive' => false,
        'rewrite' => ['slug' => 'team'],
        'taxonomies' => ['category'],
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'],
    ]);

    register_post_meta('team_member', 'position', [
        'type' => 'string',
        'single' => true,
        'show_in_rest' => true,
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => static function (): bool {
            return current_user_can('edit_posts');
        },
    ]);

    register_post_meta('team_member', 'standAlone', [
        'type' => 'boolean',
        'single' => true,
        'show_in_rest' => true,
        'default' => false,
        'sanitize_callback' => static function ($value): bool {
            return (bool) $value;
        },
        'auth_callback' => static function (): bool {
            return current_user_can('edit_posts');
        },
    ]);
});

add_filter('use_block_editor_for_post_type', static function (bool $useBlockEditor, string $postType): bool {
    if ($postType === 'savings_product') {
        return true;
    }

    if ($postType === 'loan_product') {
        return true;
    }

    if ($postType === 'service') {
        return true;
    }

    if ($postType === 'event') {
        return true;
    }

    if ($postType === 'team_member') {
        return true;
    }

    return $useBlockEditor;
}, 10, 2);
