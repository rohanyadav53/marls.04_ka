<?php
/**
 * MARLSBORO Group — backend configuration.
 *
 *  COPY THIS FILE OUTSIDE THE WEB ROOT.  On CWP that means:
 *
 *      /home/<cwp-user>/marlsboro-config/config.php        ← real secrets here
 *      /home/<cwp-user>/public_html/                       ← website
 *
 *  chmod 600 it and chown it to the account user.  The bootstrap looks for it
 *  automatically (see api/_internal/bootstrap.php for the search order).
 *
 *  NEVER commit the filled-in copy to git.  NEVER put any of these values in
 *  the React app — everything in this file is server-side only.
 */

return [

    /* ---------------------------------------------------------------- App -- */

    // Public site origin. Used for CORS, links in emails and cookie security.
    'app_url'      => 'https://marlsboro.com',

    // 'production' hides error detail from responses; 'development' shows it.
    'environment'  => 'production',

    // Origins allowed to call the API. Keep this tight — no wildcards.
    'allowed_origins' => [
        'https://marlsboro.com',
        'https://www.marlsboro.com',
    ],

    // Timezone used for created_at, report periods and email timestamps.
    'timezone'     => 'Asia/Kolkata',

    /* ----------------------------------------------------------- Database -- */

    'db' => [
        'host'     => 'localhost',
        'port'     => 3306,
        'name'     => 'marlsbor_leads',      // CWP prefixes with the account name
        'user'     => 'marlsbor_leads',
        'password' => 'CHANGE-ME',
        'charset'  => 'utf8mb4',
    ],

    /* -------------------------------------------------------------- Email -- */

    // driver: 'smtp' (authenticated, preferred) or 'mail' (PHP mail(), last resort)
    'mail' => [
        'driver'     => 'smtp',

        'host'       => 'mail.marlsboro.com',
        'port'       => 587,
        'username'   => 'leads@marlsboro.com',
        'password'   => 'CHANGE-ME',

        // 'tls' = STARTTLS on 587  ·  'ssl' = implicit TLS on 465  ·  'none'
        'encryption' => 'tls',

        // Some CWP boxes use a self-signed certificate on mail.<domain>.
        // Leave true. Only set false if the SMTP test fails with a
        // certificate error AND you understand the trade-off.
        'verify_peer' => true,

        'timeout'    => 20,

        'from'       => 'leads@marlsboro.com',
        'from_name'  => 'MARLSBORO Website',

        // Where new-lead notifications go. Comma-separate for several people.
        'to'         => 'info@marlsboro.com',

        // Where the Friday report goes. Defaults to `to` when left empty.
        'report_to'  => '',

        // Optional Reply-To override; empty = reply goes to the lead's own address.
        'reply_to'   => '',

        // If PHPMailer is installed via Composer, point at its autoloader and
        // it will be used instead of the built-in SMTP client. Optional.
        'phpmailer_autoload' => '',
    ],

    /* ----------------------------------------------------------- Sessions -- */

    'session' => [
        'name'            => 'MARLSBORO_ADMIN',
        // Log out after this many seconds of inactivity (default 2 hours).
        'idle_timeout'    => 7200,
        // Hard cap on a single session regardless of activity (12 hours).
        'absolute_timeout'=> 43200,
        // Leave null to auto-detect HTTPS. Force true in production.
        'secure_cookie'   => null,
        // Optional writable dir for session files, outside the web root.
        'save_path'       => '',
    ],

    /* ------------------------------------------------------------ Security -- */

    'security' => [
        // Public lead form: max submissions per IP per window.
        'lead_rate_limit'        => 5,
        'lead_rate_window'       => 3600,   // seconds

        // Admin login: failed attempts per IP+email before lockout.
        'login_rate_limit'       => 5,
        'login_rate_window'      => 900,    // seconds

        // A second lead with the same email (or phone) AND the same
        // requirement inside this window is flagged as a possible duplicate.
        // It is still saved. 0 disables the check.
        'duplicate_window'       => 600,    // seconds

        // Name of the hidden honeypot input. Must match the React form.
        'honeypot_field'         => 'website',

        // Optional Cloudflare Turnstile / reCAPTCHA v3 secret. Empty = disabled.
        // The API accepts a `captcha_token` field and verifies it when set.
        'captcha_provider'       => '',     // '' | 'turnstile' | 'recaptcha'
        'captcha_secret'         => '',

        // Trust X-Forwarded-For? Only enable behind a proxy/CDN you control,
        // otherwise the client can forge its own IP and defeat rate limiting.
        'trust_proxy'            => false,
    ],

    /* ------------------------------------------------------------ Reports -- */

    'reports' => [
        // 'rolling7'  — the 7 days ending on the run date (Sat→Fri if run Friday)
        // 'last_week' — the most recent completed Monday 00:00 → Sunday 23:59
        'period'          => 'rolling7',

        // Attach an .xlsx as well as the .csv when PHP has the zip extension.
        'attach_xlsx'     => true,

        // Skip sending when the period produced no leads at all.
        'skip_when_empty' => false,
    ],

    /* -------------------------------------------------------------- Logs --- */

    // Directory for application logs. Keep it OUTSIDE public_html.
    // Leave empty to use api/_internal/storage/logs (web-blocked by .htaccess).
    'log_dir'   => '',
    // 'debug' | 'info' | 'warning' | 'error'
    'log_level' => 'info',
];
