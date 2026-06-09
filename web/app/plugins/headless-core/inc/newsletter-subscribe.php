<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', static function (): void {
    register_rest_route('custom/v1', '/newsletter-subscribe', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'headless_core_rest_newsletter_subscribe',
        'permission_callback' => 'headless_core_rest_verify_nonce_permission',
        'args' => [
            'email' => [
                'required' => true,
                'type' => 'string',
            ],
            'list_ids' => [
                'required' => false,
                'type' => 'array',
            ],
            'form_id' => [
                'required' => false,
                'type' => 'string',
            ],
            '_gotcha' => [
                'required' => false,
                'type' => 'string',
            ],
        ],
    ]);
});

/**
 * @return WP_REST_Response|WP_Error
 */
function headless_core_rest_newsletter_subscribe(WP_REST_Request $request)
{
    $gotcha = trim((string) $request->get_param('_gotcha'));
    if ($gotcha !== '') {
        return new WP_REST_Response([
            'success' => true,
            'message' => __('Thank you for subscribing.', 'headless-core'),
        ], 200);
    }

    if (! class_exists('NewsletterSubscription')) {
        return new WP_Error(
            'newsletter_missing',
            __('Newsletter plugin is not available.', 'headless-core'),
            ['status' => 503]
        );
    }

    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    $rateKey = 'headless_newsletter_rl_' . md5($ip);
    $count = (int) get_transient($rateKey);
    if ($count >= 10) {
        return new WP_REST_Response([
            'success' => false,
            'message' => __('Too many attempts, please wait.', 'headless-core'),
        ], 429);
    }
    set_transient($rateKey, $count + 1, 10 * MINUTE_IN_SECONDS);

    $email = sanitize_email((string) $request->get_param('email'));
    if ($email === '' || ! is_email($email)) {
        return new WP_REST_Response([
            'success' => false,
            'message' => __('Please enter a valid email address.', 'headless-core'),
        ], 422);
    }

    $module = NewsletterSubscription::instance();
    $subscription = $module->get_default_subscription();
    $subscription->data->email = $email;

    $formId = sanitize_key((string) $request->get_param('form_id'));
    if ($formId !== '') {
        $subscription->form_id = $formId;
    }

    $listIds = $request->get_param('list_ids');
    if (is_array($listIds)) {
        foreach ($listIds as $rawId) {
            $listId = (int) $rawId;
            if ($listId <= 0) {
                continue;
            }
            $list = $module->get_list($listId);
            if ($list && ! $list->is_private()) {
                $subscription->data->lists[(string) $listId] = 1;
            }
        }
    }

    if ($subscription->data->http_referer === '' && isset($_SERVER['HTTP_REFERER'])) {
        $subscription->data->http_referer = sanitize_url((string) $_SERVER['HTTP_REFERER']);
    }

    $user = $module->subscribe2($subscription);

    if (is_wp_error($user)) {
        $code = $user->get_error_code();
        if ($code === 'exists') {
            $message = $module->get_text('error_text');
            if ($message === '') {
                $message = __('You are already subscribed.', 'headless-core');
            }

            return new WP_REST_Response([
                'success' => false,
                'code' => 'exists',
                'message' => wp_strip_all_tags($message),
            ], 200);
        }

        error_log('[NEWSLETTER_SUBSCRIBE] ' . $user->get_error_message());

        return new WP_REST_Response([
            'success' => false,
            'message' => __('Subscription failed. Please try again.', 'headless-core'),
        ], 422);
    }

    $module->switch_language($user->language);
    if (! empty($user->_activation)) {
        $message = $module->replace($module->get_text('confirmation_text'), $user);
    } else {
        $message = $module->replace($module->get_text('confirmed_text'), $user);
    }

    if ($message === '') {
        $message = __('Thank you for subscribing.', 'headless-core');
    }

    return new WP_REST_Response([
        'success' => true,
        'message' => wp_strip_all_tags($message),
        'requires_confirmation' => ! empty($user->_activation),
    ], 200);
}
