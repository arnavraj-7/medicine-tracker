"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, message, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div
        className="relative bg-white rounded-3xl p-6 w-full max-w-sm"
        style={{ boxShadow: "0 8px 0 #e2d8ff, 0 12px 32px rgba(124, 92, 255, 0.2)" }}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center"
               style={{ boxShadow: "0 4px 0 #fecaca" }}>
            <AlertTriangle size={28} className="text-red-400" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-semibold text-lg text-[#1e1040]">Are you sure?</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{message}</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              ref={cancelRef}
              onClick={onCancel}
              className="btn-ghost flex-1 py-3 text-sm"
            >
              Nope
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 text-sm font-bold text-white rounded-2xl"
              style={{
                background: "#ff5b70",
                boxShadow: "0 4px 0 #c9364a",
                fontFamily: "var(--font-fredoka), sans-serif",
                transition: "all 0.1s ease",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 0 #c9364a";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 0 #c9364a";
              }}
            >
              Yes, remove it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
