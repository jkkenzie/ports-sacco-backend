<?php

declare(strict_types=1);

/**
 * One-off generator: reads WPForms template excerpt and writes normalized spec files.
 */

$source = file_get_contents(dirname(__DIR__) . '/tmp-onboarding-extract.txt');
if ($source === false) {
    fwrite(STDERR, "Missing tmp-onboarding-extract.txt\n");
    exit(1);
}

$start = strpos($source, "'fields' => array");
$end = strrpos($source, "'meta' => array");
if ($start === false || $end === false) {
    fwrite(STDERR, "Could not locate fields/meta in source\n");
    exit(1);
}

$middle = substr($source, $start, $end - $start);
$php = "<?php\nreturn array(\n" . $middle . "'meta' => array (\n\t\t'template' => 'onboarding_form',\n\t),\n);\n";

$tmp = dirname(__DIR__) . '/tmp-onboarding-parsed.php';
file_put_contents($tmp, $php);

/** @var array<string, mixed> $raw */
$raw = require $tmp;

/**
 * @param mixed $conditionals
 * @return list<list<array{field: string, operator: string, value: string}>>
 */
function normalize_conditionals($conditionals): array
{
    if (! is_array($conditionals)) {
        return [];
    }
    $groups = [];
    foreach ($conditionals as $group) {
        if (! is_array($group)) {
            continue;
        }
        $rules = [];
        foreach ($group as $rule) {
            if (! is_array($rule)) {
                continue;
            }
            $rules[] = [
                'field' => (string) ($rule['field'] ?? ''),
                'operator' => (string) ($rule['operator'] ?? '=='),
                'value' => (string) ($rule['value'] ?? ''),
            ];
        }
        if ($rules !== []) {
            $groups[] = $rules;
        }
    }

    return $groups;
}

/**
 * @param mixed $choices
 * @return list<array{value: string, label: string}>
 */
function normalize_choices($choices): array
{
    if (! is_array($choices)) {
        return [];
    }
    $out = [];
    foreach ($choices as $key => $choice) {
        if (! is_array($choice)) {
            continue;
        }
        $label = (string) ($choice['label'] ?? '');
        $value = isset($choice['value']) ? (string) $choice['value'] : (string) $key;
        $out[] = ['value' => $value, 'label' => $label];
    }

    return $out;
}

/**
 * @param array<string, mixed> $field
 * @return array<string, mixed>
 */
function normalize_field(array $field): array
{
    $id = (string) ($field['id'] ?? '');
    $type = (string) ($field['type'] ?? 'text');

    $out = [
        'id' => $id,
        'type' => $type,
        'label' => (string) ($field['label'] ?? ''),
        'required' => ! empty($field['required']),
    ];

    if (isset($field['placeholder']) && (string) $field['placeholder'] !== '') {
        $out['placeholder'] = (string) $field['placeholder'];
    }

    if (isset($field['format']) && (string) $field['format'] !== '') {
        $out['format'] = (string) $field['format'];
    }

    if (isset($field['choices']) && is_array($field['choices'])) {
        $out['choices'] = normalize_choices($field['choices']);
    }

    if (isset($field['limit_count'])) {
        $out['limit_count'] = (int) $field['limit_count'];
    }
    if (isset($field['limit_mode']) && (string) $field['limit_mode'] !== '') {
        $out['limit_mode'] = (string) $field['limit_mode'];
    }
    if (! empty($field['limit_enabled'])) {
        $out['limit_enabled'] = true;
    }

    if (isset($field['max_file_number'])) {
        $out['max_file_number'] = (int) $field['max_file_number'];
    }

    if (isset($field['date_format']) && (string) $field['date_format'] !== '') {
        $out['date_format'] = (string) $field['date_format'];
    }

    if (isset($field['css']) && (string) $field['css'] !== '') {
        $out['css'] = trim((string) $field['css']);
    }

    $hasConditional = ! empty($field['conditional_logic']);
    $out['conditional_logic'] = $hasConditional;
    if ($hasConditional) {
        $out['conditional_type'] = (string) ($field['conditional_type'] ?? 'show');
        $out['conditionals'] = normalize_conditionals($field['conditionals'] ?? []);
    }

    if ($type === 'divider' && ! empty($field['label_disable'])) {
        $out['label_disable'] = true;
    }

    if (isset($field['input_columns']) && (string) $field['input_columns'] !== '') {
        $out['input_columns'] = (string) $field['input_columns'];
    }

    if (isset($field['size']) && (string) $field['size'] !== '') {
        $out['size'] = (string) $field['size'];
    }

    return $out;
}

/**
 * @param array<string, mixed> $settings
 * @return array<string, mixed>
 */
function normalize_settings(array $settings): array
{
    $confirmations = $settings['confirmations'] ?? [];
    $confirmation = is_array($confirmations) ? ($confirmations[1] ?? $confirmations['1'] ?? []) : [];
    $messageHtml = (string) ($confirmation['message'] ?? '');
    $messagePlain = trim(wp_strip_all_tags($messageHtml));

    $notifications = $settings['notifications'] ?? [];
    $admin = is_array($notifications) ? ($notifications[1] ?? $notifications['1'] ?? []) : [];
    $user = is_array($notifications) ? ($notifications[2] ?? $notifications['2'] ?? []) : [];

    $mapNotification = static function (array $n): array {
        return [
            'email' => (string) ($n['email'] ?? ''),
            'subject' => (string) ($n['subject'] ?? ''),
            'sender_name' => (string) ($n['sender_name'] ?? ''),
            'sender_address' => (string) ($n['sender_address'] ?? ''),
            'replyto' => (string) ($n['replyto'] ?? ''),
            'message' => (string) ($n['message'] ?? ''),
        ];
    };

    return [
        'form_title' => (string) ($settings['form_title'] ?? 'Onboarding Form'),
        'submit_text' => (string) ($settings['submit_text'] ?? 'Submit'),
        'submit_text_processing' => (string) ($settings['submit_text_processing'] ?? 'Sending...'),
        'form_slug' => 'onboarding_form',
        'confirmation' => [
            'message' => $messagePlain,
            'message_html' => $messageHtml,
        ],
        'notifications' => [
            '1' => $mapNotification(is_array($admin) ? $admin : []),
            '2' => $mapNotification(is_array($user) ? $user : []),
        ],
        'submitter_email_field_ids' => ['2', '32', '84', '95', '109'],
    ];
}

if (! function_exists('wp_strip_all_tags')) {
    function wp_strip_all_tags(string $text): string
    {
        return strip_tags($text);
    }
}

$fieldsRaw = $raw['fields'] ?? [];
if (! is_array($fieldsRaw)) {
    fwrite(STDERR, "No fields in parsed data\n");
    exit(1);
}

$fieldOrder = array_map('strval', array_keys($fieldsRaw));
$fields = [];
foreach ($fieldsRaw as $id => $field) {
    if (! is_array($field)) {
        continue;
    }
    $fields[(string) $id] = normalize_field($field);
}
// Ensure string keys in exported array (var_export otherwise uses int keys for numeric ids).
$fields = array_combine(array_map('strval', array_keys($fields)), array_values($fields));

$export = [
    'slug' => 'onboarding_form',
    'name' => 'Onboarding Form',
    'field_order' => $fieldOrder,
    'fields' => $fields,
    'settings' => normalize_settings(is_array($raw['settings'] ?? null) ? $raw['settings'] : []),
];

$phpOut = dirname(__DIR__) . '/web/app/plugins/headless-core/inc/form/onboarding-form-export.php';
$jsOut = dirname(__DIR__) . '/web/frontend/src/components/ContactForm/onboardingFormSpec.js';

$phpContent = "<?php\n\ndeclare(strict_types=1);\n\nif (! defined('ABSPATH')) {\n    exit;\n}\n\n/**\n * Onboarding Form specification (from WPForms template).\n *\n * @return array<string, mixed>\n */\nreturn " . var_export($export, true) . ";\n";

if (! is_dir(dirname($phpOut))) {
    mkdir(dirname($phpOut), 0755, true);
}
if (! is_dir(dirname($jsOut))) {
    mkdir(dirname($jsOut), 0755, true);
}

file_put_contents($phpOut, $phpContent);

$json = json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false) {
    fwrite(STDERR, "JSON encode failed\n");
    exit(1);
}

$jsContent = "/**\n * Onboarding Form specification (from WPForms template).\n */\nconst onboardingFormSpec = " . $json . ";\n\nexport default onboardingFormSpec;\n";
file_put_contents($jsOut, $jsContent);

echo 'Fields: ' . count($fields) . PHP_EOL;
echo 'PHP: ' . $phpOut . PHP_EOL;
echo 'JS: ' . $jsOut . PHP_EOL;
echo 'Confirmation: ' . $export['settings']['confirmation']['message'] . PHP_EOL;
