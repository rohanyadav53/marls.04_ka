<?php
/**
 * GET /api/admin/export.php — download leads.
 *
 * Authenticated, always. This endpoint hands over every personal detail the
 * business holds about its enquirers, so it is behind exactly the same session
 * check as the rest of the portal — never a "secret" URL.
 *
 *   format=csv|xlsx                (csv is always available)
 *   scope=filtered|all             (filtered honours the same query params as
 *                                   the leads table; all ignores them)
 */

declare(strict_types=1);

require_once __DIR__ . '/../_internal/bootstrap.php';

Response::begin(['GET'], true);
$admin = Auth::requireUser();

$scope   = ($_GET['scope'] ?? 'filtered') === 'all' ? 'all' : 'filtered';
$format  = ($_GET['format'] ?? 'csv') === 'xlsx' ? 'xlsx' : 'csv';

$filters = $scope === 'all'
    ? ['status' => 'all']
    : [
        'search'    => $_GET['search']    ?? null,
        'status'    => $_GET['status']    ?? null,
        'source'    => $_GET['source']    ?? null,
        'date_from' => $_GET['date_from'] ?? null,
        'date_to'   => $_GET['date_to']   ?? null,
    ];

$rows = Leads::export($filters);

Logger::info('Lead export', [
    'admin_id' => $admin['id'],
    'scope'    => $scope,
    'format'   => $format,
    'rows'     => count($rows),
]);

if ($format === 'xlsx') {
    $body = Export::xlsx($rows);
    if ($body === null) {
        Response::error('XLSX_UNAVAILABLE', 'This server cannot build .xlsx files. Please export CSV instead.', 501);
    }
    $filename = Export::filename('marlsboro-leads', 'xlsx');
    $mime     = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
} else {
    $body     = Export::csv($rows);
    $filename = Export::filename('marlsboro-leads', 'csv');
    $mime     = 'text/csv; charset=UTF-8';
}

header('Content-Type: ' . $mime);
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . strlen($body));
header('X-Filename: ' . $filename);
header('Access-Control-Expose-Headers: X-Filename, Content-Disposition');
echo $body;
