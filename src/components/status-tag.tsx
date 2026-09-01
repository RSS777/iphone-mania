import { InlineTag } from "./inline-tag";
import { STATUS_LABEL } from "@/lib/iphones";

export function StatusTag({ status }: { status: string }) {
  return (
    <InlineTag tone={status === "vendido" ? "stamp" : "ink"}>
      {STATUS_LABEL[status as keyof typeof STATUS_LABEL] ?? status}
    </InlineTag>
  );
}
