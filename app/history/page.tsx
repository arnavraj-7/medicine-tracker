import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { BearAnimation } from "@/components/animations";

const colorDot: Record<string, string> = {
  pink:   "bg-pink-400",
  purple: "bg-purple-400",
  blue:   "bg-blue-400",
  green:  "bg-green-400",
  orange: "bg-orange-400",
  yellow: "bg-yellow-400",
};

function formatDate(dateStr: string) {
  // Compare using IST date strings to avoid UTC offset issues
  const todayIST = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayIST = yesterdayDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  if (dateStr === todayIST) return "Today";
  if (dateStr === yesterdayIST) return "Yesterday";

  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: logs } = await supabase
    .from("intake_logs")
    .select("*, medicines(color)")
    .order("taken_at", { ascending: false })
    .limit(200);

  const grouped: Record<string, typeof logs> = {};
  for (const log of logs ?? []) {
    if (!grouped[log.log_date]) grouped[log.log_date] = [];
    grouped[log.log_date]!.push(log);
  }

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      <h1 className="text-3xl font-display font-semibold text-[#1e1040] mb-5">History</h1>

      {!sortedDates.length ? (
        <div className="text-center py-4">
          <div className="flex justify-center">
            <BearAnimation size={200} />
          </div>
          <p className="font-display font-semibold text-xl text-[#1e1040] mt-1">
            No logs yet
          </p>
          <p className="text-sm mt-1 text-gray-400 font-medium">
            Start taking your medicines to see history here
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedDates.map((date) => {
            const dayLogs = grouped[date]!;
            return (
              <div key={date}>
                <p className="text-xs font-display font-semibold text-purple-500 uppercase tracking-widest mb-2">
                  {formatDate(date)}
                </p>
                <div className="space-y-2">
                  {dayLogs.map((log) => {
                    const isQuick = log.is_quick_log;
                    const color = (log.medicines as { color?: string } | null)?.color ?? "pink";
                    return (
                      <div
                        key={log.id}
                        className={`card flex items-center gap-3 px-4 py-3 ${
                          isQuick ? "bg-purple-50 border-purple-100" : "bg-white"
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            isQuick ? "bg-purple-400" : (colorDot[color] ?? "bg-pink-400")
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${isQuick ? "text-purple-700" : "text-[#1e1040]"}`}>
                            {log.medicine_name}
                          </p>
                          {log.dosage && !isQuick && (
                            <p className="text-xs text-gray-400 font-medium">{log.dosage}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 font-medium flex-shrink-0">
                          {new Date(log.taken_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isQuick
                              ? "bg-purple-100 text-purple-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {isQuick ? "note" : "done"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
