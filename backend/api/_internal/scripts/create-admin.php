<?php
/**
 * Create (or reset) an admin account.
 *
 *   php /home/<user>/public_html/api/_internal/scripts/create-admin.php
 *
 * The password is typed at a prompt with echo turned off — it never appears in
 * the shell history, in `ps`, or in this repository. To script it, pipe the
 * password in:
 *
 *   printf '%s' 'the-password' | php create-admin.php --email you@marlsboro.com --name "Your Name" --password-stdin
 *
 * Re-running for an existing email resets that account's password.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("This script runs from the command line only.\n");
}

require_once dirname(__DIR__) . '/bootstrap.php';

/** @return array<string,string> */
function options(array $argv): array
{
    $out = [];
    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];
        if (!str_starts_with($arg, '--')) {
            continue;
        }
        $key = substr($arg, 2);
        if (str_contains($key, '=')) {
            [$key, $value] = explode('=', $key, 2);
            $out[$key] = $value;
        } elseif (isset($argv[$i + 1]) && !str_starts_with($argv[$i + 1], '--')) {
            $out[$key] = $argv[++$i];
        } else {
            $out[$key] = '1';
        }
    }
    return $out;
}

function prompt(string $label, bool $hidden = false): string
{
    fwrite(STDOUT, $label);
    if (!$hidden) {
        return trim((string) fgets(STDIN));
    }
    // Turn off terminal echo where the platform allows it.
    $restore = null;
    if (function_exists('shell_exec') && stripos(PHP_OS_FAMILY, 'win') === false) {
        $restore = @shell_exec('stty -g 2>/dev/null');
        @shell_exec('stty -echo 2>/dev/null');
    }
    $value = trim((string) fgets(STDIN));
    if ($restore !== null) {
        @shell_exec('stty ' . trim($restore) . ' 2>/dev/null');
    }
    fwrite(STDOUT, "\n");
    return $value;
}

$opts = options($argv ?? []);

echo "MARLSBORO admin account setup\n";
echo "  Database: " . Config::str('db.name') . " on " . Config::str('db.host') . "\n\n";

$name  = $opts['name']  ?? prompt('Full name    : ');
$email = mb_strtolower(trim($opts['email'] ?? prompt('Email address: ')));
$role  = $opts['role']  ?? 'admin';

if ($name === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    fwrite(STDERR, "A name and a valid email address are required.\n");
    exit(1);
}
if (!in_array($role, ['admin', 'manager', 'viewer'], true)) {
    fwrite(STDERR, "Role must be admin, manager or viewer.\n");
    exit(1);
}

if (isset($opts['password-stdin'])) {
    $password = rtrim((string) stream_get_contents(STDIN), "\r\n");
    $confirm  = $password;
} else {
    $password = prompt('Password     : ', true);
    $confirm  = prompt('Confirm      : ', true);
}

if ($password !== $confirm) {
    fwrite(STDERR, "The passwords do not match.\n");
    exit(1);
}
if (strlen($password) < 12) {
    fwrite(STDERR, "Use at least 12 characters — this account can read every lead the business has.\n");
    exit(1);
}
if (preg_match('/[A-Za-z]/', $password) !== 1 || preg_match('/[0-9\W]/', $password) !== 1) {
    fwrite(STDERR, "Mix letters with numbers or symbols.\n");
    exit(1);
}

try {
    $existing = Database::one('SELECT id FROM admin_users WHERE email = :email', ['email' => $email]);
    $hash     = password_hash($password, PASSWORD_DEFAULT);
    $now      = Database::now();

    if ($existing !== null) {
        Database::run(
            'UPDATE admin_users SET name = :name, password_hash = :hash, role = :role,
                    is_active = 1, updated_at = :now WHERE id = :id',
            ['name' => $name, 'hash' => $hash, 'role' => $role, 'now' => $now, 'id' => (int) $existing['id']]
        );
        echo "\nPassword reset for {$email} (id {$existing['id']}, role {$role}).\n";
    } else {
        Database::run(
            'INSERT INTO admin_users (name, email, password_hash, role, is_active, created_at, updated_at)
                  VALUES (:name, :email, :hash, :role, 1, :now, :now2)',
            ['name' => $name, 'email' => $email, 'hash' => $hash, 'role' => $role, 'now' => $now, 'now2' => $now]
        );
        echo "\nAdmin created: {$email} (id " . Database::lastInsertId() . ", role {$role}).\n";
    }

    echo "Sign in at " . rtrim(Config::str('app_url'), '/') . "/admin/\n";
    exit(0);
} catch (Throwable $e) {
    Logger::exception('create-admin failed', $e);
    fwrite(STDERR, 'Failed: ' . $e->getMessage() . "\n");
    exit(1);
}
