<?php
/**
 * POST /api/leads.php — the public lead endpoint.
 *
 * The one rule that shapes this file: the row is committed to MySQL BEFORE any
 * email is attempted, and no email failure can change the answer the visitor
 * gets. A broken mail server costs a notification, never a lead.
 *
 * Everything arriving here is hostile until validated — source, page_url and
 * language included.
 */

declare(strict_types=1);

require_once __DIR__ . '/_internal/bootstrap.php';

Response::begin(['POST']);
Response::requireTrustedOrigin();

$GENERIC_FAILURE = 'We couldn\'t submit your enquiry right now. Please try again, or email us directly.';

$input = Response::input();
$ip    = Response::clientIp();

/* ------------------------------------------------------------- honeypot -- */
/* A hidden field no human ever fills in. Bots do. We answer as though the
   submission worked so the bot has nothing to learn, and store nothing. */

$honeypot = Config::str('security.honeypot_field', 'website');
if (Validation::line($input[$honeypot] ?? null, 200) !== null) {
    Logger::info('Honeypot triggered', ['ip' => $ip, 'ua' => Response::userAgent()]);
    Response::success([], 200, [
        'message' => 'Thank you. Your enquiry has been submitted.',
    ]);
}

/* ----------------------------------------------------------- rate limit -- */

$allowed = RateLimiter::hit(
    'lead:' . $ip,
    Config::int('security.lead_rate_limit', 5),
    Config::int('security.lead_rate_window', 3600)
);

if (!$allowed) {
    // Deliberately the same wording as any other failure — a scripted client
    // learns nothing about the limit from the response body.
    Logger::warning('Lead rate limit exceeded', ['ip' => $ip]);
    Response::error('SUBMIT_FAILED', $GENERIC_FAILURE, 429);
}

/* ------------------------------------------------------------ validation -- */

$v = new Validation();

$v->required('name', $input['name'] ?? null, 150, 'Please tell us your name.')
  ->optional('company', $input['company'] ?? null, 200)
  ->optional('country', $input['country'] ?? null, 100)
  ->optional('city', $input['city'] ?? null, 100)
  ->optional('subject', $input['subject'] ?? null, 255)
  ->optional('inquiry_type', $input['type'] ?? $input['inquiry_type'] ?? null, 100)
  ->requiredText('message', $input['message'] ?? null, 8000, 'Please tell us about your requirement.', 2)
  ->enum('source', $input['source'] ?? null, Validation::SOURCES, 'Other')
  ->enum('language', $input['language'] ?? null, Validation::LANGUAGES, 'en')
  ->pageUrl('page_url', $input['page_url'] ?? null);

// Email is required unless a usable phone number was supplied — we must be
// able to reply to the enquiry one way or the other.
$hasPhone = Validation::line($input['phone'] ?? null, 50) !== null;
$v->email('email', $input['email'] ?? null, !$hasPhone, 'Please enter a valid email address.')
  ->phone('phone', $input['phone'] ?? null, false, 'Please enter a valid phone number.');

if (!$v->ok()) {
    Response::error('VALIDATION_ERROR', $v->firstError(), 422, ['fields' => array_keys($v->errors())]);
}

$lead = $v->clean();

/* -------------------------------------------------------------- captcha -- */

if (!Captcha::verify(Validation::line($input['captcha_token'] ?? null, 4000), $ip)) {
    Logger::warning('Captcha rejected a submission', ['ip' => $ip]);
    Response::error('SUBMIT_FAILED', $GENERIC_FAILURE, 400);
}

/* ---------------------------------------------------------- enrichment --- */

// `requirement` is the one-line summary the admin table shows. Prefer what the
// visitor typed; fall back to the enquiry type they picked.
$lead['requirement'] = $lead['subject'] ?? $lead['inquiry_type'];

$lead['ip_address'] = $ip;
$lead['user_agent'] = Response::userAgent();

$lead['spam_score'] = Validation::spamScore($lead);
$lead['status']     = $lead['spam_score'] >= 70 ? 'spam' : 'new';

$duplicateOf = Leads::findRecentDuplicate(
    $lead['email'],
    $lead['phone'],
    $lead['requirement'],
    Config::int('security.duplicate_window', 600)
);
$lead['is_duplicate'] = $duplicateOf !== null ? 1 : 0;
$lead['duplicate_of'] = $duplicateOf;

/* ------------------------------------------------------------- persist --- */

try {
    $leadId = Leads::create($lead);
} catch (Throwable $e) {
    Logger::exception('Lead insert failed', $e, ['source' => $lead['source']]);
    Response::error('SUBMIT_FAILED', $GENERIC_FAILURE, 500);
}

Leads::logActivity($leadId, 'created', null, $lead['source'], null);

Logger::info('Lead stored', [
    'lead_id'    => $leadId,
    'source'     => $lead['source'],
    'language'   => $lead['language'],
    'spam_score' => $lead['spam_score'],
    'duplicate'  => $lead['is_duplicate'],
]);

/* -------------------------------------------------------- notification --- */
/* From here on nothing may change the visitor's answer. The lead is safe. */

if ($lead['status'] !== 'spam') {
    try {
        $stored = Leads::find($leadId) ?? ($lead + ['id' => $leadId, 'created_at' => Database::now()]);
        $appUrl = rtrim(Config::str('app_url', 'https://marlsboro.com'), '/');

        $html = Template::render('lead-notification', [
            'lead'     => $stored,
            'appUrl'   => $appUrl,
            'adminUrl' => $appUrl . '/admin/leads/' . $leadId,
        ]);

        $subjectLabel = $lead['company'] ?? $lead['name'];

        $sent = Mailer::send([
            'to'         => Config::str('mail.to'),
            'subject'    => 'New Marlsboro Lead — ' . $subjectLabel,
            'html'       => $html,
            'reply_to'   => $lead['email'] ?? '',
            'reply_name' => $lead['name'],
        ]);

        Leads::markNotified($leadId, $sent, $sent ? '' : Mailer::lastError());
    } catch (Throwable $e) {
        // Logged, recorded on the row, and then ignored — see the file header.
        Logger::exception('Lead notification failed', $e, ['lead_id' => $leadId]);
        try {
            Leads::markNotified($leadId, false, $e->getMessage());
        } catch (Throwable) {
            // nothing further we can usefully do
        }
    }
} else {
    Logger::info('Notification skipped for spam-scored lead', ['lead_id' => $leadId]);
}

/* -------------------------------------------------------------- respond -- */

Response::success(['lead_id' => $leadId], 201, [
    'message' => 'Thank you. Your enquiry has been submitted.',
    'lead_id' => $leadId,
]);
