<?php
declare(strict_types=1);

/**
 * JSON responses and the security headers that go with them.
 *
 * Envelope:
 *   success  {"success":true,"data":{…}}
 *   failure  {"success":false,"error":{"code":"…","message":"…"}}
 *
 * Internal detail (SQL, stack traces, SMTP transcripts) never crosses this
 * boundary — it goes to Logger instead.
 */
final class Response
{
    private static bool $corsSent = false;

    /**
     * Emit CORS + hardening headers and answer preflight requests.
     *
     * @param bool $credentials true for endpoints that read the admin session
     * @param string[] $methods
     */
    public static function begin(array $methods, bool $credentials = false): void
    {
        header('Vary: Origin');
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('X-Frame-Options: DENY');
        header('Cache-Control: no-store, no-cache, must-revalidate');

        $origin = self::origin();
        if ($origin !== null && self::originAllowed($origin)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            if ($credentials) {
                header('Access-Control-Allow-Credentials: true');
            }
        }
        self::$corsSent = true;

        $allow = implode(', ', array_unique([...$methods, 'OPTIONS']));

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
            header('Access-Control-Allow-Methods: ' . $allow);
            header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, X-Requested-With');
            header('Access-Control-Max-Age: 600');
            http_response_code(204);
            exit;
        }

        if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', $methods, true)) {
            header('Allow: ' . $allow);
            self::error('METHOD_NOT_ALLOWED', 'Unsupported request method.', 405);
        }
    }

    public static function origin(): ?string
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        return is_string($origin) && $origin !== '' ? $origin : null;
    }

    public static function originAllowed(string $origin): bool
    {
        $allowed = Config::arr('allowed_origins');
        if ($allowed === []) {
            $allowed = [Config::str('app_url', 'https://marlsboro.com')];
        }
        foreach ($allowed as $candidate) {
            if (strcasecmp(rtrim($candidate, '/'), rtrim($origin, '/')) === 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Reject cross-site state-changing requests.
     *
     * A same-origin browser request either carries an allowed Origin or, on
     * older browsers, no Origin at all. Anything else is refused.
     */
    public static function requireTrustedOrigin(): void
    {
        $origin = self::origin();
        if ($origin === null) {
            $referer = $_SERVER['HTTP_REFERER'] ?? '';
            if (is_string($referer) && $referer !== '') {
                $parts  = parse_url($referer);
                $origin = isset($parts['scheme'], $parts['host'])
                    ? $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '')
                    : null;
            }
        }
        if ($origin !== null && !self::originAllowed($origin)) {
            Logger::warning('Blocked cross-origin request', [
                'origin' => $origin,
                'path'   => $_SERVER['REQUEST_URI'] ?? '',
            ]);
            self::error('FORBIDDEN_ORIGIN', 'Request rejected.', 403);
        }
    }

    /** @param array<string,mixed> $data */
    public static function success(array $data = [], int $status = 200, array $extra = []): void
    {
        self::send(['success' => true] + $extra + ['data' => $data], $status);
    }

    public static function error(string $code, string $message, int $status = 400, array $extra = []): void
    {
        self::send([
            'success' => false,
            'error'   => ['code' => $code, 'message' => $message] + $extra,
        ], $status);
    }

    /** @param array<string,mixed> $payload */
    private static function send(array $payload, int $status): void
    {
        if (!headers_sent()) {
            if (!self::$corsSent) {
                header('X-Content-Type-Options: nosniff');
            }
            header('Content-Type: application/json; charset=utf-8');
            http_response_code($status);
        }
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Decode a JSON request body (falls back to form encoding so the API keeps
     * working from a plain HTML form or curl -d).
     *
     * @return array<string,mixed>
     */
    public static function input(): array
    {
        $type = $_SERVER['CONTENT_TYPE'] ?? '';
        $raw  = file_get_contents('php://input');

        if (is_string($raw) && $raw !== '' && str_contains(strtolower($type), 'json')) {
            $decoded = json_decode($raw, true);
            if (!is_array($decoded)) {
                self::error('INVALID_JSON', 'Malformed request.', 400);
            }
            return $decoded;
        }

        if ($_POST !== []) {
            return $_POST;
        }

        if (is_string($raw) && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                return $decoded;
            }
            parse_str($raw, $parsed);
            if ($parsed !== []) {
                return $parsed;
            }
        }

        return [];
    }

    /** Caller's IP, honouring X-Forwarded-For only when explicitly trusted. */
    public static function clientIp(): string
    {
        if (Config::bool('security.trust_proxy', false)) {
            $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
            if (is_string($forwarded) && $forwarded !== '') {
                $first = trim(explode(',', $forwarded)[0]);
                if (filter_var($first, FILTER_VALIDATE_IP) !== false) {
                    return $first;
                }
            }
        }
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        return is_string($ip) && filter_var($ip, FILTER_VALIDATE_IP) !== false ? $ip : '0.0.0.0';
    }

    public static function userAgent(): string
    {
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        return is_string($ua) ? mb_substr($ua, 0, 1000) : '';
    }
}
