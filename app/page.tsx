import { cookies } from "next/headers";
import { Pill, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { TakeButton, UndoButton } from "@/components/intake-buttons";
import { QuickLogInput } from "@/components/quick-log-input";

const colorMap: Record<string, { dot: string; strip: string }> = {
  pink: { dot: "bg-pink-400", strip: "bg-pink-400" },
  purple: { dot: "bg-purple-400", strip: "bg-purple-400" },
  blue: { dot: "bg-blue-400", strip: "bg-blue-400" },
  green: { dot: "bg-green-400", strip: "bg-green-400" },
  orange: { dot: "bg-orange-400", strip: "bg-orange-400" },
  yellow: { dot: "bg-yellow-400", strip: "bg-yellow-400" },
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
  const quickLogs: { id: string; medicine_name: string; taken_at: string }[] =
    [];

  for (const log of logs ?? []) {
    if (log.is_quick_log) {
      quickLogs.push({
        id: log.id,
        medicine_name: log.medicine_name,
        taken_at: log.taken_at,
      });
    } else {
      if (!takenMap[log.medicine_id]) takenMap[log.medicine_id] = [];
      takenMap[log.medicine_id].push({ id: log.id, taken_at: log.taken_at });
    }
  }

  const totalMeds = medicines?.length ?? 0;
  const takenCount = Object.keys(takenMap).length;
  const progress =
    totalMeds > 0 ? Math.round((takenCount / totalMeds) * 100) : 0;
  const allDone = totalMeds > 0 && takenCount === totalMeds;

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const quote = QUOTES[dayOfYear % QUOTES.length];

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      {/* Header */}
      <div className="mb-1">
        <h1 className="text-2xl font-bold text-pink-900">
          {greeting}, Vrinda!
        </h1>
        <p className="text-sm text-pink-400 mt-0.5">{dateStr}</p>
      </div>

      {/* Daily Quote */}
      <div className="my-4 bg-white rounded-2xl px-4 py-3 border border-pink-100 shadow-sm flex items-center gap-2">
        <Sparkles size={14} className="text-pink-400 flex-shrink-0" />
        <p className="text-sm text-pink-500 font-medium italic">{quote}</p>
      </div>

      {/* Progress */}
      {totalMeds > 0 && (
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-pink-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Today&apos;s progress
            </span>
            <span className="text-sm font-semibold text-pink-600">
              {takenCount}/{totalMeds}
            </span>
          </div>
          <div className="w-full bg-pink-100 rounded-full h-2.5">
            <div
              className="bg-pink-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {allDone && (
            <p className="text-xs text-green-600 mt-2 font-semibold">
              All done! Vrinda is a good girl today!
            </p>
          )}
        </div>
      )}

      {/* Medicine List */}
      {!medicines?.length ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Pill size={36} className="text-pink-400" />
          </div>
          <p className="font-semibold text-gray-500">No medicines yet</p>
          <p className="text-sm mt-1 text-gray-400">
            Add medicines from the Medicines tab below
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {medicines.map((med) => {
            const takenLogs = takenMap[med.id] ?? [];
            const isTaken = takenLogs.length > 0;
            const colors = colorMap[med.color] ?? colorMap.pink;

            return (
              <div
                key={med.id}
                className={`bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden flex transition-opacity ${
                  isTaken ? "opacity-60" : ""
                }`}
              >
                <div className={`w-1.5 flex-shrink-0 ${colors.strip}`} />
                <div className="flex-1 p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors.dot}`}
                      />
                      <span
                        className={`font-semibold text-gray-800 truncate ${
                          isTaken ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {med.name}
                      </span>
                    </div>
                    {med.dosage && (
                      <p className="text-sm text-gray-400 mt-0.5 ml-4">
                        {med.dosage}
                      </p>
                    )}
                    {med.notes && (
                      <p className="text-xs text-gray-300 mt-0.5 ml-4 italic">
                        {med.notes}
                      </p>
                    )}
                    {isTaken && takenLogs[0] && (
                      <p className="text-xs text-green-500 mt-1 ml-4 font-medium">
                        Taken at{" "}
                        {new Date(takenLogs[0].taken_at).toLocaleTimeString(
                          "en-IN",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {isTaken ? (
                      <UndoButton logId={takenLogs[0].id} />
                    ) : (
                      <TakeButton
                        medicineId={med.id}
                        medicineName={med.name}
                        dosage={med.dosage}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Log Section */}
      <div className="mt-6 mb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-violet-600">Quick Log</span>
          <span className="text-xs text-gray-400 font-normal">
            — jot anything down
          </span>
        </div>
        <QuickLogInput />

        {quickLogs.length > 0 && (
          <div className="mt-3 space-y-2">
            {quickLogs.map((ql) => (
              <div
                key={ql.id}
                className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3"
              >
                <p className="text-sm text-violet-700 font-medium flex-1 min-w-0 truncate">
                  {ql.medicine_name}
                </p>
                <span className="text-xs text-violet-400 flex-shrink-0">
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
