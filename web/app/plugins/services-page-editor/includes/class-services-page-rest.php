<?php
/**
 * REST API for Services Page content (public GET).
 */

namespace PortsServices;

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists(__NAMESPACE__ . '\\Admin')) {
    require_once dirname(__FILE__) . '/class-services-page-admin.php';
}

class REST {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes() {
        register_rest_route('ports/v1', '/services-page', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_services_page'),
            'permission_callback' => '__return_true',
        ));
    }

    public function get_services_page($request) {
        $option = get_option('ports_services_page', array());
        $defaults = Admin::get_default_settings();
        $data = wp_parse_args($option, $defaults);

        $hero = array(
            'banner_url'   => $this->image_url($data['hero_banner_id']),
            'heading'      => $data['hero_heading'],
            'menu_items'   => $data['hero_menu_items'],
            'buttons'      => $data['hero_buttons'],
        );

        $intro = array(
            'heading'     => $data['intro_heading'],
            'description' => $data['intro_description'],
        );

        $cards = array();
        // Prefer cards from the custom post type so we use native WordPress logic.
        $card_posts = get_posts(array(
            'post_type'      => 'ports_service_card',
            'post_status'    => 'publish',
            'numberposts'    => -1,
            'orderby'        => 'menu_order',
            'order'          => 'ASC',
            'suppress_filters' => false,
        ));

        if (!empty($card_posts)) {
            foreach ($card_posts as $post) {
                $image_url = get_the_post_thumbnail_url($post, 'full');

                // Prefer meta link if set; otherwise use the card permalink.
                $meta_link = get_post_meta($post->ID, 'ports_service_card_link', true);
                $href      = $meta_link ? $meta_link : get_permalink($post);

                // Prefer the manual excerpt if set; otherwise derive one from content,
                // and strip HTML tags so frontend sees plain text (no <p> tags).
                $raw_description = has_excerpt($post) ? $post->post_excerpt : $post->post_content;
                $html_excerpt    = apply_filters('the_excerpt', $raw_description);
                $description     = wp_strip_all_tags($html_excerpt);

                $cards[] = array(
                    'image_url'   => $image_url ?: '',
                    'title'       => get_the_title($post),
                    'description' => $description,
                    'href'        => $href,
                );
            }
        } else {
            // Fallback: use any cards still stored in options.
            $cards_data = isset($data['cards']) && is_array($data['cards']) ? $data['cards'] : array();
            foreach ($cards_data as $card) {
                $cards[] = array(
                    'image_url'   => $this->image_url($card['image_id'] ?? 0),
                    'title'       => $card['title'] ?? '',
                    'description' => $card['description'] ?? '',
                    'href'        => !empty($card['href']) ? $card['href'] : '',
                );
            }
        }

        return rest_ensure_response(array(
            'hero'   => $hero,
            'intro'  => $intro,
            'cards'  => $cards,
        ));
    }

    private function image_url($attachment_id) {
        if (empty($attachment_id)) {
            return '';
        }
        $url = wp_get_attachment_image_url((int) $attachment_id, 'full');
        return $url ?: '';
    }
}
