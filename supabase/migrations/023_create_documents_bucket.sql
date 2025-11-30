-- Create documents bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Policy to allow anyone to view documents
create policy "Public Access Documents"
  on storage.objects for select
  using ( bucket_id = 'documents' );

-- Policy to allow authenticated users to upload documents
create policy "Authenticated users can upload documents"
  on storage.objects for insert
  with check ( bucket_id = 'documents' and auth.role() = 'authenticated' );
