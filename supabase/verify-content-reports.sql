-- All test reports roll back. Does not send mail or change real reports.
begin;
select set_config('request.jwt.claim.sub','efbdb8cb-d187-4a9d-81dd-02be20f40162',true);
set local role authenticated;
do $$
declare r jsonb; rid uuid := gen_random_uuid(); n integer;
begin
 if not public.is_report_admin() then raise exception 'Owner not admin'; end if;
 r:=jsonb_build_object('id',rid,'note','Synthetic inbox verification; rolled back','context',jsonb_build_object('entryId','test-entry','language','fr','prompt','Test','taughtAnswer','Test'));
 if public.submit_content_report(r)<>rid then raise exception 'Submit failed'; end if;
 perform public.submit_content_report(r);
 select count(*) into n from public.list_content_reports(0) where id=rid;
 if n<>1 then raise exception 'Retry duplicated report'; end if;
 if not public.set_content_report_status(rid,'resolved') then raise exception 'Status update failed'; end if;
 if not exists(select 1 from public.list_content_reports(0) where id=rid and status='resolved') then raise exception 'Status not retained'; end if;
 begin
  perform public.submit_content_report(r || '{"note":""}'::jsonb);
  raise exception 'Invalid report accepted';
 exception when raise_exception then if sqlerrm='Invalid report accepted' then raise; end if; end;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ begin
 if public.is_report_admin() then raise exception 'Non-admin granted access'; end if;
 begin perform public.list_content_reports(0); raise exception 'Inbox exposed';
 exception when raise_exception then if sqlerrm='Inbox exposed' then raise; end if; end;
 begin perform public.set_content_report_status(gen_random_uuid(),'resolved'); raise exception 'Update exposed';
 exception when raise_exception then if sqlerrm='Update exposed' then raise; end if; end;
 if has_table_privilege('authenticated','public.content_reports','SELECT') or has_table_privilege('authenticated','public.report_admins','INSERT') then raise exception 'Direct access exposed'; end if;
end $$;
reset role;
do $$ begin
 if has_function_privilege('anon','public.submit_content_report(jsonb)','EXECUTE') or has_table_privilege('anon','public.content_reports','SELECT') then raise exception 'Guest access exposed'; end if;
end $$;
rollback;
select 'PASS: submission, retry deduplication, status update, admin isolation, guest denial; test reports rolled back' as result;
