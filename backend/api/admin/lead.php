<?php
/**
 * /api/admin/lead.php — a single lead.
 *
 *   GET   ?id=123   full record plus its audit trail
 *   PATCH {id, status?, assigned_to?, admin_notes?}
 *
 * Only these three fields are editable — what the visitor submitted is a
 * record of what they said and is never rewritten.
 */

declare(strict_types=1);

require_once __DIR__ . '/../_internal/bootstrap.php';

Response::begin(['GET', 'PATCH', 'POST'], true);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    Auth::requireUser();

    $id   = (int) ($_GET['id'] ?? 0);
    $lead = $id > 0 ? Leads::find($id) : null;

    if ($lead === null) {
        Response::error('NOT_FOUND', 'That lead no longer exists.', 404);
    }

    Response::success([
        'lead'     => Leads::shapeDetail($lead),
        'activity' => Leads::activity($id),
    ]);
}

/* --------------------------------------------------------------- update -- */

Response::requireTrustedOrigin();
$admin = Auth::requireWriter();
Csrf::verify();

$input = Response::input();
$id    = (int) ($input['id'] ?? $_GET['id'] ?? 0);

if ($id <= 0) {
    Response::error('VALIDATION_ERROR', 'Which lead?', 422);
}

$changes = array_intersect_key($input, array_flip(['status', 'assigned_to', 'admin_notes']));
if ($changes === []) {
    Response::error('VALIDATION_ERROR', 'Nothing to update.', 422);
}

$updated = Leads::update($id, $changes, $admin);

Response::success(['lead' => Leads::shapeDetail($updated)]);
