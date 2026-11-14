<?php
declare(strict_types=1);

/**
 * Append-only file logger, one file per day.
 *
 * Two rules, enforced here rather than left to callers:
 *   1. Anything that looks like a credential is redacted before it is written.
 *   2. Logging failures are swallowed — a full disk must never take the site
 *      down or lose a lead.
 */
final class Logger
{
    private const LEVELS = ['debug' => 10, 'info' => 20, 'warning' => 30, 'error' => 40];

    /** Context keys whose values are replaced with '***'. */
    private const SECRET_KEYS = [
        'password', 'passwd', 'pass', 'secret', 'token', 'csrf', 'authorization',
        'api_key', 'apikey', 'session', 'cookie', 'hash',
    ];

    private static ?string $dir = null;

    public static function debug(string $m, array $c = []): void   { self::write('debug', $m, $c); }
    public static function info(string $m, array $c = []): void    { self::write('info', $m, $c); }
    public static function warning(string $m, array $c = []): void { self::write('warning', $m, $c); }
    public static function error(string $m, array $c = []): void   { self::write('error', $m, $c); }

    public static function exception(string $message, Throwable $e, array $context = []): void
    {
        self::write('error', $message, $context + [
            'exception' => get_class($e),
            'detail'    => $e->getMessage(),
            'file'      => $e->getFile() . ':' . $e->getLine(),
            'trace'     => self::isDebug() ? $e->getTraceAsString() : '(enable log_level=debug for trace)',
        ]);
    }

    private static function isDebug(): bool
    {
        return Config::isLoaded() && Config::str('log_level', 'info') === 'debug';
    }

    private static function write(string $level, string $message, array $context): void
    {
        try {
            $min = self::LEVELS[Config::isLoaded() ? Config::str('log_level', 'info') : 'info'] ?? 20;
            if ((self::LEVELS[$level] ?? 20) < $min) {
                return;
            }

            $dir = self::dir();
            if ($dir === null) {
                return;
            }

            $line = sprintf(
                "[%s] %s: %s%s%s",
                date('Y-m-d H:i:s'),
                strtoupper($level),
                $message,
                $context === [] ? '' : ' ' . self::encode(self::redact($context)),
                PHP_EOL
            );

            @file_put_contents($dir . '/marlsboro-' . date('Y-m-d') . '.log', $line, FILE_APPEND | LOCK_EX);
        } catch (Throwable) {
            // Never let logging break the request.
        }
    }

    private static function dir(): ?string
    {
        if (self::$dir !== null) {
            return self::$dir === '' ? null : self::$dir;
        }

        $configured = Config::isLoaded() ? Config::str('log_dir', '') : '';
        $dir = $configured !== '' ? rtrim($configured, '/') : MARLS_INTERNAL . '/storage/logs';

        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }
        self::$dir = is_dir($dir) && is_writable($dir) ? $dir : '';

        return self::$dir === '' ? null : self::$dir;
    }

    private static function redact(array $context): array
    {
        $out = [];
        foreach ($context as $key => $value) {
            if (is_array($value)) {
                $out[$key] = self::redact($value);
                continue;
            }
            $lower  = strtolower((string) $key);
            $secret = false;
            foreach (self::SECRET_KEYS as $needle) {
                if (str_contains($lower, $needle)) {
                    $secret = true;
                    break;
                }
            }
            if ($secret) {
                $out[$key] = '***';
            } elseif (is_string($value) && strlen($value) > 500) {
                $out[$key] = substr($value, 0, 500) . '…';
            } else {
                $out[$key] = $value;
            }
        }
        return $out;
    }

    private static function encode(array $context): string
    {
        $json = json_encode($context, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
        return $json === false ? '{"log_encode":"failed"}' : $json;
    }
}
