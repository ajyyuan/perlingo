-- Run in your Supabase project's SQL editor. No service-role key belongs in the app.
create table if not exists public.progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 pack text not null check (pack in ('course','foundation','starter')),
 revision bigint not null default 1 check (revision > 0),
 payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 8388608),
 updated_at timestamptz not null default now(),
 primary key (user_id,pack)
);
alter table public.progress enable row level security;
drop policy if exists own_progress on public.progress;
create policy own_progress on public.progress for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.progress from anon,authenticated;
grant select on public.progress to authenticated;

-- Atomic compare-and-swap. A null result means the caller must resolve a conflict.
create or replace function public.save_progress(p_pack text,p_revision bigint,p_payload jsonb)
returns bigint language plpgsql security definer set search_path = '' as $$
declare saved_revision bigint; owner_id uuid := auth.uid();
begin
 if owner_id is null then raise exception 'Sign in required'; end if;
 if p_revision < 0 or p_revision is null then raise exception 'Invalid revision'; end if;
 if p_payload->>'srsVersion' is distinct from '2'
    or jsonb_typeof(p_payload->'settings') is distinct from 'object'
    or jsonb_typeof(p_payload->'history') is distinct from 'object'
    or jsonb_typeof(p_payload->'sessions') is distinct from 'array'
 then raise exception 'Invalid progress'; end if;
 if p_revision = 0 then
  insert into public.progress(user_id,pack,payload) values(owner_id,p_pack,p_payload)
  on conflict do nothing returning revision into saved_revision;
 else
  update public.progress set payload=p_payload,revision=revision+1,updated_at=now()
  where user_id=owner_id and pack=p_pack and revision=p_revision
  returning revision into saved_revision;
 end if;
 return saved_revision;
end $$;
revoke all on function public.save_progress(text,bigint,jsonb) from public,anon;
grant execute on function public.save_progress(text,bigint,jsonb) to authenticated;
