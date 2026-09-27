<?php

/**
 * Excel export of per-content SEO fields (title, focus keyword, description).
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('admin_post_headless_core_export_seo', 'headless_core_handle_seo_export');
add_action('admin_post_headless_core_import_seo', 'headless_core_handle_seo_import');

function headless_core_seo_export_url(): string
{
    return wp_nonce_url(
        admin_url('admin-post.php?action=headless_core_export_seo'),
        'headless_core_export_seo'
    );
}

function headless_core_handle_seo_export(): void
{
    if (! current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to export SEO data.', 'headless-core'), '', ['response' => 403]);
    }

    check_admin_referer('headless_core_export_seo');

    if (! class_exists(ZipArchive::class)) {
        wp_die(esc_html__('Excel export requires the PHP ZipArchive extension.', 'headless-core'));
    }

    $rows = headless_core_seo_export_rows();
    $xlsx = headless_core_seo_build_xlsx($rows);
    if ($xlsx === '') {
        wp_die(esc_html__('Could not generate the Excel file.', 'headless-core'));
    }

    $filename = 'ports-sacco-seo-inventory-' . wp_date('Y-m-d') . '.xlsx';

    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    nocache_headers();
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . (string) strlen($xlsx));
    header('X-Content-Type-Options: nosniff');

    echo $xlsx;
    exit;
}

/**
 * @return list<list<string>>
 */
function headless_core_seo_export_rows(): array
{
    $headers = [
        __('Post type', 'headless-core'),
        __('ID', 'headless-core'),
        __('Title', 'headless-core'),
        __('Status', 'headless-core'),
        __('SEO title', 'headless-core'),
        __('SEO focus keyword', 'headless-core'),
        __('SEO description', 'headless-core'),
        __('SEO completeness', 'headless-core'),
        __('Public URL', 'headless-core'),
    ];

    $query = new WP_Query([
        'post_type' => headless_core_seo_post_types(),
        'post_status' => ['publish', 'draft', 'pending', 'private', 'future'],
        'posts_per_page' => -1,
        'orderby' => [
            'post_type' => 'ASC',
            'title' => 'ASC',
        ],
        'no_found_rows' => true,
        'ignore_sticky_posts' => true,
    ]);

    $rows = [$headers];
    $base = function_exists('headless_core_seo_frontend_base')
        ? headless_core_seo_frontend_base()
        : untrailingslashit(home_url('/'));

    foreach ($query->posts as $post) {
        if (! $post instanceof WP_Post) {
            continue;
        }

        $typeObject = get_post_type_object($post->post_type);
        $typeLabel = $typeObject instanceof WP_Post_Type
            ? (string) $typeObject->labels->singular_name
            : $post->post_type;

        $statusObject = get_post_status_object($post->post_status);
        $statusLabel = $statusObject ? (string) $statusObject->label : $post->post_status;

        $seoTitle = trim((string) get_post_meta($post->ID, '_hc_seo_title', true));
        $seoKeyword = trim((string) get_post_meta($post->ID, '_hc_seo_keyphrase', true));
        $seoDescription = trim((string) get_post_meta($post->ID, '_hc_seo_description', true));

        $filled = 0;
        foreach ([$seoTitle, $seoKeyword, $seoDescription] as $value) {
            if ($value !== '') {
                $filled++;
            }
        }

        if ($filled === 3) {
            $completeness = __('Complete', 'headless-core');
        } elseif ($filled === 0) {
            $completeness = __('Empty', 'headless-core');
        } else {
            $completeness = __('Partial', 'headless-core');
        }

        $route = function_exists('headless_core_seo_route_for_post')
            ? headless_core_seo_route_for_post($post)
            : '/' . ltrim((string) $post->post_name, '/');
        $publicUrl = $base . $route;

        $rows[] = [
            $typeLabel,
            (string) $post->ID,
            (string) $post->post_title,
            $statusLabel,
            $seoTitle,
            $seoKeyword,
            $seoDescription,
            $completeness,
            $publicUrl,
        ];
    }

    wp_reset_postdata();

    return $rows;
}

/**
 * @param list<list<string>> $rows
 */
function headless_core_seo_build_xlsx(array $rows): string
{
    $sheetXml = headless_core_seo_xlsx_sheet($rows);

    $contentTypes = <<<'XML'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>
XML;

    $rootRels = <<<'XML'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>
XML;

    $workbookRels = <<<'XML'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
XML;

    $workbook = <<<'XML'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="SEO inventory" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>
XML;

    $styles = <<<'XML'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="2">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
</styleSheet>
XML;

    $tmp = wp_tempnam('hc-seo.xlsx');
    if (! is_string($tmp) || $tmp === '') {
        return '';
    }

    // wp_tempnam creates an empty file; ZipArchive needs to create the archive itself.
    @unlink($tmp);

    $zip = new ZipArchive();
    if ($zip->open($tmp, ZipArchive::CREATE) !== true) {
        @unlink($tmp);

        return '';
    }

    $zip->addFromString('[Content_Types].xml', $contentTypes);
    $zip->addFromString('_rels/.rels', $rootRels);
    $zip->addFromString('xl/_rels/workbook.xml.rels', $workbookRels);
    $zip->addFromString('xl/workbook.xml', $workbook);
    $zip->addFromString('xl/styles.xml', $styles);
    $zip->addFromString('xl/worksheets/sheet1.xml', $sheetXml);
    $zip->close();

    $binary = (string) file_get_contents($tmp);
    @unlink($tmp);

    return $binary;
}

/**
 * @param list<list<string>> $rows
 */
function headless_core_seo_xlsx_sheet(array $rows): string
{
    $colCount = $rows !== [] ? count($rows[0]) : 0;
    $widths = [22, 10, 36, 14, 40, 28, 48, 18, 48];
    $colsXml = '';
    for ($i = 0; $i < $colCount; $i++) {
        $width = $widths[$i] ?? 20;
        $min = $i + 1;
        $colsXml .= '<col min="' . $min . '" max="' . $min . '" width="' . $width . '" customWidth="1"/>';
    }

    $sheetData = '';
    foreach ($rows as $rowIndex => $cells) {
        $excelRow = $rowIndex + 1;
        $style = $rowIndex === 0 ? ' s="1"' : '';
        $cellsXml = '';
        foreach ($cells as $colIndex => $value) {
            $ref = headless_core_seo_xlsx_column($colIndex) . $excelRow;
            $cellsXml .= headless_core_seo_xlsx_cell($ref, (string) $value, $style);
        }
        $sheetData .= '<row r="' . $excelRow . '">' . $cellsXml . '</row>';
    }

    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        . '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        . '<sheetViews><sheetView tabSelected="1" workbookViewId="0">'
        . '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>'
        . '</sheetView></sheetViews>'
        . '<cols>' . $colsXml . '</cols>'
        . '<sheetData>' . $sheetData . '</sheetData>'
        . '</worksheet>';
}

function headless_core_seo_xlsx_column(int $index): string
{
    $name = '';
    $n = $index + 1;
    while ($n > 0) {
        $n--;
        $name = chr(65 + ($n % 26)) . $name;
        $n = intdiv($n, 26);
    }

    return $name;
}

function headless_core_seo_xlsx_cell(string $ref, string $value, string $style = ''): string
{
    $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $value) ?? $value;
    $escaped = htmlspecialchars($clean, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    $space = (str_contains($clean, "\n") || str_contains($clean, '  ')) ? ' xml:space="preserve"' : '';

    return '<c r="' . $ref . '" t="inlineStr"' . $style . '><is><t' . $space . '>' . $escaped . '</t></is></c>';
}

function headless_core_handle_seo_import(): void
{
    if (! current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to import SEO data.', 'headless-core'), '', ['response' => 403]);
    }

    check_admin_referer('headless_core_import_seo');

    $redirect = admin_url('admin.php?page=headless-core-settings&tab=seo');
    $file = $_FILES['hc_seo_xlsx'] ?? null;
    if (! is_array($file) || (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        wp_safe_redirect(add_query_arg('hc_seo_error', 'upload', $redirect));
        exit;
    }

    $tmp = (string) ($file['tmp_name'] ?? '');
    $name = (string) ($file['name'] ?? '');
    $size = (int) ($file['size'] ?? 0);
    if ($tmp === '' || ! is_uploaded_file($tmp) || $size <= 0 || $size > 5 * 1024 * 1024) {
        wp_safe_redirect(add_query_arg('hc_seo_error', 'upload', $redirect));
        exit;
    }

    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if ($ext !== 'xlsx') {
        wp_safe_redirect(add_query_arg('hc_seo_error', 'format', $redirect));
        exit;
    }

    $result = headless_core_seo_import_from_xlsx_path($tmp);
    if (! empty($result['error'])) {
        wp_safe_redirect(add_query_arg('hc_seo_error', (string) $result['error'], $redirect));
        exit;
    }

    wp_safe_redirect(add_query_arg([
        'hc_seo_updated' => (string) ($result['updated'] ?? 0),
        'hc_seo_unchanged' => (string) ($result['unchanged'] ?? 0),
        'hc_seo_skipped' => (string) ($result['skipped'] ?? 0),
    ], $redirect));
    exit;
}

/**
 * @return array{updated: int, unchanged: int, skipped: int, error?: string}
 */
function headless_core_seo_import_from_xlsx_path(string $path): array
{
    if (! class_exists(ZipArchive::class)) {
        return ['updated' => 0, 'unchanged' => 0, 'skipped' => 0, 'error' => 'zip'];
    }

    $parsed = headless_core_seo_xlsx_parse_file($path);
    if (! empty($parsed['error'])) {
        return [
            'updated' => 0,
            'unchanged' => 0,
            'skipped' => 0,
            'error' => (string) $parsed['error'],
        ];
    }

    return headless_core_seo_import_rows($parsed['rows'] ?? []);
}

/**
 * @param list<array<string, string>> $rows
 * @return array{updated: int, unchanged: int, skipped: int}
 */
function headless_core_seo_import_rows(array $rows): array
{
    $allowedTypes = function_exists('headless_core_seo_post_types')
        ? headless_core_seo_post_types()
        : ['page', 'post'];

    $sanitizeTitle = function_exists('headless_core_seo_sanitizer_for')
        ? headless_core_seo_sanitizer_for('string', '_hc_seo_title')
        : static fn ($value): string => sanitize_text_field((string) $value);
    $sanitizeKeyword = function_exists('headless_core_seo_sanitizer_for')
        ? headless_core_seo_sanitizer_for('string', '_hc_seo_keyphrase')
        : static fn ($value): string => sanitize_text_field((string) $value);
    $sanitizeDescription = function_exists('headless_core_seo_sanitizer_for')
        ? headless_core_seo_sanitizer_for('string', '_hc_seo_description')
        : static fn ($value): string => trim(wp_strip_all_tags((string) $value));

    $updated = 0;
    $unchanged = 0;
    $skipped = 0;

    foreach ($rows as $row) {
        $id = (int) preg_replace('/\D+/', '', (string) ($row['id'] ?? '0'));
        if ($id <= 0) {
            $skipped++;
            continue;
        }

        $post = get_post($id);
        if (! $post instanceof WP_Post || ! in_array($post->post_type, $allowedTypes, true)) {
            $skipped++;
            continue;
        }

        $nextTitle = $sanitizeTitle($row['seo_title'] ?? '');
        $nextKeyword = $sanitizeKeyword($row['seo_keyword'] ?? '');
        $nextDescription = $sanitizeDescription($row['seo_description'] ?? '');

        $changed = false;
        $changed = headless_core_seo_write_meta($id, '_hc_seo_title', $nextTitle) || $changed;
        $changed = headless_core_seo_write_meta($id, '_hc_seo_keyphrase', $nextKeyword) || $changed;
        $changed = headless_core_seo_write_meta($id, '_hc_seo_description', $nextDescription) || $changed;

        if ($changed) {
            $updated++;
        } else {
            $unchanged++;
        }
    }

    return [
        'updated' => $updated,
        'unchanged' => $unchanged,
        'skipped' => $skipped,
    ];
}

function headless_core_seo_write_meta(int $postId, string $key, string $value): bool
{
    $current = trim((string) get_post_meta($postId, $key, true));
    if ($current === $value) {
        return false;
    }

    if ($value === '') {
        delete_post_meta($postId, $key);

        return true;
    }

    update_post_meta($postId, $key, $value);

    return true;
}

/**
 * @return array{rows: list<array<string, string>>, error?: string}
 */
function headless_core_seo_xlsx_parse_file(string $path): array
{
    $zip = new ZipArchive();
    if ($zip->open($path) !== true) {
        return ['rows' => [], 'error' => 'format'];
    }

    $strings = headless_core_seo_xlsx_shared_strings($zip);
    $sheetXml = headless_core_seo_xlsx_first_sheet($zip);
    $zip->close();

    if ($sheetXml === '') {
        return ['rows' => [], 'error' => 'format'];
    }

    $grid = headless_core_seo_xlsx_sheet_grid($sheetXml, $strings);
    if ($grid === []) {
        return ['rows' => [], 'error' => 'empty'];
    }

    $headerMap = headless_core_seo_xlsx_header_map($grid[0]);
    if (! isset($headerMap['id']) || ! isset($headerMap['seo_title']) || ! isset($headerMap['seo_keyword']) || ! isset($headerMap['seo_description'])) {
        return ['rows' => [], 'error' => 'columns'];
    }

    $rows = [];
    foreach (array_slice($grid, 1) as $line) {
        if (! is_array($line) || $line === []) {
            continue;
        }
        $id = trim((string) ($line[$headerMap['id']] ?? ''));
        if ($id === '') {
            continue;
        }
        $rows[] = [
            'id' => $id,
            'seo_title' => trim((string) ($line[$headerMap['seo_title']] ?? '')),
            'seo_keyword' => trim((string) ($line[$headerMap['seo_keyword']] ?? '')),
            'seo_description' => trim((string) ($line[$headerMap['seo_description']] ?? '')),
        ];
    }

    if ($rows === []) {
        return ['rows' => [], 'error' => 'empty'];
    }

    return ['rows' => $rows];
}

/**
 * @return list<string>
 */
function headless_core_seo_xlsx_shared_strings(ZipArchive $zip): array
{
    $xml = $zip->getFromName('xl/sharedStrings.xml');
    if (! is_string($xml) || $xml === '') {
        return [];
    }

    $root = headless_core_seo_xlsx_simplexml($xml);
    if (! $root instanceof SimpleXMLElement) {
        return [];
    }

    $strings = [];
    foreach ($root->si as $si) {
        $buf = '';
        if (isset($si->t)) {
            $buf = (string) $si->t;
        } else {
            foreach ($si->r as $run) {
                $buf .= (string) $run->t;
            }
        }
        $strings[] = html_entity_decode($buf, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }

    return $strings;
}

function headless_core_seo_xlsx_first_sheet(ZipArchive $zip): string
{
    $rels = $zip->getFromName('xl/_rels/workbook.xml.rels');
    $target = 'xl/worksheets/sheet1.xml';
    if (is_string($rels) && $rels !== '') {
        $root = headless_core_seo_xlsx_simplexml($rels);
        if ($root instanceof SimpleXMLElement) {
            foreach ($root->Relationship as $rel) {
                $type = (string) $rel['Type'];
                if (! str_contains($type, '/worksheet')) {
                    continue;
                }
                $raw = str_replace('\\', '/', (string) $rel['Target']);
                $raw = ltrim($raw, '/');
                $target = str_starts_with($raw, 'xl/') ? $raw : 'xl/' . $raw;
                break;
            }
        }
    }

    $xml = $zip->getFromName($target);

    return is_string($xml) ? $xml : '';
}

/**
 * @param list<string> $strings
 * @return list<array<int, string>>
 */
function headless_core_seo_xlsx_sheet_grid(string $sheetXml, array $strings): array
{
    $root = headless_core_seo_xlsx_simplexml($sheetXml);
    if (! $root instanceof SimpleXMLElement || ! isset($root->sheetData)) {
        return [];
    }

    $grid = [];
    foreach ($root->sheetData->row as $row) {
        $line = [];
        foreach ($row->c as $cell) {
            $ref = (string) $cell['r'];
            if (! preg_match('/^([A-Z]+)/', $ref, $m)) {
                continue;
            }
            $col = headless_core_seo_xlsx_column_index($m[1]);
            $type = (string) $cell['t'];
            $value = '';
            if ($type === 's') {
                $idx = (int) (string) $cell->v;
                $value = $strings[$idx] ?? '';
            } elseif ($type === 'inlineStr') {
                if (isset($cell->is->t)) {
                    $value = (string) $cell->is->t;
                } else {
                    foreach ($cell->is->r ?? [] as $run) {
                        $value .= (string) $run->t;
                    }
                }
            } elseif (isset($cell->v)) {
                $value = (string) $cell->v;
            }
            $line[$col] = html_entity_decode($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
        }
        $grid[] = $line;
    }

    return $grid;
}

/**
 * @param array<int, string> $headerRow
 * @return array<string, int>
 */
function headless_core_seo_xlsx_header_map(array $headerRow): array
{
    $aliases = [
        'id' => 'id',
        'seotitle' => 'seo_title',
        'seofocuskeyword' => 'seo_keyword',
        'seofocuskeyphrase' => 'seo_keyword',
        'focuskeyword' => 'seo_keyword',
        'focuskeyphrase' => 'seo_keyword',
        'seokeyword' => 'seo_keyword',
        'seokeyphrase' => 'seo_keyword',
        'seodescription' => 'seo_description',
        'metadescription' => 'seo_description',
    ];

    $map = [];
    foreach ($headerRow as $index => $label) {
        $key = strtolower(trim((string) $label));
        $key = preg_replace('/[^a-z0-9]+/', '', $key) ?? $key;
        if (isset($aliases[$key])) {
            $map[$aliases[$key]] = (int) $index;
        }
    }

    return $map;
}

function headless_core_seo_xlsx_column_index(string $letters): int
{
    $n = 0;
    $letters = strtoupper($letters);
    $len = strlen($letters);
    for ($i = 0; $i < $len; $i++) {
        $n = ($n * 26) + (ord($letters[$i]) - 64);
    }

    return $n - 1;
}

function headless_core_seo_xlsx_simplexml(string $xml): ?SimpleXMLElement
{
    $stripped = preg_replace('/xmlns(:[A-Za-z0-9]+)?="[^"]*"/', '', $xml) ?? $xml;
    libxml_use_internal_errors(true);
    $el = simplexml_load_string($stripped);
    libxml_clear_errors();

    return $el instanceof SimpleXMLElement ? $el : null;
}
