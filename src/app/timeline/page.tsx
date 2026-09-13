import { createClient } from "@/lib/supabase/server";
import { TimelineList } from "@/components/TimelineList";
import { MemoryForm } from "@/components/MemoryForm";
import { AddDialog } from "@/components/AddDialog";
import { MEMORY_COLUMNS, type Memory } from "@/lib/memory";

export default async function TimelinePage() {
  const supabase = await createClient();
  const { data: memories } = await supabase
    .from("photos")
    .select(MEMORY_COLUMNS)
    .order("date", { ascending: true });

  return (
    <main className="mx-auto flex h-full w-full max-w-2xl flex-1 flex-col px-4 py-6">
      <div className="shrink-0">
        <h1 className="text-2xl font-semibold text-rose-600 dark:text-rose-400">
          Timeline
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Our story so far.
        </p>

        <AddDialog trigger="Add event" title="Add a memory">
          <MemoryForm />
        </AddDialog>
      </div>

      <TimelineList entries={(memories as Memory[] | null) ?? []} />
    </main>
  );
}
