<?php
/**
 * Weekly lead report email (Friday cron, or triggered from the admin portal).
 *
 * Available variables:
 *   array  $period   ['start' => Y-m-d, 'end' => Y-m-d, 'label' => '…', 'mode' => …]
 *   array  $summary  ['total' => n, 'new' => n, 'contacted' => n, …]
 *   array  $leads    every lead in the period, oldest first
 *   string $appUrl
 *
 * The full detail is attached as CSV (and XLSX where available); the table
 * below is capped so a busy week does not produce an unreadable email.
 */

/** @var array<string,string> $period */
/** @var array<string,int> $summary */
/** @var array<int,array<string,mixed>> $leads */
/** @var string $appUrl */

$maxRows  = 100;
$shown    = array_slice($leads, 0, $maxRows);
$overflow = count($leads) - count($shown);

$tiles = [
    'Total'     => $summary['total'],
    'New'       => $summary['new'],
    'Contacted' => $summary['contacted'],
    'Converted' => $summary['converted'],
    'Closed'    => $summary['closed'],
    'Spam'      => $summary['spam'],
];
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f8fb;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;color:#334155;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:860px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">

      <tr>
        <td style="background:#0b2545;padding:24px 28px;">
          <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#9db6d8;font-family:'IBM Plex Mono',monospace;">
            MARLSBORO Group
          </div>
          <div style="margin-top:6px;font-size:22px;font-weight:700;color:#ffffff;">Weekly Lead Report</div>
          <div style="margin-top:4px;font-size:14px;color:#9db6d8;">Reporting period: <?= Template::e($period['label']) ?></div>
        </td>
      </tr>

      <tr>
        <td style="padding:24px 28px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <?php foreach ($tiles as $label => $value) { ?>
                <td style="padding:0 6px 12px 0;width:16.6%;vertical-align:top;">
                  <div style="border:1px solid #e2e8f0;border-radius:10px;padding:12px 10px;text-align:center;background:#f6f8fb;">
                    <div style="font-size:22px;font-weight:700;color:#0b2545;line-height:1.1;"><?= (int) $value ?></div>
                    <div style="margin-top:3px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#7a8aa0;"><?= Template::e($label) ?></div>
                  </div>
                </td>
              <?php } ?>
            </tr>
          </table>
        </td>
      </tr>

      <?php if ($leads === []) { ?>
      <tr>
        <td style="padding:8px 28px 28px;color:#7a8aa0;font-size:14px;">
          No enquiries were received in this period.
        </td>
      </tr>
      <?php } else { ?>
      <tr>
        <td style="padding:8px 28px 4px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#7a8aa0;margin-bottom:10px;">
            Leads in this period
          </div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:12px;">
            <tr style="background:#0b2545;color:#ffffff;text-align:left;">
              <?php foreach (['Date', 'ID', 'Name', 'Company', 'Email', 'Phone', 'Requirement', 'Source', 'Status'] as $heading) { ?>
                <th style="padding:8px 8px;font-weight:600;white-space:nowrap;"><?= Template::e($heading) ?></th>
              <?php } ?>
            </tr>
            <?php foreach ($shown as $index => $lead) { ?>
              <tr style="background:<?= $index % 2 === 0 ? '#ffffff' : '#f6f8fb' ?>;border-bottom:1px solid #e2e8f0;vertical-align:top;">
                <td style="padding:7px 8px;white-space:nowrap;color:#7a8aa0;"><?= Template::e(date('d M', strtotime((string) $lead['created_at']))) ?></td>
                <td style="padding:7px 8px;color:#7a8aa0;">#<?= (int) $lead['id'] ?></td>
                <td style="padding:7px 8px;color:#0b2545;font-weight:600;"><?= Template::e($lead['name']) ?></td>
                <td style="padding:7px 8px;"><?= Template::e($lead['company'] ?? '—') ?></td>
                <td style="padding:7px 8px;word-break:break-all;"><?= Template::e($lead['email'] ?? '—') ?></td>
                <td style="padding:7px 8px;white-space:nowrap;"><?= Template::e($lead['phone'] ?? '—') ?></td>
                <td style="padding:7px 8px;"><?= Template::e($lead['requirement'] ?? '—') ?></td>
                <td style="padding:7px 8px;white-space:nowrap;"><?= Template::e($lead['source']) ?></td>
                <td style="padding:7px 8px;white-space:nowrap;"><?= Template::e(Template::statusLabel((string) $lead['status'])) ?></td>
              </tr>
            <?php } ?>
          </table>
          <?php if ($overflow > 0) { ?>
            <p style="margin:12px 0 0;font-size:12px;color:#7a8aa0;">
              … and <?= (int) $overflow ?> more. The attached file contains every lead in the period.
            </p>
          <?php } ?>
        </td>
      </tr>
      <?php } ?>

      <tr>
        <td style="padding:18px 28px 24px;">
          <a href="<?= Template::e(rtrim($appUrl, '/')) ?>/admin/"
             style="display:inline-block;background:#1e5ba8;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:999px;">
            Open the admin portal
          </a>
        </td>
      </tr>

      <tr>
        <td style="background:#f6f8fb;border-top:1px solid #e2e8f0;padding:14px 28px;font-size:11px;color:#7a8aa0;">
          Generated <?= Template::e(date('j F Y, g:i A')) ?> · full detail attached as CSV<?= class_exists('ZipArchive') ? ' and XLSX' : '' ?>.
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
