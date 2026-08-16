<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Primary + legacy REST namespaces for headless routes.
 *
 * @return list<string>
 */
function headless_core_rest_namespaces(): array
{
    $namespaces = [HEADLESS_CORE_REST_NAMESPACE];
    if (
        defined('HEADLESS_CORE_REST_NAMESPACE_LEGACY')
        && is_string(HEADLESS_CORE_REST_NAMESPACE_LEGACY)
        && HEADLESS_CORE_REST_NAMESPACE_LEGACY !== ''
        && HEADLESS_CORE_REST_NAMESPACE_LEGACY !== HEADLESS_CORE_REST_NAMESPACE
    ) {
        $namespaces[] = HEADLESS_CORE_REST_NAMESPACE_LEGACY;
    }

    return $namespaces;
}

/**
 * Register a route under the primary namespace and any legacy aliases.
 *
 * @param array<string, mixed> $args
 * @param bool                 $override
 */
function headless_core_register_rest_route(string $route, array $args = [], bool $override = false): bool
{
    $ok = true;
    foreach (headless_core_rest_namespaces() as $namespace) {
        $registered = register_rest_route($namespace, $route, $args, $override);
        $ok = $ok && $registered;
    }

    return $ok;
}

/**
 * Absolute REST URL under the primary namespace.
 */
function headless_core_rest_url(string $path = ''): string
{
    $path = ltrim($path, '/');
    $route = HEADLESS_CORE_REST_NAMESPACE . ($path !== '' ? '/' . $path : '');

    return rest_url($route);
}

/**
 * Whether a REST route belongs to our headless API (primary or legacy).
 */
function headless_core_is_headless_rest_route(string $route): bool
{
    foreach (headless_core_rest_namespaces() as $namespace) {
        $prefix = '/' . trim($namespace, '/') . '/';
        if (strpos($route, $prefix) === 0 || $route === rtrim($prefix, '/')) {
            return true;
        }
    }

    return false;
}
