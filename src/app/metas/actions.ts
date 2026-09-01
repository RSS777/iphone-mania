"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { mesInputParaISO } from "@/lib/metas";

export type MetaFormState = { error: string | null };

export async function salvarMeta(
  _prevState: MetaFormState,
  formData: FormData,
): Promise<MetaFormState> {
  const mesInput = String(formData.get("mes") ?? "").trim();
  const valorRaw = String(formData.get("meta_valor") ?? "").trim();

  if (!mesInput) return { error: "Escolha o mês de referência." };

  const valor = Number(valorRaw);
  if (!valorRaw || Number.isNaN(valor) || valor <= 0) return { error: "Preencha um valor de meta válido." };

  const mes_referencia = mesInputParaISO(mesInput);

  const supabase = await createClient();
  const { error } = await supabase
    .from("metas_mensais")
    .upsert({ mes_referencia, meta_valor: valor }, { onConflict: "mes_referencia" });

  if (error) return { error: "Não deu pra salvar a meta. Tenta de novo." };

  revalidatePath("/metas");
  return { error: null };
}
