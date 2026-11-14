<?php
declare(strict_types=1);

/**
 * Fixed-window rate limiting backed by MySQL.
 *
 * A database table rather than APCu or a file so the counters are shared by
 * every PHP worker on the account — on shared hosting there is no guarantee
 * two requests hit the same process.
 */
final class RateLimiter
{
    /**
     * Count one attempt against $bucket.
     *
     * @return bool true when the caller is still inside the limit
     */
    public static function hit(string $bucket, int $limit, int $window): bool
    {
        if ($limit <= 0 || $window <= 0) {
            return true;                       // limiting disabled by config
        }

        $bucket = mb_substr($bucket, 0, 190);
        $now    = date('Y-m-d H:i:s');
        $cutoff = date('Y-m-d H:i:s', time() - $window);

        try {
            Database::run(
                'INSERT INTO rate_limits (bucket, window_start, hits, updated_at)
                      VALUES (:bucket, :now_a, 1, :now_b)
                 ON DUPLICATE KEY UPDATE
                      hits         = IF(window_start < :cutoff_a, 1, hits + 1),
                      window_start = IF(window_start < :cutoff_b, :now_c, window_start),
                      updated_at   = :now_d',
                [
                    'bucket'   => $bucket,
                    'now_a'    => $now,
                    'now_b'    => $now,
                    'now_c'    => $now,
                    'now_d'    => $now,
                    'cutoff_a' => $cutoff,
                    'cutoff_b' => $cutoff,
                ]
            );

            $hits = (int) Database::value(
                'SELECT hits FROM rate_limits WHERE bucket = :bucket',
                ['bucket' => $bucket],
                0
            );

            self::prune();

            return $hits <= $limit;
        } catch (Throwable $e) {
            // A limiter outage must not stop a customer enquiring.
            Logger::error('Rate limiter unavailable', ['bucket' => $bucket, 'detail' => $e->getMessage()]);
            return true;
        }
    }

    /** Wipe a bucket — used after a successful login. */
    public static function clear(string $bucket): void
    {
        try {
            Database::run('DELETE FROM rate_limits WHERE bucket = :bucket', ['bucket' => mb_substr($bucket, 0, 190)]);
        } catch (Throwable $e) {
            Logger::warning('Rate limiter clear failed', ['detail' => $e->getMessage()]);
        }
    }

    /** Drop stale rows now and then so the table cannot grow without bound. */
    private static function prune(): void
    {
        if (random_int(1, 50) !== 1) {
            return;
        }
        try {
            Database::run(
                'DELETE FROM rate_limits WHERE window_start < :cutoff LIMIT 500',
                ['cutoff' => date('Y-m-d H:i:s', time() - 86400)]
            );
        } catch (Throwable $e) {
            Logger::warning('Rate limiter prune failed', ['detail' => $e->getMessage()]);
        }
    }
}
