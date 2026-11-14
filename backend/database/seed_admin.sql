-- ============================================================================
--  First admin account
-- ============================================================================
--
--  PREFER THE SCRIPT.  It prompts for the password with echo off, checks its
--  strength, and writes a password_hash() digest — nothing sensitive touches
--  your shell history or this file:
--
--      php /home/<cwp-user>/public_html/api/_internal/scripts/create-admin.php
--
--  Use the SQL below only if you cannot run PHP on the command line.
--
--  Step 1 — generate a hash on the server (never paste a plaintext password
--           into SQL, and never commit one to git):
--
--      php -r 'echo password_hash(readline("Password: "), PASSWORD_DEFAULT), PHP_EOL;'
--
--  Step 2 — paste the resulting $2y$… string in place of PASTE_HASH_HERE and
--           run this INSERT in phpMyAdmin.
--
--  Step 3 — sign in at https://marlsboro.com/admin/ and confirm it works.
-- ============================================================================

INSERT INTO `admin_users` (`name`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`)
VALUES (
    'Site Administrator',
    'admin@marlsboro.com',          -- change to the real address
    'PASTE_HASH_HERE',              -- output of password_hash(), starts with $2y$
    'admin',
    1,
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `password_hash` = VALUES(`password_hash`),
    `is_active`     = 1,
    `updated_at`    = NOW();
