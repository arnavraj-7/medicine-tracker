"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function addMedicine(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const name = (formData.get("name") as string).trim();
  const dosage = (formData.get("dosage") as string)?.trim() || null;
  const frequency = formData.get("frequency") as string;
  const color = formData.get("color") as string;
  const notes = (formData.get("notes") as string)?.trim() || null;

  const { error } = await supabase
    .from("medicines")
    .insert({ name, dosage, frequency, color, notes });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/medicines");
  redirect("/medicines");
}

export async function updateMedicine(id: string, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const name = (formData.get("name") as string).trim();
  const dosage = (formData.get("dosage") as string)?.trim() || null;
  const frequency = formData.get("frequency") as string;
  const color = formData.get("color") as string;
  const notes = (formData.get("notes") as string)?.trim() || null;

  const { error } = await supabase
    .from("medicines")
    .update({ name, dosage, frequency, color, notes })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/medicines");
  redirect("/medicines");
}

export async function deleteMedicine(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("medicines").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/medicines");
}

export async function logIntake(
  medicineId: string,
  medicineName: string,
  dosage: string | null
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("intake_logs").insert({
    medicine_id: medicineId,
    medicine_name: medicineName,
    dosage,
    log_date: today,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/history");
}

export async function addQuickLog(text: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("intake_logs").insert({
    medicine_id: null,
    medicine_name: text,
    is_quick_log: true,
    log_date: today,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/history");
}

export async function undoIntake(logId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("intake_logs")
    .delete()
    .eq("id", logId);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/history");
}
