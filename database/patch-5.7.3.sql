-- Palace 5.7.3 — additive; run after setup.sql and backups.sql on the TESTING project.
-- Existing progress and sessions stay. No audio files are stored in backups.
begin;
create or replace function public.carnival_trim_backups(p_profile text) returns void
language sql security definer set search_path=public as $$
 delete from public.carnival_backups where profile=p_profile and id not in
 (select id from public.carnival_backups where profile=p_profile order by created_at desc,id desc limit 5);
$$;
select public.carnival_trim_backups('nayleen');
select public.carnival_trim_backups('testing');

-- Game saves preserve the latest native data. Native writes do not change the game revision.
create or replace function public.carnival_write_save(p_state jsonb,p_revision bigint,p_profile text)
returns table(state jsonb,revision bigint) language plpgsql security definer set search_path=public as $$
begin
 if p_profile not in ('nayleen','testing') or octet_length(p_state::text)>200000 then raise exception 'Invalid save'; end if;
 if p_revision=0 then
  return query insert into public.carnival_saves as s(profile,state,revision) values(p_profile,p_state,1) on conflict do nothing returning s.state,s.revision;
  if found then return; end if;
 end if;
 return query update public.carnival_saves as s set state=p_state||jsonb_build_object('companion',coalesce(s.state->'companion',p_state->'companion','{}'::jsonb))||jsonb_build_object('journey',coalesce(p_state->'journey','{}'::jsonb)||jsonb_build_object('loginDays',(select coalesce(jsonb_agg(day order by day),'[]'::jsonb) from (select distinct value as day from jsonb_array_elements(coalesce(p_state->'journey'->'loginDays','[]'::jsonb)||coalesce(s.state->'journey'->'loginDays','[]'::jsonb))) as days))),revision=s.revision+1
 where s.profile=p_profile and s.revision=p_revision returning s.state,s.revision;
end;$$;

create or replace function public.carnival_write_companion(p_profile text,p_part text,p_value jsonb,p_revision bigint,p_epoch bigint)
returns table(companion jsonb) language plpgsql security definer set search_path=public as $$
declare saved public.carnival_saves%rowtype; c jsonb; next_state jsonb;
begin
 if p_profile not in ('nayleen','testing') or p_part not in ('notes','calendar','music','settings') or p_revision<0 or p_epoch<0 or octet_length(p_value::text)>70000 then raise exception 'Invalid personal save'; end if;
 select * into saved from public.carnival_saves where profile=p_profile for update;
 if not found then return; end if;
 c=coalesce(saved.state->'companion','{"version":1,"epoch":0}'::jsonb);
 if coalesce((c->>'epoch')::bigint,0)<>p_epoch or coalesce((c->p_part->>'revision')::bigint,0)<>p_revision then return; end if;
 c=jsonb_set(c,array[p_part],jsonb_build_object('revision',p_revision+1,'value',p_value));
 c=c||jsonb_build_object('version',1,'epoch',p_epoch);
 next_state=jsonb_set(saved.state,'{companion}',c);
 if octet_length(next_state::text)>200000 then raise exception 'Personal save is full'; end if;
 update public.carnival_saves set state=next_state where profile=p_profile;
 return query select c;
end;$$;

create or replace function public.carnival_login_day(p_profile text,p_day text) returns boolean language plpgsql security definer set search_path=public as $$
begin
 if p_profile not in ('nayleen','testing') or p_day !~ '^20[0-9]{2}-[0-9]{2}-[0-9]{2}$' then raise exception 'Invalid login'; end if;
 update public.carnival_saves as s set state=jsonb_set(s.state,'{journey}',coalesce(s.state->'journey','{"version":1}'::jsonb)||jsonb_build_object('loginDays',coalesce(s.state->'journey'->'loginDays','[]'::jsonb)||to_jsonb(p_day))) where s.profile=p_profile and not coalesce(s.state->'journey'->'loginDays','[]'::jsonb) ? p_day;
 return found;
end;$$;
revoke all on function public.carnival_login_day(text,text) from public,anon,authenticated;
grant execute on function public.carnival_login_day(text,text) to service_role;

-- Explicit recovery advances an epoch so phones adopt the chosen copy on their next sync.
create or replace function public.carnival_restore_save(p_state jsonb,p_revision bigint,p_profile text)
returns table(state jsonb,revision bigint) language plpgsql security definer set search_path=public as $$
declare previous public.carnival_saves%rowtype; recovered jsonb;
begin
 if p_profile not in ('nayleen','testing') or octet_length(p_state::text)>200000 then raise exception 'Invalid recovery'; end if;
 select * into previous from public.carnival_saves where profile=p_profile for update;
 if not found then
  if p_revision<>0 then return; end if;
  return query select * from public.carnival_write_save(p_state,0,p_profile);return;
 end if;
 if previous.revision<>p_revision then return; end if;
 insert into public.carnival_backups(profile,state,revision,reason) values(p_profile,previous.state,previous.revision,'before-recovery');
 recovered=jsonb_set(p_state,'{companion}',coalesce(p_state->'companion','{}'::jsonb)||jsonb_build_object('version',1,'epoch',coalesce((previous.state->'companion'->>'epoch')::bigint,0)+1));
 return query update public.carnival_saves as s set state=recovered,revision=s.revision+1 where s.profile=p_profile returning s.state,s.revision;
 perform public.carnival_trim_backups(p_profile);
end;$$;
revoke all on function public.carnival_write_companion(text,text,jsonb,bigint,bigint) from public,anon,authenticated;
grant execute on function public.carnival_write_companion(text,text,jsonb,bigint,bigint) to service_role;
revoke all on function public.carnival_trim_backups(text),public.carnival_write_save(jsonb,bigint,text),public.carnival_restore_save(jsonb,bigint,text) from public,anon,authenticated;
grant execute on function public.carnival_write_save(jsonb,bigint,text),public.carnival_restore_save(jsonb,bigint,text) to service_role;
commit;
