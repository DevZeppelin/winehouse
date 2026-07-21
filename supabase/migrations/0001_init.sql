-- ============================================================================
-- WineHouse Cabañas — esquema inicial de Supabase
-- Ejecutar completo en el SQL Editor de un proyecto Supabase nuevo.
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists btree_gist;

-- ============================================================================
-- PROFILES — un perfil por usuario de auth.users
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'owner' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- REGIONS — localidades. Incluye "province" para escalar a toda Argentina.
-- ============================================================================
create table public.regions (
  id serial primary key,
  slug text unique not null,
  name text not null,
  province text not null default 'Mendoza',
  active boolean not null default true,
  sort_order int not null default 0
);

-- ============================================================================
-- AMENITIES — comodidades de cada cabaña
-- ============================================================================
create table public.amenities (
  id serial primary key,
  slug text unique not null,
  label text not null,
  icon text not null
);

-- ============================================================================
-- SUBSCRIPTION PLANS — determina el orden de aparición (mayor weight, primero)
-- ============================================================================
create table public.subscription_plans (
  id serial primary key,
  slug text unique not null,
  name text not null,
  price_ars numeric not null,
  weight int not null,
  description text,
  features text[] not null default '{}',
  active boolean not null default true
);

-- ============================================================================
-- CABINS
-- ============================================================================
create table public.cabins (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text not null,
  region_id int not null references public.regions(id),
  address_hint text,
  capacity int not null default 2,
  bedrooms int not null default 1,
  bathrooms int not null default 1,
  price_per_night numeric not null,
  whatsapp text,
  email text,
  cover_image text,
  gallery text[] not null default '{}',
  status text not null default 'draft'
    check (status in ('draft', 'pending_review', 'published', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cabins_region_idx on public.cabins (region_id);
create index cabins_status_idx on public.cabins (status);
create index cabins_owner_idx on public.cabins (owner_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cabins_touch_updated_at
  before update on public.cabins
  for each row execute procedure public.touch_updated_at();

-- ============================================================================
-- CABIN_AMENITIES (join table)
-- ============================================================================
create table public.cabin_amenities (
  cabin_id uuid not null references public.cabins(id) on delete cascade,
  amenity_id int not null references public.amenities(id) on delete cascade,
  primary key (cabin_id, amenity_id)
);

-- ============================================================================
-- SUBSCRIPTIONS — pagos mensuales (flujo manual: transferencia + aprobación)
-- ============================================================================
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  cabin_id uuid not null references public.cabins(id) on delete cascade,
  plan_id int not null references public.subscription_plans(id),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'expired', 'rejected')),
  period_start date,
  period_end date,
  payment_proof_url text,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.profiles(id)
);

create index subscriptions_cabin_idx on public.subscriptions (cabin_id);
create index subscriptions_status_idx on public.subscriptions (status);

create or replace function public.handle_subscription_status_change()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.status = 'active' and old.status is distinct from 'active' then
    if new.period_start is null then
      new.period_start := current_date;
    end if;
    if new.period_end is null then
      new.period_end := current_date + interval '30 days';
    end if;
    new.approved_at := now();
    new.approved_by := auth.uid();
    update public.cabins
      set status = 'published', updated_at = now()
      where id = new.cabin_id;
  elsif new.status = 'rejected' and old.status is distinct from 'rejected' then
    update public.cabins
      set status = 'draft', updated_at = now()
      where id = new.cabin_id;
  end if;
  return new;
end;
$$;

create trigger on_subscription_status_change
  before update on public.subscriptions
  for each row execute procedure public.handle_subscription_status_change();

-- Expira suscripciones vencidas y suspende la cabaña si no tiene otra activa.
-- Programar con pg_cron (ver README de supabase/) o llamar manualmente.
create or replace function public.expire_subscriptions()
returns void
language plpgsql
security definer
as $$
begin
  update public.subscriptions
    set status = 'expired'
    where status = 'active' and period_end < current_date;

  update public.cabins c
    set status = 'suspended', updated_at = now()
    where c.status = 'published'
      and not exists (
        select 1 from public.subscriptions s
        where s.cabin_id = c.id and s.status = 'active' and s.period_end >= current_date
      );
end;
$$;

-- ============================================================================
-- BOOKINGS — reservas. El exclude constraint bloquea fechas superpuestas
-- a nivel de base de datos para reservas pendientes o confirmadas.
-- ============================================================================
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  cabin_id uuid not null references public.cabins(id) on delete cascade,
  guest_name text not null,
  guest_phone text not null,
  guest_email text,
  check_in date not null,
  check_out date not null,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  constraint bookings_dates_valid check (check_out > check_in),
  exclude using gist (
    cabin_id with =,
    daterange(check_in, check_out, '[)') with &&
  ) where (status in ('pending', 'confirmed'))
);

create index bookings_cabin_idx on public.bookings (cabin_id);

-- Vista pública: solo expone las fechas ocupadas, nunca datos del huésped.
-- Se crea con el rol admin de las migraciones, por lo que no queda sujeta
-- a las políticas RLS de "bookings" — es la forma estándar en Supabase de
-- exponer un subconjunto seguro de una tabla protegida.
create view public.cabin_booked_dates as
  select cabin_id, check_in, check_out
  from public.bookings
  where status in ('pending', 'confirmed');

grant select on public.cabin_booked_dates to anon, authenticated;

-- Vista pública: cabañas publicadas con su plan activo, para ordenar el home
-- por quién paga más (mayor "weight" primero).
create view public.published_cabins as
  select
    c.*,
    r.name as region_name,
    r.slug as region_slug,
    r.province as region_province,
    sp.slug as plan_slug,
    sp.name as plan_name,
    sp.weight as plan_weight,
    s.period_start as subscription_since
  from public.cabins c
  join public.regions r on r.id = c.region_id
  left join lateral (
    select *
    from public.subscriptions s2
    where s2.cabin_id = c.id and s2.status = 'active' and s2.period_end >= current_date
    order by s2.period_start asc
    limit 1
  ) s on true
  left join public.subscription_plans sp on sp.id = s.plan_id
  where c.status = 'published';

grant select on public.published_cabins to anon, authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.regions enable row level security;
alter table public.amenities enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.cabins enable row level security;
alter table public.cabin_amenities enable row level security;
alter table public.subscriptions enable row level security;
alter table public.bookings enable row level security;

-- profiles
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- regions / amenities / subscription_plans: lectura pública, escritura admin
create policy "regions_public_read" on public.regions for select using (true);
create policy "regions_admin_write" on public.regions for insert with check (public.is_admin());
create policy "regions_admin_update" on public.regions for update using (public.is_admin()) with check (public.is_admin());
create policy "regions_admin_delete" on public.regions for delete using (public.is_admin());

create policy "amenities_public_read" on public.amenities for select using (true);
create policy "amenities_admin_write" on public.amenities for insert with check (public.is_admin());
create policy "amenities_admin_update" on public.amenities for update using (public.is_admin()) with check (public.is_admin());
create policy "amenities_admin_delete" on public.amenities for delete using (public.is_admin());

create policy "plans_public_read" on public.subscription_plans for select using (true);
create policy "plans_admin_write" on public.subscription_plans for insert with check (public.is_admin());
create policy "plans_admin_update" on public.subscription_plans for update using (public.is_admin()) with check (public.is_admin());
create policy "plans_admin_delete" on public.subscription_plans for delete using (public.is_admin());

-- cabins
create policy "cabins_read" on public.cabins
  for select using (status = 'published' or owner_id = auth.uid() or public.is_admin());
create policy "cabins_owner_insert" on public.cabins
  for insert with check (owner_id = auth.uid());
create policy "cabins_owner_update" on public.cabins
  for update using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());
create policy "cabins_owner_delete" on public.cabins
  for delete using (owner_id = auth.uid() or public.is_admin());

-- cabin_amenities
create policy "cabin_amenities_read" on public.cabin_amenities
  for select using (
    exists (
      select 1 from public.cabins c
      where c.id = cabin_id and (c.status = 'published' or c.owner_id = auth.uid() or public.is_admin())
    )
  );
create policy "cabin_amenities_write" on public.cabin_amenities
  for all using (
    exists (select 1 from public.cabins c where c.id = cabin_id and (c.owner_id = auth.uid() or public.is_admin()))
  )
  with check (
    exists (select 1 from public.cabins c where c.id = cabin_id and (c.owner_id = auth.uid() or public.is_admin()))
  );

-- subscriptions
create policy "subscriptions_select" on public.subscriptions
  for select using (
    exists (select 1 from public.cabins c where c.id = cabin_id and c.owner_id = auth.uid())
    or public.is_admin()
  );
create policy "subscriptions_owner_insert" on public.subscriptions
  for insert with check (
    status = 'pending'
    and exists (select 1 from public.cabins c where c.id = cabin_id and c.owner_id = auth.uid())
  );
create policy "subscriptions_owner_update_pending" on public.subscriptions
  for update using (
    status = 'pending'
    and exists (select 1 from public.cabins c where c.id = cabin_id and c.owner_id = auth.uid())
  )
  with check (
    status = 'pending'
    and exists (select 1 from public.cabins c where c.id = cabin_id and c.owner_id = auth.uid())
  );
create policy "subscriptions_admin_update" on public.subscriptions
  for update using (public.is_admin()) with check (public.is_admin());

-- bookings
create policy "bookings_public_insert" on public.bookings
  for insert with check (
    status = 'pending'
    and exists (select 1 from public.cabins c where c.id = cabin_id and c.status = 'published')
  );
create policy "bookings_owner_select" on public.bookings
  for select using (
    exists (select 1 from public.cabins c where c.id = cabin_id and c.owner_id = auth.uid())
    or public.is_admin()
  );
create policy "bookings_owner_update" on public.bookings
  for update using (
    exists (select 1 from public.cabins c where c.id = cabin_id and c.owner_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.cabins c where c.id = cabin_id and c.owner_id = auth.uid())
    or public.is_admin()
  );
create policy "bookings_owner_delete" on public.bookings
  for delete using (
    exists (select 1 from public.cabins c where c.id = cabin_id and c.owner_id = auth.uid())
    or public.is_admin()
  );

-- ============================================================================
-- STORAGE — buckets e imágenes
-- ============================================================================
insert into storage.buckets (id, name, public)
  values ('cabin-images', 'cabin-images', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('payment-proofs', 'payment-proofs', false)
  on conflict (id) do nothing;

create policy "cabin_images_public_read" on storage.objects
  for select using (bucket_id = 'cabin-images');
create policy "cabin_images_auth_insert" on storage.objects
  for insert with check (bucket_id = 'cabin-images' and auth.role() = 'authenticated');
create policy "cabin_images_owner_update" on storage.objects
  for update using (bucket_id = 'cabin-images' and owner = auth.uid());
create policy "cabin_images_owner_delete" on storage.objects
  for delete using (bucket_id = 'cabin-images' and owner = auth.uid());

create policy "payment_proofs_auth_insert" on storage.objects
  for insert with check (bucket_id = 'payment-proofs' and auth.role() = 'authenticated');
create policy "payment_proofs_owner_read" on storage.objects
  for select using (bucket_id = 'payment-proofs' and (owner = auth.uid() or public.is_admin()));

-- ============================================================================
-- SEED DATA
-- ============================================================================
insert into public.regions (slug, name, province, sort_order) values
  ('ciudad-mendoza', 'Ciudad de Mendoza', 'Mendoza', 1),
  ('chacras-de-coria', 'Chacras de Coria', 'Mendoza', 2),
  ('lujan-de-cuyo', 'Luján de Cuyo', 'Mendoza', 3),
  ('potrerillos', 'Potrerillos', 'Mendoza', 4),
  ('uspallata', 'Uspallata', 'Mendoza', 5),
  ('vista-flores', 'Vista Flores', 'Mendoza', 6),
  ('tunuyan', 'Tunuyán', 'Mendoza', 7),
  ('tupungato', 'Tupungato (Valle de Uco)', 'Mendoza', 8),
  ('san-rafael', 'San Rafael', 'Mendoza', 9),
  ('malargue', 'Malargüe', 'Mendoza', 10),
  ('maipu', 'Maipú', 'Mendoza', 11),
  ('zona-este', 'Zona Este (San Martín)', 'Mendoza', 12);

insert into public.amenities (slug, label, icon) values
  ('pileta', 'Pileta', 'pool'),
  ('wifi', 'WiFi', 'wifi'),
  ('aire', 'Aire acondicionado', 'ac'),
  ('calefaccion', 'Calefacción', 'heating'),
  ('parrilla', 'Parrilla', 'bbq'),
  ('cochera', 'Cochera', 'parking'),
  ('pet-friendly', 'Pet friendly', 'pets'),
  ('desayuno', 'Desayuno incluido', 'breakfast'),
  ('jacuzzi', 'Jacuzzi', 'jacuzzi'),
  ('rio', 'Río cercano', 'river'),
  ('ropa-de-cama', 'Ropa de cama', 'linens'),
  ('tv', 'TV / Streaming', 'tv'),
  ('cocina', 'Cocina equipada', 'kitchen'),
  ('accesible', 'Apto movilidad reducida', 'accessible'),
  ('seguridad', 'Seguridad 24hs', 'security');

insert into public.subscription_plans (slug, name, price_ars, weight, description, features) values
  ('bronce', 'Bronce', 8000, 10, 'Para empezar a mostrar tu cabaña.',
    array['Aparece en el listado público', 'Hasta 5 fotos', 'Ficha básica de la cabaña']),
  ('plata', 'Plata', 15000, 20, 'Más visibilidad para tu propiedad.',
    array['Todo lo de Bronce', 'Hasta 15 fotos', 'Prioridad media en el listado', 'Insignia Plata']),
  ('oro', 'Oro', 25000, 30, 'El máximo alcance posible.',
    array['Todo lo de Plata', 'Fotos ilimitadas', 'Primeros lugares del listado', 'Insignia Oro destacada', 'Soporte prioritario']);
