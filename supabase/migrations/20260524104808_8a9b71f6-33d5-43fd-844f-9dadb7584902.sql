create table public.quote_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  insurance_type text not null,
  full_name text not null,
  phone text not null,
  tin_number text,
  email text,
  details jsonb not null default '{}'::jsonb,
  emailed boolean not null default false
);

alter table public.quote_submissions enable row level security;

create policy "Anyone can submit a quote"
  on public.quote_submissions
  for insert
  to anon, authenticated
  with check (true);
