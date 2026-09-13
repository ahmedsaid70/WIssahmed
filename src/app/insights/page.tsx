import { createClient } from "@/lib/supabase/server";

function formatTime(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
      <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{value}</p>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
    </div>
  );
}

export default async function InsightsPage() {
  const supabase = await createClient();
  const [{ data: events }, { data: status }] = await Promise.all([
    supabase
      .from("proposal_events")
      .select("id, event_type, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("proposal_status").select("accepted, accepted_at").eq("id", true).maybeSingle(),
  ]);

  const rows = events ?? [];
  const views = rows.filter((e) => e.event_type === "view").length;
  const yes = rows.filter((e) => e.event_type === "yes").length;
  const no = rows.filter((e) => e.event_type === "no").length;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold text-rose-600 dark:text-rose-400">
        Proposal insights
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        A private log of visits and clicks on the proposal page.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard label="Views" value={views} />
        <StatCard label="Yes clicks" value={yes} />
        <StatCard label="No clicks" value={no} />
      </div>

      <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Status</p>
        <p className="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">
          {status?.accepted ? "She said yes ❤️" : "Not answered yet"}
        </p>
        {status?.accepted_at && (
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {formatTime(status.accepted_at)}
          </p>
        )}
      </div>

      <div className="mt-8 max-h-[60vh] overflow-y-auto rounded-2xl border border-rose-100 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-rose-50 text-xs text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-2 font-medium">Event</th>
              <th className="px-4 py-2 font-medium">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100 dark:divide-neutral-800">
            {rows.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-2">
                  {e.event_type === "view"
                    ? "👀 Viewed"
                    : e.event_type === "yes"
                      ? "❤️ Yes"
                      : "🙈 No"}
                </td>
                <td className="px-4 py-2 text-neutral-500 dark:text-neutral-400">
                  {formatTime(e.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-6 text-center text-sm text-neutral-400">No activity yet.</p>
        )}
      </div>
    </main>
  );
}
