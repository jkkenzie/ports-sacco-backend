<?php

declare(strict_types=1);

/**
 * Plugin Name: CORS Headers (legacy)
 * Description: Deprecated — CORS for the headless API is handled by Headless Core (inc/cors.php).
 *
 * An older version of this file sent Access-Control headers on every request and exited early
 * on OPTIONS preflights, which could break WordPress REST saves with non-JSON responses.
 * Intentionally left empty.
 */
