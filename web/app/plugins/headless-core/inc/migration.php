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
    headless_core_ensure_page(__('New Member Registration', 'headless-core'), 'new-member-registration', 0);
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
    }

    headless_core_ensure_page(__('Events', 'headless-core'), 'events', 0);

    headless_core_ensure_primary_menu();
    headless_core_seed_page_block_content();
    headless_core_seed_page_block_content_v2();
}

/**
 * Append default Gutenberg blocks to key pages when missing (idempotent).
 *
 * @return void
 */
function headless_core_seed_page_block_content(): void
{
    if (get_option('headless_core_page_content_v1') === '1') {
        return;
    }

    $contactPage = get_page_by_path('contact-us', OBJECT, 'page');
    if ($contactPage instanceof WP_Post) {
        headless_core_restore_contact_us_page_blocks((int) $contactPage->ID);
    }

    $registrationPage = get_page_by_path('new-member-registration', OBJECT, 'page');
    if ($registrationPage instanceof WP_Post) {
        headless_core_restore_new_member_registration_page_blocks((int) $registrationPage->ID);
    }

    update_option('headless_core_page_content_v1', '1', true);
}

/**
 * New Member Registration page should only contain the registration block (not Contact Form).
 *
 * @return void
 */
function headless_core_restore_new_member_registration_page_blocks(int $pageId): void
{
    if ($pageId <= 0) {
        return;
    }

    $post = get_post($pageId);
    if (! $post instanceof WP_Post) {
        return;
    }

    $blocks = parse_blocks((string) $post->post_content);
    $out = [];
    $hasRegistration = false;
    $legacyRegistrationAttrs = [];
    $changed = false;

    foreach ($blocks as $block) {
        $name = (string) ($block['blockName'] ?? '');

        if ($name === 'custom/new-member-registration') {
            $hasRegistration = true;
            $out[] = $block;
            continue;
        }

        if ($name === 'custom/contact-form') {
            $attrs = is_array($block['attrs'] ?? null) ? $block['attrs'] : [];
            if (! $hasRegistration) {
                $legacyRegistrationAttrs = $attrs;
            }
            $changed = true;
            continue;
        }

        $out[] = $block;
    }

    if (! $hasRegistration) {
        $out[] = [
            'blockName' => 'custom/new-member-registration',
            'attrs' => $legacyRegistrationAttrs,
            'innerBlocks' => [],
            'innerHTML' => '',
            'innerContent' => [],
        ];
        $changed = true;
    } elseif ($changed) {
        // Registration block already present; contact-form was removed above.
    }

    if ($changed) {
        wp_update_post([
            'ID' => $pageId,
            'post_content' => serialize_blocks($out),
        ]);
    }
}

/**
 * Run page-content fixes that may need to apply after v1 (e.g. registration page cleanup).
 *
 * @return void
 */
function headless_core_seed_page_block_content_v2(): void
{
    if (get_option('headless_core_page_content_v2') === '1') {
        return;
    }

    $registrationPage = get_page_by_path('new-member-registration', OBJECT, 'page');
    if ($registrationPage instanceof WP_Post) {
        headless_core_restore_new_member_registration_page_blocks((int) $registrationPage->ID);
    }

    update_option('headless_core_page_content_v2', '1', true);
}

/**
 * Ensure Contact Us has enquiry form + map; reset if onboarding form was placed here by mistake.
 *
 * @return void
 */
function headless_core_restore_contact_us_page_blocks(int $pageId): void
{
    if ($pageId <= 0) {
        return;
    }

    $post = get_post($pageId);
    if (! $post instanceof WP_Post) {
        return;
    }

    $blocks = parse_blocks((string) $post->post_content);
    $changed = false;
    $hasContactForm = false;
    $hasRegistrationForm = false;
    $out = [];

    foreach ($blocks as $block) {
        $name = (string) ($block['blockName'] ?? '');

        if ($name === 'custom/contact-form') {
            $hasContactForm = true;
            $attrs = is_array($block['attrs'] ?? null) ? $block['attrs'] : [];
            $title = trim((string) ($attrs['title'] ?? ''));
            $formName = trim((string) ($attrs['formName'] ?? ''));
            if ($title === 'New Member Registration' || $formName === 'Onboarding Form') {
                $block['attrs'] = [];
                $changed = true;
            }
            $out[] = $block;
            continue;
        }

        if ($name === 'custom/new-member-registration') {
            $hasRegistrationForm = true;
            $changed = true;
            continue;
        }

        $out[] = $block;
    }

    if (! $hasContactForm) {
        $out[] = [
            'blockName' => 'custom/contact-form',
            'attrs' => [],
            'innerBlocks' => [],
            'innerHTML' => '',
            'innerContent' => [],
        ];
        $changed = true;
    }

    if (! headless_core_page_has_block_in_list($out, 'custom/contact-map')) {
        $out[] = [
            'blockName' => 'custom/contact-map',
            'attrs' => [],
            'innerBlocks' => [],
            'innerHTML' => '',
            'innerContent' => [],
        ];
        $changed = true;
    }

    if ($hasRegistrationForm) {
        $registrationPage = get_page_by_path('new-member-registration', OBJECT, 'page');
        if ($registrationPage instanceof WP_Post) {
            headless_core_append_block_if_missing(
                (int) $registrationPage->ID,
                'custom/new-member-registration',
                "<!-- wp:custom/new-member-registration /-->"
            );
        }
    }

    if ($changed) {
        wp_update_post([
            'ID' => $pageId,
            'post_content' => serialize_blocks($out),
        ]);
    }
}

/**
 * @param array<int, array<string, mixed>> $blocks
 */
function headless_core_page_has_block_in_list(array $blocks, string $blockName): bool
{
    foreach ($blocks as $block) {
        if (($block['blockName'] ?? '') === $blockName) {
            return true;
        }
    }

    return false;
}

/**
 * @return bool
 */
function headless_core_page_has_block(int $pageId, string $blockName): bool
{
    $post = get_post($pageId);
    if (! $post instanceof WP_Post) {
        return false;
    }

    $blocks = parse_blocks((string) $post->post_content);
    foreach ($blocks as $block) {
        if (($block['blockName'] ?? '') === $blockName) {
            return true;
        }
    }

    return false;
}

/**
 * @return void
 */
function headless_core_append_block_if_missing(int $pageId, string $blockName, string $blockMarkup): void
{
    if ($pageId <= 0 || headless_core_page_has_block($pageId, $blockName)) {
        return;
    }

    $post = get_post($pageId);
    if (! $post instanceof WP_Post) {
        return;
    }

    $content = trim((string) $post->post_content);
    if ($content !== '') {
        $content .= "\n\n";
    }
    $content .= trim($blockMarkup);

    wp_update_post([
        'ID' => $pageId,
        'post_content' => $content,
    ]);
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
            [__('Events', 'headless-core'), '/events'],
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
