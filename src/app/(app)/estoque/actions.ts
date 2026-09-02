"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CHECKLIST_ITENS, proximoStatus } from "@/lib/iphones";

export type IphoneFormState = { error: string | null };
export type AdvanceStatusState = { error: string | null };
export type VendaFormState = { error: string | null };

function readIphoneFields(formData: FormData) {
  const modelo = String(formData.get("modelo") ?? "").trim();
  const capacidade_gb = Number(formData.get("capacidade_gb"));
  const cor = String(formData.get("cor") ?? "").trim();
  const imei = String(formData.get("imei") ?? "").trim();
  const origemSelecionada = String(formData.get("origem_compra") ?? "").trim();
  const origemOutro = String(formData.get("origem_compra_outro") ?? "").trim();
  const observacoesRaw = String(formData.get("observacoes") ?? "").trim();
  const valorCompraRaw = String(formData.get("valor_compra") ?? "").trim();
  const dataCompraRaw = String(formData.get("data_compra") ?? "").trim();

  const origem_compra = origemSelecionada === "Outro" ? origemOutro : origemSelecionada;

  return {
    modelo,
    capacidade_gb,
    cor,
    imei,
    origem_compra,
    observacoes: observacoesRaw || null,
    valor_compra: valorCompraRaw ? Number(valorCompraRaw) : null,
    data_compra: dataCompraRaw || null,
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
  const { data, error } = await supabase.from("iphones").insert(fields).select("id").single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Esse IMEI já está cadastrado em outro item ativo." };
    }
    return { error: "Não deu pra cadastrar o iPhone. Tenta de novo." };
  }

  revalidatePath("/estoque");
  redirect(`/estoque/${data.id}`);
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
  revalidatePath(`/estoque/${id}`);
  redirect(`/estoque/${id}`);
}

export async function deleteIphone(id: string) {
  const supabase = await createClient();

  // as linhas de iphone_fotos cascateiam pela FK, mas os arquivos no Storage não —
  // precisam ser removidos manualmente antes, senão ficam órfãos pra sempre.
  const { data: fotos } = await supabase.from("iphone_fotos").select("path").eq("iphone_id", id);
  if (fotos && fotos.length > 0) {
    await supabase.storage.from("iphone-fotos").remove(fotos.map((f) => f.path));
  }

  await supabase.from("iphones").delete().eq("id", id);
  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function updateChecklist(id: string, formData: FormData) {
  const checklist: Record<string, boolean> = {};
  for (const item of CHECKLIST_ITENS) {
    checklist[item.key] = formData.get(item.key) === "on";
  }
  const observacao_checklist = String(formData.get("observacao_checklist") ?? "").trim() || null;

  const supabase = await createClient();
  await supabase.from("iphones").update({ checklist, observacao_checklist }).eq("id", id);
  revalidatePath(`/estoque/${id}`);
}

export type CustoFormState = { error: string | null };

export async function addCusto(
  iphoneId: string,
  _prevState: CustoFormState,
  formData: FormData,
): Promise<CustoFormState> {
  const descricao = String(formData.get("descricao") ?? "").trim();
  const valor = Number(formData.get("valor"));
  const data = String(formData.get("data") ?? "").trim();

  if (!descricao) return { error: "Preencha a descrição do custo." };
  if (!valor || Number.isNaN(valor) || valor <= 0) return { error: "Preencha um valor válido." };
  if (!data) return { error: "Preencha a data do custo." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("custos_adicionais")
    .insert({ iphone_id: iphoneId, descricao, valor, data });

  if (error) return { error: "Não deu pra adicionar o custo. Tenta de novo." };

  revalidatePath(`/estoque/${iphoneId}`);
  return { error: null };
}

export async function deleteCusto(custoId: string, iphoneId: string) {
  const supabase = await createClient();
  await supabase.from("custos_adicionais").delete().eq("id", custoId);
  revalidatePath(`/estoque/${iphoneId}`);
}

export type FotoFormState = { error: string | null };

export async function addFotos(
  iphoneId: string,
  _prevState: FotoFormState,
  formData: FormData,
): Promise<FotoFormState> {
  const files = formData.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) return { error: "Escolha pelo menos uma foto." };

  const supabase = await createClient();

  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${iphoneId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("iphone-fotos")
      .upload(path, file, { contentType: file.type });

    if (uploadError) return { error: "Não deu pra subir uma das fotos. Tenta de novo." };

    await supabase.from("iphone_fotos").insert({ iphone_id: iphoneId, path });
  }

  revalidatePath(`/estoque/${iphoneId}`);
  return { error: null };
}

export async function deleteFoto(fotoId: string, path: string, iphoneId: string) {
  const supabase = await createClient();
  await supabase.storage.from("iphone-fotos").remove([path]);
  await supabase.from("iphone_fotos").delete().eq("id", fotoId);
  revalidatePath(`/estoque/${iphoneId}`);
}

export async function advanceStatus(
  iphoneId: string,
  _prevState: AdvanceStatusState,
  _formData: FormData,
): Promise<AdvanceStatusState> {
  const supabase = await createClient();

  const { data: iphone } = await supabase
    .from("iphones")
    .select("status")
    .eq("id", iphoneId)
    .single();

  if (!iphone) return { error: "Item não encontrado." };

  const proximo = proximoStatus(iphone.status);
  if (!proximo) return { error: "Esse item já está no último status manual." };

  if (proximo === "a_venda") {
    const { count } = await supabase
      .from("iphone_fotos")
      .select("id", { count: "exact", head: true })
      .eq("iphone_id", iphoneId);

    if (!count || count === 0) {
      return { error: 'Adicione pelo menos 1 foto antes de avançar para "À venda".' };
    }
  }

  const { error } = await supabase.from("iphones").update({ status: proximo }).eq("id", iphoneId);
  if (error) return { error: "Não deu pra avançar o status. Tenta de novo." };

  revalidatePath("/estoque");
  revalidatePath(`/estoque/${iphoneId}`);
  return { error: null };
}

export async function registrarVenda(
  iphoneId: string,
  _prevState: VendaFormState,
  formData: FormData,
): Promise<VendaFormState> {
  const valorVendaRaw = String(formData.get("valor_venda") ?? "").trim();
  const dataVenda = String(formData.get("data_venda") ?? "").trim();
  const canalVenda = String(formData.get("canal_venda") ?? "").trim() || null;

  const valorVenda = Number(valorVendaRaw);
  if (!valorVendaRaw || Number.isNaN(valorVenda) || valorVenda <= 0) {
    return { error: "Preencha um valor de venda válido." };
  }
  if (!dataVenda) return { error: "Preencha a data da venda." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("registrar_venda", {
    p_iphone_id: iphoneId,
    p_valor_venda: valorVenda,
    p_data_venda: dataVenda,
    p_canal_venda: canalVenda,
  });

  if (error) {
    if (error.message?.includes("status_invalido")) {
      return { error: 'Só dá pra vender um item que esteja "À venda".' };
    }
    return { error: "Não deu pra registrar a venda. Tenta de novo." };
  }

  revalidatePath("/estoque");
  revalidatePath(`/estoque/${iphoneId}`);
  revalidatePath("/caixa");
  redirect(`/estoque/${iphoneId}`);
}
