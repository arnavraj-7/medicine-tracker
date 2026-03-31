import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { TakeButton, UndoButton } from "@/components/intake-buttons";
import { QuickLogInput } from "@/components/quick-log-input";
import { TrophyAnimation, SnorlaxAnimation } from "@/components/animations";

const colorMap: Record<string, { dot: string; bar: string; badge: string }> = {
  pink:   { dot: "bg-pink-400",   bar: "bg-pink-400",   badge: "bg-pink-50 text-pink-600 border-pink-200" },
  purple: { dot: "bg-purple-400", bar: "bg-purple-400", badge: "bg-purple-50 text-purple-600 border-purple-200" },
  blue:   { dot: "bg-blue-400",   bar: "bg-blue-400",   badge: "bg-blue-50 text-blue-600 border-blue-200" },
  green:  { dot: "bg-green-400",  bar: "bg-green-400",  badge: "bg-green-50 text-green-600 border-green-200" },
  orange: { dot: "bg-orange-400", bar: "bg-orange-400", badge: "bg-orange-50 text-orange-600 border-orange-200" },
  yellow: { dot: "bg-yellow-400", bar: "bg-yellow-300", badge: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

const QUOTES = [
  "waxing and packing karlo",
  "soturu vanshika",
  "babu meds khalo na pleaseee",
  "alasi panda",
  "awww cumtie",
  "pom pom dabadoge",
  "babu ne meds khali?",
  "ek baar meds lo phir sona",
  "doctor uncle dekhenge toh dant padegi",
  "meds lo vrinda, main dekh raha hun",
];

export default async function TodayPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const today = new Date().toISOString().split("T")[0];

  const [{ data: medicines }, { data: logs }] = await Promise.all([
    supabase.from("medicines").select("*").eq("active", true).order("name"),
    supabase
      .from("intake_logs")
      .select("*")
      .eq("log_date", today)
      .order("taken_at", { ascending: false }),
  ]);

  const takenMap: Record<string, { id: string; taken_at: string }[]> = {};
  const quickLogs: { id: string; medicine_name: string; taken_at: string }[] = [];

  for (const log of logs ?? []) {
    if (log.is_quick_log) {
      quickLogs.push({ id: log.id, medicine_name: log.medicine_name, taken_at: log.taken_at });
    } else {
      if (!takenMap[log.medicine_id]) takenMap[log.medicine_id] = [];
      takenMap[log.medicine_id].push({ id: log.id, taken_at: log.taken_at });
    }
  }

  const totalMeds = medicines?.length ?? 0;
  const takenCount = Object.keys(takenMap).length;
  const progress = totalMeds > 0 ? Math.round((takenCount / totalMeds) * 100) : 0;
  const allDone = totalMeds > 0 && takenCount === totalMeds;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const quote = QUOTES[dayOfYear % QUOTES.length];

  return (
    <div className="max-w-md mx-auto px-4 pt-6">

      {/* Header */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-purple-400">{dateStr}</p>
        <h1 className="text-3xl font-display font-semibold text-[#1e1040] leading-tight mt-0.5">
          {greeting}, Vrinda! 👋
        </h1>
      </div>

      {/* Quote card */}
      <div className="card px-4 py-3 mb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <p className="text-sm font-semibold text-purple-600 italic">"{quote}"</p>
      </div>

      {/* Progress */}
      {totalMeds > 0 && (
        <div className="card p-4 mb-4">
          {allDone ? (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <TrophyAnimation size={80} />
              </div>
              <div>
                <p className="font-display font-semibold text-xl text-[#1e1040]">All done!</p>
                <p className="text-sm text-green-600 font-semibold mt-0.5">
                  Vrinda is a good girl today!
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-sm font-semibold text-gray-500">Today&apos;s progress</span>
                <span className="text-sm font-display font-semibold text-purple-600">
                  {takenCount} of {totalMeds}
                </span>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #7C5CFF, #FF7EB6)",
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Medicine List */}
      {!medicines?.length ? (
        <div className="text-center py-4">
          <div className="flex justify-center">
            <SnorlaxAnimation size={200} />
          </div>
          <p className="font-display font-semibold text-xl text-[#1e1040] mt-1">
            No meds yet
          </p>
          <p className="text-sm mt-1 text-gray-400 font-medium">
            Let&apos;s take care of yourself today!
          </p>
          <Link
            href="/medicines/new"
            className="inline-block mt-4 btn-primary px-6 py-3 text-sm"
          >
            + Add your first medicine
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {medicines.map((med) => {
            const takenLogs = takenMap[med.id] ?? [];
            const isTaken = takenLogs.length > 0;
            const c = colorMap[med.color] ?? colorMap.pink;

            return (
              <div
                key={med.id}
                className={`card overflow-hidden flex transition-all ${isTaken ? "opacity-60" : ""}`}
              >
                <div className={`w-1.5 flex-shrink-0 ${c.bar}`} />
                <div className="flex-1 p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${c.dot}`} />
                      <span
                        className={`font-display font-semibold text-[#1e1040] truncate ${
                          isTaken ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {med.name}
                      </span>
                      {med.dosage && (
                        <span className={`hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full border ${c.badge}`}>
                          {med.dosage}
                        </span>
                      )}
                    </div>
                    {med.dosage && (
                      <p className="text-xs text-gray-400 font-medium mt-0.5 ml-5 sm:hidden">
                        {med.dosage}
                      </p>
                    )}
                    {med.notes && (
                      <p className="text-xs text-gray-400 italic mt-0.5 ml-5">{med.notes}</p>
                    )}
                    {isTaken && takenLogs[0] && (
                      <p className="text-xs text-green-600 font-semibold mt-1 ml-5">
                        Taken at{" "}
                        {new Date(takenLogs[0].taken_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {isTaken ? (
                      <UndoButton logId={takenLogs[0].id} />
                    ) : (
                      <TakeButton medicineId={med.id} medicineName={med.name} dosage={med.dosage} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Log */}
      <div className="mt-6 mb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-display font-semibold text-[#7C5CFF]">Quick Log</span>
          <span className="text-xs text-gray-400 font-medium">— jot anything down</span>
        </div>
        <QuickLogInput />

        {quickLogs.length > 0 && (
          <div className="mt-3 space-y-2">
            {quickLogs.map((ql) => (
              <div
                key={ql.id}
                className="card bg-purple-50 border-purple-100 px-4 py-2.5 flex items-center justify-between gap-3"
              >
                <p className="text-sm text-purple-700 font-semibold flex-1 min-w-0 truncate">
                  {ql.medicine_name}
                </p>
                <span className="text-xs text-purple-400 font-medium flex-shrink-0">
                  {new Date(ql.taken_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <UndoButton logId={ql.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
