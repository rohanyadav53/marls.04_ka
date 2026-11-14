-- ============================================================================
--  MARLSBORO Group — Lead Management schema
--  MySQL 5.7+ / MariaDB 10.3+   ·   utf8mb4 throughout (Hindi + Chinese leads)
--
--  Import:  mysql -u <user> -p <database> < schema.sql
--  (or CWP → phpMyAdmin → Import)
--
--  Safe to re-run: every statement is IF NOT EXISTS.
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ---------------------------------------------------------------------------
--  leads — one row per public enquiry submission
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id`                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

  -- Contact
  `name`                 VARCHAR(150)  NOT NULL,
  `company`              VARCHAR(200)      NULL,
  `email`                VARCHAR(255)      NULL,
  `phone`                VARCHAR(50)       NULL,
  `country`              VARCHAR(100)      NULL,
  `city`                 VARCHAR(100)      NULL,

  -- Enquiry.  `requirement` is the one-line summary shown in the leads table;
  -- it is derived from `subject` when the visitor typed one, otherwise from
  -- `inquiry_type`.  Both originals are kept so nothing the form collected is
  -- thrown away.
  `requirement`          VARCHAR(255)      NULL,
  `inquiry_type`         VARCHAR(100)      NULL,
  `subject`              VARCHAR(255)      NULL,
  `message`              TEXT              NULL,

  -- Tracking
  `source`               VARCHAR(100)  NOT NULL DEFAULT 'Other',
  `page_url`             VARCHAR(500)      NULL,
  `language`             VARCHAR(10)   NOT NULL DEFAULT 'en',

  -- Management
  `status`               ENUM('new','contacted','converted','closed','spam')
                                       NOT NULL DEFAULT 'new',
  `assigned_to`          VARCHAR(150)      NULL,
  `admin_notes`          TEXT              NULL,

  -- Quality signals.  A suspected duplicate is FLAGGED, never rejected — a
  -- real customer may legitimately enquire twice.
  `is_duplicate`         TINYINT(1)    NOT NULL DEFAULT 0,
  `duplicate_of`         BIGINT UNSIGNED   NULL,
  `spam_score`           TINYINT UNSIGNED NOT NULL DEFAULT 0,

  -- Notification outcome.  The row is committed BEFORE the email is attempted,
  -- so a broken SMTP server can never cost the business a lead.
  `notification_sent`    TINYINT(1)    NOT NULL DEFAULT 0,
  `notification_sent_at` DATETIME          NULL,
  `notification_error`   VARCHAR(500)      NULL,

  -- Request metadata (retained for spam/abuse handling — see backend/README.md)
  `ip_address`           VARCHAR(45)       NULL,
  `user_agent`           TEXT              NULL,

  `created_at`           DATETIME      NOT NULL,
  `updated_at`           DATETIME      NOT NULL,

  PRIMARY KEY (`id`),
  KEY `idx_leads_email`      (`email`),
  KEY `idx_leads_phone`      (`phone`),
  KEY `idx_leads_status`     (`status`),
  KEY `idx_leads_created`    (`created_at`),
  KEY `idx_leads_source`     (`source`),
  KEY `idx_leads_status_created` (`status`, `created_at`),
  KEY `idx_leads_notify`     (`notification_sent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
--  admin_users — portal logins.  Passwords are password_hash() digests only.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(150) NOT NULL,
  `email`         VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`          ENUM('admin','manager','viewer') NOT NULL DEFAULT 'admin',
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1,
  `last_login`    DATETIME         NULL,
  `created_at`    DATETIME     NOT NULL,
  `updated_at`    DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
--  lead_activity — audit trail.  Who changed what, and when.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lead_activity` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lead_id`    BIGINT UNSIGNED NOT NULL,
  `admin_id`   INT UNSIGNED        NULL,   -- NULL = system (lead created)
  `admin_name` VARCHAR(150)        NULL,   -- denormalised so history survives
  `action`     VARCHAR(60)     NOT NULL,   -- created | status_changed | …
  `old_value`  TEXT                NULL,
  `new_value`  TEXT                NULL,
  `created_at` DATETIME        NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_activity_lead` (`lead_id`, `id`),
  CONSTRAINT `fk_activity_lead` FOREIGN KEY (`lead_id`)
    REFERENCES `leads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
--  weekly_reports — one row per reporting period per recipient set.
--  The UNIQUE key is what makes the Friday cron safe to run twice.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `weekly_reports` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `period_start` DATE         NOT NULL,
  `period_end`   DATE         NOT NULL,
  `recipient`    VARCHAR(500) NOT NULL,
  `lead_count`   INT UNSIGNED NOT NULL DEFAULT 0,
  `status`       ENUM('sent','failed','running') NOT NULL DEFAULT 'running',
  `error`        VARCHAR(500)     NULL,
  `triggered_by` VARCHAR(60)  NOT NULL DEFAULT 'cron',  -- cron | admin:<id>
  `sent_at`      DATETIME         NULL,
  `created_at`   DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_report_period` (`period_start`, `period_end`, `recipient`(150)),
  KEY `idx_report_sent` (`sent_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
--  rate_limits — fixed-window counters (lead submissions, login attempts).
--  Rows older than the window are pruned opportunistically.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rate_limits` (
  `bucket`       VARCHAR(190) NOT NULL,   -- e.g. lead:203.0.113.9
  `window_start` DATETIME     NOT NULL,
  `hits`         INT UNSIGNED NOT NULL DEFAULT 0,
  `updated_at`   DATETIME     NOT NULL,
  PRIMARY KEY (`bucket`),
  KEY `idx_rate_window` (`window_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
