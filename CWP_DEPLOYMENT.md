# Deploying the MARLSBORO lead system on CWP

Step-by-step, assuming no prior CWP experience. Follow it in order — later
steps depend on earlier ones. Budget about an hour for the first deployment.

Throughout, replace `<user>` with your CWP account username (the one that owns
`marlsboro.com`). You can see it in **CWP → List Accounts**. Paths on CWP look
like `/home/<user>/public_html`.

---

## 0 · What you are deploying

Three separate things end up on the server:

```
/home/<user>/
├── marlsboro-config/
│   └── config.php              ← database + SMTP passwords. OUTSIDE the web
│                                 root, so Apache can never serve it.
├── marlsboro-logs/             ← application logs (optional but recommended)
│
└── public_html/                ← everything the public can reach
    ├── index.html              ┐
    ├── assets/                 │ the marketing site (Vite build)
    ├── photos/  brochure/      ┘
    │
    ├── admin/                  ← the admin portal (second Vite build)
    │   └── index.html
    │
    ├── api/                    ← the PHP backend
    │   ├── leads.php           public lead endpoint
    │   ├── login.php  logout.php  me.php
    │   ├── admin/              authenticated admin endpoints
    │   └── _internal/          library code, templates, cron, setup scripts
    │                             (blocked from the web by its own .htaccess)
    └── .htaccess
```

The rule to remember: **`_internal/` and `marlsboro-config/` are never reachable
over HTTP.** If you can load either in a browser, stop and fix it before going
live.

---

## 1 · Before you start

You need:

- CWP admin (or account) login
- FTP/SFTP or CWP's File Manager
- SSH access if possible — steps 9, 10 and 12 are much easier with it
  (they can be done through CWP's Terminal or File Manager if not)
- Node.js 20+ on your own machine, to build the frontend

---

## 2 · Build the frontend

On your own machine, in the project folder:

```bash
npm install && npm run build
```

This produces `dist/`:

```
dist/index.html          the marketing site
dist/admin/index.html    the admin portal
dist/assets/…            JS + CSS for both
dist/photos/ …           static files copied from public/
```

No `.env` file is needed for a production build — the app defaults to a
relative `/api`, which is correct when the API shares the domain.

---

## 3 · Create the MySQL database

**CWP → SQL Services → MySQL Manager → Create Database.**

| Field         | Value                                        |
|---------------|----------------------------------------------|
| Database name | `leads` (CWP prefixes it → `<user>_leads`)   |
| Username      | `leads` (becomes `<user>_leads`)             |
| Password      | generate a long random one — save it somewhere safe |

Note the **full** names CWP shows after creation, e.g. `marlsbor_leads`. You
need them in step 7.

## 4 · Grant privileges

CWP usually assigns the new user to the new database automatically. Confirm in
**MySQL Manager → the database → Users**. The user needs
`SELECT, INSERT, UPDATE, DELETE` — `ALL PRIVILEGES` on this one database is fine
and simplest. It never needs access to any other database.

## 5 · Import the schema

**CWP → SQL Services → phpMyAdmin →** select `<user>_leads` **→ Import →**
choose `backend/database/schema.sql` **→ Go.**

You should end up with five tables: `leads`, `admin_users`, `lead_activity`,
`weekly_reports`, `rate_limits`.

> The file is safe to re-run — every statement is `CREATE TABLE IF NOT EXISTS`.

## 6 · Check the PHP version

**CWP → PHP Settings → PHP Version Switcher** (or **PHP-FPM Selector** for the
domain). You need **PHP 8.0 or newer** with these extensions:

`pdo_mysql` · `mbstring` · `openssl` · `json` — all standard.
`zip` is optional; without it CSV export still works but `.xlsx` does not.

Find the CLI binary — you need its exact path for the cron job in step 12:

```bash
which php
```

Typical answers on CWP: `/usr/local/bin/php`, `/usr/bin/php`, or a version-
specific path such as `/opt/alt/php82/usr/bin/php`. Whatever it prints, check it:

```bash
/usr/local/bin/php -v
```

---

## 7 · Upload the files

Upload in this order.

**a) The website** — contents of `dist/` into `/home/<user>/public_html/`
(so `public_html/index.html` and `public_html/admin/index.html` both exist).

**b) The API** — the whole `backend/api/` folder into
`/home/<user>/public_html/api/`.

After this you should have `public_html/api/leads.php` and
`public_html/api/_internal/bootstrap.php`.

**c) The Apache rules** — `deploy/public_html.htaccess` to
`/home/<user>/public_html/.htaccess` (renamed to exactly `.htaccess`), and
optionally `deploy/admin.htaccess` to `/home/<user>/public_html/admin/.htaccess`.

> If `public_html/.htaccess` already exists, **merge** rather than overwrite —
> CWP may have put its own directives there.

**d) Check the hidden files arrived.** FTP clients often skip dotfiles. These
three must exist:

```
public_html/.htaccess
public_html/api/.htaccess
public_html/api/_internal/.htaccess          ← the important one
```

## 8 · Create the configuration file

This holds every password, so it goes **outside** `public_html`.

```bash
mkdir -p /home/<user>/marlsboro-config /home/<user>/marlsboro-logs
cp /home/<user>/public_html/api/../../backend/config/config.example.php \
   /home/<user>/marlsboro-config/config.php
```

If you did not upload the repo's `backend/config/` folder, just create
`/home/<user>/marlsboro-config/config.php` in File Manager and paste the
contents of `backend/config/config.example.php` into it.

Now edit it and fill in:

| Setting                | Value                                              |
|------------------------|----------------------------------------------------|
| `app_url`              | `https://marlsboro.com`                            |
| `allowed_origins`      | `https://marlsboro.com`, `https://www.marlsboro.com` |
| `db.name/user/password`| the full names from step 3                         |
| `mail.*`               | step 9                                             |
| `log_dir`              | `/home/<user>/marlsboro-logs`                      |

Lock it down:

```bash
chmod 600 /home/<user>/marlsboro-config/config.php
chown <user>:<user> /home/<user>/marlsboro-config/config.php
chmod 750 /home/<user>/marlsboro-logs
```

> **How the backend finds it:** it looks for `$MARLSBORO_CONFIG`, then
> `/home/<user>/marlsboro-config/config.php` (derived from its own location),
> then a path next to the document root, and only as a last resort
> `api/_internal/config.php`. The first three are outside the web root; use one
> of them.

## 9 · Configure SMTP

**CWP → Email → Email Accounts → Create** a mailbox for the domain, e.g.
`leads@marlsboro.com`, with a strong password.

Then in `config.php`:

```php
'mail' => [
    'driver'     => 'smtp',
    'host'       => 'mail.marlsboro.com',   // or the server's hostname
    'port'       => 587,
    'username'   => 'leads@marlsboro.com',
    'password'   => 'the mailbox password',
    'encryption' => 'tls',                  // 587 = tls · 465 = ssl
    'verify_peer'=> true,
    'from'       => 'leads@marlsboro.com',
    'from_name'  => 'MARLSBORO Website',
    'to'         => 'info@marlsboro.com',   // who gets new-lead alerts
    'report_to'  => '',                     // blank = same as `to`
],
```

Notes:

- Use the **domain mailbox**, not a Gmail address — mail sent "from"
  `marlsboro.com` through another provider will fail SPF and land in spam.
- If step 11's test fails with a certificate error, the server is probably using
  a self-signed certificate on `mail.marlsboro.com`. Either use the server's
  real hostname as `host`, or set `verify_peer => false` (weaker: it stops the
  client verifying who it is talking to).
- Make sure SPF and DKIM exist for the domain — **CWP → Email → SPF/DKIM
  Manager**. Without them, notifications go to junk.

## 10 · Create the first admin account

```bash
/usr/local/bin/php /home/<user>/public_html/api/_internal/scripts/create-admin.php
```

It prompts for name, email and password (typed invisibly), requires at least 12
characters, and stores only a `password_hash()` digest.

No plaintext password is ever written to a file, and there is **no web installer
to remove afterwards** — account creation only exists on the command line.

If you truly cannot run PHP on the command line, `backend/database/seed_admin.sql`
explains the phpMyAdmin route.

## 11 · Run the self-test

```bash
/usr/local/bin/php /home/<user>/public_html/api/_internal/scripts/selftest.php --email you@marlsboro.com
```

It checks PHP version, extensions, config location and permissions, database
connectivity, all five tables, utf8mb4 (Hindi/Chinese), log writability, the
mail settings — and sends a real test email if you pass `--email`.

Fix anything marked `FAIL` before continuing. `WARN` is worth reading but not
blocking.

## 12 · Test a real lead submission

1. Open `https://marlsboro.com/contact` and submit the form.
2. You should see the thank-you panel.
3. Check `info@marlsboro.com` for **"New Marlsboro Lead — …"**.
4. Sign in at `https://marlsboro.com/admin/` — the lead should be on the
   dashboard.

If the form shows the failure message, open the browser's developer console
(F12 → Network → `leads.php`) and look at the response. Then check
`/home/<user>/marlsboro-logs/marlsboro-<today>.log`.

---

## 13 · Set up the weekly cron job

**CWP → Cron Jobs → Add Cron Job** (as the account user, not root).

Use the PHP path you found in step 6:

```
0 18 * * 5 /usr/local/bin/php /home/<user>/public_html/api/_internal/cron/weekly-leads.php >> /home/<user>/marlsboro-logs/weekly-leads.log 2>&1
```

Reading the schedule: `0 18 * * 5` = **minute 0, hour 18, every day-of-month,
every month, day-of-week 5 (Friday)** → every Friday at 18:00 server time.

To change the time, edit the first two fields — `30 17 * * 5` is 17:30 Friday.
Check the server's timezone matches your expectation:

```bash
date
```

and set `timezone` in `config.php` to match your business hours
(`Asia/Kolkata` by default).

**The cron is safe to run twice.** Each reporting period is recorded in
`weekly_reports` with a unique key; a period already sent is skipped, not
re-sent. You can prove this by running the command twice by hand.

## 14 · Test the weekly report

Dry run first — this sends nothing:

```bash
/usr/local/bin/php /home/<user>/public_html/api/_internal/cron/weekly-leads.php --dry-run
```

Then for real:

```bash
/usr/local/bin/php /home/<user>/public_html/api/_internal/cron/weekly-leads.php
```

Or click **Send weekly report now** in the admin portal's Reports screen — same
code, same duplicate protection.

The email contains a summary, a table of the week's leads, and the full list
attached as CSV (plus `.xlsx` if the `zip` extension is available).

**Reporting period:** by default the **rolling last 7 days**, i.e. the 7 days
ending on the day the report runs — Saturday→Friday when it runs on a Friday.
To use the completed Monday–Sunday week instead, set
`'reports' => ['period' => 'last_week']` in `config.php`.

---

## 15 · SSL

**CWP → Apache Settings → SSL Certificates → Let's Encrypt** (or install the
certificate you have) for both `marlsboro.com` and `www.marlsboro.com`.

Only after the certificate is live, confirm the HTTPS redirect block at the top
of `public_html/.htaccess` is uncommented. Sessions use `Secure` cookies, so the
admin portal will not stay signed in over plain HTTP.

## 16 · Final verification

Work through this list in a browser:

| Check | Expected |
|---|---|
| `https://marlsboro.com/` | site loads |
| `https://marlsboro.com/contact` then refresh | still loads (no 404 — rewrite works) |
| Submit the enquiry form | thank-you panel + email arrives |
| `https://marlsboro.com/api/me.php` | JSON `{"success":true,…,"authenticated":false}` |
| `https://marlsboro.com/api/_internal/bootstrap.php` | **403 Forbidden** ← must not be 200 |
| `https://marlsboro.com/api/_internal/config.php` | **403 Forbidden** |
| `https://marlsboro.com/api/admin/leads.php` (signed out) | **401** JSON, no data |
| `https://marlsboro.com/api/admin/export.php` (signed out) | **401**, no file downloads |
| `https://marlsboro.com/admin/` | sign-in screen |
| Sign in, wrong password ×6 | rate-limited message |
| Sign in correctly | dashboard with real numbers |
| Leads → search, filter, open one, change status, add a note | all persist after refresh |
| Leads → Export all | CSV downloads and opens in Excel with correct accents |
| Reports → Send weekly report now | email arrives; pressing again says "skipped" |
| Settings → Send test email | "Email sent successfully" |

---

## Troubleshooting

**The form says "We couldn't submit your enquiry right now."**
Open DevTools → Network → `leads.php`.
- `404` — the `api/` folder is missing or `.htaccess` rule 2 was not merged.
- `500` — check the log in `marlsboro-logs/`. Usually the config file was not
  found, or the database credentials are wrong.
- `403` — `allowed_origins` in `config.php` does not include the domain you are
  browsing (a common cause: browsing `www.marlsboro.com` with only
  `marlsboro.com` listed).
- `429` — you hit the rate limit (5 submissions per IP per hour by default).
  Wait, or raise `security.lead_rate_limit`.

**Leads arrive but no email does.**
The lead is safe — that is the design. Run the self-test with `--email`, or use
Settings → Send test email, and read the reason it gives. Most often: wrong
mailbox password, port 465 with `tls` instead of `ssl`, or a firewall blocking
outbound SMTP.

**"No configuration file found" in the log.**
The backend could not find `config.php`. Confirm it is at
`/home/<user>/marlsboro-config/config.php` and readable by the account user, or
set the path explicitly for cron by prefixing the command with
`MARLSBORO_CONFIG=/path/to/config.php`.

**The admin portal shows a blank page or 404 on refresh.**
Rewrite rule 3 in `public_html/.htaccess` is missing, or `mod_rewrite` is off.

**Signed out immediately after signing in.**
Cookies are `Secure` — you are browsing over HTTP. Finish step 15.

**Hindi or Chinese text arrives as `????`.**
The database or connection is not utf8mb4. Re-check step 5 and run the
self-test, which tests a round trip explicitly.

---

## Backups

The lead database is business data that exists nowhere else. At minimum:

1. **CWP → Backup → Backup Manager** — enable a **daily** account backup with
   at least 7 days of retention. This covers `public_html` and MySQL.
2. Include `/home/<user>/marlsboro-config/` in the backup set — without
   `config.php` a restored site cannot connect to anything.
3. A quick manual database dump before any change:

   ```bash
   mysqldump -u <user>_leads -p <user>_leads > ~/leads-$(date +%F).sql
   ```

4. Test a restore once, into a scratch database, so you know the backups work.

Logs in `marlsboro-logs/` do not need backing up, but do prune them
occasionally — one file per day, small, but they accumulate.

---

## Deploying an update later

Frontend only (most changes):

```bash
npm run build
```

then upload `dist/` over `public_html/` (keep `.htaccess`, `api/`, `photos/`,
`brochure/`). Old fingerprinted files in `assets/` can be deleted.

Backend changes: upload the changed files under `api/`. `config.php` is never
overwritten — it lives outside the deployment. If a change adds a database
column, re-import `schema.sql` (safe) or run the specific `ALTER TABLE`.

After any backend change, re-run the self-test.
