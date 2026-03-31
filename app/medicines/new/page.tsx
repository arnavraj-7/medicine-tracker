import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MedicineForm } from "@/components/medicine-form";
import { addMedicine } from "@/app/actions";

export default function NewMedicinePage() {
  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/medicines"
          className="text-pink-400 hover:text-pink-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-pink-900">Add Medicine</h1>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <MedicineForm action={addMedicine} submitLabel="Add Medicine" />
      </div>
    </div>
  );
}
