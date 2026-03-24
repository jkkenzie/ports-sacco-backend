<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const HEADLESS_CORE_OPTION_ENABLE_TRANSIENTS = 'headless_core_enable_transients';

add_action('admin_menu', static function (): void {
    add_menu_page(
        __('Headless Core', 'headless-core'),
        __('Headless Core', 'headless-core'),
        'manage_options',
        'headless-core-settings',
        'headless_core_render_settings_page',
        'dashicons-admin-generic',
        58
    );
});

add_action('admin_init', static function (): void {
    register_setting('headless_core_settings_group', HEADLESS_CORE_OPTION_ENABLE_TRANSIENTS, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return ((string) $value === '1') ? '1' : '0';
        },
        'default' => '1',
    ]);
});

/**
 * Render settings page with tabs.
 */
function headless_core_render_settings_page(): void
{
    if (! current_user_can('manage_options')) {
        return;
    }

    $activeTab = isset($_GET['tab']) ? sanitize_key((string) $_GET['tab']) : 'general';
    if (! in_array($activeTab, ['general'], true)) {
        $activeTab = 'general';
    }

    $enabled = get_option(HEADLESS_CORE_OPTION_ENABLE_TRANSIENTS, '1') === '1';
    ?>
    <div class="wrap">
        <h1><?php echo esc_html__('Headless Core Settings', 'headless-core'); ?></h1>
        <style>
            .headless-core-switch {
                position: relative;
                display: inline-flex;
                width: 54px;
                height: 30px;
            }
            .headless-core-switch input {
                opacity: 0;
                width: 0;
                height: 0;
                position: absolute;
            }
            .headless-core-switch-track {
                position: absolute;
                inset: 0;
                border-radius: 999px;
                background: #8c8f94;
                transition: background-color .2s ease;
                cursor: pointer;
            }
            .headless-core-switch-thumb {
                position: absolute;
                top: 3px;
                left: 3px;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #fff;
                box-shadow: 0 1px 3px rgba(0,0,0,.25);
                transition: transform .2s ease;
                cursor: pointer;
            }
            .headless-core-switch input:checked + .headless-core-switch-track {
                background: #22ACB6;
            }
            .headless-core-switch input:checked + .headless-core-switch-track + .headless-core-switch-thumb {
                transform: translateX(24px);
            }
            .headless-core-switch input:focus + .headless-core-switch-track {
                box-shadow: 0 0 0 2px rgba(34,172,182,.25);
            }
        </style>
        <div class="nav-tab-wrapper" style="margin-bottom: 16px;">
            <a href="<?php echo esc_url(admin_url('admin.php?page=headless-core-settings&tab=general')); ?>" class="nav-tab <?php echo $activeTab === 'general' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('General Settings', 'headless-core'); ?>
            </a>
        </div>

        <?php if ($activeTab === 'general') : ?>
            <form method="post" action="options.php">
                <?php settings_fields('headless_core_settings_group'); ?>
                <div style="max-width: 880px; background: #fff; border: 1px solid #dcdcde; border-radius: 10px; padding: 20px;">
                    <h2 style="margin-top: 0;"><?php echo esc_html__('Caching Controls', 'headless-core'); ?></h2>
                    <p style="color: #50575e; margin-top: 6px;">
                        <?php echo esc_html__('Enable or disable transient caching for Headless Core APIs and related features.', 'headless-core'); ?>
                    </p>

                    <div style="display: flex; align-items: center; gap: 14px; margin-top: 18px;">
                        <label class="headless-core-switch" aria-label="<?php echo esc_attr__('Enable Transient Caching', 'headless-core'); ?>">
                            <input type="hidden" name="<?php echo esc_attr(HEADLESS_CORE_OPTION_ENABLE_TRANSIENTS); ?>" value="0" />
                            <input type="checkbox" name="<?php echo esc_attr(HEADLESS_CORE_OPTION_ENABLE_TRANSIENTS); ?>" value="1" <?php checked($enabled); ?> />
                            <span class="headless-core-switch-track"></span>
                            <span class="headless-core-switch-thumb"></span>
                        </label>
                        <div>
                            <strong><?php echo esc_html__('Enable Transient Caching', 'headless-core'); ?></strong>
                            <div style="margin-top: 4px; color: #50575e;">
                                <?php echo $enabled ? esc_html__('Enabled (recommended).', 'headless-core') : esc_html__('Disabled. All API responses bypass transient cache.', 'headless-core'); ?>
                            </div>
                        </div>
                    </div>
                </div>
                <p style="margin-top: 16px;">
                    <?php submit_button(__('Save Settings', 'headless-core'), 'primary', 'submit', false); ?>
                </p>
            </form>
        <?php endif; ?>
    </div>
    <?php
}
