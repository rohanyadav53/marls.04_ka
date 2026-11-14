<?php
/**
 * Post-deployment self-check.
 *
 *   php /home/<user>/public_html/api/_internal/scripts/selftest.php
 *   php … /selftest.php --email you@marlsboro.com     (also sends a test email)
 *
 * Run this once after deploying and again whenever something stops working.
 * It checks the things that actually break on shared hosting — PHP version,
 * extensions, config location and permissions, database connectivity, schema,
 * writable logs, and mail — and prints a plain pass/fail list.
 *
 * Nothing here writes to the leads table, and no credential is ever printed.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("This script runs from the command line only.\n");
}

$pass = 0;
$fail = 0;
$warn = 0;

function check(string $label, callable $test): void
{
    global $pass, $fail, $warn;
    try {
        $result = $test();
    } catch (Throwable $e) {
        $result = ['fail', $e->getMessage()];
    }
    [$state, $detail] = is_array($result) ? $result : ['pass', (string) $result];

    $mark = ['pass' => '  OK  ', 'warn' => ' WARN ', 'fail' => ' FAIL '][$state] ?? ' ???? ';
    printf("[%s] %-34s %s\n", $mark, $label, $detail);

    $state === 'fail' ? $fail++ : ($state === 'warn' ? $warn++ : $pass++);
}

echo "MARLSBORO lead system — self test\n";
echo str_repeat('-', 72) . "\n";

check('PHP version', static function () {
    return version_compare(PHP_VERSION, '8.0.0', '>=')
        ? ['pass', PHP_VERSION]
        : ['fail', PHP_VERSION . ' — PHP 8.0 or newer is required'];
});

foreach (['pdo_mysql' => 'fail', 'mbstring' => 'fail', 'openssl' => 'fail', 'json' => 'fail', 'zip' => 'warn'] as $ext => $severity) {
    check('Extension: ' . $ext, static function () use ($ext, $severity) {
        if (extension_loaded($ext)) {
            return ['pass', 'loaded'];
        }
        return [$severity, $ext === 'zip' ? 'missing — CSV export still works, .xlsx will not' : 'missing'];
    });
}

require_once dirname(__DIR__) . '/bootstrap.php';

check('Configuration file', static function () {
    $path = (string) Config::path();
    $inWebRoot = str_contains($path, '/public_html/');
    return $inWebRoot
        ? ['warn', $path . ' — inside public_html; move it to ../marlsboro-config/']
        : ['pass', $path];
});

check('Config file permissions', static function () {
    $path = (string) Config::path();
    $mode = @fileperms($path);
    if ($mode === false) {
        return ['warn', 'could not read permissions'];
    }
    $octal = substr(sprintf('%o', $mode), -3);
    return (int) $octal <= 640
        ? ['pass', $octal]
        : ['warn', $octal . ' — chmod 600 is safer'];
});

check('Timezone', static fn () => ['pass', date_default_timezone_get() . ' (' . date('Y-m-d H:i') . ')']);

check('Log directory writable', static function () {
    Logger::info('selftest');
    $dir = Config::str('log_dir', '') ?: MARLS_INTERNAL . '/storage/logs';
    return is_dir($dir) && is_writable($dir) ? ['pass', $dir] : ['fail', $dir . ' is not writable'];
});

check('Database connection', static function () {
    $version = Database::value('SELECT VERSION()', [], 'unknown');
    return ['pass', 'connected — ' . $version];
});

check('Database charset', static function () {
    $charset = (string) Database::value("SELECT @@character_set_database", [], '');
    return str_starts_with($charset, 'utf8mb4')
        ? ['pass', $charset]
        : ['warn', $charset . ' — utf8mb4 is required for Hindi/Chinese leads'];
});

foreach (['leads', 'admin_users', 'lead_activity', 'weekly_reports', 'rate_limits'] as $table) {
    check('Table: ' . $table, static function () use ($table) {
        $exists = Database::value('SELECT COUNT(*) FROM information_schema.tables
                                    WHERE table_schema = DATABASE() AND table_name = :t',
            ['t' => $table], 0);
        if ((int) $exists === 0) {
            return ['fail', 'missing — import database/schema.sql'];
        }
        $rows = Database::value('SELECT COUNT(*) FROM `' . $table . '`', [], 0);
        return ['pass', $rows . ' row(s)'];
    });
}

check('Admin accounts', static function () {
    $count = (int) Database::value('SELECT COUNT(*) FROM admin_users WHERE is_active = 1', [], 0);
    return $count > 0
        ? ['pass', $count . ' active']
        : ['fail', 'none — run scripts/create-admin.php'];
});

check('Unicode round-trip', static function () {
    // Proves the connection charset really carries Devanagari and Chinese.
    $sample = 'हिन्दी · 中文 · Ünïcode';
    $back   = (string) Database::value('SELECT :s', ['s' => $sample], '');
    return $back === $sample ? ['pass', 'utf8mb4 intact'] : ['fail', 'mangled: ' . $back];
});

check('Mail configuration', static function () {
    $driver = Config::str('mail.driver', 'smtp');
    if ($driver === 'mail') {
        return ['warn', 'using PHP mail() — authenticated SMTP is more reliable'];
    }
    if (Config::str('mail.host') === '' || Config::str('mail.username') === '') {
        return ['fail', 'SMTP host/username not set'];
    }
    if (Mailer::addresses(Config::str('mail.to')) === []) {
        return ['fail', 'mail.to is empty — nobody would be notified'];
    }
    return ['pass', Config::str('mail.username') . ' → ' . Config::str('mail.host') . ':' . Config::int('mail.port', 587)];
});

check('Report period', static function () {
    $p = Reports::period();
    return ['pass', $p['label'] . ' (' . $p['mode'] . ')'];
});

check('Export writer', static function () {
    $rows = [['id' => 1, 'name' => 'Test — हिन्दी', 'message' => "line one\nline two, with comma"]];
    $csv  = Export::csv($rows);
    $ok   = str_starts_with($csv, "\xEF\xBB\xBF") && str_contains($csv, 'हिन्दी');
    $xlsx = Export::xlsx($rows);
    return $ok
        ? ['pass', 'CSV ok' . ($xlsx === null ? ', XLSX unavailable' : ', XLSX ' . strlen($xlsx) . ' bytes')]
        : ['fail', 'CSV output looks wrong'];
});

$emailTo = null;
foreach (array_slice($argv, 1) as $index => $arg) {
    if ($arg === '--email' && isset($argv[$index + 2])) {
        $emailTo = $argv[$index + 2];
    } elseif (str_starts_with($arg, '--email=')) {
        $emailTo = substr($arg, 8);
    }
}

if ($emailTo !== null) {
    check('Test email', static function () use ($emailTo) {
        $ok = Mailer::send([
            'to'      => $emailTo,
            'subject' => 'MARLSBORO — self test',
            'html'    => '<p>Self test passed. SMTP is working.</p>',
        ]);
        return $ok ? ['pass', 'delivered to ' . $emailTo] : ['fail', Mailer::lastError()];
    });
} else {
    echo "[ skip ] Test email                        pass --email you@marlsboro.com to try SMTP\n";
}

echo str_repeat('-', 72) . "\n";
printf("%d passed · %d warnings · %d failed\n", $pass, $warn, $fail);

exit($fail > 0 ? 1 : 0);
