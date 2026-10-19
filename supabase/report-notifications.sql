-- Apply after content-reports.sql. Does not enable delivery until secrets are configured.
create table if not exists public.report_notifications (
 report_id uuid primary key references public.content_reports(id),
 created_at timestamptz not null default now(),
 attempts integer not null default 0,
 next_attempt_at timestamptz not null default now(),
 lease_id uuid,
 sent_at timestamptz,
 provider_id text,
 last_error text
);
alter table public.report_notifications enable row level security;
revoke all on public.report_notifications from anon, authenticated;
create or replace function public.queue_report_notification() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 insert into public.report_notifications(report_id) values(new.id) on conflict do nothing;
 return new;
end; $$;
revoke all on function public.queue_report_notification() from public,anon,authenticated;
drop trigger if exists queue_report_notification on public.content_reports;
create trigger queue_report_notification after insert on public.content_reports
for each row execute function public.queue_report_notification();

create or replace function public.claim_report_notifications()
returns table(report_id uuid,lease_id uuid) language sql security definer set search_path='' as $$
 with due as (
  select n.report_id from public.report_notifications n
  where n.sent_at is null and n.attempts<8 and n.next_attempt_at<=now()
    and n.created_at>now()-interval '20 hours'
  order by n.created_at limit 5 for update skip locked
 )
 update public.report_notifications n set attempts=n.attempts+1,lease_id=gen_random_uuid(),
  next_attempt_at=now()+interval '5 minutes'
 from due where n.report_id=due.report_id returning n.report_id,n.lease_id;
$$;
create or replace function public.finish_report_notification(p_report_id uuid,p_lease_id uuid,p_provider_id text,p_error text)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 update public.report_notifications set
  sent_at=case when p_provider_id is not null then now() else null end,
  provider_id=p_provider_id,last_error=left(p_error,200),lease_id=null,
  next_attempt_at=now()+make_interval(mins=>power(2,attempts)::integer)
 where report_id=p_report_id and lease_id=p_lease_id and sent_at is null;
 return found;
end; $$;
revoke all on function public.claim_report_notifications() from public,anon,authenticated;
revoke all on function public.finish_report_notification(uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.claim_report_notifications() to service_role;
grant execute on function public.finish_report_notification(uuid,uuid,text,text) to service_role;

-- Store REPORT_WORKER_TOKEN in Edge Function secrets and the same value in Vault
-- as report_worker_token before scheduling. Never put the value in source code.
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;
create or replace function public.dispatch_report_notifications() returns void
language plpgsql security definer set search_path='' as $$
declare worker_token text; anon_key text;
begin
 if not exists(select 1 from public.report_notifications where sent_at is null and attempts<8
 and next_attempt_at<=now() and created_at>now()-interval '20 hours') then return; end if;
 select decrypted_secret into worker_token from vault.decrypted_secrets where name='report_worker_token';
 select decrypted_secret into anon_key from vault.decrypted_secrets where name='report_gateway_anon_key';
 if worker_token is null or anon_key is null then return; end if;
 perform net.http_post(
  url:='https://buuxjzibgblnlmfafpny.supabase.co/functions/v1/report-notifications',
  headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||anon_key,'X-Report-Worker-Token',worker_token),
  body:='{}'::jsonb,timeout_milliseconds:=10000);
end; $$;
revoke all on function public.dispatch_report_notifications() from public,anon,authenticated;
-- Run only after forwarding, worker secrets, and the worker deployment are verified:
-- select cron.schedule('perlingo-report-notifications','* * * * *','select public.dispatch_report_notifications()');
