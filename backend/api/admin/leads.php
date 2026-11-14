<?php
/**
 * GET /api/admin/leads.php — the leads table.
 *
 * Search, filtering, sorting and pagination all happen in MySQL: the browser
 * never receives more than one page of leads, however many the business has.
 *
 * Query parameters:
 *   search      name / company / email / phone / requirement, or a bare lead ID
 *   status      new|contacted|converted|closed|spam|all   (default hides spam)
 *   source      one of Validation::SOURCES, or 'all'
 *   date_from   YYYY-MM-DD          date_to  YYYY-MM-DD
 *   sort        created_at|updated_at|name|company|status|source|id
 *   dir         asc|desc
 *   page        1-based             per_page 20|50|100 (max 200)
 */

declare(strict_types=1);

require_once __DIR__ . '/../_internal/bootstrap.php';

Response::begin(['GET'], true);
Auth::requireUser();

$filters = [
    'search'    => $_GET['search']    ?? null,
    'status'    => $_GET['status']    ?? null,
    'source'    => $_GET['source']    ?? null,
    'date_from' => $_GET['date_from'] ?? null,
    'date_to'   => $_GET['date_to']   ?? null,
    'sort'      => $_GET['sort']      ?? null,
    'dir'       => $_GET['dir']       ?? null,
];

$page    = max(1, (int) ($_GET['page'] ?? 1));
$perPage = (int) ($_GET['per_page'] ?? 20);
if (!in_array($perPage, [20, 50, 100], true)) {
    $perPage = 20;
}

$result = Leads::search($filters, $page, $perPage);

Response::success($result + [
    'filters' => [
        'sources'  => Validation::SOURCES,
        'statuses' => Validation::STATUSES,
    ],
]);
