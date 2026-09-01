"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ConfigFormState = { error: string | null };

function readConfigFields(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const termos_busca = String(formData.get("termos_busca") ?? "").trim();
  const modelo = String(formData.get("modelo") ?? "").trim();
  const localizacao = String(formData.get("localizacao") ?? "").trim();
  const precoMinRaw = String(formData.get("preco_min") ?? "").trim();
  const precoMaxRaw = String(formData.get("preco_max") ?? "").trim();

  return {
    nome,
    termos_busca,
    modelo: modelo || null,
    localizacao: localizacao || null,
    preco_min: precoMinRaw ? Number(precoMinRaw) : null,
    preco_max: precoMaxRaw ? Number(precoMaxRaw) : null,
  };
}

export async function createConfig(
  _prevState: ConfigFormState,
  formData: FormData,
): Promise<ConfigFormState> {
  const fields = readConfigFields(formData);

  if (!fields.nome) return { error: "Dê um nome pra essa busca." };
  if (!fields.termos_busca) return { error: "Preencha os termos de busca." };

  const supabase = await createClient();
  const { error } = await supabase.from("scraping_configs").insert(fields);
  if (error) return { error: "Não deu pra criar a busca. Tenta de novo." };

  revalidatePath("/garimpo/configurar");
  return { error: null };
}

export async function updateConfig(id: string, formData: FormData) {
  const fields = readConfigFields(formData);
  if (!fields.nome || !fields.termos_busca) return;

  const supabase = await createClient();
  await supabase.from("scraping_configs").update(fields).eq("id", id);
  revalidatePath("/garimpo/configurar");
  revalidatePath("/garimpo");
}

export async function toggleConfigAtivo(id: string, ativo: boolean) {
  const supabase = await createClient();
  await supabase.from("scraping_configs").update({ ativo: !ativo }).eq("id", id);
  revalidatePath("/garimpo/configurar");
  revalidatePath("/garimpo");
}

export async function deleteConfig(id: string) {
  const supabase = await createClient();
  await supabase.from("scraping_configs").delete().eq("id", id);
  revalidatePath("/garimpo/configurar");
  revalidatePath("/garimpo");
}

export async function descartarAnuncio(id: string) {
  const supabase = await createClient();
  await supabase.from("scraping_anuncios").update({ status: "descartado" }).eq("id", id);
  revalidatePath("/garimpo");
}

export async function marcarAvaliado(id: string) {
  const supabase = await createClient();
  await supabase.from("scraping_anuncios").update({ status: "avaliado" }).eq("id", id);
  revalidatePath("/garimpo");
}
