"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type IphoneFormState = { error: string | null };

function readIphoneFields(formData: FormData) {
  const modelo = String(formData.get("modelo") ?? "").trim();
  const capacidade_gb = Number(formData.get("capacidade_gb"));
  const cor = String(formData.get("cor") ?? "").trim();
  const imei = String(formData.get("imei") ?? "").trim();
  const origemSelecionada = String(formData.get("origem_compra") ?? "").trim();
  const origemOutro = String(formData.get("origem_compra_outro") ?? "").trim();
  const observacoesRaw = String(formData.get("observacoes") ?? "").trim();

  const origem_compra = origemSelecionada === "Outro" ? origemOutro : origemSelecionada;

  return {
    modelo,
    capacidade_gb,
    cor,
    imei,
    origem_compra,
    observacoes: observacoesRaw || null,
  };
}

function validate(fields: ReturnType<typeof readIphoneFields>): string | null {
  if (!fields.modelo) return "Preencha o modelo.";
  if (!fields.capacidade_gb || Number.isNaN(fields.capacidade_gb)) return "Escolha a capacidade.";
  if (!fields.cor) return "Preencha a cor.";
  if (!fields.imei) return "Preencha o IMEI.";
  if (!fields.origem_compra) return "Preencha a origem da compra.";
  return null;
}

export async function createIphone(
  _prevState: IphoneFormState,
  formData: FormData,
): Promise<IphoneFormState> {
  const fields = readIphoneFields(formData);
  const validationError = validate(fields);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("iphones").insert(fields);

  if (error) {
    if (error.code === "23505") {
      return { error: "Esse IMEI já está cadastrado em outro item ativo." };
    }
    return { error: "Não deu pra cadastrar o iPhone. Tenta de novo." };
  }

  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function updateIphone(
  id: string,
  _prevState: IphoneFormState,
  formData: FormData,
): Promise<IphoneFormState> {
  const fields = readIphoneFields(formData);
  const validationError = validate(fields);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("iphones").update(fields).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Esse IMEI já está cadastrado em outro item ativo." };
    }
    return { error: "Não deu pra salvar as alterações. Tenta de novo." };
  }

  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function deleteIphone(id: string) {
  const supabase = await createClient();
  await supabase.from("iphones").delete().eq("id", id);
  revalidatePath("/estoque");
  redirect("/estoque");
}
