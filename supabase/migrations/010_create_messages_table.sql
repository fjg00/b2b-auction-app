create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  transaction_id uuid references public.transactions(id) not null,
  sender_id uuid references auth.users(id) not null,
  content text not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies
create policy "Users can view messages for their transactions"
  on public.messages for select
  using (
    auth.uid() in (
      select buyer_id from public.transactions where id = transaction_id
      union
      select seller_id from public.transactions where id = transaction_id
    )
  );

create policy "Users can insert messages for their transactions"
  on public.messages for insert
  with check (
    auth.uid() in (
      select buyer_id from public.transactions where id = transaction_id
      union
      select seller_id from public.transactions where id = transaction_id
    )
  );
