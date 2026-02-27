<?php
/**
 * Admin menu and form for editing Services page content.
 */

namespace PortsServices;

if (!defined('ABSPATH')) {
    exit;
}

class Admin {

    private static $instance = null;
    const OPTION_KEY = 'ports_services_page';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function get_default_settings() {
        return array(
            'hero_banner_id'   => 0,
            'hero_heading'     => 'Services',
            'hero_menu_items'  => array(
                array('id' => 'appointment', 'label' => 'GET AN APPOINTMENT', 'href' => '#'),
                array('id' => 'email', 'label' => 'SEND AN EMAIL', 'href' => '/contact-us'),
            ),
            'hero_buttons'     => array(
                array('label' => 'GET A CALL BACK', 'href' => '#'),
                array('label' => 'JOIN PORTS SACCO', 'href' => '/contact-us'),
            ),
            'intro_heading'     => 'Our Services',
            'intro_description' => 'Ports DT Sacco provides a wide array of services to cater for the financial needs of all our members. We are also constantly innovating to cater for emerging needs and markets.',
            'cards'             => array(
                array('image_id' => 0, 'title' => 'Till Number for Business', 'description' => 'Get your Ports Sacco Business Till Number today for Customers to pay quickly and securely via mobile money.', 'href' => ''),
                array('image_id' => 0, 'title' => 'Mobile Banking', 'description' => 'Experience the ultimate convenience in banking with our Mobile Banking services.', 'href' => '/services/mobile-banking-services'),
                array('image_id' => 0, 'title' => 'Cheque Clearance', 'description' => 'Ensure your cash flows run smoothly with our swift Cheque Clearance services.', 'href' => ''),
                array('image_id' => 0, 'title' => 'Salary Processing', 'description' => 'Easily manage payroll with our swift Salary Processing services. We ensure your operations run efficiently.', 'href' => ''),
                array('image_id' => 0, 'title' => 'Standing Orders', 'description' => 'Set up a Standing Order with Ports Sacco today and experience the convenience of automated financial management!', 'href' => ''),
                array('image_id' => 0, 'title' => 'Rent Collection', 'description' => 'Streamline your rent collection process and manage your rental payments with ease.', 'href' => ''),
                array('image_id' => 0, 'title' => 'School Fees Collection', 'description' => 'Open a School Fees Collection Account with Ports Sacco today and effortlessly streamline your fees collections.', 'href' => ''),
                array('image_id' => 0, 'title' => 'Financial Advice', 'description' => 'Make smart financial decisions with customized financial advice based on your unique goals and needs.', 'href' => ''),
                array('image_id' => 0, 'title' => 'Insurance Services', 'description' => 'We protect both your deposits and loans with comprehensive insurance coverage.', 'href' => ''),
            ),
        );
    }

    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'handle_save'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_ports_services_remove_card', array($this, 'ajax_remove_card'));
    }

    public function add_admin_menu() {
        add_menu_page(
            'Services Page',
            'Services Page',
            'manage_options',
            'services-page-editor',
            array($this, 'render_page'),
            'dashicons-edit-page',
            32
        );
    }

    public function enqueue_scripts($hook) {
        if ($hook !== 'toplevel_page_services-page-editor') {
            return;
        }
        wp_enqueue_media();
        wp_enqueue_style('services-page-editor', plugin_dir_url(dirname(__FILE__)) . 'assets/admin.css', array(), PORTS_SERVICES_EDITOR_VERSION);
        wp_enqueue_script('services-page-editor', plugin_dir_url(dirname(__FILE__)) . 'assets/admin.js', array('jquery'), PORTS_SERVICES_EDITOR_VERSION, true);
        wp_localize_script('services-page-editor', 'portsServicesEditor', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('ports_services_editor'),
            'actionRemoveCard' => 'ports_services_remove_card',
        ));
    }

    /**
     * AJAX: remove a card and update the option in the DB.
     */
    public function ajax_remove_card() {
        $body = file_get_contents('php://input');
        $input = json_decode($body, true);
        if (empty($input['nonce']) || !wp_verify_nonce($input['nonce'], 'ports_services_editor')) {
            wp_send_json_error(array('message' => 'Invalid nonce'), 403);
        }
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Forbidden'), 403);
        }

        if (!isset($input['cards']) || !is_array($input['cards'])) {
            wp_send_json_error(array('message' => 'Invalid payload'));
        }

        $current  = get_option(self::OPTION_KEY, array());
        $defaults = self::get_default_settings();
        $data     = wp_parse_args($current, $defaults);

        $new_cards = array();
        foreach ($input['cards'] as $card) {
            $title = isset($card['title']) ? sanitize_text_field($card['title']) : '';
            if ($title === '') {
                continue;
            }
            $new_cards[] = array(
                'image_id'    => isset($card['image_id']) ? absint($card['image_id']) : 0,
                'title'       => $title,
                'description' => isset($card['description']) ? sanitize_textarea_field($card['description']) : '',
                'href'        => isset($card['href']) ? sanitize_text_field($card['href']) : '',
            );
        }

        $data['cards'] = $new_cards;
        update_option(self::OPTION_KEY, $data);

        wp_send_json_success(array('message' => __('Card removed and saved.', 'services-page-editor')));
    }

    public function handle_save() {
        if (!isset($_POST['ports_services_page_nonce']) || !wp_verify_nonce($_POST['ports_services_page_nonce'], 'ports_services_save')) {
            return;
        }
        if (!current_user_can('manage_options')) {
            return;
        }

        $raw  = isset($_POST['ports_services_page']) ? $_POST['ports_services_page'] : array();
        $data = array(
            'hero_banner_id'    => isset($raw['hero_banner_id']) ? absint($raw['hero_banner_id']) : 0,
            'hero_heading'      => isset($raw['hero_heading']) ? sanitize_text_field($raw['hero_heading']) : 'Services',
            'hero_menu_items'   => array(),
            'hero_buttons'      => array(),
            'intro_heading'     => isset($raw['intro_heading']) ? sanitize_text_field($raw['intro_heading']) : '',
            'intro_description' => isset($raw['intro_description']) ? sanitize_textarea_field($raw['intro_description']) : '',
            'cards'             => array(),
        );

        if (!empty($raw['hero_menu_items']) && is_array($raw['hero_menu_items'])) {
            foreach ($raw['hero_menu_items'] as $i => $item) {
                $data['hero_menu_items'][] = array(
                    'id'    => sanitize_key($item['id'] ?? 'item-' . $i),
                    'label' => sanitize_text_field($item['label'] ?? ''),
                    'href'  => sanitize_text_field($item['href'] ?? '#'),
                );
            }
        }

        if (!empty($raw['hero_buttons']) && is_array($raw['hero_buttons'])) {
            foreach ($raw['hero_buttons'] as $btn) {
                $data['hero_buttons'][] = array(
                    'label' => sanitize_text_field($btn['label'] ?? ''),
                    'href'  => sanitize_text_field($btn['href'] ?? '#'),
                );
            }
        }

        if (!empty($raw['cards']) && is_array($raw['cards'])) {
            foreach ($raw['cards'] as $card) {
                $title = sanitize_text_field($card['title'] ?? '');
                if ($title === '') {
                    continue;
                }
                $data['cards'][] = array(
                    'image_id'    => isset($card['image_id']) ? absint($card['image_id']) : 0,
                    'title'       => $title,
                    'description' => sanitize_textarea_field($card['description'] ?? ''),
                    'href'        => sanitize_text_field($card['href'] ?? ''),
                );
            }
        }

        update_option(self::OPTION_KEY, $data);
        add_settings_error(
            'ports_services_page',
            'saved',
            __('Settings saved. Frontend will reflect changes.', 'services-page-editor'),
            'success'
        );
    }

    public function render_page() {
        $data = get_option(self::OPTION_KEY, array());
        $data = wp_parse_args($data, self::get_default_settings());

        settings_errors('ports_services_page');

        $banner_url = $data['hero_banner_id'] ? wp_get_attachment_image_url($data['hero_banner_id'], 'medium') : '';
        $page_url  = admin_url('admin.php?page=services-page-editor');
        ?>
        <div class="wrap ports-services-editor">
            <h1><?php esc_html_e('Services Page Editor', 'services-page-editor'); ?></h1>
            <p class="description"><?php esc_html_e('Edit content for the Services page. Changes appear on the frontend via the REST API.', 'services-page-editor'); ?></p>

            <form method="post" action="<?php echo esc_url($page_url); ?>" id="ports-services-form">
                <?php wp_nonce_field('ports_services_save', 'ports_services_page_nonce'); ?>

                <!-- Hero -->
                <div class="ports-section">
                    <h2><?php esc_html_e('Hero Section', 'services-page-editor'); ?></h2>
                    <table class="form-table">
                        <tr>
                            <th><label for="hero_banner"><?php esc_html_e('Background banner image', 'services-page-editor'); ?></label></th>
                            <td>
                                <div class="ports-media-wrap">
                                    <input type="hidden" name="ports_services_page[hero_banner_id]" id="hero_banner_id" value="<?php echo esc_attr($data['hero_banner_id']); ?>" />
                                    <button type="button" class="button ports-upload" data-target="hero_banner_id"><?php esc_html_e('Upload / Select image', 'services-page-editor'); ?></button>
                                    <button type="button" class="button ports-remove" data-target="hero_banner_id"><?php esc_html_e('Remove', 'services-page-editor'); ?></button>
                                    <div class="ports-preview" id="hero_banner_preview"><?php if ($banner_url) { ?><img src="<?php echo esc_url($banner_url); ?>" alt="" style="max-width:300px;height:auto;" /><?php } ?></div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="hero_heading"><?php esc_html_e('Hero heading', 'services-page-editor'); ?></label></th>
                            <td><input type="text" name="ports_services_page[hero_heading]" id="hero_heading" value="<?php echo esc_attr($data['hero_heading']); ?>" class="regular-text" /></td>
                        </tr>
                    </table>
                    <h3><?php esc_html_e('Menu items (e.g. Appointment, Send an email)', 'services-page-editor'); ?></h3>
                    <div id="hero-menu-items">
                        <?php foreach ($data['hero_menu_items'] as $idx => $item) : ?>
                            <div class="ports-repeat-row">
                                <input type="text" name="ports_services_page[hero_menu_items][<?php echo $idx; ?>][id]" value="<?php echo esc_attr($item['id']); ?>" placeholder="id (e.g. appointment)" />
                                <input type="text" name="ports_services_page[hero_menu_items][<?php echo $idx; ?>][label]" value="<?php echo esc_attr($item['label']); ?>" placeholder="Label" />
                                <input type="text" name="ports_services_page[hero_menu_items][<?php echo $idx; ?>][href]" value="<?php echo esc_attr($item['href']); ?>" placeholder="Link (e.g. /contact-us or #)" />
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <h3><?php esc_html_e('CTA buttons (Call back, Join Portsacco)', 'services-page-editor'); ?></h3>
                    <div id="hero-buttons">
                        <?php foreach ($data['hero_buttons'] as $idx => $btn) : ?>
                            <div class="ports-repeat-row">
                                <input type="text" name="ports_services_page[hero_buttons][<?php echo $idx; ?>][label]" value="<?php echo esc_attr($btn['label']); ?>" placeholder="Button label" />
                                <input type="text" name="ports_services_page[hero_buttons][<?php echo $idx; ?>][href]" value="<?php echo esc_attr($btn['href']); ?>" placeholder="Link" />
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Intro -->
                <div class="ports-section">
                    <h2><?php esc_html_e('Intro section (Our Services)', 'services-page-editor'); ?></h2>
                    <table class="form-table">
                        <tr>
                            <th><label for="intro_heading"><?php esc_html_e('Heading', 'services-page-editor'); ?></label></th>
                            <td><input type="text" name="ports_services_page[intro_heading]" id="intro_heading" value="<?php echo esc_attr($data['intro_heading']); ?>" class="regular-text" /></td>
                        </tr>
                        <tr>
                            <th><label for="intro_description"><?php esc_html_e('Description', 'services-page-editor'); ?></label></th>
                            <td><textarea name="ports_services_page[intro_description]" id="intro_description" rows="4" class="large-text"><?php echo esc_textarea($data['intro_description']); ?></textarea></td>
                        </tr>
                    </table>
                </div>

                <!-- Cards -->
                <div class="ports-section">
                    <h2><?php esc_html_e('Service cards', 'services-page-editor'); ?></h2>
                    <p class="description"><?php esc_html_e('Each card: image, title, description, and optional link. Use Remove to delete a card.', 'services-page-editor'); ?></p>
                    <div id="cards-container">
                        <?php foreach ($data['cards'] as $idx => $card) : ?>
                            <div class="ports-card-row" data-index="<?php echo $idx; ?>">
                                <div class="ports-card-fields">
                                    <div class="ports-card-row-header">
                                        <span class="ports-card-row-label"><?php esc_html_e('Card', 'services-page-editor'); ?> #<span class="ports-card-num"><?php echo $idx + 1; ?></span></span>
                                        <button type="button" class="button button-link-delete ports-remove-card" aria-label="<?php esc_attr_e('Remove this card', 'services-page-editor'); ?>"><?php esc_html_e('Remove', 'services-page-editor'); ?></button>
                                    </div>
                                    <div class="ports-media-wrap">
                                        <input type="hidden" name="ports_services_page[cards][<?php echo $idx; ?>][image_id]" class="card-image-id" value="<?php echo esc_attr($card['image_id']); ?>" />
                                        <button type="button" class="button ports-upload" data-target="<?php echo $idx; ?>"><?php esc_html_e('Image', 'services-page-editor'); ?></button>
                                        <div class="ports-preview card-preview"><?php
                                            if (!empty($card['image_id'])) {
                                                $img = wp_get_attachment_image_url($card['image_id'], 'thumbnail');
                                                if ($img) {
                                                    echo '<img src="' . esc_url($img) . '" alt="" />';
                                                }
                                            }
                                        ?></div>
                                    </div>
                                    <input type="text" name="ports_services_page[cards][<?php echo $idx; ?>][title]" value="<?php echo esc_attr($card['title']); ?>" placeholder="Card title" class="card-title" />
                                    <textarea name="ports_services_page[cards][<?php echo $idx; ?>][description]" rows="2" placeholder="Description"><?php echo esc_textarea($card['description']); ?></textarea>
                                    <input type="text" name="ports_services_page[cards][<?php echo $idx; ?>][href]" value="<?php echo esc_attr($card['href']); ?>" placeholder="Link URL (e.g. /services/mobile-banking)" class="card-href" />
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <p><button type="button" class="button" id="add-card"><?php esc_html_e('Add another card', 'services-page-editor'); ?></button></p>
                </div>

                <?php submit_button(__('Save changes', 'services-page-editor')); ?>
            </form>
        </div>
        <?php
    }
}
