<?php
/**
 * GET /api/admin/stats.php — dashboard figures.
 *
 * Totals and period counts exclude spam-flagged rows so the headline numbers
 * describe real business; the spam count is reported separately.
 */

declare(strict_types=1);

require_once __DIR__ . '/../_internal/bootstrap.php';

Response::begin(['GET'], true);
Auth::requireUser();

Response::success(Leads::stats());
