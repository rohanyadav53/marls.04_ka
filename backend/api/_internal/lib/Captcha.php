<?php
declare(strict_types=1);

/**
 * Optional CAPTCHA verification.
 *
 * Disabled by default — the honeypot plus rate limiting handles ordinary form
 * spam without asking a genuine customer to prove anything. If the site ever
 * gets targeted, set security.captcha_provider + captcha_secret and have the
 * frontend post a `captcha_token`; nothing else needs to change.
 */
final class Captcha
{
    private const ENDPOINTS = [
        'turnstile' => 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        'recaptcha' => 'https://www.google.com/recaptcha/api/siteverify',
    ];

    public static function enabled(): bool
    {
        return Config::str('security.captcha_provider', '') !== ''
            && Config::str('security.captcha_secret', '') !== '';
    }

    /** Fails open on a network problem: our own outage must not block leads. */
    public static function verify(?string $token, string $ip): bool
    {
        if (!self::enabled()) {
            return true;
        }
        $endpoint = self::ENDPOINTS[Config::str('security.captcha_provider')] ?? null;
        if ($endpoint === null) {
            Logger::warning('Unknown captcha provider configured');
            return true;
        }
        if ($token === null || $token === '') {
            return false;
        }

        $payload = http_build_query([
            'secret'   => Config::str('security.captcha_secret'),
            'response' => $token,
            'remoteip' => $ip,
        ]);

        try {
            $body = self::post($endpoint, $payload);
            if ($body === null) {
                return true;
            }
            $decoded = json_decode($body, true);
            return is_array($decoded) && ($decoded['success'] ?? false) === true;
        } catch (Throwable $e) {
            Logger::warning('Captcha verification error', ['detail' => $e->getMessage()]);
            return true;
        }
    }

    private static function post(string $url, string $payload): ?string
    {
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $payload,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 8,
                CURLOPT_SSL_VERIFYPEER => true,
            ]);
            $body = curl_exec($ch);
            $err  = curl_error($ch);
            curl_close($ch);
            if ($body === false) {
                Logger::warning('Captcha request failed', ['detail' => $err]);
                return null;
            }
            return (string) $body;
        }

        $context = stream_context_create(['http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => 8,
        ]]);
        $body = @file_get_contents($url, false, $context);
        return $body === false ? null : $body;
    }
}
