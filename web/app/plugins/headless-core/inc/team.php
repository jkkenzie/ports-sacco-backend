<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('add_meta_boxes', static function (): void {
    add_meta_box(
        'headless_core_team_meta',
        __('Team Member Details', 'headless-core'),
        'headless_core_render_team_member_meta_box',
        'team_member',
        'side',
        'high'
    );
});

function headless_core_render_team_member_meta_box(WP_Post $post): void
{
    $position = (string) get_post_meta($post->ID, 'position', true);
    $standAlone = (bool) get_post_meta($post->ID, 'standAlone', true);
    wp_nonce_field('headless_core_team_meta_save', 'headless_core_team_meta_nonce');
    ?>
    <p>
        <label for="headless_core_team_position" style="font-weight: 600; display: block; margin-bottom: 6px;">
            <?php echo esc_html__('Position / Title', 'headless-core'); ?>
        </label>
        <input
            type="text"
            id="headless_core_team_position"
            name="headless_core_team_position"
            value="<?php echo esc_attr($position); ?>"
            style="width: 100%;"
            placeholder="<?php echo esc_attr__('e.g. CEO', 'headless-core'); ?>"
        />
    </p>

    <p style="margin-top: 12px;">
        <label style="display: flex; gap: 8px; align-items: center;">
            <input type="checkbox" name="headless_core_team_standalone" value="1" <?php checked($standAlone); ?> />
            <span style="font-weight: 600;"><?php echo esc_html__('Stand alone (first centered card)', 'headless-core'); ?></span>
        </label>
        <span style="display:block; color:#50575e; margin-top: 6px;">
            <?php echo esc_html__('When enabled, this member will be prioritized as the single centered card.', 'headless-core'); ?>
        </span>
    </p>
    <?php
}

add_action('save_post_team_member', static function (int $postId): void {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (wp_is_post_revision($postId) || wp_is_post_autosave($postId)) {
        return;
    }
    if (! current_user_can('edit_post', $postId)) {
        return;
    }
    if (! isset($_POST['headless_core_team_meta_nonce']) || ! wp_verify_nonce((string) $_POST['headless_core_team_meta_nonce'], 'headless_core_team_meta_save')) {
        return;
    }

    $position = isset($_POST['headless_core_team_position']) ? sanitize_text_field((string) $_POST['headless_core_team_position']) : '';
    update_post_meta($postId, 'position', $position);

    $standAlone = isset($_POST['headless_core_team_standalone']) && (string) $_POST['headless_core_team_standalone'] === '1';
    update_post_meta($postId, 'standAlone', $standAlone ? '1' : '0');
}, 20);

