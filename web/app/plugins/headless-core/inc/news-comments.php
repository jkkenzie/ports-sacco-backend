<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', static function (): void {
    register_rest_route('custom/v1', '/news/(?P<slug>[a-z0-9\-_]+)/comments', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_news_comments_list',
        'permission_callback' => '__return_true',
        'args' => [
            'slug' => [
                'required' => true,
                'type' => 'string',
            ],
        ],
    ]);

    register_rest_route('custom/v1', '/news/(?P<slug>[a-z0-9\-_]+)/comments', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'headless_core_rest_news_comment_submit',
        'permission_callback' => 'headless_core_rest_verify_nonce_permission',
        'args' => [
            'slug' => [
                'required' => true,
                'type' => 'string',
            ],
            'name' => [
                'required' => true,
                'type' => 'string',
            ],
            'email' => [
                'required' => true,
                'type' => 'string',
            ],
            'comment' => [
                'required' => true,
                'type' => 'string',
            ],
            '_gotcha' => [
                'required' => false,
                'type' => 'string',
            ],
            '_wpnonce' => [
                'required' => false,
                'type' => 'string',
            ],
        ],
    ]);
});

add_action('transition_comment_status', static function (string $newStatus, string $oldStatus, WP_Comment $comment): void {
    if ($newStatus === $oldStatus) {
        return;
    }
    $postId = (int) $comment->comment_post_ID;
    if ($postId <= 0) {
        return;
    }
    $post = get_post($postId);
    if ($post instanceof WP_Post && $post->post_type === 'post') {
        headless_core_bump_news_cache_version();
    }
}, 10, 3);

add_action('deleted_comment', static function (int $commentId): void {
    $comment = get_comment($commentId);
    if (! $comment instanceof WP_Comment) {
        return;
    }
    $post = get_post((int) $comment->comment_post_ID);
    if ($post instanceof WP_Post && $post->post_type === 'post') {
        headless_core_bump_news_cache_version();
    }
}, 10, 1);

/**
 * @return WP_Post|null
 */
function headless_core_news_get_post_by_slug(string $slug): ?WP_Post
{
    $slug = sanitize_title($slug);
    if ($slug === '' || $slug === 'categories') {
        return null;
    }

    $matches = get_posts([
        'name' => $slug,
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => 1,
    ]);

    $post = is_array($matches) && isset($matches[0]) && $matches[0] instanceof WP_Post ? $matches[0] : null;

    return $post instanceof WP_Post ? $post : null;
}

/**
 * @return array{id: int, author: string, content: string, date: string}
 */
function headless_core_news_format_comment(WP_Comment $comment): array
{
    return [
        'id' => (int) $comment->comment_ID,
        'author' => (string) $comment->comment_author,
        'content' => wp_kses_post((string) $comment->comment_content),
        'date' => get_comment_date((string) get_option('date_format'), $comment),
    ];
}

/**
 * @return list<array{id: int, author: string, content: string, date: string}>
 */
function headless_core_news_approved_comments(int $postId): array
{
    if ($postId <= 0) {
        return [];
    }

    $comments = get_comments([
        'post_id' => $postId,
        'status' => 'approve',
        'type' => 'comment',
        'orderby' => 'comment_date_gmt',
        'order' => 'ASC',
    ]);

    if (! is_array($comments) || $comments === []) {
        return [];
    }

    $out = [];
    foreach ($comments as $comment) {
        if ($comment instanceof WP_Comment) {
            $out[] = headless_core_news_format_comment($comment);
        }
    }

    return $out;
}

/**
 * Share metadata for social platforms (absolute URL built on the frontend when possible).
 *
 * @return array{title: string, description: string, imageUrl: string, path: string}
 */
function headless_core_news_share_meta(WP_Post $post): array
{
    $card = headless_core_format_news_post_card($post);
    $path = '/news/' . (string) $post->post_name;

    return [
        'title' => (string) ($card['title'] ?? get_the_title($post)),
        'description' => (string) ($card['excerpt'] ?? ''),
        'imageUrl' => (string) ($card['imageUrl'] ?? ''),
        'path' => $path,
    ];
}

/**
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_news_comments_list(WP_REST_Request $request)
{
    $slug = sanitize_title((string) $request->get_param('slug'));
    $post = headless_core_news_get_post_by_slug($slug);
    if (! $post instanceof WP_Post) {
        return new WP_Error('headless_not_found', __('Post not found.', 'headless-core'), ['status' => 404]);
    }

    $cacheVersion = (string) get_option('headless_news_cache_ver', '1');
    $cacheKey = 'comments_' . $slug . '_' . $cacheVersion;
    $cached = headless_core_cache_get('news', $cacheKey);
    if (is_array($cached)) {
        return new WP_REST_Response($cached, 200);
    }

    $payload = [
        'commentsOpen' => (bool) comments_open($post),
        'items' => headless_core_news_approved_comments((int) $post->ID),
    ];

    headless_core_cache_set('news', $cacheKey, $payload);

    return new WP_REST_Response($payload, 200);
}

/**
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_news_comment_submit(WP_REST_Request $request)
{
    $gotcha = trim((string) $request->get_param('_gotcha'));
    if ($gotcha !== '') {
        return new WP_REST_Response([
            'ok' => true,
            'message' => __('Thank you. Your comment is awaiting moderation.', 'headless-core'),
            'pending' => true,
        ], 200);
    }

    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    $rateKey = 'headless_news_comment_rl_' . md5($ip);
    $count = (int) get_transient($rateKey);
    if ($count >= 8) {
        return new WP_REST_Response([
            'ok' => false,
            'message' => __('Too many attempts, please wait.', 'headless-core'),
        ], 429);
    }
    set_transient($rateKey, $count + 1, 10 * MINUTE_IN_SECONDS);

    $slug = sanitize_title((string) $request->get_param('slug'));
    $post = headless_core_news_get_post_by_slug($slug);
    if (! $post instanceof WP_Post) {
        return new WP_Error('headless_not_found', __('Post not found.', 'headless-core'), ['status' => 404]);
    }

    if (! comments_open($post)) {
        return new WP_REST_Response([
            'ok' => false,
            'message' => __('Comments are closed for this article.', 'headless-core'),
        ], 403);
    }

    $name = sanitize_text_field((string) $request->get_param('name'));
    $email = sanitize_email((string) $request->get_param('email'));
    $content = trim((string) $request->get_param('comment'));

    if ($name === '') {
        return new WP_REST_Response([
            'ok' => false,
            'message' => __('Please enter your name.', 'headless-core'),
        ], 422);
    }

    if ($email === '' || ! is_email($email)) {
        return new WP_REST_Response([
            'ok' => false,
            'message' => __('Please enter a valid email address.', 'headless-core'),
        ], 422);
    }

    if ($content === '') {
        return new WP_REST_Response([
            'ok' => false,
            'message' => __('Please enter a comment.', 'headless-core'),
        ], 422);
    }

    if (mb_strlen($content) > 5000) {
        return new WP_REST_Response([
            'ok' => false,
            'message' => __('Comment is too long.', 'headless-core'),
        ], 422);
    }

    $commentData = [
        'comment_post_ID' => (int) $post->ID,
        'comment_author' => $name,
        'comment_author_email' => $email,
        'comment_content' => $content,
        'comment_type' => 'comment',
        'comment_parent' => 0,
        'user_id' => 0,
        'comment_author_IP' => $ip,
        'comment_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? substr(sanitize_text_field((string) $_SERVER['HTTP_USER_AGENT']), 0, 255) : '',
    ];

    $commentId = wp_new_comment(wp_slash($commentData), true);
    if (is_wp_error($commentId)) {
        return new WP_REST_Response([
            'ok' => false,
            'message' => $commentId->get_error_message() ?: __('Could not save your comment.', 'headless-core'),
        ], 422);
    }

    $pending = true;
    $stored = get_comment((int) $commentId);
    if ($stored instanceof WP_Comment && (string) $stored->comment_approved === '1') {
        $pending = false;
        headless_core_bump_news_cache_version();
    }

    return new WP_REST_Response([
        'ok' => true,
        'message' => $pending
            ? __('Thank you. Your comment is awaiting moderation.', 'headless-core')
            : __('Thank you. Your comment has been published.', 'headless-core'),
        'pending' => $pending,
    ], 200);
}
