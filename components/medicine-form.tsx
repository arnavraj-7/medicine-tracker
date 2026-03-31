"use client";

import { useState } from "react";

const COLORS = [
  { value: "pink", bg: "bg-pink-400", ring: "ring-pink-500", label: "Pink" },
  { value: "purple", bg: "bg-purple-400", ring: "ring-purple-500", label: "Purple" },
  { value: "blue", bg: "bg-blue-400", ring: "ring-blue-500", label: "Blue" },
  { value: "green", bg: "bg-green-400", ring: "ring-green-500", label: "Green" },
  { value: "orange", bg: "bg-orange-400", ring: "ring-orange-500", label: "Orange" },
  { value: "yellow", bg: "bg-yellow-400", ring: "ring-yellow-500", label: "Yellow" },
];

const FREQUENCIES = [
  { value: "once_daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times_daily", label: "3x daily" },
  { value: "as_needed", label: "As needed" },
];

interface MedicineFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    dosage?: string;
    frequency?: string;
    color?: string;
    notes?: string;
  };
  submitLabel?: string;
}

export function MedicineForm({
  action,
  defaultValues,
  submitLabel = "Save Medicine",
}: MedicineFormProps) {
  const [selectedColor, setSelectedColor] = useState(
    defaultValues?.color ?? "pink"
  );
  const [selectedFreq, setSelectedFreq] = useState(
    defaultValues?.frequency ?? "once_daily"
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="color" value={selectedColor} />
      <input type="hidden" name="frequency" value={selectedFreq} />

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Medicine name <span className="text-pink-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={defaultValues?.name}
          placeholder="e.g. Vitamin D, Paracetamol..."
          className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
      </div>

      {/* Dosage */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Dosage{" "}
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          type="text"
          name="dosage"
          defaultValue={defaultValues?.dosage ?? ""}
          placeholder="e.g. 500mg, 1 tablet, 2 drops..."
          className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          How often?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setSelectedFreq(f.value)}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                selectedFreq === f.value
                  ? "border-pink-400 bg-pink-50 text-pink-700"
                  : "border-gray-200 bg-white text-gray-500 hover:border-pink-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Pick a color
        </label>
        <div className="flex gap-3">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.label}
              onClick={() => setSelectedColor(c.value)}
              className={`w-8 h-8 rounded-full ${c.bg} transition-all ${
                selectedColor === c.value
                  ? `ring-2 ring-offset-2 ${c.ring} scale-110`
                  : "hover:scale-105"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Notes{" "}
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <textarea
          name="notes"
          defaultValue={defaultValues?.notes ?? ""}
          placeholder="e.g. Take after food, with warm water..."
          rows={2}
          className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-sm transition-all text-sm"
      >
        {submitLabel}
      </button>
    </form>
  );
}
