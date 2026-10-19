-- Run in SQL Editor as postgres. All fixtures are rolled back; sends no emails.
begin;
create temporary table perlingo_test_users as select gen_random_uuid() as a, gen_random_uuid() as b;
grant select on perlingo_test_users to authenticated;
insert into auth.users(id) select a from perlingo_test_users union all select b from perlingo_test_users;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select a::text from perlingo_test_users),true);
do $$
declare p jsonb := '{"srsVersion":2,"appDay":1,"settings":{},"history":{},"sessions":[]}'::jsonb; r bigint;
begin
 r:=public.save_progress('course',0,p); if r is distinct from 1 then raise exception 'Initial write failed'; end if;
 r:=public.save_progress('course',0,p); if r is not null then raise exception 'Stale insert accepted'; end if;
 r:=public.save_progress('course',1,p); if r is distinct from 2 then raise exception 'Revision update failed'; end if;
 r:=public.save_progress('course',1,p); if r is not null then raise exception 'Stale update accepted'; end if;
 if (select count(*) from public.progress) <> 1 then raise exception 'Own read failed'; end if;
end $$;
select set_config('request.jwt.claim.sub',(select b::text from perlingo_test_users),true);
do $$
declare p jsonb := '{"srsVersion":2,"appDay":1,"settings":{},"history":{},"sessions":[]}'::jsonb; r bigint;
begin
 if (select count(*) from public.progress) <> 0 then raise exception 'Cross-user read allowed'; end if;
 r:=public.save_progress('course',2,p); if r is not null then raise exception 'Cross-user overwrite allowed'; end if;
 r:=public.save_progress('course',0,p); if r is distinct from 1 then raise exception 'Second user write failed'; end if;
 begin
  update public.progress set revision=9;
  raise exception 'Direct update allowed';
 exception when insufficient_privilege then null;
 end;
end $$;
set local role anon;
do $$
begin
 begin
  perform * from public.progress;
  raise exception 'Anonymous read allowed';
 exception when insufficient_privilege then null;
 end;
 begin
  perform public.save_progress('course',0,'{}');
  raise exception 'Anonymous RPC allowed';
 exception when insufficient_privilege then null;
 end;
end $$;
rollback;
select 'PASS: owner isolation, revision conflicts, direct-write denial, anonymous denial; fixtures rolled back' as verification;
