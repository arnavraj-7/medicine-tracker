"use client";

import { useTransition } from "react";
import { Check, Undo2 } from "lucide-react";
import { logIntake, undoIntake } from "@/app/actions";

export function TakeButton({
  medicineId,
  medicineName,
  dosage,
}: {
  medicineId: string;
  medicineName: string;
  dosage: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logIntake(medicineId, medicineName, dosage))}
      disabled={isPending}
      className="btn-primary px-4 py-2 text-sm disabled:opacity-50 min-w-[80px] flex items-center gap-1.5 justify-center"
    >
      {isPending ? (
        <span className="w-4 h-4 border-2 border-purple-200 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <Check size={14} strokeWidth={3} />
          Take
        </>
      )}
    </button>
  );
}

export function UndoButton({ logId }: { logId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => undoIntake(logId))}
      disabled={isPending}
      className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-50 flex items-center gap-1"
    >
      {isPending ? (
        <span className="w-3 h-3 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
      ) : (
        <>
          <Undo2 size={11} strokeWidth={2.5} />
          Undo
        </>
      )}
    </button>
  );
}
