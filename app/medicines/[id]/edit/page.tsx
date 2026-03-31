import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { MedicineForm } from "@/components/medicine-form";
import { updateMedicine } from "@/app/actions";

export default async function EditMedicinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: med } = await supabase
    .from("medicines")
    .select("*")
    .eq("id", id)
    .single();

  if (!med) notFound();

  const updateWithId = updateMedicine.bind(null, id);

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/medicines"
          className="text-pink-400 hover:text-pink-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-pink-900">Edit Medicine</h1>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <MedicineForm
          action={updateWithId}
          defaultValues={{
            name: med.name,
            dosage: med.dosage ?? "",
            frequency: med.frequency,
            color: med.color,
            notes: med.notes ?? "",
          }}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
