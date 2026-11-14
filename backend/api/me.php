<?php
/**
 * GET /api/me.php — session probe for the admin app.
 *
 * Answers 200 either way (the SPA needs to know *whether* it is signed in, not
 * to treat "signed out" as an error) and hands over the CSRF token that every
 * state-changing admin request must echo back in X-CSRF-Token.
 */

declare(strict_types=1);

require_once __DIR__ . '/_internal/bootstrap.php';

Response::begin(['GET'], true);

Auth::startSession();
$user = Auth::user();

Response::success([
    'authenticated' => $user !== null,
    'user'          => $user,
    'csrf_token'    => Csrf::token(),
    'features'      => [
        'xlsx_export' => class_exists('ZipArchive'),
        'captcha'     => Captcha::enabled(),
    ],
]);
