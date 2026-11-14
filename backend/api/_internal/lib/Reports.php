<?php
declare(strict_types=1);

/**
 * The weekly lead report.
 *
 * Reporting period (configurable, reports.period):
 *   rolling7   the 7 days ending on the run date, inclusive. Run on a Friday
 *              that is Saturday → Friday. This is the default: it always
 *              covers the seven days the team just worked through.
 *   last_week  the most recent COMPLETED Monday 00:00 → Sunday 23:59.
 *
 * Running twice never sends twice: weekly_reports carries a unique key on
 * (period_start, period_end, recipient) and a period already marked 'sent' is
 * skipped unless the caller explicitly forces a resend.
 */
final class Reports
{
    /** @return array{start:string,end:string,label:string,mode:string} */
    public static function period(?DateTimeImmutable $now = null): array
    {
        $now  = $now ?? new DateTimeImmutable('today');
        $mode = Config::str('reports.period', 'rolling7');

        if ($mode === 'last_week') {
            // Monday of the previous week → the Sunday that ended it.
            $start = $now->modify('monday this week')->modify('-7 days');
            $end   = $start->modify('+6 days');
        } else {
            $mode  = 'rolling7';
            $end   = $now;
            $start = $now->modify('-6 days');
        }

        return [
            'start' => $start->format('Y-m-d'),
            'end'   => $end->format('Y-m-d'),
            'label' => $start->format('j M Y') . ' – ' . $end->format('j M Y'),
            'mode'  => $mode,
        ];
    }

    public static function recipients(): string
    {
        $configured = Config::str('mail.report_to', '');
        return $configured !== '' ? $configured : Config::str('mail.to', '');
    }

    /**
     * Build and send the report.
     *
     * @param string $triggeredBy 'cron' or 'admin:<id>'
     * @return array{status:string,message:string,period:array,lead_count:int,report_id:int|null}
     */
    public static function send(string $triggeredBy = 'cron', bool $force = false, ?DateTimeImmutable $now = null): array
    {
        $period    = self::period($now);
        $recipient = self::recipients();

        if (Mailer::addresses($recipient) === []) {
            return self::outcome('error', 'No report recipient is configured (mail.report_to / mail.to).', $period, 0, null);
        }

        $existing = Database::one(
            'SELECT id, status FROM weekly_reports
              WHERE period_start = :start AND period_end = :end AND recipient = :recipient
              LIMIT 1',
            ['start' => $period['start'], 'end' => $period['end'], 'recipient' => $recipient]
        );

        if ($existing !== null && $existing['status'] === 'sent' && !$force) {
            return self::outcome(
                'skipped',
                'This reporting period has already been sent. Nothing to do.',
                $period,
                0,
                (int) $existing['id']
            );
        }

        $leads   = Leads::forPeriod($period['start'], $period['end']);
        $summary = self::summarise($leads);

        if ($leads === [] && Config::bool('reports.skip_when_empty', false)) {
            return self::outcome('skipped', 'No leads in the period; sending was skipped by configuration.', $period, 0, null);
        }

        // Claim the period before sending so a second run cannot overlap.
        $reportId = self::claim($existing, $period, $recipient, count($leads), $triggeredBy);

        $csv  = Export::csv($leads);
        $name = Export::filename('marlsboro-weekly-leads', 'csv', $period['end']);

        $attachments = [[
            'name'    => $name,
            'content' => $csv,
            'mime'    => 'text/csv; charset=UTF-8',
        ]];

        if (Config::bool('reports.attach_xlsx', true)) {
            $xlsx = Export::xlsx($leads, null, 'Weekly Leads');
            if ($xlsx !== null) {
                $attachments[] = [
                    'name'    => Export::filename('marlsboro-weekly-leads', 'xlsx', $period['end']),
                    'content' => $xlsx,
                    'mime'    => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ];
            }
        }

        $html = Template::render('weekly-report', [
            'period'  => $period,
            'summary' => $summary,
            'leads'   => $leads,
            'appUrl'  => Config::str('app_url', 'https://marlsboro.com'),
        ]);

        $sent = Mailer::send([
            'to'          => $recipient,
            'subject'     => 'Marlsboro Weekly Lead Report — Week of ' . Template::shortDate($period['start']),
            'html'        => $html,
            'attachments' => $attachments,
        ]);

        $error = $sent ? null : mb_substr(Mailer::lastError(), 0, 500);

        Database::run(
            'UPDATE weekly_reports
                SET status = :status, sent_at = :sent_at, error = :error,
                    lead_count = :lead_count, triggered_by = :triggered_by
              WHERE id = :id',
            [
                'status'       => $sent ? 'sent' : 'failed',
                'sent_at'      => $sent ? Database::now() : null,
                'error'        => $error,
                'lead_count'   => count($leads),
                'triggered_by' => mb_substr($triggeredBy, 0, 60),
                'id'           => $reportId,
            ]
        );

        if ($sent) {
            Logger::info('Weekly report sent', [
                'period' => $period['label'], 'leads' => count($leads), 'to' => $recipient, 'by' => $triggeredBy,
            ]);
            return self::outcome('sent', 'Report sent to ' . $recipient . '.', $period, count($leads), $reportId);
        }

        Logger::error('Weekly report failed', ['period' => $period['label'], 'detail' => Mailer::lastError()]);
        return self::outcome('failed', 'The report could not be emailed. See the log for detail.', $period, count($leads), $reportId);
    }

    /** @param array<string,mixed>|null $existing */
    private static function claim(?array $existing, array $period, string $recipient, int $leadCount, string $triggeredBy): int
    {
        if ($existing !== null) {
            Database::run(
                'UPDATE weekly_reports SET status = :status, error = NULL WHERE id = :id',
                ['status' => 'running', 'id' => (int) $existing['id']]
            );
            return (int) $existing['id'];
        }

        try {
            Database::run(
                'INSERT INTO weekly_reports (period_start, period_end, recipient, lead_count, status, triggered_by, created_at)
                      VALUES (:start, :end, :recipient, :lead_count, :status, :triggered_by, :created_at)',
                [
                    'start'        => $period['start'],
                    'end'          => $period['end'],
                    'recipient'    => $recipient,
                    'lead_count'   => $leadCount,
                    'status'       => 'running',
                    'triggered_by' => mb_substr($triggeredBy, 0, 60),
                    'created_at'   => Database::now(),
                ]
            );
            return Database::lastInsertId();
        } catch (PDOException $e) {
            // Another run claimed the same period a moment ago.
            $row = Database::one(
                'SELECT id FROM weekly_reports WHERE period_start = :start AND period_end = :end AND recipient = :recipient LIMIT 1',
                ['start' => $period['start'], 'end' => $period['end'], 'recipient' => $recipient]
            );
            if ($row === null) {
                throw $e;
            }
            return (int) $row['id'];
        }
    }

    /**
     * @param array<int,array<string,mixed>> $leads
     * @return array<string,int>
     */
    public static function summarise(array $leads): array
    {
        $summary = ['total' => count($leads)];
        foreach (Validation::STATUSES as $status) {
            $summary[$status] = 0;
        }
        foreach ($leads as $lead) {
            $status = (string) $lead['status'];
            if (array_key_exists($status, $summary)) {
                $summary[$status]++;
            }
        }
        return $summary;
    }

    /** @return array<int,array<string,mixed>> */
    public static function history(int $limit = 30): array
    {
        return Database::all(
            'SELECT id, period_start, period_end, recipient, lead_count, status, error, triggered_by, sent_at, created_at
               FROM weekly_reports ORDER BY id DESC LIMIT ' . max(1, min($limit, 200))
        );
    }

    private static function outcome(string $status, string $message, array $period, int $leadCount, ?int $reportId): array
    {
        return [
            'status'     => $status,
            'message'    => $message,
            'period'     => $period,
            'lead_count' => $leadCount,
            'report_id'  => $reportId,
        ];
    }
}
