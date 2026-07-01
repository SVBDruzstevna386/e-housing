revoke execute on function public.handle_new_user_profile() from public, anon, authenticated;

update storage.buckets
set public = false
where id = 'e-housing-files';
