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
      onClick={() =>
        startTransition(() => logIntake(medicineId, medicineName, dosage))
      }
      disabled={isPending}
      className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-all min-w-[80px] shadow-sm flex items-center gap-1.5 justify-center"
    >
      {isPending ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <Check size={14} strokeWidth={2.5} />
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
      className="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-500 text-xs font-medium px-3 py-2 rounded-xl disabled:opacity-50 transition-all flex items-center gap-1"
    >
      {isPending ? (
        <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
      ) : (
        <>
          <Undo2 size={12} />
          Undo
        </>
      )}
    </button>
  );
}
