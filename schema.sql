-- Run this in your Supabase SQL editor

create table if not exists medicines (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  dosage text,
  frequency text not null default 'once_daily',
  color text not null default 'pink',
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists intake_logs (
  id uuid default gen_random_uuid() primary key,
  medicine_id uuid references medicines(id) on delete cascade, -- nullable for quick logs
  medicine_name text not null,
  dosage text,
  is_quick_log boolean not null default false,
  taken_at timestamptz not null default now(),
  log_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

alter table medicines enable row level security;
alter table intake_logs enable row level security;

create policy "Allow all on medicines" on medicines
  for all using (true) with check (true);

create policy "Allow all on intake_logs" on intake_logs
  for all using (true) with check (true);
