begin;
do $$
declare rid uuid:=gen_random_uuid(); lease uuid;
begin
 if has_table_privilege('authenticated','public.report_notifications','SELECT')
 or has_function_privilege('authenticated','public.claim_report_notifications()','EXECUTE')
 or has_function_privilege('anon','public.dispatch_report_notifications()','EXECUTE')
 then raise exception 'Notification access exposed'; end if;
 insert into public.content_reports(id,user_id,payload) values(rid,'efbdb8cb-d187-4a9d-81dd-02be20f40162','{"note":"Transaction-only notification check"}'::jsonb);
 if not exists(select 1 from public.report_notifications where report_id=rid) then raise exception 'Queue trigger failed'; end if;
 select c.lease_id into lease from public.claim_report_notifications() c where c.report_id=rid;
 if lease is null then raise exception 'Claim failed'; end if;
 if exists(select 1 from public.claim_report_notifications() where report_id=rid) then raise exception 'Leased job reclaimed'; end if;
 if public.finish_report_notification(rid,gen_random_uuid(),'fake-provider-id',null) then raise exception 'Wrong lease accepted'; end if;
 if not public.finish_report_notification(rid,lease,null,'Synthetic provider failure') then raise exception 'Failure not saved'; end if;
 if not exists(select 1 from public.report_notifications where report_id=rid and sent_at is null and next_attempt_at>now()) then raise exception 'Failure did not retry'; end if;
 update public.report_notifications set next_attempt_at=now() where report_id=rid;
 select c.lease_id into lease from public.claim_report_notifications() c where c.report_id=rid;
 if not public.finish_report_notification(rid,lease,'synthetic-acceptance',null) then raise exception 'Acceptance not saved'; end if;
 if exists(select 1 from public.claim_report_notifications() where report_id=rid) then raise exception 'Accepted email requeued'; end if;
end $$;
rollback;
select 'PASS: enqueue, exclusive leases, bounded retry, acceptance recording, client denial; rolled back without sending mail' as result;
