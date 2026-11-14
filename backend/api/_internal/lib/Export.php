<?php
declare(strict_types=1);

/**
 * Lead exports.
 *
 * CSV is the guaranteed format — UTF-8 with a BOM so Excel opens Hindi and
 * Chinese correctly on a double-click. XLSX is produced too when the server has
 * the zip extension: a minimal but valid SpreadsheetML workbook, written by
 * hand rather than pulling a spreadsheet library onto a shared host.
 */
final class Export
{
    /**
     * @param array<int,array<string,mixed>> $rows
     * @param array<string,string>|null      $columns  column => header
     */
    public static function csv(array $rows, ?array $columns = null): string
    {
        $columns ??= Leads::EXPORT_COLUMNS;

        $handle = fopen('php://temp', 'r+');
        if ($handle === false) {
            throw new RuntimeException('Unable to open a buffer for the export.');
        }

        // Explicit escape: "" is RFC 4180 behaviour, and the implicit
        // default is deprecated from PHP 8.4.
        fputcsv($handle, array_values($columns), ',', '"', '');
        foreach ($rows as $row) {
            $line = [];
            foreach (array_keys($columns) as $key) {
                $line[] = self::cell($row[$key] ?? '');
            }
            fputcsv($handle, $line, ',', '"', '');
        }

        rewind($handle);
        $csv = (string) stream_get_contents($handle);
        fclose($handle);

        return "\xEF\xBB\xBF" . $csv;      // UTF-8 BOM for Excel
    }

    /**
     * @param array<int,array<string,mixed>> $rows
     * @param array<string,string>|null      $columns
     * @return string|null null when the zip extension is unavailable
     */
    public static function xlsx(array $rows, ?array $columns = null, string $sheetName = 'Leads'): ?string
    {
        if (!class_exists('ZipArchive')) {
            return null;
        }
        $columns ??= Leads::EXPORT_COLUMNS;

        $temp = tempnam(sys_get_temp_dir(), 'mrlxlsx');
        if ($temp === false) {
            return null;
        }

        $zip = new ZipArchive();
        if ($zip->open($temp, ZipArchive::OVERWRITE) !== true) {
            @unlink($temp);
            return null;
        }

        $zip->addFromString('[Content_Types].xml', self::contentTypes());
        $zip->addFromString('_rels/.rels', self::rootRels());
        $zip->addFromString('xl/workbook.xml', self::workbook($sheetName));
        $zip->addFromString('xl/_rels/workbook.xml.rels', self::workbookRels());
        $zip->addFromString('xl/styles.xml', self::styles());
        $zip->addFromString('xl/worksheets/sheet1.xml', self::sheet($rows, $columns));
        $zip->close();

        $bytes = file_get_contents($temp);
        @unlink($temp);

        return $bytes === false ? null : $bytes;
    }

    public static function filename(string $prefix, string $extension, ?string $date = null): string
    {
        return sprintf('%s-%s.%s', $prefix, $date ?? date('Y-m-d'), $extension);
    }

    /* ------------------------------------------------------------ helpers - */

    /**
     * Flatten a value for a spreadsheet cell and defuse formula injection.
     *
     * A leading =, @, + or - makes Excel treat the cell as a formula, which is
     * how a hostile "name" becomes code on someone's laptop. Prefixing an
     * apostrophe forces text. Phone numbers like "+91 98878 11121" are left
     * alone — they are digits and separators, never a formula.
     */
    private static function cell($value): string
    {
        if ($value === null || $value === false) {
            return '';
        }
        if ($value === true) {
            return 'Yes';
        }
        $text = (string) $value;
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        if ($text !== ''
            && (preg_match('/^[=@]/', $text) === 1
                || (preg_match('/^[+\-]/', $text) === 1 && preg_match('/^[+\-][0-9\s()\-\.]*$/', $text) !== 1))) {
            return "'" . $text;
        }
        return $text;
    }

    private static function contentTypes(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            . '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            . '<Default Extension="xml" ContentType="application/xml"/>'
            . '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            . '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            . '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
            . '</Types>';
    }

    private static function rootRels(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            . '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            . '</Relationships>';
    }

    private static function workbook(string $sheetName): string
    {
        $name = self::xml(mb_substr($sheetName, 0, 31));
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
            . ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            . '<sheets><sheet name="' . $name . '" sheetId="1" r:id="rId1"/></sheets>'
            . '</workbook>';
    }

    private static function workbookRels(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            . '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
            . '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
            . '</Relationships>';
    }

    /** Two styles: 0 = body, 1 = bold header. */
    private static function styles(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            . '<fonts count="2">'
            . '<font><sz val="11"/><name val="Calibri"/></font>'
            . '<font><b/><sz val="11"/><name val="Calibri"/></font>'
            . '</fonts>'
            . '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>'
            . '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
            . '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
            . '<cellXfs count="2">'
            . '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
            . '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
            . '</cellXfs>'
            . '</styleSheet>';
    }

    /**
     * @param array<int,array<string,mixed>> $rows
     * @param array<string,string>           $columns
     */
    private static function sheet(array $rows, array $columns): string
    {
        $keys  = array_keys($columns);
        $count = count($keys);

        $xml  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
        $xml .= '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
        $xml .= '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';

        $xml .= '<cols>';
        foreach ($keys as $index => $key) {
            $width = in_array($key, ['message', 'admin_notes', 'page_url'], true) ? 48
                : (in_array($key, ['email', 'requirement', 'subject', 'company'], true) ? 26 : 16);
            $xml .= '<col min="' . ($index + 1) . '" max="' . ($index + 1) . '" width="' . $width . '" customWidth="1"/>';
        }
        $xml .= '</cols><sheetData>';

        $xml .= '<row r="1">';
        foreach (array_values($columns) as $index => $header) {
            $xml .= '<c r="' . self::columnName($index) . '1" s="1" t="inlineStr"><is><t>' . self::xml($header) . '</t></is></c>';
        }
        $xml .= '</row>';

        $rowNumber = 1;
        foreach ($rows as $row) {
            $rowNumber++;
            $xml .= '<row r="' . $rowNumber . '">';
            foreach ($keys as $index => $key) {
                $value = self::cell($row[$key] ?? '');
                if ($value === '') {
                    continue;                  // an empty cell needs no element
                }
                $reference = self::columnName($index) . $rowNumber;
                if (is_numeric($value) && $key === 'id') {
                    $xml .= '<c r="' . $reference . '"><v>' . (int) $value . '</v></c>';
                } else {
                    $xml .= '<c r="' . $reference . '" t="inlineStr"><is><t xml:space="preserve">'
                        . self::xml($value) . '</t></is></c>';
                }
            }
            $xml .= '</row>';
        }

        $xml .= '</sheetData>';
        $xml .= '<autoFilter ref="A1:' . self::columnName($count - 1) . max($rowNumber, 1) . '"/>';
        $xml .= '</worksheet>';

        return $xml;
    }

    private static function columnName(int $index): string
    {
        $name = '';
        $index++;
        while ($index > 0) {
            $index--;
            $name = chr(65 + ($index % 26)) . $name;
            $index = intdiv($index, 26);
        }
        return $name;
    }

    /** Escape for XML and drop code points XML 1.0 cannot carry. */
    private static function xml(string $value): string
    {
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $value) ?? $value;
        return htmlspecialchars($value, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
