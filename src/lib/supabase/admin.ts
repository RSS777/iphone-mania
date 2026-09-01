import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client com service_role — só pra rotas server-only sem sessão de usuário
 * (ex: o cron de saídas recorrentes). Ignora RLS. Nunca importar num
 * Client Component nem expor a chave ao browser.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
