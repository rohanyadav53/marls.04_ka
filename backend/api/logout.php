<?php
/**
 * POST /api/logout.php — end the admin session.
 */

declare(strict_types=1);

require_once __DIR__ . '/_internal/bootstrap.php';

Response::begin(['POST'], true);
Response::requireTrustedOrigin();

Auth::startSession();

// Only verify CSRF when there is a session to protect; logging out of an
// already-dead session should never error.
if (Auth::id() !== null) {
    Csrf::verify();
    Auth::logout();
}

Response::success(['authenticated' => false]);
