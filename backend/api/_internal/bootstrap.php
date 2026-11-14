<?php
/**
 * MARLSBORO Group — backend bootstrap.
 *
 * Every entry point (API endpoint, cron script, CLI tool) includes this file
 * and nothing else. It locates the configuration, wires the autoloader, and
 * installs error handlers that log the detail and reveal none of it.
 */

declare(strict_types=1);

// Nothing is ever printed to the client, whatever php.ini says. Errors are
// logged; the client gets a clean JSON envelope. Overridden below when the
// configuration says we are in development.
@ini_set('display_errors', '0');
@ini_set('log_errors', '1');
error_reporting(E_ALL);

define('MARLS_INTERNAL', __DIR__);
define('MARLS_API_ROOT', dirname(__DIR__));
define('MARLS_IS_CLI', PHP_SAPI === 'cli');

/* ------------------------------------------------------------ autoloader -- */

spl_autoload_register(static function (string $class): void {
    if (!preg_match('/^[A-Za-z][A-Za-z0-9_]*$/', $class)) {
        return;
    }
    $file = MARLS_INTERNAL . '/lib/' . $class . '.php';
    if (is_file($file)) {
        require_once $file;
    }
});

require_once MARLS_INTERNAL . '/lib/Config.php';

/* ------------------------------------------------------------ config ----- */
/*
 * Search order — first hit wins:
 *   1. $_ENV / getenv MARLSBORO_CONFIG   (explicit path, best for cron & dev)
 *   2. <account home>/marlsboro-config/config.php  (…/public_html/api/_internal → up 3)
 *   3. <docroot parent>/marlsboro-config/config.php
 *   4. api/_internal/config.php          (fallback; blocked by .htaccess but
 *                                         still inside the web root — avoid)
 */
$candidates = [];

$fromEnv = getenv('MARLSBORO_CONFIG');
if (is_string($fromEnv) && $fromEnv !== '') {
    $candidates[] = $fromEnv;
}
$candidates[] = dirname(__DIR__, 3) . '/marlsboro-config/config.php';

$docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
if (is_string($docRoot) && $docRoot !== '') {
    $candidates[] = dirname($docRoot) . '/marlsboro-config/config.php';
}
$candidates[] = __DIR__ . '/config.php';

// Loaded before the handlers below exist, so it needs its own guard —
// otherwise a missing config file produces a blank 500 with no clue why.
try {
    Config::load($candidates);
} catch (Throwable $e) {
    Logger::error('Configuration could not be loaded', ['detail' => $e->getMessage()]);
    if (MARLS_IS_CLI) {
        fwrite(STDERR, $e->getMessage() . PHP_EOL);
        exit(1);
    }
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => ['code' => 'NOT_CONFIGURED', 'message' => 'The service is not available right now.'],
    ]);
    exit(1);
}

date_default_timezone_set(Config::get('timezone', 'Asia/Kolkata'));

if (Config::isDevelopment()) {
    @ini_set('display_errors', MARLS_IS_CLI ? '1' : '0');
}

/* ------------------------------------------------------- error handling -- */

set_error_handler(static function (int $no, string $msg, string $file = '', int $line = 0): bool {
    if ((error_reporting() & $no) === 0) {
        return false;                       // suppressed with @ — respect it
    }
    Logger::warning('PHP notice', ['message' => $msg, 'file' => $file, 'line' => $line]);
    return true;
});

set_exception_handler(static function (Throwable $e): void {
    Logger::exception('Unhandled exception', $e);
    if (MARLS_IS_CLI) {
        fwrite(STDERR, 'Fatal: ' . $e->getMessage() . PHP_EOL);
        exit(1);
    }
    if (!headers_sent()) {
        Response::error('SERVER_ERROR', 'Something went wrong. Please try again.', 500);
    }
    exit(1);
});

register_shutdown_function(static function (): void {
    $err = error_get_last();
    if ($err === null || !in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        return;
    }
    Logger::error('Fatal error', [
        'message' => $err['message'],
        'file'    => $err['file'],
        'line'    => $err['line'],
    ]);
    if (!MARLS_IS_CLI && !headers_sent()) {
        Response::error('SERVER_ERROR', 'Something went wrong. Please try again.', 500);
    }
});
