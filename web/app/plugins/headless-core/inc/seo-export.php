<?php

/**
 * Excel export of per-content SEO fields (title, focus keyword, description).
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('admin_post_headless_core_export_seo', 'headless_core_handle_seo_export');

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
