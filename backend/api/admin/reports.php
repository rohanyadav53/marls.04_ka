<?php
/**
 * GET /api/admin/reports.php — the weekly-report log.
 *
 * Shows what was sent, for which period, to whom, and whether it worked —
 * so a missing Friday email is visible rather than silent.
 */

declare(strict_types=1);

require_once __DIR__ . '/../_internal/bootstrap.php';

Response::begin(['GET'], true);
Auth::requireUser();

Response::success([
    'reports'     => Reports::history(30),
    'next_period' => Reports::period(),
    'recipient'   => Reports::recipients(),
    'mode'        => Config::str('reports.period', 'rolling7'),
]);
