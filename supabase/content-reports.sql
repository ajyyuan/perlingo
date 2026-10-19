-- Private report inbox. Owners read through admin-authorized RPCs only.
create table if not exists public.content_reports (
 id uuid primary key,
 user_id uuid not null references auth.users(id),
 received_at timestamptz not null default now(),
 payload jsonb not null check (octet_length(payload::text) <= 65536),
 status text not null default 'open' check (status in ('open','reviewed','resolved'))
);
alter table public.content_reports enable row level security;
revoke all on public.content_reports from anon, authenticated;

-- Authenticate and rate-limit atomically; repeated submissions retain the original snapshot.
create or replace function public.submit_content_report(p_report jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare owner_id uuid := auth.uid(); report_id uuid; existing_owner uuid;
begin
 if owner_id is null then raise exception 'Sign in to send a report.'; end if;
 if jsonb_typeof(p_report) is distinct from 'object'
 or octet_length(p_report::text)>65536
 or jsonb_typeof(p_report->'note') is distinct from 'string'
 or length(trim(p_report->>'note')) not between 1 and 2000
 or jsonb_typeof(p_report->'context') is distinct from 'object'
 or coalesce(length(p_report->'context'->>'entryId'),0) not between 1 and 200
 or coalesce(p_report->'context'->>'language','') not in ('es','fr','de')
 then raise exception 'Invalid report.'; end if;
 report_id := (p_report->>'id')::uuid;
 if report_id is null then raise exception 'Invalid report ID.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(owner_id::text,0));
 select user_id into existing_owner from public.content_reports where id=report_id;
 if existing_owner=owner_id then return report_id; end if;
 if existing_owner is not null then raise exception 'Report ID already used.'; end if;
 if (select count(*) from public.content_reports where user_id=owner_id and received_at>now()-interval '1 hour')>=10
 then raise exception 'Report limit reached. Please try again in an hour.'; end if;
 insert into public.content_reports(id,user_id,payload) values(report_id,owner_id,p_report);
 return report_id;
end; $$;
revoke all on function public.submit_content_report(jsonb) from public,anon;
grant execute on function public.submit_content_report(jsonb) to authenticated;

-- Admin membership is managed only from the project dashboard, never client metadata.
create table if not exists public.report_admins (user_id uuid primary key references auth.users(id));
alter table public.report_admins enable row level security;
revoke all on public.report_admins from anon, authenticated;
create or replace function public.is_report_admin() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.report_admins where user_id=auth.uid());
$$;
create or replace function public.list_content_reports(p_offset integer default 0)
returns setof public.content_reports language plpgsql security definer set search_path = '' as $$
begin
 if not public.is_report_admin() then raise exception 'Admin access required.'; end if;
 return query select * from public.content_reports order by received_at desc,id desc limit 25 offset greatest(0,least(p_offset,100000));
end; $$;
create or replace function public.set_content_report_status(p_id uuid,p_status text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
 if not public.is_report_admin() then raise exception 'Admin access required.'; end if;
 if p_status not in ('open','reviewed','resolved') or p_status is null then raise exception 'Invalid status.'; end if;
 update public.content_reports set status=p_status where id=p_id;
 return found;
end; $$;
revoke all on function public.is_report_admin() from public,anon;
revoke all on function public.list_content_reports(integer) from public,anon;
revoke all on function public.set_content_report_status(uuid,text) from public,anon;
grant execute on function public.is_report_admin() to authenticated;
grant execute on function public.list_content_reports(integer) to authenticated;
grant execute on function public.set_content_report_status(uuid,text) to authenticated;
-- Verified Perlingo owner account (Google identity); do not use client-supplied metadata.
insert into public.report_admins(user_id) values ('efbdb8cb-d187-4a9d-81dd-02be20f40162') on conflict do nothing;
