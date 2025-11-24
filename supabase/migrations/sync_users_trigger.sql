-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'BUYER' -- Default role
  );
  return new;
end;
$$;

-- Trigger to call the function on new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill existing users from auth.users to public.users
insert into public.users (id, email, full_name, role)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name',
  'BUYER'
from auth.users
where id not in (select id from public.users);
