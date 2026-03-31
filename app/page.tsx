import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { TakeButton, UndoButton } from "@/components/intake-buttons";
import { QuickLogInput } from "@/components/quick-log-input";
import { TrophyAnimation, LazyPandaAnimation } from "@/components/animations";

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

  // Use IST date to avoid UTC day mismatch for Indian users
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

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

  const freqRequired: Record<string, number> = {
    once_daily: 1,
    twice_daily: 2,
    three_times_daily: 3,
    as_needed: 0, // unlimited
  };

  const totalMeds = medicines?.length ?? 0;
  // A medicine counts as "fully done" when takenLogs >= required (or at least 1 for as_needed)
  const fullyDoneCount = (medicines ?? []).filter((med) => {
    const required = freqRequired[med.frequency] ?? 1;
    const taken = (takenMap[med.id] ?? []).length;
    return required === 0 ? taken > 0 : taken >= required;
  }).length;
  // For progress bar: count total required doses vs taken doses
  const totalRequired = (medicines ?? []).reduce((sum, med) => {
    const r = freqRequired[med.frequency] ?? 1;
    return sum + (r === 0 ? 1 : r);
  }, 0);
  const totalTaken = (medicines ?? []).reduce((sum, med) => {
    const r = freqRequired[med.frequency] ?? 1;
    const taken = (takenMap[med.id] ?? []).length;
    return sum + Math.min(taken, r === 0 ? taken : r);
  }, 0);
  const progress = totalRequired > 0 ? Math.round((totalTaken / totalRequired) * 100) : 0;
  const allDone = totalMeds > 0 && fullyDoneCount === totalMeds;

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
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest">{dateStr}</p>
        <h1 className="text-4xl font-display font-semibold leading-tight mt-1" style={{
          background: "linear-gradient(135deg, #7C5CFF 0%, #FF7EB6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {greeting},
        </h1>
        <h1 className="text-4xl font-display font-semibold leading-tight" style={{
          background: "linear-gradient(135deg, #FF7EB6 0%, #c77dff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Vrinda!
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
                  {totalTaken}/{totalRequired} doses
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
            <LazyPandaAnimation size={200} />
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
            const required = freqRequired[med.frequency] ?? 1;
            const isUnlimited = required === 0;
            const takenSoFar = takenLogs.length;
            const isFullyDone = isUnlimited ? false : takenSoFar >= required;
            const c = colorMap[med.color] ?? colorMap.pink;

            return (
              <div
                key={med.id}
                className={`card overflow-hidden flex transition-all ${isFullyDone ? "opacity-60" : ""}`}
              >
                <div className={`w-1.5 flex-shrink-0 ${c.bar}`} />
                <div className="flex-1 p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${c.dot}`} />
                      <span
                        className={`font-display font-semibold text-[#1e1040] truncate ${
                          isFullyDone ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {med.name}
                      </span>
                      {/* Dose counter pill */}
                      {!isUnlimited && required > 1 && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                          isFullyDone
                            ? "bg-green-50 text-green-600 border-green-200"
                            : c.badge
                        }`}>
                          {takenSoFar}/{required}
                        </span>
                      )}
                      {isUnlimited && takenSoFar > 0 && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                          ×{takenSoFar}
                        </span>
                      )}
                    </div>
                    {med.dosage && (
                      <p className="text-xs text-gray-400 font-medium mt-0.5 ml-5">{med.dosage}</p>
                    )}
                    {med.notes && (
                      <p className="text-xs text-gray-400 italic mt-0.5 ml-5">{med.notes}</p>
                    )}
                    {takenLogs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1 ml-5">
                        {takenLogs.slice().reverse().map((log, i) => (
                          <span key={log.id} className="text-xs text-green-600 font-semibold">
                            {i === 0 ? "" : "· "}
                            {new Date(log.taken_at).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex flex-col gap-1.5 items-end">
                    {!isFullyDone && (
                      <TakeButton medicineId={med.id} medicineName={med.name} dosage={med.dosage} />
                    )}
                    {takenLogs.length > 0 && (
                      <UndoButton logId={takenLogs[0].id} />
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
