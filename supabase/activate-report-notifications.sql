-- Run after the worker is deployed and Vault/server credentials are configured.
-- Named scheduling is idempotent: rerunning updates this job rather than duplicating it.
select cron.schedule('perlingo-report-notifications','* * * * *','select public.dispatch_report_notifications()');
