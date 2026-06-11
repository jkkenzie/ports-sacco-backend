<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const HEADLESS_CORE_OPTION_YOUTUBE_API_KEY = 'headless_core_youtube_api_key';
const HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID = 'headless_core_youtube_channel_id';

add_action('rest_api_init', static function (): void {
    register_rest_route('custom/v1', '/youtube/videos', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'headless_core_rest_youtube_videos',
        'permission_callback' => '__return_true',
        'args' => [
            'max' => [
                'required' => false,
                'type' => 'integer',
                'minimum' => 1,
                'maximum' => 12,
            ],
            'channel' => [
                'required' => false,
                'type' => 'string',
            ],
        ],
    ]);
});

add_action('update_option_' . HEADLESS_CORE_OPTION_YOUTUBE_API_KEY, static function (): void {
    headless_core_bump_youtube_cache_version();
});

add_action('update_option_' . HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID, static function (): void {
    headless_core_bump_youtube_cache_version();
});

/**
 * @return void
 */
function headless_core_bump_youtube_cache_version(): void
{
    $v = (int) get_option('headless_youtube_cache_ver', 1);
    update_option('headless_youtube_cache_ver', $v + 1, false);
}

/**
 * @return array{apiKey: string, channelId: string}
 */
function headless_core_youtube_settings(): array
{
    return [
        'apiKey' => trim((string) get_option(HEADLESS_CORE_OPTION_YOUTUBE_API_KEY, '')),
        'channelId' => headless_core_youtube_sanitize_channel_id((string) get_option(HEADLESS_CORE_OPTION_YOUTUBE_CHANNEL_ID, '')),
    ];
}

/**
 * @return non-empty-string
 */
function headless_core_youtube_sanitize_channel_id(string $value): string
{
    $value = trim(sanitize_text_field($value));
    if ($value === '') {
        return '';
    }

    if (preg_match('/^UC[\w-]{20,}$/i', $value)) {
        return $value;
    }

    if (preg_match('/^@[\w.-]{2,}$/', $value)) {
        return $value;
    }

    return '';
}

/**
 * @return string|WP_Error
 */
function headless_core_youtube_resolve_channel_id(string $channelId, string $apiKey)
{
    if ($channelId === '') {
        return new WP_Error('headless_youtube_missing_channel', __('YouTube channel is not configured.', 'headless-core'), ['status' => 503]);
    }

    if (str_starts_with($channelId, 'UC')) {
        return $channelId;
    }

    if (! str_starts_with($channelId, '@')) {
        return new WP_Error('headless_youtube_invalid_channel', __('Invalid YouTube channel identifier.', 'headless-core'), ['status' => 400]);
    }

    $cacheKey = 'handle_' . md5($channelId);
    $cacheVer = (string) get_option('headless_youtube_cache_ver', '1');
    $cached = headless_core_cache_get('youtube', $cacheKey . '_' . $cacheVer);
    if (is_string($cached) && $cached !== '') {
        return $cached;
    }

    $url = add_query_arg([
        'part' => 'id',
        'forHandle' => ltrim($channelId, '@'),
        'key' => $apiKey,
    ], 'https://www.googleapis.com/youtube/v3/channels');

    $response = wp_remote_get($url, ['timeout' => 20]);
    if (is_wp_error($response)) {
        return $response;
    }

    $code = (int) wp_remote_retrieve_response_code($response);
    $body = json_decode((string) wp_remote_retrieve_body($response), true);
    if ($code !== 200 || ! is_array($body)) {
        $message = is_array($body) && isset($body['error']['message'])
            ? (string) $body['error']['message']
            : __('Could not resolve YouTube channel.', 'headless-core');

        return new WP_Error('headless_youtube_api', $message, ['status' => 502]);
    }

    $resolved = (string) ($body['items'][0]['id'] ?? '');
    if ($resolved === '') {
        return new WP_Error('headless_youtube_not_found', __('YouTube channel was not found.', 'headless-core'), ['status' => 404]);
    }

    headless_core_cache_set('youtube', $cacheKey . '_' . $cacheVer, $resolved);

    return $resolved;
}

/**
 * @return array{items: list<array<string, mixed>>, channel: array<string, string>}
 */
function headless_core_youtube_fetch_videos(string $channelId, int $max): array
{
    $settings = headless_core_youtube_settings();
    $apiKey = $settings['apiKey'];
    if ($apiKey === '') {
        return [
            'items' => [],
            'channel' => [
                'id' => '',
                'url' => '',
            ],
            'error' => __('YouTube API key is not configured.', 'headless-core'),
        ];
    }

    $resolvedChannel = headless_core_youtube_resolve_channel_id($channelId, $apiKey);
    if (is_wp_error($resolvedChannel)) {
        return [
            'items' => [],
            'channel' => [
                'id' => '',
                'url' => '',
            ],
            'error' => $resolvedChannel->get_error_message(),
        ];
    }

    $cacheVer = (string) get_option('headless_youtube_cache_ver', '1');
    $cacheKey = 'videos_' . $resolvedChannel . '_max_' . $max . '_v_' . $cacheVer;
    $cached = headless_core_cache_get('youtube', $cacheKey);
    if (is_array($cached)) {
        return $cached;
    }

    $channelUrl = 'https://www.googleapis.com/youtube/v3/channels';
    $channelResponse = wp_remote_get(add_query_arg([
        'part' => 'contentDetails,snippet',
        'id' => $resolvedChannel,
        'key' => $apiKey,
    ], $channelUrl), ['timeout' => 20]);

    if (is_wp_error($channelResponse)) {
        return [
            'items' => [],
            'channel' => ['id' => $resolvedChannel, 'url' => 'https://www.youtube.com/channel/' . $resolvedChannel],
            'error' => $channelResponse->get_error_message(),
        ];
    }

    $channelBody = json_decode((string) wp_remote_retrieve_body($channelResponse), true);
    if ((int) wp_remote_retrieve_response_code($channelResponse) !== 200 || ! is_array($channelBody)) {
        return [
            'items' => [],
            'channel' => ['id' => $resolvedChannel, 'url' => 'https://www.youtube.com/channel/' . $resolvedChannel],
            'error' => __('Could not load YouTube channel.', 'headless-core'),
        ];
    }

    $uploadsPlaylist = (string) ($channelBody['items'][0]['contentDetails']['relatedPlaylists']['uploads'] ?? '');
    $channelTitle = (string) ($channelBody['items'][0]['snippet']['title'] ?? '');
    if ($uploadsPlaylist === '') {
        return [
            'items' => [],
            'channel' => [
                'id' => $resolvedChannel,
                'title' => $channelTitle,
                'url' => 'https://www.youtube.com/channel/' . $resolvedChannel,
            ],
            'error' => __('No uploads playlist found for this channel.', 'headless-core'),
        ];
    }

    $playlistResponse = wp_remote_get(add_query_arg([
        'part' => 'snippet,contentDetails',
        'playlistId' => $uploadsPlaylist,
        'maxResults' => $max,
        'key' => $apiKey,
    ], 'https://www.googleapis.com/youtube/v3/playlistItems'), ['timeout' => 20]);

    if (is_wp_error($playlistResponse)) {
        return [
            'items' => [],
            'channel' => [
                'id' => $resolvedChannel,
                'title' => $channelTitle,
                'url' => 'https://www.youtube.com/channel/' . $resolvedChannel,
            ],
            'error' => $playlistResponse->get_error_message(),
        ];
    }

    $playlistBody = json_decode((string) wp_remote_retrieve_body($playlistResponse), true);
    if ((int) wp_remote_retrieve_response_code($playlistResponse) !== 200 || ! is_array($playlistBody)) {
        $message = is_array($playlistBody) && isset($playlistBody['error']['message'])
            ? (string) $playlistBody['error']['message']
            : __('Could not load YouTube videos.', 'headless-core');

        return [
            'items' => [],
            'channel' => [
                'id' => $resolvedChannel,
                'title' => $channelTitle,
                'url' => 'https://www.youtube.com/channel/' . $resolvedChannel,
            ],
            'error' => $message,
        ];
    }

    $items = [];
    $rows = is_array($playlistBody['items'] ?? null) ? $playlistBody['items'] : [];
    foreach ($rows as $row) {
        if (! is_array($row)) {
            continue;
        }
        $snippet = is_array($row['snippet'] ?? null) ? $row['snippet'] : [];
        $videoId = (string) ($snippet['resourceId']['videoId'] ?? '');
        if ($videoId === '') {
            continue;
        }

        $thumbs = is_array($snippet['thumbnails'] ?? null) ? $snippet['thumbnails'] : [];
        $thumbUrl = (string) ($thumbs['high']['url'] ?? $thumbs['medium']['url'] ?? $thumbs['default']['url'] ?? '');
        $published = (string) ($snippet['publishedAt'] ?? '');
        $timestamp = $published !== '' ? strtotime($published) : false;

        $items[] = [
            'id' => $videoId,
            'videoId' => $videoId,
            'title' => (string) ($snippet['title'] ?? ''),
            'description' => wp_trim_words(wp_strip_all_tags((string) ($snippet['description'] ?? '')), 24),
            'thumbnailUrl' => $thumbUrl,
            'publishedAt' => $published,
            'date' => $timestamp ? date_i18n((string) get_option('date_format'), $timestamp) : '',
            'url' => 'https://www.youtube.com/watch?v=' . $videoId,
            'embedUrl' => 'https://www.youtube.com/embed/' . $videoId . '?autoplay=1&rel=0',
        ];
    }

    $payload = [
        'items' => $items,
        'channel' => [
            'id' => $resolvedChannel,
            'title' => $channelTitle,
            'url' => 'https://www.youtube.com/channel/' . $resolvedChannel,
        ],
    ];

    headless_core_cache_set('youtube', $cacheKey, $payload);

    return $payload;
}

/**
 * @return WP_REST_Response
 */
function headless_core_rest_youtube_videos(WP_REST_Request $request): WP_REST_Response
{
    $max = max(1, min(12, (int) $request->get_param('max')));
    if ($max <= 0) {
        $max = 6;
    }

    $settings = headless_core_youtube_settings();
    $channelParam = headless_core_youtube_sanitize_channel_id((string) $request->get_param('channel'));
    $channelId = $channelParam !== '' ? $channelParam : $settings['channelId'];

    $payload = headless_core_youtube_fetch_videos($channelId, $max);

    return new WP_REST_Response($payload, 200);
}
