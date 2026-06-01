<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

require_once HEADLESS_CORE_PATH . 'inc/form/submission-storage.php';
require_once HEADLESS_CORE_PATH . 'inc/form/form-spec.php';

add_action('add_meta_boxes_form_submission', static function (): void {
    remove_meta_box('ports-form-submission-details', 'form_submission', 'normal');
    remove_meta_box('postcustom', 'form_submission', 'normal');

    add_meta_box(
        'ports-form-submission-view',
        __('Submission', 'headless-core'),
        'ports_form_render_submission_metabox',
        'form_submission',
        'normal',
        'high'
    );
});

add_action('admin_enqueue_scripts', static function (string $hook): void {
    if (! in_array($hook, ['post.php', 'edit.php'], true)) {
        return;
    }
    $screen = get_current_screen();
    if (! $screen || $screen->post_type !== 'form_submission') {
        return;
    }
    wp_enqueue_style(
        'ports-form-submission-admin',
        HEADLESS_CORE_URL . 'assets/form-submission-admin.css',
        [],
        HEADLESS_CORE_VERSION
    );
});

add_filter('manage_form_submission_posts_columns', static function (array $columns): array {
    $rebuilt = [];
    foreach ($columns as $key => $label) {
        if ($key === 'date') {
            $rebuilt['submitter_email'] = __('Email', 'headless-core');
        }
        $rebuilt[$key] = $label;
        if ($key === 'title') {
            $rebuilt['form_slug'] = __('Form', 'headless-core');
        }
    }
    if (! isset($rebuilt['submitter_email'])) {
        $rebuilt['submitter_email'] = __('Email', 'headless-core');
    }
    if (! isset($rebuilt['form_slug'])) {
        $rebuilt['form_slug'] = __('Form', 'headless-core');
    }

    return $rebuilt;
});

add_action('manage_form_submission_posts_custom_column', static function (string $column, int $postId): void {
    if ($column === 'submitter_email') {
        $email = (string) get_post_meta($postId, 'submitter_email', true);
        echo $email !== '' ? esc_html($email) : '—';
        return;
    }
    if ($column === 'form_slug') {
        $slug = (string) get_post_meta($postId, 'form_slug', true);
        echo esc_html($slug !== '' ? $slug : 'onboarding_form');
    }
}, 10, 2);

add_filter('manage_edit-form_submission_sortable_columns', static function (array $columns): array {
    $columns['submitter_email'] = 'submitter_email';

    return $columns;
});

add_action('restrict_manage_posts', static function (string $postType): void {
    if ($postType !== 'form_submission') {
        return;
    }
    if (! current_user_can('edit_posts')) {
        return;
    }
    $url = wp_nonce_url(
        admin_url('edit.php?post_type=form_submission&ports_export_csv=1'),
        'ports_form_export_csv',
        '_ports_export_nonce'
    );
    echo '<a href="' . esc_url($url) . '" class="button" style="margin-left: 8px;">'
        . esc_html__('Export to Excel (CSV)', 'headless-core')
        . '</a>';
});

add_action('admin_init', static function (): void {
    if (! isset($_GET['ports_export_csv']) || $_GET['ports_export_csv'] !== '1') {
        return;
    }
    if (! is_admin() || ! current_user_can('edit_posts')) {
        return;
    }
    check_admin_referer('ports_form_export_csv', '_ports_export_nonce');

    ports_form_export_submissions_csv();
    exit;
});

function ports_form_render_submission_metabox(WP_Post $post): void
{
    $snapshot = ports_form_get_submission_snapshot((int) $post->ID);
    $slug = (string) get_post_meta($post->ID, 'form_slug', true);
    if ($slug === '') {
        $slug = 'onboarding_form';
    }

    $submitterEmail = (string) get_post_meta($post->ID, 'submitter_email', true);
    $submitterIp = (string) get_post_meta($post->ID, 'submitter_ip', true);
    $submittedAt = get_the_date('Y-m-d H:i:s', $post);
    ?>
    <div class="ports-submission-wrap">
        <div class="ports-submission-meta-bar">
            <div class="ports-submission-meta-item">
                <span class="ports-submission-meta-label"><?php esc_html_e('Submitted', 'headless-core'); ?></span>
                <strong><?php echo esc_html($submittedAt); ?></strong>
            </div>
            <div class="ports-submission-meta-item">
                <span class="ports-submission-meta-label"><?php esc_html_e('Email', 'headless-core'); ?></span>
                <strong><?php echo $submitterEmail !== '' ? esc_html($submitterEmail) : '—'; ?></strong>
            </div>
            <div class="ports-submission-meta-item">
                <span class="ports-submission-meta-label"><?php esc_html_e('Form', 'headless-core'); ?></span>
                <strong><?php echo esc_html($slug); ?></strong>
            </div>
            <?php if ($submitterIp !== '') : ?>
                <div class="ports-submission-meta-item">
                    <span class="ports-submission-meta-label"><?php esc_html_e('IP', 'headless-core'); ?></span>
                    <strong><?php echo esc_html($submitterIp); ?></strong>
                </div>
            <?php endif; ?>
        </div>

        <?php
        if ($snapshot !== null && ! empty($snapshot['sections']) && is_array($snapshot['sections'])) {
            foreach ($snapshot['sections'] as $section) {
                if (! is_array($section)) {
                    continue;
                }
                $sectionLabel = (string) ($section['label'] ?? __('Section', 'headless-core'));
                $fields = $section['fields'] ?? [];
                if (! is_array($fields) || $fields === []) {
                    continue;
                }
                ports_form_render_submission_section(
                    [
                        'label' => $sectionLabel,
                        'fields' => array_values(array_filter($fields, 'is_array')),
                    ],
                    (int) $post->ID,
                    $slug
                );
            }
        } else {
            ports_form_render_submission_legacy_fallback((int) $post->ID, $slug);
        }
        ?>
    </div>
    <?php
}

/**
 * @param array<string, mixed> $field
 */
function ports_form_render_submission_field_row(array $field, int $postId, string $slug): void
{
    $fieldId = (string) ($field['field_id'] ?? '');
    $label = (string) ($field['label'] ?? '');
    $type = (string) ($field['type'] ?? 'text');
    $value = (string) ($field['value'] ?? '');

    $fieldDef = $fieldId !== '' ? ports_form_get_field_definition($slug, $fieldId) : null;
    if ($fieldDef !== null) {
        $type = (string) ($fieldDef['type'] ?? $type);
        if ($label === '') {
            $label = ports_form_field_label($fieldDef);
        }
        $meta = ports_form_get_submission_meta_map($postId);
        $resolved = ports_form_resolve_meta_display_value($fieldDef, $meta);
        if ($resolved !== '') {
            $value = $resolved;
        } elseif (in_array($type, ['select', 'radio'], true) && $value !== '') {
            $choiceLabel = ports_form_choice_label_for_value($fieldDef, $value);
            if ($choiceLabel !== $value) {
                $value = $choiceLabel;
            }
        }
    }

    $snapshotFiles = isset($field['files']) && is_array($field['files']) ? $field['files'] : [];
    $files = $type === 'file-upload' && $fieldId !== ''
        ? ports_form_collect_submission_files($postId, $fieldId, $snapshotFiles)
        : [];
    ?>
    <div class="ports-submission-field <?php echo $type === 'file-upload' ? 'ports-submission-field--files' : ''; ?>">
        <div class="ports-submission-field-label"><?php echo esc_html($label); ?></div>
        <div class="ports-submission-field-value">
            <?php if ($type === 'file-upload') : ?>
                <?php ports_form_render_submission_files($files); ?>
            <?php elseif ($value !== '') : ?>
                <div class="ports-submission-text-value"><?php echo nl2br(esc_html($value)); ?></div>
            <?php else : ?>
                <span class="ports-submission-empty">—</span>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

/**
 * @param list<array{id: int, name: string, url: string, mime: string}> $files
 */
function ports_form_render_submission_files(array $files): void
{
    if ($files === []) {
        echo '<span class="ports-submission-empty">' . esc_html__('No file uploaded', 'headless-core') . '</span>';
        return;
    }
    ?>
    <div class="ports-submission-files">
        <?php foreach ($files as $file) :
            $url = (string) ($file['url'] ?? '');
            $name = (string) ($file['name'] ?? 'file');
            $mime = (string) ($file['mime'] ?? '');
            $attachId = (int) ($file['id'] ?? 0);
            if ($url === '') {
                continue;
            }
            if ($mime === '' && $attachId > 0) {
                $mime = (string) (get_post_mime_type($attachId) ?: '');
            }
            $isImage = str_starts_with($mime, 'image/')
                || preg_match('/\.(jpe?g|png|gif|webp|bmp)$/i', $name);
            ?>
            <div class="ports-submission-file-card">
                <?php if ($isImage) : ?>
                    <a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer" class="ports-submission-file-preview">
                        <img src="<?php echo esc_url($url); ?>" alt="<?php echo esc_attr($name); ?>" loading="lazy" />
                    </a>
                <?php else : ?>
                    <div class="ports-submission-file-icon" aria-hidden="true">
                        <span class="dashicons dashicons-media-default"></span>
                    </div>
                <?php endif; ?>
                <div class="ports-submission-file-meta">
                    <span class="ports-submission-file-name" title="<?php echo esc_attr($name); ?>"><?php echo esc_html($name); ?></span>
                    <div class="ports-submission-file-actions">
                        <a class="button button-primary button-small" href="<?php echo esc_url($url); ?>" download="<?php echo esc_attr($name); ?>" target="_blank" rel="noopener noreferrer">
                            <?php esc_html_e('Download', 'headless-core'); ?>
                        </a>
                        <a class="button button-small" href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer">
                            <?php esc_html_e('Open', 'headless-core'); ?>
                        </a>
                        <?php if ($attachId > 0) : ?>
                            <a class="button button-link" href="<?php echo esc_url(admin_url('post.php?post=' . $attachId . '&action=edit')); ?>">
                                <?php esc_html_e('Media', 'headless-core'); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <?php
}

function ports_form_render_submission_legacy_fallback(int $postId, string $slug): void
{
    $meta = ports_form_get_submission_meta_map($postId);
    if ($meta === []) {
        echo '<p>' . esc_html__('No submission details available.', 'headless-core') . '</p>';
        return;
    }

    $currentSection = [
        'label' => __('Submission data', 'headless-core'),
        'fields' => [],
    ];

    foreach (ports_form_get_ordered_fields($slug) as $field) {
        $type = (string) ($field['type'] ?? '');
        $id = (string) ($field['id']);

        if ($type === 'divider') {
            if ($currentSection['fields'] !== []) {
                ports_form_render_submission_section($currentSection, $postId, $slug);
            }
            $currentSection = [
                'label' => ports_form_field_label($field),
                'fields' => [],
            ];
            continue;
        }

        $key = 'field_' . $id;
        $hasValue = isset($meta[$key]) && trim((string) $meta[$key]) !== '';
        $hasFiles = trim((string) get_post_meta($postId, $key . '_attachments', true)) !== '';
        if (! $hasValue && ! $hasFiles && $type !== 'file-upload') {
            if ($type === 'name' && ($field['format'] ?? '') === 'first-last') {
                $hasValue = trim((string) ($meta["{$key}_first"] ?? '') . (string) ($meta["{$key}_last"] ?? '')) !== '';
            }
        }
        if ($type === 'file-upload') {
            $hasValue = $hasValue || $hasFiles;
        }

        if (! $hasValue && ! $hasFiles) {
            continue;
        }

        $currentSection['fields'][] = [
            'field_id' => $id,
            'type' => $type,
            'label' => ports_form_field_label($field),
            'value' => ports_form_resolve_meta_display_value($field, $meta),
            'files' => [],
        ];
    }

    if ($currentSection['fields'] !== []) {
        ports_form_render_submission_section($currentSection, $postId, $slug);
    }
}

/**
 * @param array{label: string, fields: list<array<string, mixed>>} $section
 */
function ports_form_render_submission_section(array $section, int $postId, string $slug): void
{
    ?>
    <section class="ports-submission-section">
        <h3 class="ports-submission-section-title"><?php echo esc_html((string) $section['label']); ?></h3>
        <div class="ports-submission-fields">
            <?php foreach ($section['fields'] as $field) :
                if (! is_array($field)) {
                    continue;
                }
                ports_form_render_submission_field_row($field, $postId, $slug);
            endforeach; ?>
        </div>
    </section>
    <?php
}

function ports_form_export_submissions_csv(): void
{
    $slug = 'onboarding_form';
    $headers = ['ID', 'Submitted', 'Submitter Email', 'IP'];
    $fieldLabels = [];

    foreach (ports_form_get_ordered_fields($slug) as $field) {
        if (($field['type'] ?? '') === 'divider') {
            continue;
        }
        $fieldLabels[(string) $field['id']] = ports_form_field_label($field);
    }
    foreach ($fieldLabels as $label) {
        $headers[] = $label;
    }

    $filename = 'form-submissions-' . wp_date('Y-m-d') . '.csv';
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Pragma: no-cache');
    header('Expires: 0');

    $out = fopen('php://output', 'w');
    if ($out === false) {
        return;
    }

    fprintf($out, "\xEF\xBB\xBF");
    fputcsv($out, $headers);

    $query = new WP_Query([
        'post_type' => 'form_submission',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => true,
    ]);

    while ($query->have_posts()) {
        $query->the_post();
        $postId = get_the_ID();
        $flat = ports_form_snapshot_flat_rows((int) $postId);
        $byLabel = [];
        foreach ($flat as $row) {
            $byLabel[(string) $row['label']] = (string) $row['value'];
        }

        $row = [
            (string) $postId,
            get_the_date('Y-m-d H:i:s', $postId),
            (string) get_post_meta($postId, 'submitter_email', true),
            (string) get_post_meta($postId, 'submitter_ip', true),
        ];
        foreach ($fieldLabels as $label) {
            $row[] = $byLabel[$label] ?? '';
        }
        fputcsv($out, $row);
    }
    wp_reset_postdata();
    fclose($out);
}
