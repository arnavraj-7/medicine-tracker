import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { DeleteMedicineButton } from "@/components/delete-medicine-button";
import { SnorlaxAnimation } from "@/components/animations";

const colorDot: Record<string, string> = {
  pink:   "bg-pink-400",
  purple: "bg-purple-400",
  blue:   "bg-blue-400",
  green:  "bg-green-400",
  orange: "bg-orange-400",
  yellow: "bg-yellow-400",
};

const frequencyBadge: Record<string, string> = {
  once_daily:        "Once daily",
  twice_daily:       "Twice daily",
  three_times_daily: "3x daily",
  as_needed:         "As needed",
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
        <h1 className="text-3xl font-display font-semibold text-[#1e1040]">
          Medicines
        </h1>
        <Link href="/medicines/new" className="btn-primary px-4 py-2.5 text-sm flex items-center gap-1.5">
          <Plus size={15} strokeWidth={3} />
          Add
        </Link>
      </div>

      {!medicines?.length ? (
        <div className="text-center py-4">
          <div className="flex justify-center">
            <SnorlaxAnimation size={200} />
          </div>
          <p className="font-display font-semibold text-xl text-[#1e1040] mt-1">
            No medicines added yet
          </p>
          <p className="text-sm mt-1 text-gray-400 font-medium">
            Tap &ldquo;Add&rdquo; to get started
          </p>
          <Link
            href="/medicines/new"
            className="inline-flex items-center gap-2 mt-4 btn-primary px-6 py-3 text-sm"
          >
            <Plus size={16} strokeWidth={3} />
            Add first medicine
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {medicines.map((med) => (
            <div key={med.id} className="card p-4 flex items-center gap-3">
              <span className={`w-4 h-4 rounded-full flex-shrink-0 ${colorDot[med.color] ?? "bg-purple-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-[#1e1040] truncate">{med.name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {med.dosage && (
                    <span className="text-xs text-gray-400 font-medium">{med.dosage}</span>
                  )}
                  <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {frequencyBadge[med.frequency] ?? med.frequency}
                  </span>
                </div>
                {med.notes && (
                  <p className="text-xs text-gray-400 italic mt-0.5 truncate">{med.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href={`/medicines/${med.id}/edit`}
                  className="btn-ghost p-2 flex items-center"
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
