<?php
declare(strict_types=1);

/**
 * CSRF tokens for admin state-changing requests.
 *
 * The token lives in the session and travels in the X-CSRF-Token header, so it
 * can never be replayed by a cross-site form post. It is handed to the admin
 * app by /api/me.php and kept in memory there — never in localStorage.
 */
final class Csrf
{
    private const KEY = 'csrf_token';

    public static function token(): string
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            Auth::startSession();
        }
        if (!isset($_SESSION[self::KEY]) || !is_string($_SESSION[self::KEY]) || $_SESSION[self::KEY] === '') {
            $_SESSION[self::KEY] = bin2hex(random_bytes(32));
        }
        return $_SESSION[self::KEY];
    }

    /** Issue a fresh token — called on login and logout. */
    public static function rotate(): string
    {
        $_SESSION[self::KEY] = bin2hex(random_bytes(32));
        return $_SESSION[self::KEY];
    }

    public static function verify(): void
    {
        $expected = $_SESSION[self::KEY] ?? '';
        $supplied = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

        if (!is_string($expected) || $expected === '' || !is_string($supplied) || $supplied === ''
            || !hash_equals($expected, $supplied)) {
            Logger::warning('CSRF check failed', ['path' => $_SERVER['REQUEST_URI'] ?? '']);
            Response::error('CSRF_INVALID', 'Your session has expired. Please sign in again.', 419);
        }
    }
}
