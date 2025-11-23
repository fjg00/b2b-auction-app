-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text check (role in ('buyer', 'seller')) not null,
  business_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LOTS (Auction Items)
create table lots (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references profiles(id) not null,
  title text not null,
  description text not null,
  category text not null,
  condition text not null,
  
  -- Inventory Details
  quantity text not null,
  location text not null,
  barcode text,
  production_date date,
  expiry_date date,
  tags text[], -- Array of smart tags
  
  -- Pricing & Auction
  starting_bid numeric not null,
  buy_now_price numeric,
  current_bid numeric default 0,
  
  -- Timing
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  duration_days integer not null,
  
  -- Media
  images text[], -- Array of image URLs
  
  -- Status
  status text check (status in ('draft', 'active', 'ended', 'sold')) default 'draft',
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BIDS
create table bids (
  id uuid default uuid_generate_v4() primary key,
  lot_id uuid references lots(id) on delete cascade not null,
  bidder_id uuid references profiles(id) not null,
  amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WATCHLIST
create table watchlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  lot_id uuid references lots(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lot_id)
);

-- RLS POLICIES (Row Level Security)
alter table profiles enable row level security;
alter table lots enable row level security;
alter table bids enable row level security;
alter table watchlist enable row level security;

-- Policies can be added later (e.g., Public read for active lots, Authenticated create for bids)
