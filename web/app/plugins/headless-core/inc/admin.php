<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const HEADLESS_CORE_OPTION_ENABLE_TRANSIENTS = 'headless_core_enable_transients';
const HEADLESS_CORE_OPTION_RECAPTCHA_SECRET = 'headless_core_recaptcha_secret';
const HEADLESS_CORE_OPTION_RECAPTCHA_MIN_SCORE = 'headless_core_recaptcha_min_score';

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

    register_setting('headless_core_settings_group', HEADLESS_CORE_OPTION_RECAPTCHA_SECRET, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return trim((string) $value);
        },
        'default' => '',
    ]);

    register_setting('headless_core_settings_group', HEADLESS_CORE_OPTION_RECAPTCHA_MIN_SCORE, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            $raw = trim((string) $value);
            if ($raw === '') {
                return '';
            }
            $num = (float) $raw;
            if ($num <= 0 || $num > 1) {
                return '';
            }
            return rtrim(rtrim(number_format($num, 2, '.', ''), '0'), '.');
        },
        'default' => '',
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
    $recaptchaSecret = (string) get_option(HEADLESS_CORE_OPTION_RECAPTCHA_SECRET, '');
    $recaptchaMinScore = (string) get_option(HEADLESS_CORE_OPTION_RECAPTCHA_MIN_SCORE, '');
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
        <script>
            (function () {
                function ready(fn) {
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', fn);
                    } else {
                        fn();
                    }
                }
                ready(function () {
                    var btn = document.getElementById('headless-core-recaptcha-toggle');
                    var input = document.getElementById('<?php echo esc_js(HEADLESS_CORE_OPTION_RECAPTCHA_SECRET); ?>');
                    if (!btn || !input) return;
                    btn.addEventListener('click', function () {
                        var isHidden = input.type === 'password';
                        input.type = isHidden ? 'text' : 'password';
                        btn.textContent = isHidden ? '<?php echo esc_js(__('Hide', 'headless-core')); ?>' : '<?php echo esc_js(__('Show', 'headless-core')); ?>';
                    });
                });
            })();
        </script>
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

                    <hr style="margin: 22px 0; border: 0; border-top: 1px solid #e5e7eb;" />
                    <h2 style="margin-top: 0;"><?php echo esc_html__('Bot protection (reCAPTCHA v3)', 'headless-core'); ?></h2>
                    <p style="color: #50575e; margin-top: 6px;">
                        <?php echo esc_html__('Used to protect public form submissions (Contact + Apply). The secret key is stored in WordPress options and used server-side only.', 'headless-core'); ?>
                    </p>
                    <table class="form-table" role="presentation" style="margin-top: 8px;">
                        <tbody>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr(HEADLESS_CORE_OPTION_RECAPTCHA_SECRET); ?>"><?php echo esc_html__('reCAPTCHA Secret Key', 'headless-core'); ?></label>
                            </th>
                            <td>
                                <div style="display: flex; gap: 8px; align-items: center; max-width: 520px;">
                                    <input
                                        type="password"
                                        id="<?php echo esc_attr(HEADLESS_CORE_OPTION_RECAPTCHA_SECRET); ?>"
                                        name="<?php echo esc_attr(HEADLESS_CORE_OPTION_RECAPTCHA_SECRET); ?>"
                                        value="<?php echo esc_attr($recaptchaSecret); ?>"
                                        class="regular-text"
                                        autocomplete="new-password"
                                        style="flex: 1 1 auto;"
                                    />
                                    <button
                                        type="button"
                                        class="button"
                                        id="headless-core-recaptcha-toggle"
                                        aria-controls="<?php echo esc_attr(HEADLESS_CORE_OPTION_RECAPTCHA_SECRET); ?>"
                                    >
                                        <?php echo esc_html__('Show', 'headless-core'); ?>
                                    </button>
                                </div>
                                <p class="description">
                                    <?php echo esc_html__('Paste your Google reCAPTCHA v3 secret key here. (Do not put the site key here.)', 'headless-core'); ?>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr(HEADLESS_CORE_OPTION_RECAPTCHA_MIN_SCORE); ?>"><?php echo esc_html__('Minimum score (0–1)', 'headless-core'); ?></label>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    id="<?php echo esc_attr(HEADLESS_CORE_OPTION_RECAPTCHA_MIN_SCORE); ?>"
                                    name="<?php echo esc_attr(HEADLESS_CORE_OPTION_RECAPTCHA_MIN_SCORE); ?>"
                                    value="<?php echo esc_attr($recaptchaMinScore); ?>"
                                    class="small-text"
                                    inputmode="decimal"
                                    placeholder="0.5"
                                />
                                <p class="description">
                                    <?php echo esc_html__('Optional. If empty, defaults to 0.5. Lower = easier to pass; higher = stricter.', 'headless-core'); ?>
                                </p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <p style="margin-top: 16px;">
                    <?php submit_button(__('Save Settings', 'headless-core'), 'primary', 'submit', false); ?>
                </p>
            </form>
        <?php endif; ?>
    </div>
    <?php
}
