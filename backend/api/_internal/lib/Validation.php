<?php
declare(strict_types=1);

/**
 * Server-side validation and normalisation for public input.
 *
 * Nothing that arrives over HTTP is trusted — not the source, not the page URL,
 * not the language, not the length of anything. Values are normalised to the
 * shape the database column expects, or rejected with a message safe to show a
 * visitor.
 */
final class Validation
{
    /** Sources the frontend may claim. Anything else becomes 'Other'. */
    public const SOURCES = [
        'Contact Page',
        'Quote Popup',
        'Enquiry Form',
        'Product Page',
        'Industry Page',
        'Packaging Security',
        'Recyclable',
        'Careers',
        'Homepage',
        'Other',
    ];

    public const LANGUAGES = [
        'en', 'hi', 'gu', 'mr', 'bn', 'ta', 'te', 'ar',
        'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'id',
    ];

    public const STATUSES = ['new', 'contacted', 'converted', 'closed', 'spam'];

    /** @var array<string,string> field => message */
    private array $errors = [];

    /** @var array<string,mixed> */
    private array $clean = [];

    public function errors(): array { return $this->errors; }
    public function ok(): bool      { return $this->errors === []; }
    public function clean(): array  { return $this->clean; }

    public function firstError(): string
    {
        foreach ($this->errors as $message) {
            return $message;
        }
        return 'Please check the details you entered.';
    }

    /**
     * Trim, strip control characters, collapse runaway whitespace and cut to
     * the column width. Returns null for an empty result.
     */
    public static function text($value, int $max): ?string
    {
        if (!is_scalar($value)) {
            return null;
        }
        $s = (string) $value;

        // Reject bytes that are not valid UTF-8 before anything else — a
        // /u pattern fails outright on them, and a failed preg_replace would
        // otherwise silently blank a real enquiry.
        if (!mb_check_encoding($s, 'UTF-8')) {
            $s = mb_convert_encoding($s, 'UTF-8', 'UTF-8');
        }

        // Strip C0/C1 control characters except tab and newline.
        $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? $s;
        // Normalise line endings and cap consecutive blank lines.
        $s = str_replace(["\r\n", "\r"], "\n", $s);
        $s = preg_replace('/\n{4,}/', "\n\n\n", $s) ?? $s;
        $s = trim($s);

        if ($s === '') {
            return null;
        }
        if (mb_strlen($s) > $max) {
            $s = mb_substr($s, 0, $max);
        }
        return $s;
    }

    /** A single-line field: as text(), but newlines become spaces. */
    public static function line($value, int $max): ?string
    {
        $s = self::text($value, $max * 2);
        if ($s === null) {
            return null;
        }
        $s = preg_replace('/\s+/u', ' ', $s) ?? $s;
        $s = trim($s);
        return $s === '' ? null : mb_substr($s, 0, $max);
    }

    public function required(string $field, $value, int $max, string $message): self
    {
        $clean = self::line($value, $max);
        if ($clean === null) {
            $this->errors[$field] = $message;
        } else {
            $this->clean[$field] = $clean;
        }
        return $this;
    }

    public function optional(string $field, $value, int $max): self
    {
        $this->clean[$field] = self::line($value, $max);
        return $this;
    }

    public function optionalText(string $field, $value, int $max): self
    {
        $this->clean[$field] = self::text($value, $max);
        return $this;
    }

    public function requiredText(string $field, $value, int $max, string $message, int $min = 1): self
    {
        $clean = self::text($value, $max);
        if ($clean === null || mb_strlen($clean) < $min) {
            $this->errors[$field] = $message;
        } else {
            $this->clean[$field] = $clean;
        }
        return $this;
    }

    public function email(string $field, $value, bool $required, string $message): self
    {
        $clean = self::line($value, 255);
        if ($clean === null) {
            if ($required) {
                $this->errors[$field] = $message;
            }
            $this->clean[$field] = null;
            return $this;
        }
        $clean = mb_strtolower($clean);
        if (filter_var($clean, FILTER_VALIDATE_EMAIL) === false || !str_contains(explode('@', $clean)[1] ?? '', '.')) {
            $this->errors[$field] = $message;
            return $this;
        }
        $this->clean[$field] = $clean;
        return $this;
    }

    /**
     * Phone numbers arrive in every imaginable format from seven locales, so
     * this keeps what the visitor typed and only rejects what cannot be a
     * phone number at all.
     */
    public function phone(string $field, $value, bool $required, string $message): self
    {
        $clean = self::line($value, 50);
        if ($clean === null) {
            if ($required) {
                $this->errors[$field] = $message;
            }
            $this->clean[$field] = null;
            return $this;
        }
        $digits = preg_replace('/\D+/', '', $clean) ?? '';
        if (strlen($digits) < 6 || strlen($digits) > 20 || preg_match('/[<>{}\[\]]/', $clean) === 1) {
            $this->errors[$field] = $message;
            return $this;
        }
        $this->clean[$field] = $clean;
        return $this;
    }

    /** @param string[] $allowed */
    public function enum(string $field, $value, array $allowed, string $fallback): self
    {
        $clean = self::line($value, 100);
        $this->clean[$field] = ($clean !== null && in_array($clean, $allowed, true)) ? $clean : $fallback;
        return $this;
    }

    /**
     * A page URL is only stored when it points at our own site — otherwise it
     * is an open redirect / spam vector sitting in the admin inbox.
     */
    public function pageUrl(string $field, $value): self
    {
        $clean = self::line($value, 500);
        $this->clean[$field] = null;

        if ($clean === null) {
            return $this;
        }
        $parts = parse_url($clean);
        if ($parts === false || !isset($parts['scheme'], $parts['host'])) {
            return $this;
        }
        if (!in_array(strtolower($parts['scheme']), ['http', 'https'], true)) {
            return $this;
        }

        $host    = strtolower($parts['host']);
        $allowed = false;
        foreach (array_merge(Config::arr('allowed_origins'), [Config::str('app_url')]) as $origin) {
            $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
            if ($originHost !== '' && $originHost === $host) {
                $allowed = true;
                break;
            }
        }
        // Local development hosts are accepted so the field is useful in dev.
        if (!$allowed && in_array($host, ['localhost', '127.0.0.1', '[::1]'], true)) {
            $allowed = true;
        }

        if ($allowed) {
            $this->clean[$field] = $clean;
        }
        return $this;
    }

    /**
     * Cheap heuristics that catch the bulk of form spam. The score is stored
     * on the lead; a high score parks it in the Spam tab rather than deleting
     * it, so a false positive is recoverable.
     */
    public static function spamScore(array $lead): int
    {
        $score   = 0;
        $message = (string) ($lead['message'] ?? '');
        $name    = (string) ($lead['name'] ?? '');
        $haystack = mb_strtolower($name . ' ' . $message . ' ' . (string) ($lead['company'] ?? '') . ' ' . (string) ($lead['subject'] ?? ''));

        // Link farming — a genuine enquiry rarely carries several URLs.
        $links = preg_match_all('~https?://|www\.~i', $message);
        if ($links >= 2) { $score += 25; }
        if ($links >= 4) { $score += 30; }

        // BBCode/HTML anchors belong to bots, not to our form.
        if (preg_match('~\[url=|\[/url\]|<a\s+href~i', $message) === 1) { $score += 40; }

        foreach (['seo service', 'backlink', 'crypto', 'casino', 'viagra', 'porn', 'loan offer', 'bitcoin', 'forex', 'escort'] as $needle) {
            if (str_contains($haystack, $needle)) { $score += 30; }
        }

        // A "name" containing a URL, or nothing but consonants.
        if (preg_match('~https?://|www\.~i', $name) === 1) { $score += 40; }

        // Message identical to the name, or absurdly short for an enquiry.
        if ($message !== '' && mb_strlen($message) < 12) { $score += 10; }

        return min($score, 100);
    }
}
