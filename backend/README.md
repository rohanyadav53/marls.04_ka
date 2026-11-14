# MARLSBORO lead backend

PHP 8 + MySQL. No Composer, no framework, no build step — it runs on stock CWP
hosting. Deployment is "copy `api/` into `public_html/`"; see
[CWP_DEPLOYMENT.md](../CWP_DEPLOYMENT.md).

## Layout

```
backend/
├── config/config.example.php   template — the real copy lives OUTSIDE public_html
├── database/
│   ├── schema.sql              all five tables, safe to re-run
│   └── seed_admin.sql          fallback for servers with no PHP CLI
└── api/                        ← this whole folder becomes public_html/api/
    ├── .htaccess               no listings, no dotfiles, no caching
    ├── leads.php               PUBLIC  POST  — the only unauthenticated endpoint
    ├── login.php  logout.php  me.php
    ├── admin/                  every file here calls Auth::requireUser() first
    │   ├── leads.php  lead.php  stats.php
    │   ├── export.php  reports.php  send-report.php  test-email.php
    │   └── .htaccess
    └── _internal/              ← .htaccess: Require all denied
        ├── bootstrap.php       config discovery, autoloader, error handling
        ├── lib/                Config Database Logger Response Validation
        │                       RateLimiter Auth Csrf Captcha Mailer SmtpClient
        │                       Leads Reports Export Template
        ├── templates/          lead-notification.php · weekly-report.php
        ├── cron/weekly-leads.php
        ├── scripts/            create-admin.php · selftest.php
        └── storage/logs/
```

Everything a browser may reach is one directory deep. Everything else is behind
`Require all denied`, and the credentials are not in the web root at all.

## Request flow

```
Browser  →  POST /api/leads.php
              honeypot → rate limit → validation → captcha (optional)
              → spam score → duplicate check
              → INSERT into leads          ← committed here
              → SMTP notification          ← failure only sets notification_error
              → 201 {"success":true,"lead_id":n}
```

The ordering is the point: **the lead is stored before the email is attempted**,
and no mail failure changes the visitor's answer or removes the row.

## API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/leads.php` | public | submit an enquiry |
| POST | `/api/login.php` | public | admin sign-in (rate limited) |
| POST | `/api/logout.php` | session | sign out (CSRF) |
| GET | `/api/me.php` | any | session probe + CSRF token + feature flags |
| GET | `/api/admin/stats.php` | session | dashboard figures |
| GET | `/api/admin/leads.php` | session | search / filter / paginate |
| GET | `/api/admin/lead.php?id=` | session | one lead + audit trail |
| PATCH | `/api/admin/lead.php` | session + CSRF | status / assignee / notes |
| GET | `/api/admin/export.php` | session | CSV or XLSX download |
| GET | `/api/admin/reports.php` | session | weekly-report log |
| POST | `/api/admin/send-report.php` | session + CSRF | run the report now |
| POST | `/api/admin/test-email.php` | session + CSRF | verify SMTP |

Responses are always JSON:

```json
{ "success": true,  "data": { } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "…" } }
```

Unauthenticated admin requests get `401`; a signed-in user without the right
role gets `403`; a stale CSRF token gets `419`. Database and PHP errors are
logged server-side and surface as a generic message — never a stack trace.

## Security summary

- **SQL** — PDO with `ATTR_EMULATE_PREPARES => false`, prepared statements
  everywhere. The only non-parameterised SQL fragments are column names and
  sort directions chosen from fixed whitelists in `Leads.php`.
- **Input** — nothing is trusted: `source` and `language` are matched against
  whitelists, `page_url` is discarded unless it points at our own domain,
  every string is control-character-stripped and length-capped to its column.
- **Spam** — hidden honeypot (silently accepted, never stored), per-IP rate
  limiting, keyword/link heuristics that park a lead in the Spam tab rather
  than deleting it, and optional Turnstile/reCAPTCHA.
- **Duplicates** — flagged, never rejected. A company may legitimately enquire
  twice; the admin sees a badge and decides.
- **Sessions** — HttpOnly + Secure + SameSite=Strict cookie, id regenerated on
  login and every 15 minutes, idle and absolute timeouts, session dropped if
  the user agent changes.
- **CSRF** — token in the session, echoed in `X-CSRF-Token`, required for every
  state-changing admin call, plus an Origin check.
- **Passwords** — `password_hash()` / `password_verify()`, transparent rehash on
  algorithm upgrade, identical response for unknown user and wrong password.
- **CORS** — an explicit origin allowlist. Never `*`, and credentials are only
  allowed for the listed origins.
- **Logs** — anything whose key looks like a credential is written as `***`.

## Data stored, and why

| Field | Why it exists |
|---|---|
| name, company, email, phone, country, city | to reply to the enquiry |
| requirement, inquiry_type, subject, message | what they asked for |
| source, page_url, language | which page and language produced the lead |
| status, assigned_to, admin_notes | sales workflow |
| is_duplicate, duplicate_of, spam_score | quality signals, all reversible |
| notification_sent / _at / _error | proof the alert went out, or why it did not |
| ip_address, user_agent | abuse handling and spam disputes only |
| created_at, updated_at | reporting |

`ip_address` and `user_agent` are **never** returned by the list endpoint and
never reach the public site — only an authenticated admin viewing a single lead
sees them, because that is where a spam judgement is made. If the business
decides it does not want them, drop the two columns; nothing else depends on
them.

## Local development

There is no PHP requirement for frontend work — the form will simply report a
failure it cannot reach. To run the whole thing locally you need PHP 8 and
MySQL.

```bash
# 1. database
mysql -u root -e "CREATE DATABASE marlsboro_leads CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
mysql -u root marlsboro_leads < backend/database/schema.sql

# 2. configuration (outside the served folder)
mkdir -p ~/marlsboro-config
cp backend/config/config.example.php ~/marlsboro-config/config.php
#    edit: db credentials, app_url=http://localhost:5173,
#    allowed_origins=["http://localhost:5173"], environment='development'

# 3. serve the API
MARLSBORO_CONFIG=~/marlsboro-config/config.php php -S localhost:8080 -t backend/api

# 4. point the frontend at it
echo 'VITE_API_BASE_URL=http://localhost:8080' > .env.local
npm run dev

# 5. an admin account
MARLSBORO_CONFIG=~/marlsboro-config/config.php \
  php backend/api/_internal/scripts/create-admin.php
```

Two caveats with `php -S`:

- It ignores `.htaccess`, so `_internal/` **is** reachable locally. That is a
  development-only artefact — Apache blocks it in production, and step 16 of
  the deployment guide verifies that.
- Set `environment => 'development'` to get error detail on the console.

Verify the setup at any time:

```bash
MARLSBORO_CONFIG=~/marlsboro-config/config.php php backend/api/_internal/scripts/selftest.php
```

## Configuration reference

Every key is documented inline in `config/config.example.php`. The ones worth
knowing about:

| Key | Default | Notes |
|---|---|---|
| `security.lead_rate_limit` / `_window` | 5 / 3600 | submissions per IP per hour |
| `security.login_rate_limit` / `_window` | 5 / 900 | failed sign-ins before lockout |
| `security.duplicate_window` | 600 | seconds within which a repeat is flagged |
| `security.honeypot_field` | `website` | must match the React form |
| `security.trust_proxy` | false | only enable behind a proxy you control |
| `reports.period` | `rolling7` | or `last_week` |
| `reports.attach_xlsx` | true | ignored if PHP has no `zip` |
| `session.idle_timeout` | 7200 | seconds |
| `mail.driver` | `smtp` | `mail` falls back to PHP `mail()` |
| `mail.phpmailer_autoload` | — | set it and PHPMailer is used instead |
