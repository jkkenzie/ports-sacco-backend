<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const HEADLESS_CORE_OPTION_ENABLE_TRANSIENTS = 'headless_core_enable_transients';
// Turnstile option constants live in inc/turnstile.php.

if (! defined('HEADLESS_CORE_OPTION_YOUTUBE_API_KEY')) {
    define('HEADLESS_CORE_OPTION_YOUTUBE_API_KEY', 'headless_core_youtube_api_key');
}
if (! defined('HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID')) {
    define('HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID', 'headless_core_youtube_channel_id');
}

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

    register_setting('headless_core_settings_group', HEADLESS_CORE_OPTION_TURNSTILE_ENABLED, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return ((string) $value === '1') ? '1' : '0';
        },
        'default' => '0',
    ]);

    register_setting('headless_core_settings_group', HEADLESS_CORE_OPTION_TURNSTILE_SITE_KEY, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return trim((string) $value);
        },
        'default' => '',
    ]);

    register_setting('headless_core_settings_group', HEADLESS_CORE_OPTION_TURNSTILE_SECRET, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return trim((string) $value);
        },
        'default' => '',
    ]);

    register_setting('headless_core_settings_group', HEADLESS_CORE_OPTION_YOUTUBE_API_KEY, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return trim((string) $value);
        },
        'default' => '',
    ]);

    register_setting('headless_core_settings_group', HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return headless_core_youtube_sanitize_channel_id((string) $value);
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
    if (! in_array($activeTab, ['general', 'youtube', 'seo'], true)) {
        $activeTab = 'general';
    }

    $enabled = get_option(HEADLESS_CORE_OPTION_ENABLE_TRANSIENTS, '1') === '1';
    $turnstileEnabled = get_option(HEADLESS_CORE_OPTION_TURNSTILE_ENABLED, '0') === '1';
    $turnstileSiteKey = (string) get_option(HEADLESS_CORE_OPTION_TURNSTILE_SITE_KEY, '');
    $turnstileSecret = (string) get_option(HEADLESS_CORE_OPTION_TURNSTILE_SECRET, '');
    $youtubeApiKey = (string) get_option(HEADLESS_CORE_OPTION_YOUTUBE_API_KEY, '');
    $youtubeChannelId = (string) get_option(HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID, '');
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
                    function bindToggle(btnId, inputId) {
                        var btn = document.getElementById(btnId);
                        var input = document.getElementById(inputId);
                        if (!btn || !input) return;
                        btn.addEventListener('click', function () {
                            var isHidden = input.type === 'password';
                            input.type = isHidden ? 'text' : 'password';
                            btn.textContent = isHidden ? '<?php echo esc_js(__('Hide', 'headless-core')); ?>' : '<?php echo esc_js(__('Show', 'headless-core')); ?>';
                        });
                    }
                    bindToggle('headless-core-turnstile-toggle', '<?php echo esc_js(HEADLESS_CORE_OPTION_TURNSTILE_SECRET); ?>');
                    bindToggle('headless-core-youtube-toggle', '<?php echo esc_js(HEADLESS_CORE_OPTION_YOUTUBE_API_KEY); ?>');
                });
            })();
        </script>
        <div class="nav-tab-wrapper" style="margin-bottom: 16px;">
            <a href="<?php echo esc_url(admin_url('admin.php?page=headless-core-settings&tab=general')); ?>" class="nav-tab <?php echo $activeTab === 'general' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('General Settings', 'headless-core'); ?>
            </a>
            <a href="<?php echo esc_url(admin_url('admin.php?page=headless-core-settings&tab=youtube')); ?>" class="nav-tab <?php echo $activeTab === 'youtube' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('YouTube', 'headless-core'); ?>
            </a>
            <a href="<?php echo esc_url(admin_url('admin.php?page=headless-core-settings&tab=seo')); ?>" class="nav-tab <?php echo $activeTab === 'seo' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('SEO', 'headless-core'); ?>
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
                    <h2 style="margin-top: 0;"><?php echo esc_html__('Bot protection (Cloudflare Turnstile)', 'headless-core'); ?></h2>
                    <p style="color: #50575e; margin-top: 6px;">
                        <?php echo esc_html__('Off by default. Forms always use WordPress nonce + honeypot. When enabled with both keys, Turnstile runs seamlessly on public form submissions.', 'headless-core'); ?>
                    </p>

                    <div style="display: flex; align-items: center; gap: 14px; margin-top: 18px; margin-bottom: 12px;">
                        <label class="headless-core-switch" aria-label="<?php echo esc_attr__('Enable Cloudflare Turnstile', 'headless-core'); ?>">
                            <input type="hidden" name="<?php echo esc_attr(HEADLESS_CORE_OPTION_TURNSTILE_ENABLED); ?>" value="0" />
                            <input type="checkbox" name="<?php echo esc_attr(HEADLESS_CORE_OPTION_TURNSTILE_ENABLED); ?>" value="1" <?php checked($turnstileEnabled); ?> />
                            <span class="headless-core-switch-track"></span>
                            <span class="headless-core-switch-thumb"></span>
                        </label>
                        <div>
                            <strong><?php echo esc_html__('Enable Cloudflare Turnstile', 'headless-core'); ?></strong>
                            <div style="margin-top: 4px; color: #50575e;">
                                <?php
                                echo $turnstileEnabled
                                    ? esc_html__('Enabled. Forms will request a Turnstile token when site + secret keys are set.', 'headless-core')
                                    : esc_html__('Disabled. Forms rely on nonce + honeypot only.', 'headless-core');
                                ?>
                            </div>
                        </div>
                    </div>

                    <table class="form-table" role="presentation" style="margin-top: 8px;">
                        <tbody>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr(HEADLESS_CORE_OPTION_TURNSTILE_SITE_KEY); ?>"><?php echo esc_html__('Turnstile Site Key', 'headless-core'); ?></label>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    id="<?php echo esc_attr(HEADLESS_CORE_OPTION_TURNSTILE_SITE_KEY); ?>"
                                    name="<?php echo esc_attr(HEADLESS_CORE_OPTION_TURNSTILE_SITE_KEY); ?>"
                                    value="<?php echo esc_attr($turnstileSiteKey); ?>"
                                    class="regular-text"
                                    autocomplete="off"
                                    style="max-width: 520px;"
                                />
                                <p class="description">
                                    <?php echo esc_html__('Public widget site key from Cloudflare Turnstile. Exposed to the frontend via /wp-json/custom/v1/nonce when enabled.', 'headless-core'); ?>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr(HEADLESS_CORE_OPTION_TURNSTILE_SECRET); ?>"><?php echo esc_html__('Turnstile Secret Key', 'headless-core'); ?></label>
                            </th>
                            <td>
                                <div style="display: flex; gap: 8px; align-items: center; max-width: 520px;">
                                    <input
                                        type="password"
                                        id="<?php echo esc_attr(HEADLESS_CORE_OPTION_TURNSTILE_SECRET); ?>"
                                        name="<?php echo esc_attr(HEADLESS_CORE_OPTION_TURNSTILE_SECRET); ?>"
                                        value="<?php echo esc_attr($turnstileSecret); ?>"
                                        class="regular-text"
                                        autocomplete="new-password"
                                        style="flex: 1 1 auto;"
                                    />
                                    <button
                                        type="button"
                                        class="button"
                                        id="headless-core-turnstile-toggle"
                                        aria-controls="<?php echo esc_attr(HEADLESS_CORE_OPTION_TURNSTILE_SECRET); ?>"
                                    >
                                        <?php echo esc_html__('Show', 'headless-core'); ?>
                                    </button>
                                </div>
                                <p class="description">
                                    <?php echo esc_html__('Server-side only. Create keys in Cloudflare Dashboard → Turnstile.', 'headless-core'); ?>
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
        <?php elseif ($activeTab === 'youtube') : ?>
            <form method="post" action="options.php">
                <?php settings_fields('headless_core_settings_group'); ?>
                <div style="max-width: 880px; background: #fff; border: 1px solid #dcdcde; border-radius: 10px; padding: 20px;">
                    <h2 style="margin-top: 0;"><?php echo esc_html__('YouTube Data API', 'headless-core'); ?></h2>
                    <p style="color: #50575e; margin-top: 6px;">
                        <?php echo esc_html__('Connect your YouTube channel so the YouTube Grid block can display latest uploads on the headless frontend. The API key is stored server-side and never exposed to visitors.', 'headless-core'); ?>
                    </p>
                    <p style="color: #50575e;">
                        <?php echo esc_html__('Create a key in Google Cloud Console and enable the YouTube Data API v3.', 'headless-core'); ?>
                        <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener noreferrer">
                            <?php echo esc_html__('Open Google Cloud Console', 'headless-core'); ?>
                        </a>
                    </p>
                    <table class="form-table" role="presentation" style="margin-top: 8px;">
                        <tbody>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr(HEADLESS_CORE_OPTION_YOUTUBE_API_KEY); ?>"><?php echo esc_html__('YouTube API key', 'headless-core'); ?></label>
                            </th>
                            <td>
                                <div style="display: flex; gap: 8px; align-items: center; max-width: 520px;">
                                    <input
                                        type="password"
                                        id="<?php echo esc_attr(HEADLESS_CORE_OPTION_YOUTUBE_API_KEY); ?>"
                                        name="<?php echo esc_attr(HEADLESS_CORE_OPTION_YOUTUBE_API_KEY); ?>"
                                        value="<?php echo esc_attr($youtubeApiKey); ?>"
                                        class="regular-text"
                                        autocomplete="new-password"
                                        style="flex: 1 1 auto;"
                                    />
                                    <button type="button" class="button" id="headless-core-youtube-toggle">
                                        <?php echo esc_html__('Show', 'headless-core'); ?>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr(HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID); ?>"><?php echo esc_html__('Default channel ID or @handle', 'headless-core'); ?></label>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    id="<?php echo esc_attr(HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID); ?>"
                                    name="<?php echo esc_attr(HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID); ?>"
                                    value="<?php echo esc_attr($youtubeChannelId); ?>"
                                    class="regular-text"
                                    placeholder="UCxxxxxxxxxxxxxxxxxxxxxx or @YourChannel"
                                />
                                <p class="description">
                                    <?php echo esc_html__('Find the channel ID on YouTube → channel page → About, or use the public @handle.', 'headless-core'); ?>
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
        <?php elseif ($activeTab === 'seo') : ?>
            <?php headless_core_render_seo_settings_tab(); ?>
        <?php endif; ?>
    </div>
    <?php
}

/**
 * Render the SEO global defaults tab.
 */
function headless_core_render_seo_settings_tab(): void
{
    wp_enqueue_media();

    $siteName = (string) get_option(HEADLESS_CORE_SEO_OPT_SITE_NAME, '');
    $titleTemplate = (string) get_option(HEADLESS_CORE_SEO_OPT_TITLE_TEMPLATE, '');
    $separator = (string) get_option(HEADLESS_CORE_SEO_OPT_SEPARATOR, '');
    $defaultDescription = (string) get_option(HEADLESS_CORE_SEO_OPT_DEFAULT_DESCRIPTION, '');
    $twitterSite = (string) get_option(HEADLESS_CORE_SEO_OPT_TWITTER_SITE, '');
    $frontendUrl = (string) get_option(HEADLESS_CORE_SEO_OPT_FRONTEND_URL, '');
    $orgName = (string) get_option(HEADLESS_CORE_SEO_OPT_ORG_NAME, '');
    $orgSameAs = (string) get_option(HEADLESS_CORE_SEO_OPT_ORG_SAME_AS, '');
    $defaultImageId = (int) get_option(HEADLESS_CORE_SEO_OPT_DEFAULT_OG_IMAGE, 0);
    $orgLogoId = (int) get_option(HEADLESS_CORE_SEO_OPT_ORG_LOGO, 0);
    $defaultImageUrl = $defaultImageId > 0 ? (string) wp_get_attachment_image_url($defaultImageId, 'medium') : '';
    $orgLogoUrl = $orgLogoId > 0 ? (string) wp_get_attachment_image_url($orgLogoId, 'medium') : '';
    ?>
    <form method="post" action="options.php">
        <?php settings_fields('headless_core_settings_group'); ?>
        <div style="max-width: 880px; background: #fff; border: 1px solid #dcdcde; border-radius: 10px; padding: 20px;">
            <h2 style="margin-top: 0;"><?php echo esc_html__('Global SEO Defaults', 'headless-core'); ?></h2>
            <p style="color: #50575e; margin-top: 6px;">
                <?php echo esc_html__('These defaults are used whenever a page or item does not define its own SEO values. Per-page SEO is edited in the sidebar of each page/post.', 'headless-core'); ?>
            </p>
            <table class="form-table" role="presentation">
                <tbody>
                <tr>
                    <th scope="row"><label for="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_SITE_NAME); ?>"><?php echo esc_html__('Site name', 'headless-core'); ?></label></th>
                    <td>
                        <input type="text" class="regular-text" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_SITE_NAME); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_SITE_NAME); ?>" value="<?php echo esc_attr($siteName); ?>" placeholder="<?php echo esc_attr(get_bloginfo('name')); ?>" />
                        <p class="description"><?php echo esc_html__('Used in title templates and Open Graph. Defaults to your WordPress site title.', 'headless-core'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_TITLE_TEMPLATE); ?>"><?php echo esc_html__('Title template', 'headless-core'); ?></label></th>
                    <td>
                        <input type="text" class="regular-text" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_TITLE_TEMPLATE); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_TITLE_TEMPLATE); ?>" value="<?php echo esc_attr($titleTemplate); ?>" placeholder="%title% %sep% %sitename%" />
                        <p class="description"><?php echo esc_html__('Tokens: %title%, %sitename%, %sep%. Example: %title% %sep% %sitename%', 'headless-core'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_SEPARATOR); ?>"><?php echo esc_html__('Title separator', 'headless-core'); ?></label></th>
                    <td>
                        <input type="text" class="small-text" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_SEPARATOR); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_SEPARATOR); ?>" value="<?php echo esc_attr($separator); ?>" placeholder="|" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_DEFAULT_DESCRIPTION); ?>"><?php echo esc_html__('Default meta description', 'headless-core'); ?></label></th>
                    <td>
                        <textarea class="large-text" rows="3" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_DEFAULT_DESCRIPTION); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_DEFAULT_DESCRIPTION); ?>"><?php echo esc_textarea($defaultDescription); ?></textarea>
                        <p class="description"><?php echo esc_html__('Fallback description when a page has none and none can be derived from its content.', 'headless-core'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label><?php echo esc_html__('Default share image', 'headless-core'); ?></label></th>
                    <td>
                        <div class="hc-seo-media" data-target="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_DEFAULT_OG_IMAGE); ?>">
                            <input type="hidden" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_DEFAULT_OG_IMAGE); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_DEFAULT_OG_IMAGE); ?>" value="<?php echo esc_attr((string) $defaultImageId); ?>" />
                            <img class="hc-seo-media-preview" src="<?php echo esc_url($defaultImageUrl); ?>" alt="" style="max-width: 220px; height: auto; display: <?php echo $defaultImageUrl !== '' ? 'block' : 'none'; ?>; border: 1px solid #dcdcde; border-radius: 6px; margin-bottom: 8px;" />
                            <button type="button" class="button hc-seo-media-select"><?php echo esc_html__('Select image', 'headless-core'); ?></button>
                            <button type="button" class="button hc-seo-media-clear" style="<?php echo $defaultImageId > 0 ? '' : 'display:none;'; ?>"><?php echo esc_html__('Remove', 'headless-core'); ?></button>
                        </div>
                        <p class="description"><?php echo esc_html__('Recommended 1200×630px. Used for Open Graph/Twitter when no page image is available.', 'headless-core'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_TWITTER_SITE); ?>"><?php echo esc_html__('Twitter/X handle', 'headless-core'); ?></label></th>
                    <td>
                        <input type="text" class="regular-text" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_TWITTER_SITE); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_TWITTER_SITE); ?>" value="<?php echo esc_attr($twitterSite); ?>" placeholder="@portsacco" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_FRONTEND_URL); ?>"><?php echo esc_html__('Frontend site URL', 'headless-core'); ?></label></th>
                    <td>
                        <input type="url" class="regular-text" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_FRONTEND_URL); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_FRONTEND_URL); ?>" value="<?php echo esc_attr($frontendUrl); ?>" placeholder="<?php echo esc_attr(home_url('/')); ?>" />
                        <p class="description"><?php echo esc_html__('Public URL of the React site. Used to build canonical and og:url links. Defaults to the WordPress home URL.', 'headless-core'); ?></p>
                    </td>
                </tr>
            </tbody>
            </table>

            <hr style="margin: 22px 0; border: 0; border-top: 1px solid #e5e7eb;" />
            <h2 style="margin-top: 0;"><?php echo esc_html__('Organization (structured data)', 'headless-core'); ?></h2>
            <p style="color: #50575e; margin-top: 6px;">
                <?php echo esc_html__('Powers the Organization JSON-LD emitted on every page.', 'headless-core'); ?>
            </p>
            <table class="form-table" role="presentation">
                <tbody>
                <tr>
                    <th scope="row"><label for="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_ORG_NAME); ?>"><?php echo esc_html__('Organization name', 'headless-core'); ?></label></th>
                    <td>
                        <input type="text" class="regular-text" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_ORG_NAME); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_ORG_NAME); ?>" value="<?php echo esc_attr($orgName); ?>" placeholder="<?php echo esc_attr(get_bloginfo('name')); ?>" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label><?php echo esc_html__('Organization logo', 'headless-core'); ?></label></th>
                    <td>
                        <div class="hc-seo-media" data-target="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_ORG_LOGO); ?>">
                            <input type="hidden" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_ORG_LOGO); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_ORG_LOGO); ?>" value="<?php echo esc_attr((string) $orgLogoId); ?>" />
                            <img class="hc-seo-media-preview" src="<?php echo esc_url($orgLogoUrl); ?>" alt="" style="max-width: 220px; height: auto; display: <?php echo $orgLogoUrl !== '' ? 'block' : 'none'; ?>; border: 1px solid #dcdcde; border-radius: 6px; margin-bottom: 8px;" />
                            <button type="button" class="button hc-seo-media-select"><?php echo esc_html__('Select image', 'headless-core'); ?></button>
                            <button type="button" class="button hc-seo-media-clear" style="<?php echo $orgLogoId > 0 ? '' : 'display:none;'; ?>"><?php echo esc_html__('Remove', 'headless-core'); ?></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_ORG_SAME_AS); ?>"><?php echo esc_html__('Social profile URLs', 'headless-core'); ?></label></th>
                    <td>
                        <textarea class="large-text" rows="4" id="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_ORG_SAME_AS); ?>" name="<?php echo esc_attr(HEADLESS_CORE_SEO_OPT_ORG_SAME_AS); ?>" placeholder="https://facebook.com/portsacco&#10;https://twitter.com/portsacco"><?php echo esc_textarea($orgSameAs); ?></textarea>
                        <p class="description"><?php echo esc_html__('One URL per line (Facebook, X/Twitter, LinkedIn, Instagram, YouTube). Added as sameAs in structured data.', 'headless-core'); ?></p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 16px;">
            <?php submit_button(__('Save Settings', 'headless-core'), 'primary', 'submit', false); ?>
        </p>
    </form>
    <script>
        (function () {
            var frame = null;
            var activeWrap = null;
            document.querySelectorAll('.hc-seo-media').forEach(function (wrap) {
                var input = wrap.querySelector('input[type="hidden"]');
                var preview = wrap.querySelector('.hc-seo-media-preview');
                var selectBtn = wrap.querySelector('.hc-seo-media-select');
                var clearBtn = wrap.querySelector('.hc-seo-media-clear');

                selectBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    activeWrap = wrap;
                    if (frame) { frame.open(); return; }
                    frame = wp.media({ title: '<?php echo esc_js(__('Select image', 'headless-core')); ?>', multiple: false, library: { type: 'image' } });
                    frame.on('select', function () {
                        var att = frame.state().get('selection').first().toJSON();
                        var w = activeWrap;
                        if (!w) return;
                        var i = w.querySelector('input[type="hidden"]');
                        var p = w.querySelector('.hc-seo-media-preview');
                        var c = w.querySelector('.hc-seo-media-clear');
                        i.value = att.id;
                        var url = (att.sizes && att.sizes.medium) ? att.sizes.medium.url : att.url;
                        p.src = url;
                        p.style.display = 'block';
                        c.style.display = '';
                    });
                    frame.open();
                });

                clearBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    input.value = '0';
                    preview.src = '';
                    preview.style.display = 'none';
                    clearBtn.style.display = 'none';
                });
            });
        })();
    </script>
    <?php
}
