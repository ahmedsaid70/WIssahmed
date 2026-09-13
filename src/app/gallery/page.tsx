import { createClient } from "@/lib/supabase/server";
import { MemoryWall } from "@/components/MemoryWall";
import { MemoryForm } from "@/components/MemoryForm";
import { AddDialog } from "@/components/AddDialog";
import { MEMORY_COLUMNS, type Memory } from "@/lib/memory";
import { logPageVisit } from "@/lib/tracking";

export default async function GalleryPage() {
  await logPageVisit("Gallery");
  const supabase = await createClient();
  const { data: memories } = await supabase
    .from("photos")
    .select(MEMORY_COLUMNS)
    .not("url", "is", null)
    .eq("timeline", false)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
      <div className="shrink-0">
        <h1 className="text-2xl font-semibold text-rose-600 dark:text-rose-400">
          Gallery
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Every picture worth keeping.
        </p>

        <AddDialog trigger="Add a memory" title="Add a memory">
          <MemoryForm />
        </AddDialog>
      </div>

      <MemoryWall memories={(memories as Memory[] | null) ?? []} />
    </main>
  );
}
