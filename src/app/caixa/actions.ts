"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type LancamentoFormState = { error: string | null; tipo?: "entrada" | "saida" };

function readLancamentoFields(formData: FormData) {
  const tipo = String(formData.get("tipo") ?? "");
  const descricao = String(formData.get("descricao") ?? "").trim();
  const valorRaw = String(formData.get("valor") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();
  const categoria_id = String(formData.get("categoria_id") ?? "").trim() || null;

  return {
    tipo,
    descricao,
    valor: valorRaw ? Number(valorRaw) : NaN,
    data,
    categoria_id,
  };
}

function validateLancamento(fields: ReturnType<typeof readLancamentoFields>): string | null {
  if (fields.tipo !== "entrada" && fields.tipo !== "saida") return "Escolha entrada ou saída.";
  if (!fields.descricao) return "Preencha a descrição.";
  if (!fields.valor || Number.isNaN(fields.valor) || fields.valor <= 0) return "Preencha um valor válido.";
  if (!fields.data) return "Preencha a data.";
  if (fields.tipo === "saida" && !fields.categoria_id) return "Escolha uma categoria pra saída.";
  return null;
}

export async function createLancamento(
  _prevState: LancamentoFormState,
  formData: FormData,
): Promise<LancamentoFormState> {
  const fields = readLancamentoFields(formData);
  const validationError = validateLancamento(fields);
  if (validationError) return { error: validationError, tipo: fields.tipo as "entrada" | "saida" };

  const supabase = await createClient();
  const { error } = await supabase.from("lancamentos_caixa").insert({
    tipo: fields.tipo,
    descricao: fields.descricao,
    valor: fields.valor,
    data: fields.data,
    categoria_id: fields.tipo === "saida" ? fields.categoria_id : null,
    origem: "manual",
  });

  if (error) return { error: "Não deu pra lançar. Tenta de novo." };

  revalidatePath("/caixa");
  redirect("/caixa");
}

export type SaidaRapidaState = { error: string | null; success: boolean };

/** Mesmo mecanismo do lançamento manual de saída, mas sem redirecionar — usado pelo pop-up de acesso rápido em qualquer tela. */
export async function createSaidaRapida(
  _prevState: SaidaRapidaState,
  formData: FormData,
): Promise<SaidaRapidaState> {
  const valorRaw = String(formData.get("valor") ?? "").trim();
  const categoria_id = String(formData.get("categoria_id") ?? "").trim() || null;
  const descricao = String(formData.get("descricao") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();

  const valor = Number(valorRaw);
  if (!valorRaw || Number.isNaN(valor) || valor <= 0) return { error: "Preencha um valor válido.", success: false };
  if (!categoria_id) return { error: "Escolha uma categoria.", success: false };
  if (!data) return { error: "Preencha a data.", success: false };

  const supabase = await createClient();
  const { error } = await supabase.from("lancamentos_caixa").insert({
    tipo: "saida",
    descricao: descricao || "Saída rápida",
    valor,
    data,
    categoria_id,
    origem: "manual",
  });

  if (error) return { error: "Não deu pra lançar. Tenta de novo.", success: false };

  revalidatePath("/caixa");
  return { error: null, success: true };
}

export async function updateLancamento(
  id: string,
  _prevState: LancamentoFormState,
  formData: FormData,
): Promise<LancamentoFormState> {
  const fields = readLancamentoFields(formData);
  const validationError = validateLancamento(fields);
  if (validationError) return { error: validationError, tipo: fields.tipo as "entrada" | "saida" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("lancamentos_caixa")
    .update({
      tipo: fields.tipo,
      descricao: fields.descricao,
      valor: fields.valor,
      data: fields.data,
      categoria_id: fields.tipo === "saida" ? fields.categoria_id : null,
    })
    .eq("id", id);

  if (error) return { error: "Não deu pra salvar. Tenta de novo." };

  revalidatePath("/caixa");
  redirect("/caixa");
}

export async function deleteLancamento(id: string) {
  const supabase = await createClient();
  await supabase.from("lancamentos_caixa").delete().eq("id", id);
  revalidatePath("/caixa");
  redirect("/caixa");
}

export type CategoriaFormState = { error: string | null };

export async function createCategoria(
  _prevState: CategoriaFormState,
  formData: FormData,
): Promise<CategoriaFormState> {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return { error: "Preencha o nome da categoria." };

  const supabase = await createClient();
  const { error } = await supabase.from("categorias_saida").insert({ nome });
  if (error) return { error: "Não deu pra criar a categoria. Tenta de novo." };

  revalidatePath("/caixa/categorias");
  revalidatePath("/caixa/novo");
  return { error: null };
}

export async function renameCategoria(id: string, formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;

  const supabase = await createClient();
  await supabase.from("categorias_saida").update({ nome }).eq("id", id);
  revalidatePath("/caixa/categorias");
  revalidatePath("/caixa/novo");
}

export async function toggleCategoria(id: string, ativo: boolean, _formData: FormData) {
  const supabase = await createClient();
  await supabase.from("categorias_saida").update({ ativo: !ativo }).eq("id", id);
  revalidatePath("/caixa/categorias");
  revalidatePath("/caixa/novo");
}
