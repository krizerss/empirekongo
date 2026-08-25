-- EmpireKongo MVP core schema for Supabase
-- Goal: make authentication, profiles, enterprises and products functional.
-- This migration intentionally does NOT replace the legacy EmpireKongo SQL schema.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  account_type text not null default 'individual' check (account_type in ('individual','enterprise','supplier','admin')),
  avatar_url text,
  city text,
  country text not null default 'RDC',
  website text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprises (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  category text,
  description text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  province text,
  country text not null default 'RDC',
  logo_url text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  enterprise_id uuid not null references public.enterprises(id) on delete cascade,
  name text not null,
  slug text,
  description text,
  category text not null,
  sub_category text,
  status text not null default 'Brouillon' check (status in ('Actif','Brouillon','En attente')),
  availability text not null default 'Disponible' check (availability in ('Disponible','Rupture','Sur commande')),
  main_image_url text,
  views integer not null default 0 check (views >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_owner_enterprise_fk foreign key (owner_id) references auth.users(id) on delete cascade
);

create index if not exists enterprises_owner_id_idx on public.enterprises(owner_id);
create index if not exists products_owner_id_idx on public.products(owner_id);
create index if not exists products_enterprise_id_idx on public.products(enterprise_id);
create index if not exists products_category_idx on public.products(category);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists enterprises_set_updated_at on public.enterprises;
create trigger enterprises_set_updated_at
before update on public.enterprises
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Create an application profile automatically whenever Supabase Auth creates a user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone, account_type, city, country)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.raw_user_meta_data ->> 'phone',
    coalesce(new.raw_user_meta_data ->> 'account_type', 'individual'),
    new.raw_user_meta_data ->> 'city',
    coalesce(new.raw_user_meta_data ->> 'country', 'RDC')
  )
  on conflict (id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    phone = excluded.phone,
    account_type = excluded.account_type,
    city = excluded.city,
    country = excluded.country;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.enterprises enable row level security;
alter table public.products enable row level security;

-- Profiles: users can read/update only their own profile.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Enterprises: everyone can see published enterprise profiles; owners can manage their own.
drop policy if exists enterprises_select_public on public.enterprises;
create policy enterprises_select_public on public.enterprises for select using (true);

drop policy if exists enterprises_insert_own on public.enterprises;
create policy enterprises_insert_own on public.enterprises for insert with check (auth.uid() = owner_id);

drop policy if exists enterprises_update_own on public.enterprises;
create policy enterprises_update_own on public.enterprises for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists enterprises_delete_own on public.enterprises;
create policy enterprises_delete_own on public.enterprises for delete using (auth.uid() = owner_id);

-- Products: everyone can browse; only the owner can create/update/delete.
drop policy if exists products_select_public on public.products;
create policy products_select_public on public.products for select using (true);

drop policy if exists products_insert_own on public.products;
create policy products_insert_own on public.products for insert with check (
  auth.uid() = owner_id
  and exists (
    select 1 from public.enterprises e
    where e.id = enterprise_id and e.owner_id = auth.uid()
  )
);

drop policy if exists products_update_own on public.products;
create policy products_update_own on public.products for update using (auth.uid() = owner_id) with check (
  auth.uid() = owner_id
  and exists (
    select 1 from public.enterprises e
    where e.id = enterprise_id and e.owner_id = auth.uid()
  )
);

drop policy if exists products_delete_own on public.products;
create policy products_delete_own on public.products for delete using (auth.uid() = owner_id);

-- Keep the enterprise ownership invariant explicit.
create or replace function public.validate_product_owner()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1 from public.enterprises e
    where e.id = new.enterprise_id and e.owner_id = new.owner_id
  ) then
    raise exception 'The product enterprise must belong to the product owner';
  end if;
  return new;
end;
$$;

drop trigger if exists products_validate_owner on public.products;
create trigger products_validate_owner
before insert or update on public.products
for each row execute function public.validate_product_owner();
