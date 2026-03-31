"use client";

import { useRef, useTransition } from "react";
import { PenLine } from "lucide-react";
import { addQuickLog } from "@/app/actions";

export function QuickLogInput() {
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) return;
    startTransition(async () => {
      await addQuickLog(text);
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Took morning dose, lunch wali li..."
        className="flex-1 input-cartoon"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        disabled={isPending}
      />
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary px-4 py-2.5 text-sm disabled:opacity-50 flex-shrink-0 flex items-center gap-1.5"
      >
        {isPending ? (
          <span className="w-4 h-4 border-2 border-purple-200 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <PenLine size={14} strokeWidth={2.5} />
            Log
          </>
        )}
      </button>
    </form>
  );
}
