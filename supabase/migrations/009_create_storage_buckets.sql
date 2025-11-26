-- Create storage buckets if they don't exist
insert into storage.buckets (id, name, public)
values ('lot-images', 'lot-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('transaction-proofs', 'transaction-proofs', true)
on conflict (id) do nothing;

-- Policy to allow anyone to view lot images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'lot-images' );

-- Policy to allow authenticated users to upload lot images
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'lot-images' and auth.role() = 'authenticated' );

-- Policy to allow anyone to view transaction proofs (for now, refine later)
create policy "Public Access Proofs"
  on storage.objects for select
  using ( bucket_id = 'transaction-proofs' );

-- Policy to allow authenticated users to upload transaction proofs
create policy "Authenticated users can upload proofs"
  on storage.objects for insert
  with check ( bucket_id = 'transaction-proofs' and auth.role() = 'authenticated' );
