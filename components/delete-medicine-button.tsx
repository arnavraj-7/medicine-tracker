"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteMedicine } from "@/app/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function DeleteMedicineButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="p-2 rounded-xl border-2 border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
        title="Delete medicine"
      >
        {isPending ? (
          <span className="w-3.5 h-3.5 border-2 border-red-200 border-t-red-400 rounded-full animate-spin block" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>

      <ConfirmDialog
        open={open}
        message={`Remove "${name}" from your medicines?`}
        onConfirm={() => {
          setOpen(false);
          startTransition(() => deleteMedicine(id));
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
