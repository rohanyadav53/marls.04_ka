<?php
/**
 * POST /api/login.php — admin sign-in.
 *
 * Wrong email, wrong password and disabled account all produce exactly the
 * same reply, so the endpoint cannot be used to enumerate admin addresses.
 * Failures are rate limited per IP + email.
 */

declare(strict_types=1);

require_once __DIR__ . '/_internal/bootstrap.php';

Response::begin(['POST'], true);
Response::requireTrustedOrigin();

$input    = Response::input();
$ip       = Response::clientIp();
$email    = mb_strtolower(trim((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');

$GENERIC = 'Incorrect email or password.';

if ($email === '' || $password === '') {
    Response::error('VALIDATION_ERROR', $GENERIC, 422);
}

$bucket = 'login:' . $ip . ':' . substr(hash('sha256', $email), 0, 24);

if (!RateLimiter::hit($bucket, Config::int('security.login_rate_limit', 5), Config::int('security.login_rate_window', 900))) {
    Logger::warning('Admin login rate limited', ['ip' => $ip]);
    Response::error('RATE_LIMITED', 'Too many attempts. Please wait a few minutes and try again.', 429);
}

if (!Auth::attemptLogin($email, $password)) {
    Response::error('INVALID_CREDENTIALS', $GENERIC, 401);
}

RateLimiter::clear($bucket);

Response::success([
    'user'       => Auth::user(),
    'csrf_token' => Csrf::token(),
]);
