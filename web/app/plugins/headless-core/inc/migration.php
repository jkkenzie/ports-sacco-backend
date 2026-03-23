<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Idempotent seed: pages (matching former React routes) and a primary navigation menu.
 *
 * @return void
 */
function headless_core_run_migration(): void
{
    if (! function_exists('wp_insert_post')) {
        return;
    }

    $homeId = headless_core_ensure_page(__('Home', 'headless-core'), 'home', 0);
    if ($homeId > 0) {
        update_option('show_on_front', 'page', true);
        update_option('page_on_front', $homeId, true);
    }

    headless_core_ensure_page(__('About Us', 'headless-core'), 'about-us', 0);
    headless_core_ensure_page(__('Contact Us', 'headless-core'), 'contact-us', 0);
    headless_core_ensure_page(__('Board of Directors', 'headless-core'), 'board-of-directors', 0);
    headless_core_ensure_page(__('Membership', 'headless-core'), 'membership', 0);

    $servicesId = headless_core_ensure_page(__('Services', 'headless-core'), 'services', 0);
    if ($servicesId > 0) {
        headless_core_ensure_page(__('Mobile Banking Services', 'headless-core'), 'mobile-banking-services', $servicesId);
    }

    headless_core_ensure_page(__('Savings Products', 'headless-core'), 'savings-products', 0);

    $loansId = headless_core_ensure_page(__('Loan Products', 'headless-core'), 'loan-products', 0);
    if ($loansId > 0) {
        headless_core_ensure_page(__('Asset Finance', 'headless-core'), 'asset-finance', $loansId);
        headless_core_ensure_page(__('Fanikisha Loan', 'headless-core'), 'fanikisha-loan', $loansId);
        headless_core_ensure_page(__('Jiendeleze Loan', 'headless-core'), 'jiendeleze-loan', $loansId);
        headless_core_ensure_page(__('Emergency Loan', 'headless-core'), 'emergency-loan', $loansId);
        headless_core_ensure_page(__('Masaa Loan', 'headless-core'), 'masaa-loan', $loansId);
    }

    headless_core_ensure_primary_menu();
}

/**
 * @return int Post ID (0 on failure)
 */
function headless_core_ensure_page(string $title, string $slug, int $parentId): int
{
    $path = headless_core_page_path_for_slug($slug, $parentId);
    $existing = $path !== '' ? get_page_by_path($path, OBJECT, 'page') : null;
    if ($existing instanceof WP_Post) {
        return (int) $existing->ID;
    }

    $postarr = [
        'post_title' => $title,
        'post_name' => $slug,
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_parent' => $parentId,
        'post_content' => '',
    ];

    $id = wp_insert_post($postarr, true);
    if (is_wp_error($id) || ! is_int($id)) {
        return 0;
    }

    return $id;
}

/**
 * Full path string for get_page_by_path().
 */
function headless_core_page_path_for_slug(string $slug, int $parentId): string
{
    if ($parentId <= 0) {
        return $slug;
    }

    $parent = get_post($parentId);
    if (! $parent instanceof WP_Post) {
        return $slug;
    }

    $ancestor = get_page_uri($parent);
    if (! is_string($ancestor) || $ancestor === '') {
        return $slug;
    }

    return trim($ancestor, '/') . '/' . $slug;
}

/**
 * @return void
 */
function headless_core_ensure_primary_menu(): void
{
    $name = 'Primary (Headless)';
    $menu = wp_get_nav_menu_object($name);
    $menuId = 0;
    if ($menu instanceof WP_Term) {
        $menuId = (int) $menu->term_id;
    } else {
        $menuId = (int) wp_create_nav_menu($name);
    }

    if ($menuId <= 0) {
        return;
    }

    $items = wp_get_nav_menu_items($menuId);
    if (! is_array($items) || $items === []) {
        headless_core_seed_menu_items($menuId);
    }

    headless_core_assign_primary_menu_location($menuId);
}

/**
 * @return void
 */
function headless_core_assign_primary_menu_location(int $menuId): void
{
    $locs = get_theme_mod('nav_menu_locations', []);
    if (! is_array($locs)) {
        $locs = [];
    }
    $locs['primary'] = $menuId;
    set_theme_mod('nav_menu_locations', $locs);
}

/**
 * @return void
 */
function headless_core_seed_menu_items(int $menuId): void
{
    $u = static function (string $path): string {
        return home_url($path);
    };

    wp_update_nav_menu_item($menuId, 0, [
        'menu-item-title' => __('HOME', 'headless-core'),
        'menu-item-url' => $u('/'),
        'menu-item-status' => 'publish',
        'menu-item-type' => 'custom',
    ]);

    $aboutParent = wp_update_nav_menu_item($menuId, 0, [
        'menu-item-title' => __('ABOUT US', 'headless-core'),
        'menu-item-url' => $u('/about-us'),
        'menu-item-status' => 'publish',
        'menu-item-type' => 'custom',
    ]);

    $aboutChildren = [
        [__('Who We Are', 'headless-core'), '/about-us'],
        [__('Our Mission & Vision', 'headless-core'), '/about-us#mission-vision'],
        [__('Our Core Values', 'headless-core'), '/about-us#core-values'],
        [__('Awards', 'headless-core'), '/about-us#awards'],
        [__('Board Of Directors', 'headless-core'), '/board-of-directors'],
        [__('Senior Management', 'headless-core'), '/about-us#management'],
    ];
    foreach ($aboutChildren as [$label, $path]) {
        wp_update_nav_menu_item($menuId, 0, [
            'menu-item-title' => $label,
            'menu-item-url' => home_url($path),
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
            'menu-item-parent-id' => (int) $aboutParent,
        ]);
    }

    $productsParent = wp_update_nav_menu_item($menuId, 0, [
        'menu-item-title' => __('PRODUCTS', 'headless-core'),
        'menu-item-url' => '#',
        'menu-item-status' => 'publish',
        'menu-item-type' => 'custom',
    ]);

    foreach (
        [
            [__('Savings Products', 'headless-core'), '/savings-products'],
            [__('Loan Products', 'headless-core'), '/loan-products'],
        ] as [$label, $path]
    ) {
        wp_update_nav_menu_item($menuId, 0, [
            'menu-item-title' => $label,
            'menu-item-url' => $u($path),
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
            'menu-item-parent-id' => (int) $productsParent,
        ]);
    }

    $servicesParent = wp_update_nav_menu_item($menuId, 0, [
        'menu-item-title' => __('SERVICES', 'headless-core'),
        'menu-item-url' => $u('/services'),
        'menu-item-status' => 'publish',
        'menu-item-type' => 'custom',
    ]);

    wp_update_nav_menu_item($menuId, 0, [
        'menu-item-title' => __('Mobile Banking Services', 'headless-core'),
        'menu-item-url' => $u('/services/mobile-banking-services'),
        'menu-item-status' => 'publish',
        'menu-item-type' => 'custom',
        'menu-item-parent-id' => (int) $servicesParent,
    ]);

    $membershipParent = wp_update_nav_menu_item($menuId, 0, [
        'menu-item-title' => __('MEMBERSHIP', 'headless-core'),
        'menu-item-url' => $u('/membership'),
        'menu-item-status' => 'publish',
        'menu-item-type' => 'custom',
    ]);

    $membershipChildren = [
        [__('Individual Membership', 'headless-core'), '/membership#individual'],
        [__('Joint Membership', 'headless-core'), '/membership#joint'],
        [__('Group Membership', 'headless-core'), '/membership#group'],
        [__('Corporate / Company Membership', 'headless-core'), '/membership#corporate'],
    ];
    foreach ($membershipChildren as [$label, $path]) {
        wp_update_nav_menu_item($menuId, 0, [
            'menu-item-title' => $label,
            'menu-item-url' => home_url($path),
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
            'menu-item-parent-id' => (int) $membershipParent,
        ]);
    }

    wp_update_nav_menu_item($menuId, 0, [
        'menu-item-title' => __('PORTALS', 'headless-core'),
        'menu-item-url' => '#',
        'menu-item-status' => 'publish',
        'menu-item-type' => 'custom',
    ]);

    wp_update_nav_menu_item($menuId, 0, [
        'menu-item-title' => __('CONTACT US', 'headless-core'),
        'menu-item-url' => $u('/contact-us'),
        'menu-item-status' => 'publish',
        'menu-item-type' => 'custom',
    ]);
}
