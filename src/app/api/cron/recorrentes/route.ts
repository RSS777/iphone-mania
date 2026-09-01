import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Data e dia-do-mês de hoje no fuso do negócio (o servidor pode rodar em UTC). */
function hojeSaoPaulo() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const ano = partes.find((p) => p.type === "year")!.value;
  const mes = partes.find((p) => p.type === "month")!.value;
  const dia = partes.find((p) => p.type === "day")!.value;

  return { isoDate: `${ano}-${mes}-${dia}`, diaDoMes: Number(dia) };
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { isoDate, diaDoMes } = hojeSaoPaulo();
  const supabase = createAdminClient();

  const { data: recorrentes, error: fetchError } = await supabase
    .from("saidas_recorrentes")
    .select("id, descricao, valor, categoria_id")
    .eq("ativo", true)
    .eq("dia_vencimento", diaDoMes);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  let created = 0;
  let skipped = 0;

  for (const r of recorrentes ?? []) {
    const { error: insertError } = await supabase.from("lancamentos_caixa").insert({
      tipo: "saida",
      descricao: r.descricao,
      valor: r.valor,
      data: isoDate,
      categoria_id: r.categoria_id,
      origem: "recorrencia",
      saida_recorrente_id: r.id,
    });

    if (insertError) {
      // 23505 = já existe um lançamento dessa recorrência nessa data (job rodou 2x no mesmo dia).
      if (insertError.code === "23505") {
        skipped++;
      } else {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    } else {
      created++;
    }
  }

  return NextResponse.json({
    data: isoDate,
    consideradas: recorrentes?.length ?? 0,
    criadas: created,
    ignoradas_duplicadas: skipped,
  });
}
