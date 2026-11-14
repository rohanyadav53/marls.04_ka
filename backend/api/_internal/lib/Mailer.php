<?php
declare(strict_types=1);

/**
 * Outbound mail: MIME assembly plus a choice of transport.
 *
 * Transport preference, highest first:
 *   1. PHPMailer  — when mail.phpmailer_autoload points at a real autoloader
 *   2. SmtpClient — built in, authenticated SMTP (the normal path)
 *   3. mail()     — only when mail.driver is explicitly set to 'mail'
 *
 * send() returns a bool and never throws: callers (lead submission above all)
 * must be able to carry on when the mail server is having a bad day.
 */
final class Mailer
{
    private static string $lastError = '';

    public static function lastError(): string { return self::$lastError; }

    /**
     * @param array{
     *   to?: string|string[], subject: string, html?: string, text?: string,
     *   reply_to?: string, reply_name?: string,
     *   attachments?: array<int,array{name:string,content:string,mime?:string}>
     * } $message
     */
    public static function send(array $message): bool
    {
        self::$lastError = '';

        try {
            $recipients = self::addresses($message['to'] ?? Config::str('mail.to'));
            if ($recipients === []) {
                throw new RuntimeException('No recipient configured (mail.to is empty).');
            }

            $from     = self::address(Config::str('mail.from', 'leads@marlsboro.com'));
            $fromName = Config::str('mail.from_name', 'MARLSBORO Website');
            if ($from === null) {
                throw new RuntimeException('mail.from is not a valid address.');
            }

            $subject     = self::headerSafe((string) ($message['subject'] ?? '(no subject)'));
            $html        = (string) ($message['html'] ?? '');
            $text        = (string) ($message['text'] ?? ($html !== '' ? self::htmlToText($html) : ''));
            $attachments = $message['attachments'] ?? [];

            $replyTo = self::address((string) ($message['reply_to'] ?? Config::str('mail.reply_to', '')));

            $driver = Config::str('mail.driver', 'smtp');

            $phpmailer = self::loadPhpMailer();
            if ($phpmailer && $driver === 'smtp') {
                return self::viaPhpMailer($from, $fromName, $recipients, $subject, $html, $text, $attachments, $replyTo, (string) ($message['reply_name'] ?? ''));
            }

            $raw = self::buildMime($from, $fromName, $recipients, $subject, $html, $text, $attachments, $replyTo, (string) ($message['reply_name'] ?? ''));

            if ($driver === 'mail') {
                return self::viaMailFunction($recipients, $subject, $raw);
            }

            $client = new SmtpClient(
                Config::str('mail.host', 'localhost'),
                Config::int('mail.port', 587),
                Config::str('mail.username', ''),
                Config::str('mail.password', ''),
                Config::str('mail.encryption', 'tls'),
                Config::int('mail.timeout', 20),
                Config::bool('mail.verify_peer', true),
            );

            $client->send($from, $recipients, $raw);

            Logger::info('Mail sent', ['to' => $recipients, 'subject' => $subject]);
            return true;
        } catch (Throwable $e) {
            self::$lastError = $e->getMessage();
            Logger::error('Mail delivery failed', [
                'detail'  => $e->getMessage(),
                'subject' => $message['subject'] ?? '',
            ]);
            return false;
        }
    }

    /* -------------------------------------------------------- transports -- */

    private static function loadPhpMailer(): bool
    {
        if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
            return true;
        }
        $autoload = Config::str('mail.phpmailer_autoload', '');
        if ($autoload !== '' && is_file($autoload)) {
            require_once $autoload;
        }
        return class_exists('PHPMailer\\PHPMailer\\PHPMailer');
    }

    /** @param string[] $recipients */
    private static function viaPhpMailer(
        string $from, string $fromName, array $recipients, string $subject,
        string $html, string $text, array $attachments, ?string $replyTo, string $replyName
    ): bool {
        /** @psalm-suppress UndefinedClass */
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = Config::str('mail.host', 'localhost');
        $mail->Port       = Config::int('mail.port', 587);
        $mail->SMTPAuth   = Config::str('mail.username', '') !== '';
        $mail->Username   = Config::str('mail.username', '');
        $mail->Password   = Config::str('mail.password', '');
        $mail->Timeout    = Config::int('mail.timeout', 20);
        $mail->CharSet    = 'UTF-8';

        $encryption = Config::str('mail.encryption', 'tls');
        if ($encryption === 'tls' || $encryption === 'ssl') {
            $mail->SMTPSecure = $encryption;
        } else {
            $mail->SMTPAutoTLS = false;
        }
        if (!Config::bool('mail.verify_peer', true)) {
            $mail->SMTPOptions = ['ssl' => [
                'verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true,
            ]];
        }

        $mail->setFrom($from, $fromName);
        foreach ($recipients as $rcpt) {
            $mail->addAddress($rcpt);
        }
        if ($replyTo !== null) {
            $mail->addReplyTo($replyTo, $replyName);
        }
        foreach ($attachments as $attachment) {
            $mail->addStringAttachment(
                $attachment['content'],
                self::filenameSafe($attachment['name']),
                'base64',
                $attachment['mime'] ?? 'application/octet-stream'
            );
        }

        $mail->Subject = $subject;
        if ($html !== '') {
            $mail->isHTML(true);
            $mail->Body    = $html;
            $mail->AltBody = $text;
        } else {
            $mail->isHTML(false);
            $mail->Body = $text;
        }

        $mail->send();
        Logger::info('Mail sent (PHPMailer)', ['to' => $recipients, 'subject' => $subject]);
        return true;
    }

    /** @param string[] $recipients */
    private static function viaMailFunction(array $recipients, string $subject, string $raw): bool
    {
        // Split the assembled MIME into headers + body for mail().
        $split   = explode("\r\n\r\n", $raw, 2);
        $headers = $split[0] ?? '';
        $body    = $split[1] ?? '';

        // mail() sets its own To/Subject; drop ours to avoid duplicates.
        $kept = [];
        foreach (explode("\r\n", $headers) as $line) {
            if (preg_match('/^(To|Subject):/i', $line) !== 1) {
                $kept[] = $line;
            }
        }

        $ok = @mail(implode(', ', $recipients), $subject, $body, implode("\r\n", $kept));
        if (!$ok) {
            throw new RuntimeException('PHP mail() returned false — check the server MTA.');
        }
        Logger::info('Mail sent (mail())', ['to' => $recipients, 'subject' => $subject]);
        return true;
    }

    /* ------------------------------------------------------------- MIME --- */

    /**
     * Assemble the RFC 5322 message.
     *
     * Three shapes, depending on what the message carries:
     *   text only              → text/plain
     *   text + html            → multipart/alternative
     *   anything + attachments → multipart/mixed wrapping the above
     *
     * @param string[] $recipients
     */
    private static function buildMime(
        string $from, string $fromName, array $recipients, string $subject,
        string $html, string $text, array $attachments, ?string $replyTo, string $replyName
    ): string {
        $boundaryMixed = 'mrl_mix_' . bin2hex(random_bytes(12));
        $boundaryAlt   = 'mrl_alt_' . bin2hex(random_bytes(12));
        $hasFiles      = $attachments !== [];
        $hasHtml       = $html !== '';

        $headers = [
            'Date: ' . date('r'),
            'From: ' . self::formatAddress($from, $fromName),
            'To: ' . implode(', ', $recipients),
            'Subject: ' . self::encodeHeader($subject),
            'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . self::messageIdHost($from) . '>',
            'MIME-Version: 1.0',
            'X-Mailer: MARLSBORO Lead System',
            'Auto-Submitted: auto-generated',
        ];
        if ($replyTo !== null) {
            $headers[] = 'Reply-To: ' . self::formatAddress($replyTo, $replyName);
        }

        // The alternative (or single text) block, without a top-level header —
        // whether that header belongs in $headers or after a mixed boundary
        // depends on whether there are attachments.
        if ($hasHtml) {
            $contentHeader = 'Content-Type: multipart/alternative; boundary="' . $boundaryAlt . '"';
            $content  = "\r\n";
            $content .= '--' . $boundaryAlt . "\r\n";
            $content .= self::part('text/plain; charset=UTF-8', $text);
            $content .= '--' . $boundaryAlt . "\r\n";
            $content .= self::part('text/html; charset=UTF-8', $html);
            $content .= '--' . $boundaryAlt . "--\r\n";
        } else {
            $contentHeader = "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64";
            $content = "\r\n" . chunk_split(base64_encode($text), 76, "\r\n");
        }

        if (!$hasFiles) {
            foreach (explode("\r\n", $contentHeader) as $line) {
                $headers[] = $line;
            }
            return implode("\r\n", $headers) . "\r\n" . $content;
        }

        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundaryMixed . '"';

        $body  = "\r\nThis is a multi-part message in MIME format.\r\n\r\n";
        $body .= '--' . $boundaryMixed . "\r\n";
        $body .= $contentHeader . "\r\n" . $content;

        foreach ($attachments as $attachment) {
            $name = self::filenameSafe($attachment['name']);
            $body .= "\r\n--" . $boundaryMixed . "\r\n";
            $body .= 'Content-Type: ' . ($attachment['mime'] ?? 'application/octet-stream') . '; name="' . $name . "\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= 'Content-Disposition: attachment; filename="' . $name . "\"\r\n\r\n";
            $body .= chunk_split(base64_encode($attachment['content']), 76, "\r\n");
        }
        $body .= "\r\n--" . $boundaryMixed . "--\r\n";

        return implode("\r\n", $headers) . "\r\n" . $body;
    }

    /**
     * One MIME part with its own headers. Base64 keeps UTF-8 (Hindi, Chinese)
     * intact regardless of how the receiving MTA treats long lines.
     */
    private static function part(string $contentType, string $content): string
    {
        return 'Content-Type: ' . $contentType . "\r\n"
            . "Content-Transfer-Encoding: base64\r\n\r\n"
            . chunk_split(base64_encode($content), 76, "\r\n");
    }

    /* -------------------------------------------------------- utilities -- */

    /** @param string|string[] $value @return string[] */
    public static function addresses($value): array
    {
        $list = is_array($value) ? $value : explode(',', (string) $value);
        $out  = [];
        foreach ($list as $candidate) {
            $address = self::address((string) $candidate);
            if ($address !== null && !in_array($address, $out, true)) {
                $out[] = $address;
            }
        }
        return $out;
    }

    public static function address(string $value): ?string
    {
        $value = trim(str_replace(["\r", "\n", "\0"], '', $value));
        if ($value === '') {
            return null;
        }
        return filter_var($value, FILTER_VALIDATE_EMAIL) !== false ? $value : null;
    }

    private static function formatAddress(string $address, string $name): string
    {
        $name = self::headerSafe($name);
        return $name === '' ? $address : self::encodeHeader($name) . ' <' . $address . '>';
    }

    /** Strip anything that could inject an extra header. */
    private static function headerSafe(string $value): string
    {
        return trim(str_replace(["\r", "\n", "\0"], ' ', $value));
    }

    private static function encodeHeader(string $value): string
    {
        if (preg_match('/^[\x20-\x7E]*$/', $value) === 1) {
            return $value;                     // pure ASCII — send as-is
        }
        if (function_exists('mb_encode_mimeheader')) {
            return mb_encode_mimeheader($value, 'UTF-8', 'B', "\r\n");
        }
        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }

    private static function filenameSafe(string $name): string
    {
        $name = preg_replace('/[^A-Za-z0-9._\-]/', '-', $name) ?? 'attachment';
        return $name === '' ? 'attachment' : substr($name, 0, 120);
    }

    private static function messageIdHost(string $from): string
    {
        $host = substr(strrchr($from, '@') ?: '@marlsboro.com', 1);
        return $host !== '' ? $host : 'marlsboro.com';
    }

    /** Plain-text fallback for the multipart/alternative part. */
    public static function htmlToText(string $html): string
    {
        $text = preg_replace('~<(br|/tr|/p|/div|/h[1-6])[^>]*>~i', "\n", $html) ?? $html;
        $text = preg_replace('~<(/td|/th)>~i', "\t", $text) ?? $text;
        $text = strip_tags($text);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
        $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;
        return trim($text);
    }
}
