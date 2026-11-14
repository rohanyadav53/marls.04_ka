<?php
/**
 * POST /api/admin/send-report.php — run the weekly report by hand.
 *
 * Same code path as the Friday cron, same duplicate protection: a period
 * already sent is reported back as "skipped" unless {"force": true} is passed.
 */

declare(strict_types=1);

require_once __DIR__ . '/../_internal/bootstrap.php';

Response::begin(['POST'], true);
Response::requireTrustedOrigin();
$admin = Auth::requireWriter();
Csrf::verify();

$input = Response::input();
$force = ($input['force'] ?? false) === true;

$result = Reports::send('admin:' . $admin['id'], $force);

if ($result['status'] === 'error') {
    Response::error('REPORT_ERROR', $result['message'], 400);
}

Response::success($result);
