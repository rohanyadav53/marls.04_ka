<?php
declare(strict_types=1);

/**
 * Everything that touches the `leads` table.
 *
 * Filter values are bound; only column names and sort directions are chosen
 * from fixed whitelists, so no caller can steer the SQL.
 */
final class Leads
{
    /** Columns the admin table may sort by. */
    private const SORTABLE = [
        'created_at' => 'l.created_at',
        'updated_at' => 'l.updated_at',
        'name'       => 'l.name',
        'company'    => 'l.company',
        'status'     => 'l.status',
        'source'     => 'l.source',
        'id'         => 'l.id',
    ];

    /** Every column, in the order the CSV/XLSX export uses. */
    public const EXPORT_COLUMNS = [
        'id'           => 'Lead ID',
        'created_at'   => 'Created Date',
        'updated_at'   => 'Updated Date',
        'name'         => 'Name',
        'company'      => 'Company',
        'email'        => 'Email',
        'phone'        => 'Phone',
        'country'      => 'Country',
        'city'         => 'City',
        'requirement'  => 'Requirement',
        'inquiry_type' => 'Inquiry Type',
        'subject'      => 'Subject',
        'message'      => 'Message',
        'source'       => 'Source',
        'page_url'     => 'Page URL',
        'language'     => 'Language',
        'status'       => 'Status',
        'assigned_to'  => 'Assigned To',
        'admin_notes'  => 'Admin Notes',
    ];

    /**
     * Insert a validated lead.
     *
     * Returns the new id. The caller sends the notification *after* this
     * returns — the row is committed first, always.
     *
     * @param array<string,mixed> $lead
     */
    public static function create(array $lead): int
    {
        $now = Database::now();

        Database::run(
            'INSERT INTO leads (
                name, company, email, phone, country, city,
                requirement, inquiry_type, subject, message,
                source, page_url, language, status,
                is_duplicate, duplicate_of, spam_score,
                ip_address, user_agent, created_at, updated_at
             ) VALUES (
                :name, :company, :email, :phone, :country, :city,
                :requirement, :inquiry_type, :subject, :message,
                :source, :page_url, :language, :status,
                :is_duplicate, :duplicate_of, :spam_score,
                :ip_address, :user_agent, :created_at, :updated_at
             )',
            [
                'name'         => $lead['name'],
                'company'      => $lead['company']      ?? null,
                'email'        => $lead['email']        ?? null,
                'phone'        => $lead['phone']        ?? null,
                'country'      => $lead['country']      ?? null,
                'city'         => $lead['city']         ?? null,
                'requirement'  => $lead['requirement']  ?? null,
                'inquiry_type' => $lead['inquiry_type'] ?? null,
                'subject'      => $lead['subject']      ?? null,
                'message'      => $lead['message']      ?? null,
                'source'       => $lead['source']       ?? 'Other',
                'page_url'     => $lead['page_url']     ?? null,
                'language'     => $lead['language']     ?? 'en',
                'status'       => $lead['status']       ?? 'new',
                'is_duplicate' => (int) ($lead['is_duplicate'] ?? 0),
                'duplicate_of' => $lead['duplicate_of'] ?? null,
                'spam_score'   => (int) ($lead['spam_score'] ?? 0),
                'ip_address'   => $lead['ip_address']   ?? null,
                'user_agent'   => $lead['user_agent']   ?? null,
                'created_at'   => $now,
                'updated_at'   => $now,
            ]
        );

        return Database::lastInsertId();
    }

    /**
     * Look for a recent, near-identical submission.
     *
     * Deliberately conservative: it only reports the match so the lead can be
     * flagged. A company placing two enquiries in ten minutes still gets both
     * stored and both notified.
     *
     * @return int|null id of the earlier lead
     */
    public static function findRecentDuplicate(?string $email, ?string $phone, ?string $requirement, int $windowSeconds): ?int
    {
        if ($windowSeconds <= 0 || ($email === null && $phone === null)) {
            return null;
        }

        $row = Database::one(
            'SELECT id FROM leads
              WHERE created_at >= :since
                AND ((:email IS NOT NULL AND email = :email2) OR (:phone IS NOT NULL AND phone = :phone2))
                AND (:requirement IS NULL OR requirement <=> :requirement2)
              ORDER BY id DESC
              LIMIT 1',
            [
                'since'        => date('Y-m-d H:i:s', time() - $windowSeconds),
                'email'        => $email,
                'email2'       => $email,
                'phone'        => $phone,
                'phone2'       => $phone,
                'requirement'  => $requirement,
                'requirement2' => $requirement,
            ]
        );

        return $row === null ? null : (int) $row['id'];
    }

    public static function markNotified(int $id, bool $sent, string $error = ''): void
    {
        Database::run(
            'UPDATE leads
                SET notification_sent = :sent,
                    notification_sent_at = :at,
                    notification_error = :error
              WHERE id = :id',
            [
                'sent'  => $sent ? 1 : 0,
                'at'    => $sent ? Database::now() : null,
                'error' => $error === '' ? null : mb_substr($error, 0, 500),
                'id'    => $id,
            ]
        );
    }

    /** @return array<string,mixed>|null */
    public static function find(int $id): ?array
    {
        return Database::one('SELECT * FROM leads WHERE id = :id', ['id' => $id]);
    }

    /**
     * Paginated, filtered, searchable listing.
     *
     * @param array<string,mixed> $filters status|source|search|date_from|date_to|sort|dir
     * @return array{rows:array<int,array<string,mixed>>,total:int,page:int,per_page:int,pages:int}
     */
    public static function search(array $filters, int $page, int $perPage): array
    {
        [$where, $params] = self::whereClause($filters);

        $total = (int) Database::value(
            'SELECT COUNT(*) FROM leads l ' . $where,
            $params,
            0
        );

        $perPage = max(1, min($perPage, 200));
        $pages   = max(1, (int) ceil($total / $perPage));
        $page    = max(1, min($page, $pages));
        $offset  = ($page - 1) * $perPage;

        $sortKey = is_string($filters['sort'] ?? null) ? $filters['sort'] : 'created_at';
        $column  = self::SORTABLE[$sortKey] ?? self::SORTABLE['created_at'];
        $dir     = strtoupper((string) ($filters['dir'] ?? 'DESC')) === 'ASC' ? 'ASC' : 'DESC';

        // LIMIT/OFFSET are cast integers, never interpolated user text.
        $rows = Database::all(
            'SELECT l.id, l.created_at, l.updated_at, l.name, l.company, l.email, l.phone,
                    l.country, l.city, l.requirement, l.inquiry_type, l.subject,
                    l.source, l.language, l.status, l.assigned_to,
                    l.is_duplicate, l.spam_score, l.notification_sent
               FROM leads l ' . $where . '
              ORDER BY ' . $column . ' ' . $dir . ', l.id DESC
              LIMIT ' . $perPage . ' OFFSET ' . $offset,
            $params
        );

        return [
            'rows'     => array_map([self::class, 'shape'], $rows),
            'total'    => $total,
            'page'     => $page,
            'per_page' => $perPage,
            'pages'    => $pages,
        ];
    }

    /**
     * Every matching lead, full columns — for export. Capped so a runaway
     * request cannot exhaust memory.
     *
     * @return array<int,array<string,mixed>>
     */
    public static function export(array $filters, int $limit = 50000): array
    {
        [$where, $params] = self::whereClause($filters);
        return Database::all(
            'SELECT * FROM leads l ' . $where . ' ORDER BY l.id DESC LIMIT ' . (int) $limit,
            $params
        );
    }

    /**
     * @return array{0:string,1:array<string,mixed>}
     */
    private static function whereClause(array $filters): array
    {
        $clauses = [];
        $params  = [];

        $status = is_string($filters['status'] ?? null) ? $filters['status'] : '';
        if ($status !== '' && $status !== 'all' && in_array($status, Validation::STATUSES, true)) {
            $clauses[]         = 'l.status = :status';
            $params['status']  = $status;
        } elseif ($status !== 'all') {
            // Default view hides spam; only an explicit "all" includes it.
            $clauses[] = "l.status <> 'spam'";
        }

        $source = is_string($filters['source'] ?? null) ? $filters['source'] : '';
        if ($source !== '' && $source !== 'all' && in_array($source, Validation::SOURCES, true)) {
            $clauses[]        = 'l.source = :source';
            $params['source'] = $source;
        }

        $from = self::date($filters['date_from'] ?? null);
        if ($from !== null) {
            $clauses[]           = 'l.created_at >= :date_from';
            $params['date_from'] = $from . ' 00:00:00';
        }
        $to = self::date($filters['date_to'] ?? null);
        if ($to !== null) {
            $clauses[]         = 'l.created_at <= :date_to';
            $params['date_to'] = $to . ' 23:59:59';
        }

        $search = Validation::line($filters['search'] ?? null, 120);
        if ($search !== null) {
            if (ctype_digit($search)) {
                // A bare number is a lead id first, then a phone fragment.
                $clauses[]           = '(l.id = :lead_id OR l.phone LIKE :phone_like)';
                $params['lead_id']   = (int) $search;
                $params['phone_like']= '%' . self::escapeLike($search) . '%';
            } else {
                $clauses[] = '(l.name LIKE :q1 OR l.company LIKE :q2 OR l.email LIKE :q3
                               OR l.phone LIKE :q4 OR l.requirement LIKE :q5 OR l.subject LIKE :q6)';
                $like = '%' . self::escapeLike($search) . '%';
                foreach (['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as $key) {
                    $params[$key] = $like;
                }
            }
        }

        return [$clauses === [] ? '' : 'WHERE ' . implode(' AND ', $clauses), $params];
    }

    private static function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
    }

    private static function date($value): ?string
    {
        if (!is_string($value) || $value === '') {
            return null;
        }
        $d = DateTimeImmutable::createFromFormat('Y-m-d', substr($value, 0, 10));
        return $d === false ? null : $d->format('Y-m-d');
    }

    /**
     * Apply an admin edit and record what changed.
     *
     * @param array<string,mixed> $changes status|assigned_to|admin_notes
     * @param array<string,mixed> $admin
     * @return array<string,mixed> the updated row
     */
    public static function update(int $id, array $changes, array $admin): array
    {
        $current = self::find($id);
        if ($current === null) {
            Response::error('NOT_FOUND', 'That lead no longer exists.', 404);
        }

        $sets    = [];
        $params  = ['id' => $id];
        $history = [];

        if (array_key_exists('status', $changes)) {
            $status = (string) $changes['status'];
            if (!in_array($status, Validation::STATUSES, true)) {
                Response::error('VALIDATION_ERROR', 'Unknown status.', 422);
            }
            if ($status !== $current['status']) {
                $sets[]           = 'status = :status';
                $params['status'] = $status;
                $history[]        = ['status_changed', (string) $current['status'], $status];
            }
        }

        if (array_key_exists('assigned_to', $changes)) {
            $assigned = Validation::line($changes['assigned_to'], 150);
            if ($assigned !== ($current['assigned_to'] ?? null)) {
                $sets[]                = 'assigned_to = :assigned_to';
                $params['assigned_to'] = $assigned;
                $history[]             = ['assignment_changed', (string) ($current['assigned_to'] ?? ''), (string) $assigned];
            }
        }

        if (array_key_exists('admin_notes', $changes)) {
            $notes = Validation::text($changes['admin_notes'], 20000);
            if ($notes !== ($current['admin_notes'] ?? null)) {
                $sets[]                = 'admin_notes = :admin_notes';
                $params['admin_notes'] = $notes;
                $history[]             = ['notes_changed', (string) ($current['admin_notes'] ?? ''), (string) $notes];
            }
        }

        if ($sets !== []) {
            $sets[]               = 'updated_at = :updated_at';
            $params['updated_at'] = Database::now();

            Database::run('UPDATE leads SET ' . implode(', ', $sets) . ' WHERE id = :id', $params);

            foreach ($history as [$action, $old, $new]) {
                self::logActivity($id, $action, $old, $new, $admin);
            }
        }

        $updated = self::find($id);
        return $updated === null ? $current : $updated;
    }

    /** @param array<string,mixed>|null $admin */
    public static function logActivity(int $leadId, string $action, ?string $old, ?string $new, ?array $admin): void
    {
        try {
            Database::run(
                'INSERT INTO lead_activity (lead_id, admin_id, admin_name, action, old_value, new_value, created_at)
                      VALUES (:lead_id, :admin_id, :admin_name, :action, :old_value, :new_value, :created_at)',
                [
                    'lead_id'    => $leadId,
                    'admin_id'   => $admin['id']   ?? null,
                    'admin_name' => $admin['name'] ?? null,
                    'action'     => mb_substr($action, 0, 60),
                    'old_value'  => $old === null ? null : mb_substr($old, 0, 5000),
                    'new_value'  => $new === null ? null : mb_substr($new, 0, 5000),
                    'created_at' => Database::now(),
                ]
            );
        } catch (Throwable $e) {
            // An audit-trail hiccup must not roll back the change itself.
            Logger::error('Activity log write failed', ['lead_id' => $leadId, 'detail' => $e->getMessage()]);
        }
    }

    /** @return array<int,array<string,mixed>> */
    public static function activity(int $leadId): array
    {
        return Database::all(
            'SELECT id, admin_id, admin_name, action, old_value, new_value, created_at
               FROM lead_activity WHERE lead_id = :id ORDER BY id DESC LIMIT 200',
            ['id' => $leadId]
        );
    }

    /**
     * Dashboard figures. "Total" and the period counts exclude spam so the
     * headline number reflects real business, not bot traffic.
     *
     * @return array<string,mixed>
     */
    public static function stats(): array
    {
        $byStatus = [];
        foreach (Database::all('SELECT status, COUNT(*) AS c FROM leads GROUP BY status') as $row) {
            $byStatus[(string) $row['status']] = (int) $row['c'];
        }
        foreach (Validation::STATUSES as $status) {
            $byStatus[$status] ??= 0;
        }

        $today      = date('Y-m-d');
        $weekStart  = date('Y-m-d', strtotime('monday this week'));
        $monthStart = date('Y-m-01');

        $count = static fn (string $sql, array $p): int => (int) Database::value($sql, $p, 0);

        $genuine = "status <> 'spam'";

        return [
            'total'      => $count("SELECT COUNT(*) FROM leads WHERE $genuine", []),
            'by_status'  => $byStatus,
            'today'      => $count("SELECT COUNT(*) FROM leads WHERE $genuine AND created_at >= :d", ['d' => $today . ' 00:00:00']),
            'this_week'  => $count("SELECT COUNT(*) FROM leads WHERE $genuine AND created_at >= :d", ['d' => $weekStart . ' 00:00:00']),
            'this_month' => $count("SELECT COUNT(*) FROM leads WHERE $genuine AND created_at >= :d", ['d' => $monthStart . ' 00:00:00']),
            'by_source'  => Database::all(
                "SELECT source, COUNT(*) AS count FROM leads WHERE $genuine GROUP BY source ORDER BY count DESC"
            ),
            'by_day'     => Database::all(
                "SELECT DATE(created_at) AS day, COUNT(*) AS count
                   FROM leads WHERE $genuine AND created_at >= :since
                  GROUP BY DATE(created_at) ORDER BY day ASC",
                ['since' => date('Y-m-d', strtotime('-13 days')) . ' 00:00:00']
            ),
            'recent'     => array_map([self::class, 'shape'], Database::all(
                "SELECT id, created_at, name, company, email, phone, requirement, source, status
                   FROM leads WHERE $genuine ORDER BY id DESC LIMIT 8"
            )),
            'unnotified' => $count("SELECT COUNT(*) FROM leads WHERE notification_sent = 0 AND $genuine", []),
        ];
    }

    /**
     * Leads created inside a reporting period, oldest first.
     *
     * @return array<int,array<string,mixed>>
     */
    public static function forPeriod(string $startDate, string $endDate): array
    {
        return Database::all(
            'SELECT * FROM leads
              WHERE created_at BETWEEN :start AND :end
              ORDER BY id ASC',
            ['start' => $startDate . ' 00:00:00', 'end' => $endDate . ' 23:59:59']
        );
    }

    /** Normalise types for JSON (MySQL hands back strings for some drivers). */
    public static function shape(array $row): array
    {
        foreach (['id', 'duplicate_of', 'spam_score'] as $key) {
            if (array_key_exists($key, $row) && $row[$key] !== null) {
                $row[$key] = (int) $row[$key];
            }
        }
        foreach (['is_duplicate', 'notification_sent'] as $key) {
            if (array_key_exists($key, $row)) {
                $row[$key] = (bool) $row[$key];
            }
        }
        // IP and user agent are for abuse handling, not for the browser.
        unset($row['ip_address'], $row['user_agent']);
        return $row;
    }

    /**
     * The detail view is the one place an authenticated admin sees the request
     * metadata — it is what makes a spam judgement possible. It is never part
     * of the list response.
     */
    public static function shapeDetail(array $row): array
    {
        $ip = $row['ip_address'] ?? null;
        $ua = $row['user_agent'] ?? null;
        $shaped = self::shape($row);
        $shaped['ip_address'] = $ip;
        $shaped['user_agent'] = $ua;
        return $shaped;
    }
}
