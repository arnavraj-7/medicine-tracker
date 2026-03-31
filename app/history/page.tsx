import { History } from "lucide-react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const colorDot: Record<string, string> = {
  pink: "bg-pink-400",
  purple: "bg-purple-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  orange: "bg-orange-400",
  yellow: "bg-yellow-400",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === yesterday.getTime()) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
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
      <h1 className="text-2xl font-bold text-pink-900 mb-5">History</h1>

      {!sortedDates.length ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <History size={36} className="text-pink-400" />
          </div>
          <p className="font-semibold text-gray-500">No logs yet</p>
          <p className="text-sm mt-1 text-gray-400">
            Start taking your medicines to see history here
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedDates.map((date) => {
            const dayLogs = grouped[date]!;
            return (
              <div key={date}>
                <p className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">
                  {formatDate(date)}
                </p>
                <div className="space-y-2">
                  {dayLogs.map((log) => {
                    const isQuick = log.is_quick_log;
                    const color =
                      (log.medicines as { color?: string } | null)?.color ??
                      "pink";
                    return (
                      <div
                        key={log.id}
                        className={`rounded-xl border shadow-sm flex items-center gap-3 px-4 py-3 ${
                          isQuick
                            ? "bg-violet-50 border-violet-100"
                            : "bg-white border-pink-50"
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            isQuick
                              ? "bg-violet-400"
                              : (colorDot[color] ?? "bg-pink-400")
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-sm truncate ${
                              isQuick ? "text-violet-700" : "text-gray-800"
                            }`}
                          >
                            {log.medicine_name}
                          </p>
                          {log.dosage && !isQuick && (
                            <p className="text-xs text-gray-400">{log.dosage}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(log.taken_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span
                          className={`text-sm ${isQuick ? "text-violet-400" : "text-green-400"}`}
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
