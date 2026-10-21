-- SQL Editor as postgres. Synthetic identities only; rolled back, no emails.
begin;
create temporary table challenge_test_ids as select gen_random_uuid() a,gen_random_uuid() b,gen_random_uuid() round_id;
grant select on challenge_test_ids to authenticated;
insert into auth.users(id) select a from challenge_test_ids union all select b from challenge_test_ids;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select a::text from challenge_test_ids),true);
do $$
declare round_key uuid:=(select round_id from challenge_test_ids); d date:=current_date-1; r jsonb;
begin
 if not public.claim_challenge_round(d,round_key) then raise exception 'Claim failed';end if;
 if not public.claim_challenge_round(d,round_key) then raise exception 'Idempotent retry failed';end if;
 if public.claim_challenge_round(d,gen_random_uuid()) then raise exception 'Duplicate date allowed';end if;
 r:=jsonb_build_object('date',now(),'challengeDate',d,'score',1,'total',50,'correct',jsonb_build_array('fr'),'attempts',jsonb_build_array(jsonb_build_object('id','fr')));
 perform public.save_challenge_round(round_key,r,true);
 perform public.save_challenge_round(round_key,r||'{"score":0}',false);
 if (select (record->>'score')::integer from public.challenge_rounds where id=round_key limit 1)<>1 then raise exception 'Completed score overwritten';end if;
 begin
  update public.challenge_rounds set completed=false;
  raise exception 'Direct write allowed';
 exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub',(select b::text from challenge_test_ids),true);
do $$
begin
 if (select count(*) from public.challenge_rounds)<>0 then raise exception 'Cross-user read';end if;
 if not public.claim_challenge_round(current_date-1,gen_random_uuid()) then raise exception 'Second owner claim failed';end if;
end $$;
set local role anon;
do $$
begin
 begin perform * from public.challenge_rounds;raise exception 'Anonymous read';exception when insufficient_privilege then null;end;
 begin perform public.claim_challenge_round(current_date,gen_random_uuid());raise exception 'Anonymous claim';exception when insufficient_privilege then null;end;
end $$;
reset role;
delete from auth.users where id=(select a from challenge_test_ids);
do $$begin if exists(select 1 from public.challenge_rounds where user_id=(select a from challenge_test_ids)) then raise exception 'Deletion did not cascade';end if;end $$;
rollback;
select 'PASS: daily uniqueness, idempotence, completed score protection, owner isolation, direct-write denial, anonymous denial, deletion cascade; fixtures rolled back' as verification;
