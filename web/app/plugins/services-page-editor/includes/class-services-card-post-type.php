<?php
/**
 * Custom post type for Services cards.
 */

namespace PortsServices;

if (!defined('ABSPATH')) {
    exit;
}

class Service_Card_Post_Type {

    /**
     * Bootstrap hooks.
     */
    public static function init() {
        add_action('init', array(__CLASS__, 'register_post_type'));
        add_action('init', array(__CLASS__, 'register_meta'));
    }

    /**
     * Register the ports_service_card post type.
     */
    public static function register_post_type() {
        $labels = array(
            'name'               => __('Service Cards', 'services-page-editor'),
            'singular_name'      => __('Service Card', 'services-page-editor'),
            'menu_name'          => __('Service Cards', 'services-page-editor'),
            'add_new'            => __('Add New', 'services-page-editor'),
            'add_new_item'       => __('Add New Service Card', 'services-page-editor'),
            'edit_item'          => __('Edit Service Card', 'services-page-editor'),
            'new_item'           => __('New Service Card', 'services-page-editor'),
            'view_item'          => __('View Service Card', 'services-page-editor'),
            'search_items'       => __('Search Service Cards', 'services-page-editor'),
            'not_found'          => __('No service cards found.', 'services-page-editor'),
            'not_found_in_trash' => __('No service cards found in Trash.', 'services-page-editor'),
        );

        $args = array(
            'labels'             => $labels,
            // Public so we get slugs/permalinks and the native URL UI.
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            // Keep show_in_menu false; we add an explicit submenu under Services Page.
            'show_in_menu'       => false,
            'show_in_rest'       => true,
            'rest_base'          => 'service-cards',
            // Title = card title, Editor = full description, Thumbnail = image, Excerpt = short description.
            'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
            'has_archive'        => false,
            // Frontend URL base: /service/{slug}
            'rewrite'            => array(
                'slug'       => 'services',
                'with_front' => false,
            ),
            'capability_type'    => 'post',
            'map_meta_cap'       => true,
        );

        register_post_type('ports_service_card', $args);
    }

    /**
     * Register meta fields for cards.
     */
    public static function register_meta() {
        register_post_meta(
            'ports_service_card',
            'ports_service_card_link',
            array(
                'type'         => 'string',
                'single'       => true,
                'show_in_rest' => true,
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                },
                'sanitize_callback' => 'sanitize_text_field',
            )
        );
    }
}

