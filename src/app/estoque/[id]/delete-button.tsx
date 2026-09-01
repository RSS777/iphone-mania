"use client";

import { deleteIphone } from "../actions";
import { DeleteConfirm } from "@/components/delete-confirm";

export function DeleteIphoneButton({ id }: { id: string }) {
  return (
    <DeleteConfirm
      label="Excluir item"
      confirmMessage="Excluir esse item apaga o cadastro por completo. Confirma?"
      action={deleteIphone.bind(null, id)}
    />
  );
}
