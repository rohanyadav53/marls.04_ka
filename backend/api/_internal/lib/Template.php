<?php
declare(strict_types=1);

/**
 * Email templates live in _internal/templates as plain PHP files so a
 * non-developer can safely edit the wording without touching business logic.
 * They are rendered here, never included directly.
 */
final class Template
{
    /** @param array<string,mixed> $vars */
    public static function render(string $name, array $vars = []): string
    {
        if (preg_match('/^[a-z0-9\-]+$/', $name) !== 1) {
            throw new InvalidArgumentException('Bad template name.');
        }
        $file = MARLS_INTERNAL . '/templates/' . $name . '.php';
        if (!is_file($file)) {
            throw new RuntimeException('Template not found: ' . $name);
        }

        extract($vars, EXTR_SKIP);
        ob_start();
        try {
            include $file;
            return (string) ob_get_clean();
        } catch (Throwable $e) {
            ob_end_clean();
            throw $e;
        }
    }

    /** Escape for HTML email bodies. */
    public static function e($value): string
    {
        return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /** Escape and turn newlines into <br> — for the message body. */
    public static function multiline($value): string
    {
        return nl2br(self::e($value), false);
    }

    public static function dateTime(?string $mysqlDateTime): string
    {
        if ($mysqlDateTime === null || $mysqlDateTime === '') {
            return '—';
        }
        $d = date_create($mysqlDateTime);
        return $d === false ? $mysqlDateTime : $d->format('j F Y, g:i A');
    }

    public static function shortDate(?string $date): string
    {
        if ($date === null || $date === '') {
            return '—';
        }
        $d = date_create($date);
        return $d === false ? $date : $d->format('j M Y');
    }

    /** Human label for a language code. */
    public static function language(string $code): string
    {
        return [
            'en' => 'English', 'hi' => 'Hindi', 'gu' => 'Gujarati', 'mr' => 'Marathi',
            'bn' => 'Bengali', 'ta' => 'Tamil', 'te' => 'Telugu', 'ar' => 'Arabic',
            'fr' => 'French', 'es' => 'Spanish', 'de' => 'German', 'it' => 'Italian',
            'pt' => 'Portuguese', 'ru' => 'Russian', 'zh' => 'Chinese', 'ja' => 'Japanese',
            'id' => 'Indonesian',
        ][$code] ?? strtoupper($code);
    }

    public static function statusLabel(string $status): string
    {
        return ['new' => 'New', 'contacted' => 'Contacted', 'converted' => 'Converted',
                'closed' => 'Closed', 'spam' => 'Spam'][$status] ?? ucfirst($status);
    }
}
