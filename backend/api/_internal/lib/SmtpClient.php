<?php
declare(strict_types=1);

/**
 * Minimal authenticated SMTP client — no Composer, no PEAR, nothing to install.
 *
 * CWP accounts frequently have no Composer available, and PHP's mail() gives
 * you no authentication and no error detail. This speaks enough of RFC 5321 to
 * deliver through the domain mailbox reliably: STARTTLS or implicit TLS,
 * AUTH LOGIN / PLAIN, proper dot-stuffing, and real error messages.
 *
 * If PHPMailer happens to be installed, Mailer prefers it — see Mailer.php.
 */
final class SmtpClient
{
    /** @var resource|null */
    private $socket = null;

    /** @var string[] Extensions advertised by the server's last EHLO. */
    private array $extensions = [];

    /** @var string[] Protocol transcript, credentials masked, for the log. */
    private array $transcript = [];

    public function __construct(
        private string $host,
        private int $port,
        private string $username,
        private string $password,
        private string $encryption = 'tls',   // tls | ssl | none
        private int $timeout = 20,
        private bool $verifyPeer = true,
    ) {}

    /** @return string[] */
    public function transcript(): array { return $this->transcript; }

    /**
     * @param string[] $recipients
     * @throws RuntimeException on any protocol, TLS or authentication failure
     */
    public function send(string $envelopeFrom, array $recipients, string $message): void
    {
        if ($recipients === []) {
            throw new RuntimeException('No recipients.');
        }

        try {
            $this->connect();
            $this->ehlo();

            if ($this->encryption === 'tls') {
                $this->startTls();
                $this->ehlo();                 // capabilities change after TLS
            }

            if ($this->username !== '') {
                $this->authenticate();
            }

            $this->command('MAIL FROM:<' . $envelopeFrom . '>', [250]);
            foreach ($recipients as $rcpt) {
                $this->command('RCPT TO:<' . $rcpt . '>', [250, 251]);
            }
            $this->command('DATA', [354]);

            $this->write($this->stuff($message) . "\r\n.\r\n");
            $this->expect([250], 'end of DATA');

            $this->command('QUIT', [221, 250], true);
        } finally {
            $this->close();
        }
    }

    private function connect(): void
    {
        $scheme = $this->encryption === 'ssl' ? 'ssl' : 'tcp';
        $target = $scheme . '://' . $this->host . ':' . $this->port;

        $context = stream_context_create(['ssl' => [
            'verify_peer'       => $this->verifyPeer,
            'verify_peer_name'  => $this->verifyPeer,
            'allow_self_signed' => !$this->verifyPeer,
            'SNI_enabled'       => true,
            'peer_name'         => $this->host,
        ]]);

        $errNo  = 0;
        $errStr = '';
        $socket = @stream_socket_client($target, $errNo, $errStr, $this->timeout, STREAM_CLIENT_CONNECT, $context);

        if ($socket === false) {
            throw new RuntimeException(sprintf('Cannot reach SMTP server %s:%d (%s)', $this->host, $this->port, $errStr !== '' ? $errStr : 'error ' . $errNo));
        }

        $this->socket = $socket;
        stream_set_timeout($this->socket, $this->timeout);
        $this->expect([220], 'server greeting');
    }

    private function ehlo(): void
    {
        $hostname = $this->clientHostname();
        $reply    = $this->command('EHLO ' . $hostname, [250], true);

        if ($reply === null) {
            // Very old server — fall back to HELO.
            $this->command('HELO ' . $hostname, [250]);
            $this->extensions = [];
            return;
        }

        $this->extensions = [];
        foreach (explode("\n", $reply) as $line) {
            $line = trim(substr($line, 4));     // drop "250-" / "250 "
            if ($line !== '') {
                $this->extensions[] = strtoupper($line);
            }
        }
    }

    private function startTls(): void
    {
        $this->command('STARTTLS', [220]);

        $method = STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
            $method = STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                $method |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
            }
        }

        $ok = @stream_socket_enable_crypto($this->socket, true, $method);
        if ($ok !== true) {
            throw new RuntimeException(
                'STARTTLS negotiation failed. If the mail server uses a self-signed certificate, '
                . "set mail.verify_peer to false in the configuration."
            );
        }
        $this->transcript[] = 'C: [TLS established]';
    }

    private function authenticate(): void
    {
        $supportsLogin = $this->supports('AUTH') && str_contains($this->authLine(), 'LOGIN');
        $supportsPlain = $this->supports('AUTH') && str_contains($this->authLine(), 'PLAIN');

        if ($supportsPlain && !$supportsLogin) {
            $this->command(
                'AUTH PLAIN ' . base64_encode("\0" . $this->username . "\0" . $this->password),
                [235],
                false,
                'AUTH PLAIN ***'
            );
            return;
        }

        // AUTH LOGIN is the widest-supported mechanism on cPanel/CWP mail stacks.
        $this->command('AUTH LOGIN', [334]);
        $this->command(base64_encode($this->username), [334], false, '[username]');
        $this->command(base64_encode($this->password), [235], false, '[password]');
    }

    private function authLine(): string
    {
        foreach ($this->extensions as $extension) {
            if (str_starts_with($extension, 'AUTH')) {
                return $extension;
            }
        }
        return '';
    }

    private function supports(string $extension): bool
    {
        foreach ($this->extensions as $advertised) {
            if (str_starts_with($advertised, strtoupper($extension))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param int[] $expected
     * @param bool  $tolerant  return null instead of throwing on an unexpected code
     */
    private function command(string $command, array $expected, bool $tolerant = false, ?string $logAs = null): ?string
    {
        $this->transcript[] = 'C: ' . ($logAs ?? $command);
        $this->write($command . "\r\n");

        try {
            return $this->expect($expected, $command);
        } catch (RuntimeException $e) {
            if ($tolerant) {
                return null;
            }
            throw $e;
        }
    }

    private function write(string $data): void
    {
        if (!is_resource($this->socket)) {
            throw new RuntimeException('SMTP connection closed unexpectedly.');
        }
        $written = @fwrite($this->socket, $data);
        if ($written === false) {
            throw new RuntimeException('Failed to write to the SMTP connection.');
        }
    }

    /** @param int[] $expected */
    private function expect(array $expected, string $context): string
    {
        if (!is_resource($this->socket)) {
            throw new RuntimeException('SMTP connection closed unexpectedly.');
        }

        $reply = '';
        $code  = 0;

        while (true) {
            $line = @fgets($this->socket, 1024);
            if ($line === false) {
                $meta = is_resource($this->socket) ? stream_get_meta_data($this->socket) : ['timed_out' => false];
                throw new RuntimeException(
                    !empty($meta['timed_out'])
                        ? sprintf('SMTP server timed out after %s.', $context)
                        : sprintf('SMTP server closed the connection during %s.', $context)
                );
            }
            $reply .= $line;
            $code   = (int) substr($line, 0, 3);

            // A multiline reply keeps a hyphen in the 4th column.
            if (strlen($line) < 4 || $line[3] !== '-') {
                break;
            }
        }

        $this->transcript[] = 'S: ' . trim($reply);

        if (!in_array($code, $expected, true)) {
            throw new RuntimeException(sprintf('SMTP error after %s: %s', $context, trim($reply)));
        }
        return $reply;
    }

    /** RFC 5321 §4.5.2 — a leading dot on any line must be doubled. */
    private function stuff(string $message): string
    {
        $message = str_replace(["\r\n", "\r", "\n"], ["\n", "\n", "\r\n"], $message);
        return preg_replace('/^\./m', '..', $message) ?? $message;
    }

    private function clientHostname(): string
    {
        $host = $_SERVER['SERVER_NAME'] ?? '';
        if (!is_string($host) || $host === '' || !preg_match('/^[A-Za-z0-9.\-]+$/', $host)) {
            $host = (string) parse_url(Config::str('app_url', 'https://marlsboro.com'), PHP_URL_HOST);
        }
        return $host !== '' ? $host : 'localhost';
    }

    private function close(): void
    {
        if (is_resource($this->socket)) {
            @fclose($this->socket);
        }
        $this->socket = null;
    }
}
