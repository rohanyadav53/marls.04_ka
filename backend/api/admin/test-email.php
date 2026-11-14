<?php
/**
 * POST /api/admin/test-email.php — check the SMTP configuration.
 *
 * Reports the real reason a send failed (wrong password, refused connection,
 * bad certificate) because that is the only way to fix it — but never echoes
 * the credentials themselves.
 */

declare(strict_types=1);

require_once __DIR__ . '/../_internal/bootstrap.php';

Response::begin(['POST'], true);
Response::requireTrustedOrigin();
$admin = Auth::requireUser();
Csrf::verify();

$input = Response::input();
$to    = Mailer::address((string) ($input['to'] ?? '')) ?? Config::str('mail.to');

if (Mailer::addresses($to) === []) {
    Response::error('VALIDATION_ERROR', 'No valid recipient address.', 422);
}

$ok = Mailer::send([
    'to'      => $to,
    'subject' => 'MARLSBORO — test email',
    'html'    => '<p style="font-family:Helvetica,Arial,sans-serif;color:#334155">'
        . 'This is a test message from the MARLSBORO lead system.<br>'
        . 'If you are reading it, SMTP is configured correctly.</p>'
        . '<p style="font-family:Helvetica,Arial,sans-serif;color:#7a8aa0;font-size:12px">Sent '
        . Template::e(date('j F Y, g:i A')) . ' by ' . Template::e($admin['email']) . '</p>',
]);

if (!$ok) {
    Response::success([
        'sent'   => false,
        'reason' => Mailer::lastError(),
        'to'     => $to,
    ]);
}

Response::success([
    'sent' => true,
    'to'   => $to,
    'via'  => Config::str('mail.driver', 'smtp') === 'mail' ? 'PHP mail()' : Config::str('mail.host'),
]);
