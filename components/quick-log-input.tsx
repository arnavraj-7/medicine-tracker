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
        placeholder="morning done, lunch wali li, ..."
        className="flex-1 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
        disabled={isPending}
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-violet-400 hover:bg-violet-500 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-50 transition-all flex-shrink-0 flex items-center gap-1.5"
      >
        {isPending ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <PenLine size={14} />
            Log
          </>
        )}
      </button>
    </form>
  );
}
