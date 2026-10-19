-- Synthetic relational rehearsal; run ONLY in an isolated disposable database.
-- Auth users may be a minimal id-only stub there; does not certify GoTrue deletion.
-- No real accounts, network worker or email delivery should exist in that database.
begin;
create temporary table deletion_fixture as select gen_random_uuid() target, gen_random_uuid() control;
insert into auth.users(id) select target from deletion_fixture union all select control from deletion_fixture;
insert into public.progress(user_id,pack,payload)
select id,'course','{}'::jsonb from auth.users where id in (select target from deletion_fixture union all select control from deletion_fixture);
insert into public.content_reports(id,user_id,payload)
select gen_random_uuid(),id,'{}'::jsonb from auth.users where id in (select target from deletion_fixture union all select control from deletion_fixture);
insert into public.report_admins(user_id) select target from deletion_fixture;
-- Report insert trigger queues notifications; no dispatcher runs in this rehearsal.
do $$ begin
 begin
  delete from auth.users where id=(select target from deletion_fixture);
  raise exception 'Expected dependency rejection';
 exception when foreign_key_violation then null;
 end;
end $$;
savepoint before_cleanup;
delete from public.report_notifications n using public.content_reports r
where n.report_id=r.id and r.user_id=(select target from deletion_fixture);
delete from public.content_reports where user_id=(select target from deletion_fixture);
delete from public.report_admins where user_id=(select target from deletion_fixture);
delete from auth.users where id=(select target from deletion_fixture);
do $$ begin
 if exists(select 1 from auth.users where id=(select target from deletion_fixture))
 or exists(select 1 from public.progress where user_id=(select target from deletion_fixture))
 or exists(select 1 from public.content_reports where user_id=(select target from deletion_fixture))
 or exists(select 1 from public.report_admins where user_id=(select target from deletion_fixture)) then raise exception 'Target cleanup incomplete'; end if;
 if not exists(select 1 from auth.users where id=(select control from deletion_fixture))
 or not exists(select 1 from public.progress where user_id=(select control from deletion_fixture))
 or not exists(select 1 from public.content_reports r join public.report_notifications n on n.report_id=r.id where r.user_id=(select control from deletion_fixture)) then raise exception 'Control modified'; end if;
end $$;
rollback to before_cleanup;
do $$ begin
 if not exists(select 1 from auth.users where id=(select target from deletion_fixture))
 or not exists(select 1 from public.progress where user_id=(select target from deletion_fixture))
 or not exists(select 1 from public.report_admins where user_id=(select target from deletion_fixture))
 or not exists(select 1 from public.content_reports r join public.report_notifications n on n.report_id=r.id where r.user_id=(select target from deletion_fixture)) then raise exception 'Rollback failed'; end if;
end $$;
rollback;
select 'PASS: blocked direct delete, ordered cleanup, progress cascade, control isolation and rollback; all fixtures rolled back' result;
