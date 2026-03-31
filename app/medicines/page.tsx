import Link from "next/link";
import { Plus, ClipboardList, Pencil } from "lucide-react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { DeleteMedicineButton } from "@/components/delete-medicine-button";

const colorDot: Record<string, string> = {
  pink: "bg-pink-400",
  purple: "bg-purple-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  orange: "bg-orange-400",
  yellow: "bg-yellow-400",
};

const frequencyLabel: Record<string, string> = {
  once_daily: "Once daily",
  twice_daily: "Twice daily",
  three_times_daily: "3x daily",
  as_needed: "As needed",
};

export default async function MedicinesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: medicines } = await supabase
    .from("medicines")
    .select("*")
    .eq("active", true)
    .order("name");

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-pink-900">Medicines</h1>
        <Link
          href="/medicines/new"
          className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add
        </Link>
      </div>

      {!medicines?.length ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ClipboardList size={36} className="text-pink-400" />
          </div>
          <p className="font-semibold text-gray-500">No medicines added yet</p>
          <p className="text-sm mt-1 text-gray-400">
            Tap &ldquo;Add&rdquo; to get started
          </p>
          <Link
            href="/medicines/new"
            className="inline-flex items-center gap-2 mt-4 bg-pink-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:bg-pink-600 transition-colors"
          >
            <Plus size={16} />
            Add first medicine
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {medicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-2xl shadow-sm border border-pink-50 p-4 flex items-center gap-3"
            >
              <span
                className={`w-3 h-3 rounded-full flex-shrink-0 ${colorDot[med.color] ?? "bg-pink-400"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {med.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {med.dosage && (
                    <span className="text-xs text-gray-400">{med.dosage}</span>
                  )}
                  <span className="text-xs text-pink-400 font-medium">
                    {frequencyLabel[med.frequency] ?? med.frequency}
                  </span>
                </div>
                {med.notes && (
                  <p className="text-xs text-gray-300 italic mt-0.5 truncate">
                    {med.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href={`/medicines/${med.id}/edit`}
                  className="text-gray-400 hover:text-pink-500 hover:bg-pink-50 p-1.5 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </Link>
                <DeleteMedicineButton id={med.id} name={med.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
