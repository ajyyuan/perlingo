-- Separate from Learning. Run after schema.sql; safe to re-run.
create table if not exists public.challenge_rounds (
 user_id uuid not null references auth.users(id) on delete cascade,
 id uuid not null,
 challenge_date date,
 started_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 completed boolean not null default false,
 record jsonb check(record is null or (jsonb_typeof(record)='object' and octet_length(record::text)<=262144)),
 primary key(user_id,id), unique(user_id,challenge_date)
);
alter table public.challenge_rounds enable row level security;
drop policy if exists own_challenge_rounds on public.challenge_rounds;
create policy own_challenge_rounds on public.challenge_rounds for select to authenticated using ((select auth.uid())=user_id);
revoke all on public.challenge_rounds from anon,authenticated;
grant select on public.challenge_rounds to authenticated;
create or replace function public.claim_challenge_round(p_date date,p_id uuid)
returns boolean language plpgsql security definer set search_path='' as $$
declare owner_id uuid:=auth.uid();
begin
 if owner_id is null then raise exception 'Sign in required'; end if;
 if p_date is null or p_date > (now() at time zone 'America/New_York')::date then raise exception 'Invalid date'; end if;
 insert into public.challenge_rounds(user_id,id,challenge_date) values(owner_id,p_id,p_date) on conflict do nothing;
 return exists(select 1 from public.challenge_rounds where user_id=owner_id and id=p_id and challenge_date=p_date);
end $$;
create or replace function public.save_challenge_round(p_id uuid,p_record jsonb,p_completed boolean)
returns void language plpgsql security definer set search_path='' as $$
declare owner_id uuid:=auth.uid(); dated date; existing public.challenge_rounds;
begin
 if owner_id is null then raise exception 'Sign in required'; end if;
 if p_completed is null or jsonb_typeof(p_record) is distinct from 'object'
 or jsonb_typeof(p_record->'correct') is distinct from 'array'
 or jsonb_typeof(p_record->'attempts') is distinct from 'array'
 or p_record->>'score' is null or p_record->>'total' is null
 or (p_record->>'score')::integer not between 0 and 50
 or (p_record->>'total')::integer not between 1 and 50
 or (p_record->>'score')::integer > (p_record->>'total')::integer
 or p_record->>'date' is null then raise exception 'Invalid result'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(owner_id::text||p_id::text,0));
 dated := (p_record->>'challengeDate')::date;
 select * into existing from public.challenge_rounds where user_id=owner_id and id=p_id for update;
 if dated is not null and (existing.id is null or existing.challenge_date is distinct from dated) then raise exception 'Claim required'; end if;
 if existing.id is not null and existing.challenge_date is distinct from dated then raise exception 'Round mismatch'; end if;
 if existing.completed then return; end if;
 -- Ignore stale partial writes from retries or competing requests.
 if existing.record is not null and jsonb_array_length(existing.record->'attempts')>jsonb_array_length(p_record->'attempts') then return; end if;
 insert into public.challenge_rounds(user_id,id,challenge_date,record,completed)
 values(owner_id,p_id,dated,p_record,p_completed)
 on conflict(user_id,id) do update set record=excluded.record,completed=excluded.completed,updated_at=now();
end $$;
revoke all on function public.claim_challenge_round(date,uuid),public.save_challenge_round(uuid,jsonb,boolean) from public,anon;
grant execute on function public.claim_challenge_round(date,uuid),public.save_challenge_round(uuid,jsonb,boolean) to authenticated;
