<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const PORTS_FORM_OPTION_GROUP = 'ports_form_settings_group';
const PORTS_FORM_OPTION_REGISTRATION_FROM_EMAIL = 'ports_form_registration_from_email';
const PORTS_FORM_OPTION_REGISTRATION_FROM_NAME = 'ports_form_registration_from_name';
const PORTS_FORM_OPTION_REGISTRATION_TO_EMAIL = 'ports_form_registration_to_email';
const PORTS_FORM_OPTION_CLIENT_FROM_EMAIL = 'ports_form_client_from_email';
const PORTS_FORM_OPTION_CLIENT_FROM_NAME = 'ports_form_client_from_name';

require_once HEADLESS_CORE_PATH . 'inc/form/email-template.php';

add_action('admin_menu', static function (): void {
    add_submenu_page(
        'edit.php?post_type=form_submission',
        __('Form Submission Settings', 'headless-core'),
        __('Settings', 'headless-core'),
        'manage_options',
        'ports-form-submission-settings',
        'ports_form_render_settings_page'
    );
}, 20);

add_action('admin_init', static function (): void {
    register_setting(PORTS_FORM_OPTION_GROUP, PORTS_FORM_OPTION_REGISTRATION_FROM_EMAIL, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            $email = sanitize_email((string) $value);
            return is_email($email) ? $email : '';
        },
        'default' => '',
    ]);

    register_setting(PORTS_FORM_OPTION_GROUP, PORTS_FORM_OPTION_REGISTRATION_FROM_NAME, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return sanitize_text_field((string) $value);
        },
        'default' => '',
    ]);

    register_setting(PORTS_FORM_OPTION_GROUP, PORTS_FORM_OPTION_REGISTRATION_TO_EMAIL, [
        'type' => 'string',
        'sanitize_callback' => 'ports_form_sanitize_email_list_setting',
        'default' => '',
    ]);

    register_setting(PORTS_FORM_OPTION_GROUP, PORTS_FORM_OPTION_CLIENT_FROM_EMAIL, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            $email = sanitize_email((string) $value);
            return is_email($email) ? $email : '';
        },
        'default' => '',
    ]);

    register_setting(PORTS_FORM_OPTION_GROUP, PORTS_FORM_OPTION_CLIENT_FROM_NAME, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return sanitize_text_field((string) $value);
        },
        'default' => '',
    ]);

    register_setting(PORTS_FORM_OPTION_GROUP, PORTS_FORM_OPTION_ADMIN_EMAIL_TEMPLATE, [
        'type' => 'string',
        'sanitize_callback' => 'ports_form_sanitize_email_template',
        'default' => '',
    ]);

    register_setting(PORTS_FORM_OPTION_GROUP, PORTS_FORM_OPTION_CLIENT_EMAIL_TEMPLATE, [
        'type' => 'string',
        'sanitize_callback' => 'ports_form_sanitize_email_template',
        'default' => '',
    ]);
});

add_action('admin_post_ports_form_reset_email_templates', static function (): void {
    if (! current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to reset email templates.', 'headless-core'));
    }

    check_admin_referer('ports_form_reset_email_templates');

    update_option(PORTS_FORM_OPTION_ADMIN_EMAIL_TEMPLATE, ports_form_get_default_admin_email_template());
    update_option(PORTS_FORM_OPTION_CLIENT_EMAIL_TEMPLATE, ports_form_get_default_client_email_template());

    wp_safe_redirect(admin_url('edit.php?post_type=form_submission&page=ports-form-submission-settings&tab=email&templates_reset=1'));
    exit;
});

function ports_form_sanitize_email_list_setting($value): string
{
    $parts = preg_split('/[\s,;]+/', (string) $value) ?: [];
    $valid = [];
    foreach ($parts as $part) {
        $part = sanitize_email(trim($part));
        if ($part !== '' && is_email($part)) {
            $valid[] = $part;
        }
    }

    return implode(', ', array_unique($valid));
}

/**
 * @return array{email: string, name: string}
 */
function ports_form_get_registration_sender(): array
{
    $email = sanitize_email((string) get_option(PORTS_FORM_OPTION_REGISTRATION_FROM_EMAIL, ''));
    $name = sanitize_text_field((string) get_option(PORTS_FORM_OPTION_REGISTRATION_FROM_NAME, ''));

    if ($email === '' || ! is_email($email)) {
        $email = sanitize_email((string) get_option('admin_email'));
    }
    if ($name === '') {
        $name = (string) get_bloginfo('name');
    }

    return ['email' => $email, 'name' => $name];
}

function ports_form_get_admin_notification_recipients(): string
{
    $configured = ports_form_sanitize_email_list_setting(
        (string) get_option(PORTS_FORM_OPTION_REGISTRATION_TO_EMAIL, '')
    );
    if ($configured !== '') {
        return $configured;
    }

    return '';
}

/**
 * @return array{email: string, name: string}
 */
function ports_form_get_client_sender(): array
{
    $email = sanitize_email((string) get_option(PORTS_FORM_OPTION_CLIENT_FROM_EMAIL, ''));
    $name = sanitize_text_field((string) get_option(PORTS_FORM_OPTION_CLIENT_FROM_NAME, ''));

    if ($email === '' || ! is_email($email)) {
        return ports_form_get_registration_sender();
    }
    if ($name === '') {
        $name = (string) get_bloginfo('name');
    }

    return ['email' => $email, 'name' => $name];
}

function ports_form_render_settings_page(): void
{
    if (! current_user_can('manage_options')) {
        return;
    }

    $activeTab = isset($_GET['tab']) ? sanitize_key((string) $_GET['tab']) : 'email';
    if (! in_array($activeTab, ['email'], true)) {
        $activeTab = 'email';
    }

    $registrationEmail = (string) get_option(PORTS_FORM_OPTION_REGISTRATION_FROM_EMAIL, '');
    $registrationName = (string) get_option(PORTS_FORM_OPTION_REGISTRATION_FROM_NAME, '');
    $registrationToEmail = (string) get_option(PORTS_FORM_OPTION_REGISTRATION_TO_EMAIL, '');
    $clientEmail = (string) get_option(PORTS_FORM_OPTION_CLIENT_FROM_EMAIL, '');
    $clientName = (string) get_option(PORTS_FORM_OPTION_CLIENT_FROM_NAME, '');
    $adminTemplate = ports_form_get_admin_email_template();
    $clientTemplate = ports_form_get_client_email_template();
    $savedAdminTemplate = (string) get_option(PORTS_FORM_OPTION_ADMIN_EMAIL_TEMPLATE, '');
    $savedClientTemplate = (string) get_option(PORTS_FORM_OPTION_CLIENT_EMAIL_TEMPLATE, '');
    $templatesReset = isset($_GET['templates_reset']) && (string) $_GET['templates_reset'] === '1';
    ?>
    <div class="wrap ports-form-settings-wrap">
        <h1><?php echo esc_html__('Form Submission Settings', 'headless-core'); ?></h1>
        <p class="description" style="max-width: 720px;">
            <?php echo esc_html__('Configure how new member registration emails are sent and how submissions are stored for export.', 'headless-core'); ?>
        </p>

        <nav class="nav-tab-wrapper" style="margin: 20px 0 0;">
            <a href="<?php echo esc_url(admin_url('edit.php?post_type=form_submission&page=ports-form-submission-settings&tab=email')); ?>"
               class="nav-tab <?php echo $activeTab === 'email' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('Email Settings', 'headless-core'); ?>
            </a>
        </nav>

        <?php if ($activeTab === 'email') : ?>
            <?php if ($templatesReset) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Email templates restored to defaults.', 'headless-core'); ?></p></div>
            <?php endif; ?>

            <form method="post" action="options.php" class="ports-form-settings-card">
                <?php settings_fields(PORTS_FORM_OPTION_GROUP); ?>
                <h2><?php echo esc_html__('New Member Registration', 'headless-core'); ?></h2>
                <p class="description">
                    <?php echo esc_html__('Admin and applicant From addresses override the form export. Admin To overrides the recipient in the form export when set.', 'headless-core'); ?>
                </p>

                <table class="form-table" role="presentation">
                    <tbody>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_FROM_EMAIL); ?>">
                                <?php echo esc_html__('Admin notification — From email', 'headless-core'); ?>
                            </label>
                        </th>
                        <td>
                            <input type="email"
                                   id="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_FROM_EMAIL); ?>"
                                   name="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_FROM_EMAIL); ?>"
                                   value="<?php echo esc_attr($registrationEmail); ?>"
                                   class="regular-text"
                                   placeholder="<?php echo esc_attr((string) get_option('admin_email')); ?>" />
                            <p class="description">
                                <?php echo esc_html__('Used when notifying site admins about a new registration submission.', 'headless-core'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_FROM_NAME); ?>">
                                <?php echo esc_html__('Admin notification — From name', 'headless-core'); ?>
                            </label>
                        </th>
                        <td>
                            <input type="text"
                                   id="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_FROM_NAME); ?>"
                                   name="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_FROM_NAME); ?>"
                                   value="<?php echo esc_attr($registrationName); ?>"
                                   class="regular-text"
                                   placeholder="<?php echo esc_attr((string) get_bloginfo('name')); ?>" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_TO_EMAIL); ?>">
                                <?php echo esc_html__('Admin notification — To email', 'headless-core'); ?>
                            </label>
                        </th>
                        <td>
                            <input type="text"
                                   id="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_TO_EMAIL); ?>"
                                   name="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_TO_EMAIL); ?>"
                                   value="<?php echo esc_attr($registrationToEmail); ?>"
                                   class="regular-text"
                                   placeholder="onboard.msaportsacco@gmail.com" />
                            <p class="description">
                                <?php echo esc_html__('Recipient for admin notifications about new submissions. Separate multiple addresses with commas.', 'headless-core'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_FROM_EMAIL); ?>">
                                <?php echo esc_html__('Applicant email — From email', 'headless-core'); ?>
                            </label>
                        </th>
                        <td>
                            <input type="email"
                                   id="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_FROM_EMAIL); ?>"
                                   name="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_FROM_EMAIL); ?>"
                                   value="<?php echo esc_attr($clientEmail); ?>"
                                   class="regular-text"
                                   placeholder="<?php echo esc_attr($registrationEmail ?: (string) get_option('admin_email')); ?>" />
                            <p class="description">
                                <?php echo esc_html__('Used for confirmation emails sent to the person who submitted the registration form.', 'headless-core'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_FROM_NAME); ?>">
                                <?php echo esc_html__('Applicant email — From name', 'headless-core'); ?>
                            </label>
                        </th>
                        <td>
                            <input type="text"
                                   id="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_FROM_NAME); ?>"
                                   name="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_FROM_NAME); ?>"
                                   value="<?php echo esc_attr($clientName); ?>"
                                   class="regular-text"
                                   placeholder="<?php echo esc_attr__('Ports Sacco', 'headless-core'); ?>" />
                        </td>
                    </tr>
                    </tbody>
                </table>

                <?php submit_button(__('Save Email Settings', 'headless-core')); ?>
            </form>

            <form method="post" action="options.php" class="ports-form-settings-card">
                <?php settings_fields(PORTS_FORM_OPTION_GROUP); ?>
                <h2><?php echo esc_html__('Email HTML Templates', 'headless-core'); ?></h2>
                <p class="description">
                    <?php echo esc_html__('Customize the HTML layout for admin and applicant emails. Uploaded files are attached to the email and are not listed in the message body.', 'headless-core'); ?>
                </p>
                <p class="description">
                    <?php echo esc_html__('Available placeholders:', 'headless-core'); ?>
                    <code>{logo_url}</code>,
                    <code>{site_name}</code>,
                    <code>{site_url}</code>,
                    <code>{year}</code>,
                    <code>{heading}</code>,
                    <code>{intro_message}</code>,
                    <code>{submission_table}</code> <?php echo esc_html__('(admin only)', 'headless-core'); ?>,
                    <code>{meta_info}</code> <?php echo esc_html__('(admin only)', 'headless-core'); ?>,
                    <code>{date}</code>,
                    <code>{ip_address}</code>,
                    <code>{user_agent}</code>
                </p>

                <table class="form-table" role="presentation">
                    <tbody>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_ADMIN_EMAIL_TEMPLATE); ?>">
                                <?php echo esc_html__('Admin notification template', 'headless-core'); ?>
                            </label>
                        </th>
                        <td>
                            <textarea id="<?php echo esc_attr(PORTS_FORM_OPTION_ADMIN_EMAIL_TEMPLATE); ?>"
                                      name="<?php echo esc_attr(PORTS_FORM_OPTION_ADMIN_EMAIL_TEMPLATE); ?>"
                                      rows="18"
                                      class="large-text code ports-form-email-template-input"><?php echo esc_textarea($savedAdminTemplate !== '' ? $savedAdminTemplate : $adminTemplate); ?></textarea>
                            <p class="description">
                                <?php echo esc_html__('Sent to site admins with grouped submission data in tables. Attachments are included separately.', 'headless-core'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_EMAIL_TEMPLATE); ?>">
                                <?php echo esc_html__('Applicant confirmation template', 'headless-core'); ?>
                            </label>
                        </th>
                        <td>
                            <textarea id="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_EMAIL_TEMPLATE); ?>"
                                      name="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_EMAIL_TEMPLATE); ?>"
                                      rows="18"
                                      class="large-text code ports-form-email-template-input"><?php echo esc_textarea($savedClientTemplate !== '' ? $savedClientTemplate : $clientTemplate); ?></textarea>
                            <p class="description">
                                <?php echo esc_html__('Sent to the applicant. The notification message from the form export is inserted into {intro_message}.', 'headless-core'); ?>
                            </p>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <?php submit_button(__('Save Email Templates', 'headless-core')); ?>
            </form>

            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="ports-form-settings-card ports-form-settings-card--compact">
                <?php wp_nonce_field('ports_form_reset_email_templates'); ?>
                <input type="hidden" name="action" value="ports_form_reset_email_templates" />
                <h2><?php echo esc_html__('Restore defaults', 'headless-core'); ?></h2>
                <p class="description">
                    <?php echo esc_html__('Replace both templates with the built-in Ports Sacco branded defaults.', 'headless-core'); ?>
                </p>
                <?php submit_button(__('Restore Default Templates', 'headless-core'), 'secondary'); ?>
            </form>
        <?php endif; ?>
    </div>
    <style>
        .ports-form-settings-wrap .ports-form-settings-card {
            max-width: 920px;
            margin-top: 16px;
            background: #fff;
            border: 1px solid #dcdcde;
            border-radius: 12px;
            padding: 24px 28px;
            box-shadow: 0 1px 2px rgba(0,0,0,.04);
        }
        .ports-form-settings-wrap .ports-form-settings-card h2 {
            margin: 0 0 8px;
            font-size: 1.25em;
        }
        .ports-form-settings-wrap .ports-form-settings-card--compact {
            padding-top: 16px;
            padding-bottom: 16px;
        }
        .ports-form-settings-wrap .ports-form-email-template-input {
            font-family: Consolas, Monaco, monospace;
            font-size: 12px;
            line-height: 1.45;
        }
    </style>
    <?php
}
