<?php

/**
 * Headless WordPress REST API Entry Point
 * Disables theme rendering for REST API requests
 */
define('WP_USE_THEMES', false);
require __DIR__ . '/wp/wp-blog-header.php';
