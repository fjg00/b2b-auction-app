-- File: supabase/schema.sql

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Enums
create type user_role as enum ('BUYER', 'SELLER', 'ADMIN');
create type lot_status as enum ('DRAFT', 'ACTIVE', 'ENDED', 'CANCELLED');

-- Users Table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role user_role default 'BUYER',
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lots Table
create table if not exists lots (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text not null,
  start_price integer not null,
  buy_now_price integer,
  min_bid_increment integer not null default 10,
  status lot_status not null default 'ACTIVE',
  start_time timestamptz not null,
  end_time timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bids Table
create table if not exists bids (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references lots(id) on delete cascade,
  bidder_id uuid not null references users(id) on delete cascade,
  amount integer not null,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_bids_lot_id_created_at on bids(lot_id, created_at desc);
create index if not exists idx_lots_status_end_time on lots(status, end_time);
create index if not exists idx_users_email on users(email);
