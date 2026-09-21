<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const PORTS_FORM_OPTION_GROUP = 'ports_form_settings_group';
const PORTS_FORM_REGISTRATION_OPTION_GROUP = 'ports_form_registration_settings_group';
const PORTS_FORM_OPTION_REGISTRATION_FROM_EMAIL = 'ports_form_registration_from_email';
const PORTS_FORM_OPTION_REGISTRATION_FROM_NAME = 'ports_form_registration_from_name';
const PORTS_FORM_OPTION_REGISTRATION_TO_EMAIL = 'ports_form_registration_to_email';
const PORTS_FORM_OPTION_CLIENT_FROM_EMAIL = 'ports_form_client_from_email';
const PORTS_FORM_OPTION_CLIENT_FROM_NAME = 'ports_form_client_from_name';
const PORTS_FORM_OPTION_ACCOUNT_TYPE_INDIVIDUAL = 'ports_form_account_type_individual_enabled';
const PORTS_FORM_OPTION_ACCOUNT_TYPE_JOINT = 'ports_form_account_type_joint_enabled';
const PORTS_FORM_OPTION_ACCOUNT_TYPE_GROUP = 'ports_form_account_type_group_enabled';
const PORTS_FORM_OPTION_ACCOUNT_TYPE_UNAVAILABLE_MESSAGE = 'ports_form_account_type_unavailable_message';

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

    foreach (ports_form_account_type_option_keys() as $optionKey) {
        register_setting(PORTS_FORM_REGISTRATION_OPTION_GROUP, $optionKey, [
            'type' => 'string',
            'sanitize_callback' => 'ports_form_sanitize_enabled_flag',
            'default' => '1',
        ]);
    }

    register_setting(PORTS_FORM_REGISTRATION_OPTION_GROUP, PORTS_FORM_OPTION_ACCOUNT_TYPE_UNAVAILABLE_MESSAGE, [
        'type' => 'string',
        'sanitize_callback' => static function ($value): string {
            return sanitize_textarea_field((string) $value);
        },
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

function ports_form_sanitize_enabled_flag($value): string
{
    return ((string) $value === '1' || $value === true || $value === 1) ? '1' : '0';
}

/**
 * Account type tabs on the public registration form (field 28).
 *
 * @return array<string, array{option: string, label: string, hint: string}>
 */
function ports_form_account_type_definitions(): array
{
    return [
        '1' => [
            'option' => PORTS_FORM_OPTION_ACCOUNT_TYPE_INDIVIDUAL,
            'label' => __('Individual Account', 'headless-core'),
            'hint' => __('For a single member', 'headless-core'),
        ],
        '2' => [
            'option' => PORTS_FORM_OPTION_ACCOUNT_TYPE_JOINT,
            'label' => __('Joint Account', 'headless-core'),
            'hint' => __('For two or more signatories', 'headless-core'),
        ],
        '3' => [
            'option' => PORTS_FORM_OPTION_ACCOUNT_TYPE_GROUP,
            'label' => __('Group/Company Account', 'headless-core'),
            'hint' => __('For a registered group or company', 'headless-core'),
        ],
    ];
}

/**
 * @return list<string>
 */
function ports_form_account_type_option_keys(): array
{
    $keys = [];
    foreach (ports_form_account_type_definitions() as $def) {
        $keys[] = $def['option'];
    }

    return $keys;
}

function ports_form_is_account_type_enabled(string $value): bool
{
    $defs = ports_form_account_type_definitions();
    if (! isset($defs[$value])) {
        return false;
    }

    return (string) get_option($defs[$value]['option'], '1') === '1';
}

/**
 * @return list<string>
 */
function ports_form_get_enabled_account_types(): array
{
    $enabled = [];
    foreach (array_keys(ports_form_account_type_definitions()) as $value) {
        if (ports_form_is_account_type_enabled((string) $value)) {
            $enabled[] = (string) $value;
        }
    }

    return $enabled;
}

function ports_form_get_account_type_unavailable_message(): string
{
    $message = trim((string) get_option(PORTS_FORM_OPTION_ACCOUNT_TYPE_UNAVAILABLE_MESSAGE, ''));
    if ($message !== '') {
        return $message;
    }

    return __('This account type is not currently available.', 'headless-core');
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
    if (! in_array($activeTab, ['email', 'registration'], true)) {
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
    $unavailableMessage = (string) get_option(PORTS_FORM_OPTION_ACCOUNT_TYPE_UNAVAILABLE_MESSAGE, '');
    $settingsUpdated = isset($_GET['settings-updated']) && (string) $_GET['settings-updated'] === 'true';
    ?>
    <div class="wrap ports-form-settings-wrap">
        <h1><?php echo esc_html__('Form Submission Settings', 'headless-core'); ?></h1>
        <p class="description" style="max-width: 720px;">
            <?php echo esc_html__('Configure registration account types, how new member emails are sent, and how submissions are stored for export.', 'headless-core'); ?>
        </p>

        <nav class="nav-tab-wrapper" style="margin: 20px 0 0;">
            <a href="<?php echo esc_url(admin_url('edit.php?post_type=form_submission&page=ports-form-submission-settings&tab=email')); ?>"
               class="nav-tab <?php echo $activeTab === 'email' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('Email Settings', 'headless-core'); ?>
            </a>
            <a href="<?php echo esc_url(admin_url('edit.php?post_type=form_submission&page=ports-form-submission-settings&tab=registration')); ?>"
               class="nav-tab <?php echo $activeTab === 'registration' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('Registration Form', 'headless-core'); ?>
            </a>
        </nav>

        <?php if ($settingsUpdated) : ?>
            <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Settings saved.', 'headless-core'); ?></p></div>
        <?php endif; ?>

        <?php if ($activeTab === 'registration') : ?>
            <form method="post" action="options.php" class="ports-form-settings-card">
                <?php settings_fields(PORTS_FORM_REGISTRATION_OPTION_GROUP); ?>
                <input type="hidden" name="_wp_http_referer" value="<?php echo esc_url(admin_url('edit.php?post_type=form_submission&page=ports-form-submission-settings&tab=registration')); ?>" />
                <h2><?php echo esc_html__('Account type tabs', 'headless-core'); ?></h2>
                <p class="description">
                    <?php echo esc_html__('Uncheck a type to disable that tab on the public New Member Registration form. Disabled types stay visible but cannot be selected, and submissions for them are rejected.', 'headless-core'); ?>
                </p>

                <table class="form-table" role="presentation">
                    <tbody>
                    <tr>
                        <th scope="row"><?php echo esc_html__('Available account types', 'headless-core'); ?></th>
                        <td>
                            <fieldset>
                                <legend class="screen-reader-text"><?php echo esc_html__('Available account types', 'headless-core'); ?></legend>
                                <?php foreach (ports_form_account_type_definitions() as $value => $def) : ?>
                                    <?php $optionKey = $def['option']; ?>
                                    <label class="ports-form-account-type-option" for="<?php echo esc_attr($optionKey); ?>">
                                        <input type="hidden" name="<?php echo esc_attr($optionKey); ?>" value="0" />
                                        <input type="checkbox"
                                               id="<?php echo esc_attr($optionKey); ?>"
                                               name="<?php echo esc_attr($optionKey); ?>"
                                               value="1"
                                            <?php checked(ports_form_is_account_type_enabled((string) $value)); ?> />
                                        <span>
                                            <strong><?php echo esc_html($def['label']); ?></strong>
                                            <span class="description"><?php echo esc_html($def['hint']); ?></span>
                                        </span>
                                    </label>
                                <?php endforeach; ?>
                            </fieldset>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_ACCOUNT_TYPE_UNAVAILABLE_MESSAGE); ?>">
                                <?php echo esc_html__('Unavailable message', 'headless-core'); ?>
                            </label>
                        </th>
                        <td>
                            <textarea id="<?php echo esc_attr(PORTS_FORM_OPTION_ACCOUNT_TYPE_UNAVAILABLE_MESSAGE); ?>"
                                      name="<?php echo esc_attr(PORTS_FORM_OPTION_ACCOUNT_TYPE_UNAVAILABLE_MESSAGE); ?>"
                                      rows="3"
                                      class="large-text"
                                      placeholder="<?php echo esc_attr__('This account type is not currently available.', 'headless-core'); ?>"><?php echo esc_textarea($unavailableMessage); ?></textarea>
                            <p class="description">
                                <?php echo esc_html__('Shown on disabled tabs and returned if someone tries to submit a closed account type. Leave blank to use the default.', 'headless-core'); ?>
                            </p>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <?php submit_button(__('Save Registration Form Settings', 'headless-core')); ?>
            </form>
        <?php endif; ?>

        <?php if ($activeTab === 'email') : ?>
            <?php if ($templatesReset) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Email templates restored to defaults.', 'headless-core'); ?></p></div>
            <?php endif; ?>

            <form method="post" action="options.php" class="ports-form-settings-card">
                <?php settings_fields(PORTS_FORM_OPTION_GROUP); ?>
                <h2><?php echo esc_html__('New Member Registration', 'headless-core'); ?></h2>
                <p class="description">
                    <?php echo esc_html__('Delivery (From mailbox) is handled by your site mailer plugin — e.g. iYi SMTP Mail / Microsoft Graph. Configure From Email there. These settings only control notification recipients (To) and optional Reply-To behaviour from the form templates.', 'headless-core'); ?>
                </p>

                <table class="form-table" role="presentation">
                    <tbody>
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
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_FROM_EMAIL); ?>">
                                <?php echo esc_html__('Legacy — Admin From email (unused when iYi SMTP Mail is active)', 'headless-core'); ?>
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
                                <?php echo esc_html__('Kept for backwards compatibility. With iYi SMTP Mail (force From), the Graph mailbox From Email is used instead.', 'headless-core'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_REGISTRATION_FROM_NAME); ?>">
                                <?php echo esc_html__('Legacy — Admin From name (unused when iYi SMTP Mail is active)', 'headless-core'); ?>
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
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_FROM_EMAIL); ?>">
                                <?php echo esc_html__('Legacy — Applicant From email (unused when iYi SMTP Mail is active)', 'headless-core'); ?>
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
                                <?php echo esc_html__('Applicant confirmation emails still send via wp_mail; From comes from iYi SMTP Mail when enabled.', 'headless-core'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="<?php echo esc_attr(PORTS_FORM_OPTION_CLIENT_FROM_NAME); ?>">
                                <?php echo esc_html__('Legacy — Applicant From name (unused when iYi SMTP Mail is active)', 'headless-core'); ?>
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
        .ports-form-settings-wrap .ports-form-account-type-option {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin: 0 0 12px;
            max-width: 520px;
        }
        .ports-form-settings-wrap .ports-form-account-type-option .description {
            display: block;
            margin-top: 2px;
        }
    </style>
    <?php
}
