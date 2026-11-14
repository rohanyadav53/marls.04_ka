<?php
/**
 * Weekly lead report — run by CWP Cron.
 *
 *   0 18 * * 5  /usr/bin/php /home/<user>/public_html/api/_internal/cron/weekly-leads.php >> /home/<user>/logs/weekly-leads.log 2>&1
 *
 * (Find the real PHP binary with `which php`; see CWP_DEPLOYMENT.md §11.)
 *
 * Safe to run twice: a reporting period already recorded as sent is skipped.
 * Pass --force to resend one anyway, --dry-run to see what would be sent.
 *
 * Exit codes: 0 sent or skipped · 1 failed.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("This script runs from the command line only.\n");
}

require_once dirname(__DIR__) . '/bootstrap.php';

$args    = array_slice($argv ?? [], 1);
$force   = in_array('--force', $args, true);
$dryRun  = in_array('--dry-run', $args, true);

$started = microtime(true);
$stamp   = date('Y-m-d H:i:s');

echo "[$stamp] MARLSBORO weekly lead report\n";

try {
    $period = Reports::period();
    echo "  Period : {$period['label']}  ({$period['mode']})\n";
    echo "  To     : " . Reports::recipients() . "\n";

    if ($dryRun) {
        $leads   = Leads::forPeriod($period['start'], $period['end']);
        $summary = Reports::summarise($leads);
        echo "  Leads  : {$summary['total']} (new {$summary['new']}, contacted {$summary['contacted']}, "
            . "converted {$summary['converted']}, closed {$summary['closed']}, spam {$summary['spam']})\n";
        echo "  Dry run — nothing sent.\n";
        exit(0);
    }

    $result = Reports::send('cron', $force);

    printf("  Result : %s — %s\n", strtoupper($result['status']), $result['message']);
    printf("  Leads  : %d\n", $result['lead_count']);
    printf("  Took   : %.2fs\n", microtime(true) - $started);

    exit($result['status'] === 'failed' || $result['status'] === 'error' ? 1 : 0);
} catch (Throwable $e) {
    Logger::exception('Weekly report cron failed', $e);
    fwrite(STDERR, '  FATAL  : ' . $e->getMessage() . "\n");
    exit(1);
}
