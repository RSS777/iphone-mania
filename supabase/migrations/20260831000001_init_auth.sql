-- Ticket #2: setup + auth. Perfis dos 2 sócios (admin), RLS restrita aos autenticados.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  nome text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "authenticated users can read profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Cria automaticamente um profile quando um usuário é criado no Auth (os 2 sócios são
-- pré-cadastrados manualmente via dashboard/CLI, nunca por signup público).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, nome, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'nome', new.email), 'admin');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
