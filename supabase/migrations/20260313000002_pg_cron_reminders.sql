-- Enable pg_cron and pg_net extensions for scheduled HTTP calls
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily reminders at 08:00 BRT (11:00 UTC)
-- Calls the send-reminders edge function via HTTP
-- NOTE: Replace <ref> with your actual Supabase project reference
-- SELECT cron.schedule(
--   'daily-reminders',
--   '0 11 * * *',
--   $$
--   SELECT net.http_post(
--     url := 'https://<ref>.supabase.co/functions/v1/send-reminders',
--     headers := jsonb_build_object(
--       'Authorization', 'Bearer ' || current_setting('supabase.service_role_key'),
--       'Content-Type', 'application/json'
--     ),
--     body := '{}'::jsonb
--   );
--   $$
-- );
