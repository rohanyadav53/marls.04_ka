<?php
declare(strict_types=1);

/**
 * Admin authentication on PHP sessions.
 *
 * Cookie is HttpOnly + Secure + SameSite; the session id is regenerated on
 * login and periodically afterwards; idle and absolute timeouts both apply.
 * Nothing about the admin is exposed to JavaScript beyond name/email/role.
 */
final class Auth
{
    private static bool $started = false;

    public static function startSession(): void
    {
        if (self::$started || session_status() === PHP_SESSION_ACTIVE) {
            self::$started = true;
            return;
        }

        $savePath = Config::str('session.save_path', '');
        if ($savePath !== '' && is_dir($savePath) && is_writable($savePath)) {
            session_save_path($savePath);
        }

        session_name(Config::str('session.name', 'MARLSBORO_ADMIN'));

        $secure = Config::get('session.secure_cookie', null);
        if ($secure === null) {
            $secure = self::isHttps();
        }

        session_set_cookie_params([
            'lifetime' => 0,                    // browser session
            'path'     => '/',
            'domain'   => '',
            'secure'   => (bool) $secure,
            'httponly' => true,
            'samesite' => 'Strict',
        ]);

        @ini_set('session.use_strict_mode', '1');
        @ini_set('session.use_only_cookies', '1');
        @ini_set('session.cookie_httponly', '1');

        session_start();
        self::$started = true;

        self::enforceTimeouts();
    }

    public static function isHttps(): bool
    {
        if (($_SERVER['HTTPS'] ?? '') !== '' && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
            return true;
        }
        if (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https' && Config::bool('security.trust_proxy', false)) {
            return true;
        }
        return str_starts_with(Config::str('app_url', ''), 'https://') && (int) ($_SERVER['SERVER_PORT'] ?? 0) === 443;
    }

    /**
     * Verify credentials and open a session.
     *
     * The same generic failure is returned for an unknown email, a wrong
     * password and a disabled account — the caller must not be able to tell
     * which admin addresses exist.
     */
    public static function attemptLogin(string $email, string $password): bool
    {
        $row = Database::one(
            'SELECT id, name, email, password_hash, role, is_active
               FROM admin_users
              WHERE email = :email
              LIMIT 1',
            ['email' => $email]
        );

        // Constant-ish work whether or not the account exists.
        $hash = is_array($row) ? (string) $row['password_hash'] : '$2y$12$0000000000000000000000000000000000000000000000000000';
        $ok   = password_verify($password, $hash);

        if (!is_array($row) || !$ok || (int) $row['is_active'] !== 1) {
            Logger::warning('Failed admin login', ['email' => $email, 'ip' => Response::clientIp()]);
            return false;
        }

        if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
            Database::run(
                'UPDATE admin_users SET password_hash = :hash, updated_at = :now WHERE id = :id',
                ['hash' => password_hash($password, PASSWORD_DEFAULT), 'now' => Database::now(), 'id' => (int) $row['id']]
            );
        }

        self::startSession();
        session_regenerate_id(true);

        $_SESSION['admin_id']      = (int) $row['id'];
        $_SESSION['admin_name']    = (string) $row['name'];
        $_SESSION['admin_email']   = (string) $row['email'];
        $_SESSION['admin_role']    = (string) $row['role'];
        $_SESSION['login_at']      = time();
        $_SESSION['last_seen']     = time();
        $_SESSION['regenerated_at']= time();
        $_SESSION['ua_hash']       = self::uaHash();
        Csrf::rotate();

        Database::run(
            'UPDATE admin_users SET last_login = :now, updated_at = :now2 WHERE id = :id',
            ['now' => Database::now(), 'now2' => Database::now(), 'id' => (int) $row['id']]
        );

        Logger::info('Admin login', ['admin_id' => (int) $row['id'], 'ip' => Response::clientIp()]);
        return true;
    }

    public static function logout(): void
    {
        self::startSession();
        $id = self::id();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires'  => time() - 42000,
                'path'     => $p['path'],
                'domain'   => $p['domain'],
                'secure'   => $p['secure'],
                'httponly' => $p['httponly'],
                'samesite' => $p['samesite'] ?? 'Strict',
            ]);
        }
        session_destroy();
        self::$started = false;
        if ($id !== null) {
            Logger::info('Admin logout', ['admin_id' => $id]);
        }
    }

    public static function id(): ?int
    {
        $id = $_SESSION['admin_id'] ?? null;
        return is_int($id) && $id > 0 ? $id : null;
    }

    /** @return array<string,mixed>|null */
    public static function user(): ?array
    {
        self::startSession();
        if (self::id() === null) {
            return null;
        }
        return [
            'id'    => self::id(),
            'name'  => (string) ($_SESSION['admin_name'] ?? ''),
            'email' => (string) ($_SESSION['admin_email'] ?? ''),
            'role'  => (string) ($_SESSION['admin_role'] ?? 'admin'),
        ];
    }

    /**
     * Gate for every admin endpoint. 401 when not signed in — the frontend
     * route guard is convenience only; this is the real boundary.
     *
     * @return array<string,mixed>
     */
    public static function requireUser(): array
    {
        $user = self::user();
        if ($user === null) {
            Response::error('UNAUTHENTICATED', 'Please sign in.', 401);
        }
        return $user;
    }

    /** @param string[] $roles */
    public static function requireRole(array $roles): array
    {
        $user = self::requireUser();
        if (!in_array($user['role'], $roles, true)) {
            Logger::warning('Admin role check failed', ['admin_id' => $user['id'], 'role' => $user['role']]);
            Response::error('FORBIDDEN', 'You do not have permission to do that.', 403);
        }
        return $user;
    }

    /** Writers are admin + manager; 'viewer' is read-only. */
    public static function requireWriter(): array
    {
        return self::requireRole(['admin', 'manager']);
    }

    private static function enforceTimeouts(): void
    {
        if (self::id() === null) {
            return;
        }

        $idle     = Config::int('session.idle_timeout', 7200);
        $absolute = Config::int('session.absolute_timeout', 43200);
        $lastSeen = (int) ($_SESSION['last_seen'] ?? 0);
        $loginAt  = (int) ($_SESSION['login_at'] ?? 0);

        $expired = ($idle > 0 && $lastSeen > 0 && time() - $lastSeen > $idle)
            || ($absolute > 0 && $loginAt > 0 && time() - $loginAt > $absolute);

        // A session id replayed from a different browser is treated as stolen.
        $uaChanged = ($_SESSION['ua_hash'] ?? '') !== self::uaHash();

        if ($expired || $uaChanged) {
            Logger::info('Admin session ended', ['reason' => $expired ? 'timeout' : 'client_changed']);
            $_SESSION = [];
            session_destroy();
            session_start();
            return;
        }

        $_SESSION['last_seen'] = time();

        // Roll the session id every 15 minutes to shrink the fixation window.
        if (time() - (int) ($_SESSION['regenerated_at'] ?? 0) > 900) {
            session_regenerate_id(true);
            $_SESSION['regenerated_at'] = time();
        }
    }

    private static function uaHash(): string
    {
        return substr(hash('sha256', (string) ($_SERVER['HTTP_USER_AGENT'] ?? '')), 0, 32);
    }
}
