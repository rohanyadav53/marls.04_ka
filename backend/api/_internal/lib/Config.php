<?php
declare(strict_types=1);

/**
 * Configuration loaded from a PHP file kept outside the web root.
 *
 * Values are read with dot paths — Config::get('mail.host') — and secrets are
 * never echoed: Config::redacted() is what goes into logs or diagnostics.
 */
final class Config
{
    /** @var array<string,mixed> */
    private static array $values = [];
    private static ?string $path = null;
    private static bool $loaded  = false;

    /** Keys whose values must never appear in a log, response or diagnostic. */
    private const SECRET_KEYS = ['password', 'secret', 'captcha_secret', 'key', 'token'];

    /** @param string[] $candidates */
    public static function load(array $candidates): void
    {
        foreach ($candidates as $path) {
            if ($path !== '' && is_file($path) && is_readable($path)) {
                /** @var mixed $loaded */
                $loaded = require $path;
                if (!is_array($loaded)) {
                    throw new RuntimeException('Configuration file did not return an array.');
                }
                self::$values = $loaded;
                self::$path   = $path;
                self::$loaded = true;
                return;
            }
        }

        throw new RuntimeException(
            'No configuration file found. Copy backend/config/config.example.php to '
            . dirname(__DIR__, 4) . '/marlsboro-config/config.php and fill it in.'
        );
    }

    public static function isLoaded(): bool { return self::$loaded; }
    public static function path(): ?string  { return self::$path; }

    /** @return mixed */
    public static function get(string $key, $default = null)
    {
        $node = self::$values;
        foreach (explode('.', $key) as $segment) {
            if (!is_array($node) || !array_key_exists($segment, $node)) {
                return $default;
            }
            $node = $node[$segment];
        }
        // An empty string in the config file means "not set" for scalars.
        return $node === '' ? ($default ?? '') : $node;
    }

    public static function str(string $key, string $default = ''): string
    {
        $v = self::get($key, $default);
        return is_scalar($v) ? (string) $v : $default;
    }

    public static function int(string $key, int $default = 0): int
    {
        $v = self::get($key, $default);
        return is_numeric($v) ? (int) $v : $default;
    }

    public static function bool(string $key, bool $default = false): bool
    {
        $v = self::get($key, $default);
        return is_bool($v) ? $v : (is_scalar($v) ? filter_var($v, FILTER_VALIDATE_BOOLEAN) : $default);
    }

    /** @return array<int,string> */
    public static function arr(string $key): array
    {
        $v = self::get($key, []);
        return is_array($v) ? array_values(array_map('strval', $v)) : [];
    }

    public static function isDevelopment(): bool
    {
        return self::str('environment', 'production') !== 'production';
    }

    /**
     * The whole configuration with every secret replaced by '***'.
     * Safe to log or show in an authenticated diagnostics screen.
     *
     * @return array<string,mixed>
     */
    public static function redacted(): array
    {
        return self::redact(self::$values);
    }

    /**
     * @param array<string,mixed> $node
     * @return array<string,mixed>
     */
    private static function redact(array $node): array
    {
        $out = [];
        foreach ($node as $key => $value) {
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
            $out[$key] = $secret && $value !== '' && $value !== null ? '***' : $value;
        }
        return $out;
    }
}
