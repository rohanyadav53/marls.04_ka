<?php
/**
 * New-lead notification email.
 *
 * Available variables:
 *   array  $lead      the row as stored (id, name, company, …)
 *   string $appUrl    https://marlsboro.com
 *   string $adminUrl  link straight to the lead in the admin portal
 *
 * Safe to edit the wording. Keep every echoed value wrapped in Template::e()
 * (or ::multiline for the message) — that is what stops a hostile submission
 * turning into markup in your inbox.
 */

/** @var array<string,mixed> $lead */
/** @var string $appUrl */
/** @var string $adminUrl */

$rows = [
    'Lead ID'     => '#' . (int) $lead['id'],
    'Name'        => $lead['name'],
    'Company'     => $lead['company'],
    'Email'       => $lead['email'],
    'Phone'       => $lead['phone'],
    'Country'     => $lead['country'],
    'City'        => $lead['city'],
    'Requirement' => $lead['requirement'],
    'Enquiry Type'=> $lead['inquiry_type'],
    'Subject'     => $lead['subject'],
];

$tracking = [
    'Source'    => $lead['source'],
    'Page'      => $lead['page_url'],
    'Language'  => Template::language((string) $lead['language']),
    'Submitted' => Template::dateTime((string) $lead['created_at']),
];
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f8fb;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;color:#334155;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">

      <tr>
        <td style="background:#0b2545;padding:22px 28px;">
          <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#9db6d8;font-family:'IBM Plex Mono',monospace;">
            MARLSBORO Group
          </div>
          <div style="margin-top:6px;font-size:21px;font-weight:700;color:#ffffff;">New Website Lead</div>
        </td>
      </tr>

      <?php if (!empty($lead['is_duplicate']) || (int) ($lead['spam_score'] ?? 0) >= 50) { ?>
      <tr>
        <td style="padding:12px 28px;background:#fceaec;border-bottom:1px solid #f2c9ce;color:#a6121e;font-size:13px;">
          <?php if (!empty($lead['is_duplicate'])) { ?>
            Possible duplicate of lead #<?= (int) $lead['duplicate_of'] ?> — the same contact enquired moments ago.
          <?php } ?>
          <?php if ((int) ($lead['spam_score'] ?? 0) >= 50) { ?>
            Flagged by the spam filter (score <?= (int) $lead['spam_score'] ?>). Review before replying.
          <?php } ?>
        </td>
      </tr>
      <?php } ?>

      <tr>
        <td style="padding:24px 28px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            <?php foreach ($rows as $label => $value) {
                if ($value === null || $value === '') { continue; } ?>
              <tr>
                <td style="padding:7px 0;width:34%;vertical-align:top;color:#7a8aa0;font-size:12px;text-transform:uppercase;letter-spacing:.06em;">
                  <?= Template::e($label) ?>
                </td>
                <td style="padding:7px 0;vertical-align:top;color:#0b2545;font-weight:600;">
                  <?php if ($label === 'Email') { ?>
                    <a href="mailto:<?= Template::e($value) ?>" style="color:#1e5ba8;text-decoration:none;"><?= Template::e($value) ?></a>
                  <?php } elseif ($label === 'Phone') { ?>
                    <a href="tel:<?= Template::e(preg_replace('/[^0-9+]/', '', (string) $value)) ?>" style="color:#1e5ba8;text-decoration:none;"><?= Template::e($value) ?></a>
                  <?php } else { ?>
                    <?= Template::e($value) ?>
                  <?php } ?>
                </td>
              </tr>
            <?php } ?>
          </table>
        </td>
      </tr>

      <?php if (!empty($lead['message'])) { ?>
      <tr>
        <td style="padding:14px 28px 4px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#7a8aa0;margin-bottom:8px;">Message</div>
          <div style="background:#f6f8fb;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;color:#334155;font-size:14px;line-height:1.6;">
            <?= Template::multiline($lead['message']) ?>
          </div>
        </td>
      </tr>
      <?php } ?>

      <tr>
        <td style="padding:18px 28px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border-top:1px solid #e2e8f0;">
            <?php foreach ($tracking as $label => $value) {
                if ($value === null || $value === '') { continue; } ?>
              <tr>
                <td style="padding:7px 0;width:34%;color:#7a8aa0;font-size:12px;text-transform:uppercase;letter-spacing:.06em;">
                  <?= Template::e($label) ?>
                </td>
                <td style="padding:7px 0;color:#334155;word-break:break-all;"><?= Template::e($value) ?></td>
              </tr>
            <?php } ?>
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding:8px 28px 28px;">
          <a href="<?= Template::e($adminUrl) ?>"
             style="display:inline-block;background:#1e5ba8;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:999px;">
            Open in the admin portal
          </a>
        </td>
      </tr>

      <tr>
        <td style="background:#f6f8fb;border-top:1px solid #e2e8f0;padding:14px 28px;font-size:11px;color:#7a8aa0;">
          Sent automatically by the MARLSBORO lead system · <?= Template::e($appUrl) ?>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
