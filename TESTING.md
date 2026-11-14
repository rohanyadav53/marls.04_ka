# Testing

Two things to be clear about before the checklists:

- **The React frontend was tested here**, in a real browser, against a mock API.
  Results are recorded below.
- **The PHP backend was not executed.** The development machine has no PHP, no
  MySQL, no Docker and no Homebrew, so it could not be run or even
  syntax-checked. It was reviewed by hand and structurally checked, and
  `_internal/scripts/selftest.php` exists precisely so the server can verify
  what this machine could not. **Run it as step 11 of the deployment before
  going live.**

---

## What was verified here

Environment: Vite 6 dev server + a throwaway Node mock of the API implementing
the real response envelopes. Chrome, desktop 1280×720 and mobile 375×812.

### Public enquiry form

| Check | Result |
|---|---|
| All seven original fields still present and in order | pass — `name, company, email, phone, type, subject, message` |
| Honeypot present, off-screen, untabbable, empty | pass — rendered at x = −9464px, `tabindex=-1`, `aria-hidden` |
| Honeypot does not disturb layout | pass — no horizontal overflow (scrollWidth == innerWidth) |
| Payload shape | pass — see below |
| Unicode round-trip in the payload | pass — `अरुण शर्मा 测试` intact |
| Quotes and newlines in fields | pass — `Test Packaging, Ltd. "quoted"`, multi-line message |
| Success state renders, form replaced | pass |
| Server 500 → generic message, no internal detail | pass — showed the translated failure line; `internal detail` never rendered |
| Form stays on screen after a failure so the visitor can retry | pass |
| Source from the contact page | pass — `"Contact Page"` |
| Source from the Request-a-Quote popup | pass — `"Quote Popup"` |
| Language follows the site language | pass — `"hi"` when the site is in Hindi |
| Translated success/failure copy | pass in EN and HI |

Captured payload (contact page):

```json
{
  "name": "अरुण शर्मा 测试", "company": "Test Packaging, Ltd. \"quoted\"",
  "email": "arun@example.com", "phone": "+91 98878 11121",
  "type": "General Query", "subject": "Need 50,000 BOPP bags",
  "message": "Line one\nLine two — 50,000 bags, 25kg, printed 4 colour.",
  "source": "Contact Page", "page_url": "http://localhost:5199/contact",
  "language": "en", "website": ""
}
```

> **Found and fixed during testing:** in Hindi the enquiry type was being sent
> as the translated label (`सामान्य प्रश्न`), which would have put Hindi text in
> the admin table and split one category across seven languages. The visitor
> still sees their own language; the transmitted value is now always the English
> one. Verified: labels `["सामान्य प्रश्न", …]`, values `["General Query", …]`.

### Admin portal

| Check | Result |
|---|---|
| Sign-in screen renders | pass |
| Wrong password | pass — "Incorrect email or password." |
| Correct password → dashboard | pass |
| Dashboard tiles, source breakdown, per-day chart, recent leads | pass |
| Unsent-notification warning banner | pass — appears when `unnotified > 0` |
| Leads table, 20 rows, "Page 1 of 6 · 110 total" | pass |
| Search by lead ID | pass |
| Filter by status | pass — only `Converted` rows returned |
| Spam hidden by default, shown when selected | pass |
| Rows per page 20/50/100 | pass — 50 rows, "Page 2 of 3" after Next |
| Lead detail: all fields, IP shown here only | pass |
| Save disabled until something changes | pass |
| Status + assignee + notes save, badge updates, "Saved." | pass |
| Audit trail renders | pass |
| Reports: next period, recipient, mode, log with sent/failed rows | pass |
| Send weekly report now | pass |
| Settings → Send test email | pass — "Email sent successfully to … via …" |
| CSV export downloads with the server's filename | pass — `marlsboro-leads-2026-08-19.csv` from the `X-Filename` header |
| Logout → sign-in screen | pass |
| Protected route while signed out renders no data | pass — `/admin/leads` redirected to sign-in |
| Mobile 375px: drawer nav, stacked filters, no page overflow | pass |

> **Found and fixed during testing:** the per-day bars did not render — a
> percentage height against an auto-height flex parent resolves to zero. The bar
> now sits in a `flex-1` track inside the fixed-height row.
>
> **Also fixed:** `/admin/leads` served the marketing site's HTML on the dev
> server (Vite's history fallback only knows the root entry). Apache handles
> this in production; a small dev middleware now makes local development match.

### Build

```
npm run build
✓ dist/index.html         2.32 kB   (marketing site)
✓ dist/admin/index.html   1.13 kB   (admin portal)
✓ dist/assets/main-*.js   418 kB    site bundle
✓ dist/assets/admin-*.js   43 kB    admin bundle — not loaded by the public site
```

`tsc -b` passes with no errors. The public site does not ship admin code.

### PHP structural check

All 33 PHP files start with `<?php` and have balanced braces, parentheses and
brackets (naive check with strings and comments stripped). **This is not
`php -l`** — it catches gross breakage, nothing subtler.

---

## What must be tested on the server

Work through **CWP_DEPLOYMENT.md §16** first, then this. Nothing below can be
verified from a developer machine.

### Automated

```bash
php /home/<user>/public_html/api/_internal/scripts/selftest.php --email you@marlsboro.com
```

Covers: PHP version · `pdo_mysql`/`mbstring`/`openssl`/`json`/`zip` ·
config file location and permissions · timezone · log writability · database
connection · database charset · all five tables · at least one active admin ·
a utf8mb4 round trip through MySQL · CSV and XLSX writers · mail settings ·
reporting period · a real test email.

### Lead submission

| Case | Expected |
|---|---|
| Valid lead | `201`, `{"success":true,"lead_id":n}`, row in `leads`, email arrives |
| Missing name | `422 VALIDATION_ERROR`, nothing stored |
| Invalid email, no phone | `422` |
| Invalid email **with** a valid phone | accepted — we can still reply |
| Message of 20,000 characters | stored, truncated to 8,000, no error |
| Hindi / Chinese / accented text | stored and displayed intact end to end |
| `"`, `'`, `<script>`, `,`, newlines | stored verbatim; escaped in the email and the CSV |
| `source: "Hacked"` | rewritten to `Other` |
| `page_url: "https://evil.test/x"` | discarded (null), lead still stored |
| Honeypot `website` filled | `200` success response, **nothing stored** |
| 6 submissions from one IP within an hour | 6th returns `429` with the generic message |
| Same email + requirement twice inside 10 min | both stored; second has `is_duplicate = 1` |
| Message full of links / spam keywords | stored with `status = 'spam'`, no notification |
| `GET /api/leads.php` | `405` |
| Request with a foreign `Origin` | `403` |

### Email

| Case | Expected |
|---|---|
| Notification arrives | subject `New Marlsboro Lead — <company or name>` |
| Content | every submitted field, source, page, language, timestamp |
| Reply-To | the enquirer's address, so Reply just works |
| Duplicate / spam-scored lead | red banner in the email body |
| **Stop the SMTP server, submit a lead** | **lead still stored**; `notification_sent = 0`, reason in `notification_error`; the visitor still sees the thank-you |
| Wrong SMTP password | Settings → test email reports the real reason |
| Unicode subject and body | not mangled (base64/UTF-8) |

The stopped-SMTP case is the important one — it is the whole reason the insert
happens before the send.

### Admin

| Case | Expected |
|---|---|
| Sign in / wrong password / sign out | as tested above, now against real sessions |
| 6 failed sign-ins | `429`, locked for the configured window |
| Session idle past `idle_timeout` | next request `401`, portal returns to sign-in |
| `GET /api/admin/leads.php` signed out | `401`, no data |
| `GET /api/admin/export.php` signed out | `401`, **no file** |
| `PATCH /api/admin/lead.php` without `X-CSRF-Token` | `419` |
| Search, filters, date presets, paging | correct counts against real data |
| Status / assignee / notes update | persists, `updated_at` moves, `lead_activity` row added |
| Export all → open in Excel | Hindi and Chinese legible, commas and newlines intact, dates present |
| A lead named `=cmd\|' /C calc'!A0` | opens as text in Excel, not a formula |
| `https://marlsboro.com/api/_internal/bootstrap.php` | **403** |
| `https://marlsboro.com/api/_internal/config.php` | **403** |

### Weekly report

| Case | Expected |
|---|---|
| `cron/weekly-leads.php --dry-run` | prints the period and counts, sends nothing |
| Real run | email with summary, table, CSV (and XLSX) attached |
| Period boundaries | leads on the first and last day included; the day before excluded |
| Status counts | match the admin dashboard for the same range |
| **Run it a second time** | `SKIPPED`, no second email |
| `--force` | resends, `weekly_reports` row updated not duplicated |
| Admin → Send weekly report now | same behaviour, `triggered_by = admin:<id>` |
| Week with zero leads | sends with "No enquiries were received", or skips if `skip_when_empty` |
| Cron fires on Friday | check `marlsboro-logs/weekly-leads.log` the following Saturday |

---

## Re-running the frontend tests

```bash
npm run build          # type-check + both bundles
npm run dev            # then exercise /contact and /admin/
```

The mock API used here was a scratch file and is deliberately not part of the
repository — against a real backend, `npm run dev` plus a local PHP server (see
`backend/README.md` → Local development) exercises the same paths for real.
